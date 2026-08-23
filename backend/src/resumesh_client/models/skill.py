import uuid

from resumesh_client.db import Base
from sqlalchemy import Column, DateTime, String, func


class Skill(Base):
    __tablename__ = "skills"

    id = Column(
        String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    name = Column(String(255), nullable=False)
    category = Column(String(255), nullable=False)
    icon_name = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), onupdate=func.now(), server_default=func.now()
    )


SkillModel = Skill
