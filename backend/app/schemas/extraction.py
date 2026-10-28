from datetime import datetime
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


class ExtractionFields(BaseModel):
    name: str = Field(..., description="Official title or name of the scheme/notice")
    department: str = Field(..., description="Government department issuing the notice")
    eligibility: str = Field(..., description="Who may qualify as described in the official notice")
    benefits: str = Field(..., description="Benefits and subsidies provided")
    documents: List[str] = Field(default_factory=list, description="Documents required")
    deadlines: List[str] = Field(default_factory=list, description="Application or registration deadlines")
    regions: List[str] = Field(default_factory=list, description="Applicable districts/talukas, empty for state-wide")
    crops: List[str] = Field(default_factory=list, description="Applicable crops, empty for all crops")
    official_application_link: Optional[str] = Field(None, description="Direct URL to apply on govt portal")


class ExtractionCreate(BaseModel):
    notice_version_id: str
    fields: ExtractionFields
    evidence_spans: Dict[str, str] = Field(
        ...,
        description="Map of field name to exact verbatim evidence quote from original text",
    )
    model: str = "regex-and-rules-v1"
    prompt_ver: str = "1.0.0"
    confidence: float = 1.0


class VerificationAction(BaseModel):
    status: str = Field(..., pattern="^(Verified|Rejected|Superseded)$")
    note: Optional[str] = None
    edited_fields: Optional[ExtractionFields] = None


class VerificationResponse(BaseModel):
    id: str
    notice_version_id: str
    status: str
    rule_results_json: Dict[str, Any]
    reviewer_id: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    note: Optional[str] = None

    class Config:
        from_attributes = True
