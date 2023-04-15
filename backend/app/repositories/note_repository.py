from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ReturnDocument

from app.schemas.note import NoteCreate, NoteUpdate


class NoteRepository:

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["notes"]

    def _format_doc(
        self, doc: Optional[Dict[str, Any]]
    ) -> Optional[Dict[str, Any]]:
        """Converts MongoDB BSON ObjectId to string for Pydantic serialization."""
        if not doc:
            return None
        doc["_id"] = str(doc["_id"])
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
    ) -> Tuple[List[Dict[str, Any]], int]:
        """Lists notes matching filters with pagination and total count."""
        filter_query: Dict[str, Any] = {}

        if is_archived is not None:
            filter_query["is_archived"] = is_archived
        if is_pinned is not None:
            filter_query["is_pinned"] = is_pinned
        if tag:
            filter_query["tags"] = tag
        if note_type:
            filter_query["note_type"] = note_type
        if search_query:
            regex_pattern = {"$regex": search_query, "$options": "i"}
            filter_query["$or"] = [
                {"title": regex_pattern},
                {"content": regex_pattern},
                {"explanation": regex_pattern},
                {"tags": regex_pattern},
                {"items.text": regex_pattern},
            ]

        total_count = await self.collection.count_documents(filter_query)

        # Sort pinned notes first, then newest updated notes
        cursor = (
            self.collection.find(filter_query)
            .sort([("is_pinned", -1), ("updated_at", -1)])
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

    async def get_distinct_tags(self) -> List[str]:
        """Returns a sorted list of unique tags from non-archived notes."""
        tags = await self.collection.distinct(
            "tags", {"is_archived": {"$ne": True}}
        )
        return sorted([t for t in tags if isinstance(t, str) and t.strip()])