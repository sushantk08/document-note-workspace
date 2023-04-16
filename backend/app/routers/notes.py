from typing import Optional
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
)

router = APIRouter()


def get_repository(
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> NoteRepository:
    return NoteRepository(db)


@router.post(
    "/",
    response_model=NoteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new polymorphic note",
)
async def create_note(
    note: NoteCreate, repo: NoteRepository = Depends(get_repository)
):
    created_doc = await repo.create(note)
    return created_doc


@router.get(
    "/",
    response_model=NoteListResponse,
    summary="List notes with optional filters",
)
async def list_notes(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    tag: Optional[str] = Query(None),
    note_type: Optional[NoteType] = Query(None),
    is_archived: Optional[bool] = Query(False),
    is_pinned: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
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