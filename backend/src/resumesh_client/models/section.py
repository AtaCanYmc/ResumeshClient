import uuid

from resumesh_client.db import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, func


class Section(Base):
    __tablename__ = "sections"

    id = Column(
        String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    key = Column(String(100), nullable=False, unique=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), onupdate=func.now(), server_default=func.now()
    )


SectionModel = Section
