from datetime import datetime
from typing import Optional, Union

from pydantic import BaseModel, ConfigDict


class GeneratedCVBase(BaseModel):
    job_title: str
    company_name: str
    job_description_url: Optional[str] = None
    raw_job_description: Optional[str] = None
    cv_content_markdown: str
    pdf_file_path: Optional[str] = None


class GeneratedCVCreate(GeneratedCVBase):
    pass


class GeneratedCVResponse(GeneratedCVBase):
    id: Union[int, str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
