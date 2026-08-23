import uuid

from sqlalchemy import Column, DateTime, String, Text, func

from resumesh_client.db import Base


class GeneratedCV(Base):
    __tablename__ = "generated_cvs"

    id = Column(
        String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    job_title = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False)
    job_description_url = Column(String(512), nullable=True)
    raw_job_description = Column(Text, nullable=True)
    cv_content_markdown = Column(Text, nullable=False)
    pdf_file_path = Column(String(512), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


GeneratedCVModel = GeneratedCV
