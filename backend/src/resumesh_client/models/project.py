import uuid

from resumesh_client.db import Base
from sqlalchemy import JSON, Column, DateTime, Integer, String, Text, func


class Project(Base):
    __tablename__ = "projects"

    id = Column(
        String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    name = Column(String(255), nullable=False, index=True)
    title = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    url = Column(String(512), nullable=True)
    stars = Column(Integer, default=0)
    watchers = Column(Integer, default=0)
    forks = Column(Integer, default=0)
    languages = Column(JSON, default=[])
    tags = Column(JSON, default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), onupdate=func.now(), server_default=func.now()
    )


ProjectModel = Project
