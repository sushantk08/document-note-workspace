from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ASCENDING, DESCENDING, ReturnDocument, TEXT

from app.schemas.note import NoteCreate, NoteUpdate


class NoteRepository:

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["notes"]

    async def init_indexes(self):
        """Creates compound text indexes and metadata indexes for fast queries."""
        # Compound Text Index for full-text search with field weights
        await self.collection.create_index(
            [
                ("title", TEXT),
                ("tags", TEXT),
                ("content", TEXT),
                ("items.text", TEXT),
                ("explanation", TEXT),
                ("code", TEXT),
            ],
            weights={
                "title": 10,
                "tags": 8,
                "content": 5,
                "items.text": 5,
                "explanation": 3,
                "code": 2,
            },
            name="notes_text_search_idx",
            default_language="english",
        )

        # Single field indexes for fast filtering and sorting
        await self.collection.create_index(
            [("is_archived", ASCENDING), ("is_pinned", DESCENDING)]
        )
        await self.collection.create_index([("updated_at", DESCENDING)])
        await self.collection.create_index([("tags", ASCENDING)])
        await self.collection.create_index([("note_type", ASCENDING)])

    def _format_doc(
        self, doc: Optional[Dict[str, Any]]
    ) -> Optional[Dict[str, Any]]:
        """Converts MongoDB BSON ObjectId to string for Pydantic serialization."""
        if not doc:
            return None
        doc["_id"] = str(doc["_id"])
        # Remove MongoDB text score metadata before returning to Pydantic
        doc.pop("score", None)
        return doc

    async def create(self, note: NoteCreate) -> Dict[str, Any]:
        """Inserts a new note document with UTC timestamps."""
        now = datetime.now(timezone.utc)
        note_dict = note.model_dump()
        note_dict["created_at"] = now
        note_dict["updated_at"] = now

        result = await self.collection.insert_one(note_dict)
        note_dict["_id"] = str(result.inserted_id)
        return note_dict

    async def get_by_id(self, note_id: str) -> Optional[Dict[str, Any]]:
        """Finds a single note by its 24-character hexadecimal ObjectId."""
        try:
            obj_id = ObjectId(note_id)
        except InvalidId:
            return None

        doc = await self.collection.find_one({"_id": obj_id})
        return self._format_doc(doc)

    async def list(
        self,
        skip: int = 0,
        limit: int = 50,
        tag: Optional[str] = None,
        note_type: Optional[str] = None,
        is_archived: Optional[bool] = False,
        is_pinned: Optional[bool] = None,
        search_query: Optional[str] = None,
        sort_by: str = "updated_at",
        sort_order: str = "desc",
    ) -> Tuple[List[Dict[str, Any]], int]:
        """Lists notes matching filters with full-text search, custom sorting, and pagination."""
        filter_query: Dict[str, Any] = {}
        projection: Optional[Dict[str, Any]] = None

        if is_archived is not None:
            filter_query["is_archived"] = is_archived
        if is_pinned is not None:
            filter_query["is_pinned"] = is_pinned
        if tag:
            filter_query["tags"] = tag
        if note_type:
            filter_query["note_type"] = note_type

        # Configure Full-Text Search
        if search_query and search_query.strip():
            filter_query["$text"] = {"$search": search_query.strip()}
            projection = {"score": {"$meta": "textScore"}}

        total_count = await self.collection.count_documents(filter_query)

        # Configure Sorting
        direction = DESCENDING if sort_order.lower() == "desc" else ASCENDING
        sort_criteria = []

        if is_pinned is None:
            # Show pinned notes first by default unless specifically filtered
            sort_criteria.append(("is_pinned", DESCENDING))

        if search_query and sort_by == "relevance":
            sort_criteria.append(("score", {"$meta": "textScore"}))
        elif sort_by in ["created_at", "updated_at", "title"]:
            sort_criteria.append((sort_by, direction))
        else:
            sort_criteria.append(("updated_at", DESCENDING))

        cursor = (
            self.collection.find(filter_query, projection)
            .sort(sort_criteria)
            .skip(skip)
            .limit(limit)
        )

        docs = await cursor.to_list(length=limit)
        return [self._format_doc(d) for d in docs], total_count

    async def update(
        self, note_id: str, note_update: NoteUpdate
    ) -> Optional[Dict[str, Any]]:
        """Partially updates an existing note and refreshes updated_at timestamp."""
        try:
            obj_id = ObjectId(note_id)
        except InvalidId:
            return None

        update_data = {
            k: v for k, v in note_update.model_dump().items() if v is not None
        }
        if not update_data:
            return await self.get_by_id(note_id)

        update_data["updated_at"] = datetime.now(timezone.utc)

        updated_doc = await self.collection.find_one_and_update(
            {"_id": obj_id},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER,
        )
        return self._format_doc(updated_doc)

    async def delete(self, note_id: str) -> bool:
        """Deletes a note document by ID."""
        try:
            obj_id = ObjectId(note_id)
        except InvalidId:
            return False

        result = await self.collection.delete_one({"_id": obj_id})
        return result.deleted_count > 0

    async def get_tags_with_counts(self) -> List[Dict[str, Any]]:
        """Counts occurrences of each tag across active notes."""
        pipeline = [
            {"$match": {"is_archived": {"$ne": True}}},
            {"$unwind": "$tags"},
            {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
            {"$sort": {"count": -1, "_id": 1}},
            {"$project": {"tag": "$_id", "count": 1, "_id": 0}},
        ]
        cursor = self.collection.aggregate(pipeline)
        return await cursor.to_list(length=100)

    async def get_workspace_stats(self) -> Dict[str, Any]:
        """Calculates global workspace counts by note type and status."""
        pipeline = [
            {
                "$group": {
                    "_id": None,
                    "total_notes": {"$sum": 1},
                    "active_notes": {
                        "$sum": {
                            "$cond": [{"$eq": ["$is_archived", False]}, 1, 0]
                        }
                    },
                    "archived_notes": {
                        "$sum": {
                            "$cond": [{"$eq": ["$is_archived", True]}, 1, 0]
                        }
                    },
                    "pinned_notes": {
                        "$sum": {
                            "$cond": [{"$eq": ["$is_pinned", True]}, 1, 0]
                        }
                    },
                    "standard_count": {
                        "$sum": {
                            "$cond": [
                                {"$eq": ["$note_type", "standard"]},
                                1,
                                0,
                            ]
                        }
                    },
                    "checklist_count": {
                        "$sum": {
                            "$cond": [
                                {"$eq": ["$note_type", "checklist"]},
                                1,
                                0,
                            ]
                        }
                    },
                    "code_count": {
                        "$sum": {
                            "$cond": [{"$eq": ["$note_type", "code"]}, 1, 0]
                        }
                    },
                }
            }
        ]
        cursor = self.collection.aggregate(pipeline)
        results = await cursor.to_list(length=1)
        if results:
            data = results[0]
            data.pop("_id", None)
            return data
        return {
            "total_notes": 0,
            "active_notes": 0,
            "archived_notes": 0,
            "pinned_notes": 0,
            "standard_count": 0,
            "checklist_count": 0,
            "code_count": 0,
        }

    async def toggle_pin(self, note_id: str) -> Optional[Dict[str, Any]]:
        doc = await self.get_by_id(note_id)
        if not doc:
            return None
        new_status = not doc.get("is_pinned", False)
        return await self.update(note_id, NoteUpdate(is_pinned=new_status))

    async def toggle_archive(self, note_id: str) -> Optional[Dict[str, Any]]:
        doc = await self.get_by_id(note_id)
        if not doc:
            return None
        new_status = not doc.get("is_archived", False)
        return await self.update(note_id, NoteUpdate(is_archived=new_status))