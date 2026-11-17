from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.loan import LoanStatus


class BorrowerCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    phone: str = Field(min_length=1, max_length=50)
    address: str = Field(min_length=1, max_length=500)


class BorrowerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: str
    phone: str
    address: str
    status: LoanStatus
    created_at: datetime
    updated_at: datetime


class BorrowerListResponse(BaseModel):
    items: list[BorrowerResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
