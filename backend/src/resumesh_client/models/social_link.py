import uuid

from resumesh_client.db import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, String, func


class SocialLink(Base):
    __tablename__ = "social_links"

    id = Column(
        String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    platform = Column(String(100), nullable=False)
    label = Column(String(255), nullable=False)
    url = Column(String(512), nullable=False)
    icon = Column(String(100), nullable=True)
    order_index = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), onupdate=func.now(), server_default=func.now()
    )


SocialLinkModel = SocialLink
