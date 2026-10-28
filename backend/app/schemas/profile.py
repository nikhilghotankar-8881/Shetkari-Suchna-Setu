from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class ProfileCreate(BaseModel):
    district: str = Field(..., min_length=2, max_length=128)
    taluka: Optional[str] = Field(None, max_length=128)
    crops: List[str] = Field(default_factory=list, description="List of chosen crops, e.g. ['Soybean', 'Cotton']")
    lang: str = Field(default="mr", pattern="^(mr|en)$")


class ProfileUpdate(BaseModel):
    district: Optional[str] = Field(None, min_length=2, max_length=128)
    taluka: Optional[str] = None
    crops: Optional[List[str]] = None
    lang: Optional[str] = Field(None, pattern="^(mr|en)$")


class ProfileResponse(BaseModel):
    id: str
    district: str
    taluka: Optional[str] = None
    crops: List[str]
    lang: str
    created_at: datetime
    last_seen_at: datetime
    # The raw bearer token is only returned once upon creation
    token: Optional[str] = None

    class Config:
        from_attributes = True
