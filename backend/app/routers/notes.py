from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.repositories.note_repository import NoteRepository
from app.schemas.note import (
    NoteCreate,
    NoteListResponse,
    NoteResponse,
    NoteType,
    NoteUpdate,
    TagCount,
    WorkspaceStats,
)

router = APIRouter()


def get_repository(
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> NoteRepository:
    return NoteRepository(db)


# ----------------------------------------------------
# Static Aggregation & Metadata Routes
# ----------------------------------------------------
@router.get(
    "/tags",
    response_model=List[TagCount],
    summary="Get all unique tags with note counts",
)
async def get_all_tags(repo: NoteRepository = Depends(get_repository)):
    return await repo.get_tags_with_counts()


@router.get(
    "/stats/summary",
    response_model=WorkspaceStats,
    summary="Get workspace dashboard summary stats",
)
async def get_stats(repo: NoteRepository = Depends(get_repository)):
    return await repo.get_workspace_stats()


# ----------------------------------------------------
# Core CRUD Routes
# ----------------------------------------------------
@router.post(
    "/",
    response_model=NoteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new polymorphic note",
)
async def create_note(
    note: NoteCreate, repo: NoteRepository = Depends(get_repository)
):
    return await repo.create(note)


@router.get(
    "/",
    response_model=NoteListResponse,
    summary="List notes with full-text search, filters, and sorting",
)
async def list_notes(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    note_type: Optional[NoteType] = Query(
        None, description="Filter by note type"
    ),
    is_archived: Optional[bool] = Query(
        False, description="Filter archived notes"
    ),
    is_pinned: Optional[bool] = Query(None, description="Filter pinned notes"),
    search: Optional[str] = Query(
        None, description="Full-text search keywords"
    ),
    sort_by: str = Query(
        "updated_at",
        pattern="^(updated_at|created_at|title|relevance)$",
        description="Sort field",
    ),
    sort_order: str = Query(
        "desc", pattern="^(asc|desc)$", description="Sort order"
    ),
    repo: NoteRepository = Depends(get_repository),
):
    docs, total = await repo.list(
        skip=skip,
        limit=limit,
        tag=tag,
        note_type=note_type.value if note_type else None,
        is_archived=is_archived,
        is_pinned=is_pinned,
        search_query=search,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return {"items": docs, "total": total, "skip": skip, "limit": limit}

@router.get(
    "/{note_id}",
    response_model=NoteResponse,
    summary="Get a single note by ID",
)
async def get_note(
    note_id: str, repo: NoteRepository = Depends(get_repository)
):
    doc = await repo.get_by_id(note_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Note with ID '{note_id}' not found.",
        )
    return doc


@router.patch(
    "/{note_id}",
    response_model=NoteResponse,
    summary="Partially update a note",
)
async def update_note(
    note_id: str,
    note_update: NoteUpdate,
    repo: NoteRepository = Depends(get_repository),
):
    doc = await repo.update(note_id, note_update)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Note with ID '{note_id}' not found.",
        )
    return doc


@router.patch(
    "/{note_id}/pin",
    response_model=NoteResponse,
    summary="Toggle pin status of a note",
)
async def toggle_pin_note(
    note_id: str, repo: NoteRepository = Depends(get_repository)
):
    doc = await repo.toggle_pin(note_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Note with ID '{note_id}' not found.",
        )
    return doc


@router.patch(
    "/{note_id}/archive",
    response_model=NoteResponse,
    summary="Toggle archive status of a note",
)
async def toggle_archive_note(
    note_id: str, repo: NoteRepository = Depends(get_repository)
):
    doc = await repo.toggle_archive(note_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Note with ID '{note_id}' not found.",
        )
    return doc


@router.delete(
    "/{note_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a note",
)
async def delete_note(
    note_id: str, repo: NoteRepository = Depends(get_repository)
):
    success = await repo.delete(note_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Note with ID '{note_id}' not found.",
        )
    return None