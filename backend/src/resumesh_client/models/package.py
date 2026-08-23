import uuid

from sqlalchemy import Column, DateTime, Integer, String, Text, func

from resumesh_client.db import Base


class Package(Base):
    __tablename__ = "packages"

    id = Column(
        String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    platform = Column(String(100), default="")
    url = Column(String(512), nullable=True)
    docs_url = Column(String(512), nullable=True)
    tags = Column(String(255), default="")
    version = Column(String(50), default="")
    last_month_downloads = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), onupdate=func.now(), server_default=func.now()
    )


PackageModel = Package
