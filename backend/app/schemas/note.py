from datetime import datetime, timezone
from enum import Enum
from typing import Annotated, List, Literal, Optional, Union
from pydantic import BaseModel, ConfigDict, Field


class NoteType(str, Enum):
    STANDARD = "standard"
    CHECKLIST = "checklist"
    CODE = "code"


# ----------------------------------------------------
# Nested Supporting Models
# ----------------------------------------------------
class ChecklistItem(BaseModel):
    id: str = Field(
        ..., description="Unique client/server identifier for the item"
    )
    text: str = Field(..., min_length=1, max_length=500)
    completed: bool = False


# ----------------------------------------------------
# Base Note Schemas (Shared Properties)
# ----------------------------------------------------
class BaseNote(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    tags: List[str] = Field(default_factory=list)
    is_pinned: bool = False
    is_archived: bool = False


# ----------------------------------------------------
# Polymorphic Note Create Models
# ----------------------------------------------------
class StandardNoteCreate(BaseNote):
    note_type: Literal[NoteType.STANDARD] = NoteType.STANDARD
    content: str = Field(
        default="", description="Markdown text content of the note"
    )


class ChecklistNoteCreate(BaseNote):
    note_type: Literal[NoteType.CHECKLIST] = NoteType.CHECKLIST
    items: List[ChecklistItem] = Field(default_factory=list)


class CodeSnippetNoteCreate(BaseNote):
    note_type: Literal[NoteType.CODE] = NoteType.CODE
    code: str = Field(..., description="Raw code content")
    language: str = Field(
        default="plaintext", description="Programming language identifier"
    )
    explanation: Optional[str] = Field(
        default=None, description="Optional Markdown documentation"
    )


# Discriminated Union for incoming creation payloads
NoteCreate = Annotated[
    Union[StandardNoteCreate, ChecklistNoteCreate, CodeSnippetNoteCreate],
    Field(discriminator="note_type"),
]


# ----------------------------------------------------
# Note Update Model (Partial Updates)
# ----------------------------------------------------
class NoteUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    tags: Optional[List[str]] = None
    is_pinned: Optional[bool] = None
    is_archived: Optional[bool] = None
    content: Optional[str] = None
    items: Optional[List[ChecklistItem]] = None
    code: Optional[str] = None
    language: Optional[str] = None
    explanation: Optional[str] = None


# ----------------------------------------------------
# Polymorphic Note Response Models (Stored in MongoDB)
# ----------------------------------------------------
class BaseNoteResponse(BaseNote):
    id: str = Field(..., alias="_id")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class StandardNoteResponse(BaseNoteResponse):
    note_type: Literal[NoteType.STANDARD] = NoteType.STANDARD
    content: str = ""


class ChecklistNoteResponse(BaseNoteResponse):
    note_type: Literal[NoteType.CHECKLIST] = NoteType.CHECKLIST
    items: List[ChecklistItem] = Field(default_factory=list)


class CodeSnippetNoteResponse(BaseNoteResponse):
    note_type: Literal[NoteType.CODE] = NoteType.CODE
    code: str
    language: str = "plaintext"
    explanation: Optional[str] = None


NoteResponse = Annotated[
    Union[StandardNoteResponse, ChecklistNoteResponse, CodeSnippetNoteResponse],
    Field(discriminator="note_type"),
]

class NoteListResponse(BaseModel):
    items: List[NoteResponse]
    total: int
    skip: int
    limit: int