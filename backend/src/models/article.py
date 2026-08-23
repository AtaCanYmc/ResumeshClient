import uuid

from db import Base
from sqlalchemy import JSON, Column, DateTime, Integer, String, Text, func


class Article(Base):
    __tablename__ = "articles"

    id = Column(
        String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    title = Column(String(255), nullable=False, index=True)
    summary = Column(Text, nullable=True)
    url = Column(String(512), nullable=False, unique=True)
    platform = Column(String(50), nullable=False)
    reading_time_minutes = Column(Integer, default=0)
    raw_platform_data = Column(JSON, nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), onupdate=func.now(), server_default=func.now()
    )


ArticleModel = Article
