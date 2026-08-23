import uuid

from sqlalchemy import Column, DateTime, String, Text, func

from resumesh_client.db import Base


class Video(Base):
    __tablename__ = "videos"

    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    platform = Column(String(100), nullable=False)
    url = Column(String(512), nullable=False)
    thumbnail = Column(String(512), nullable=True)
    profile = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())


VideoModel = Video
