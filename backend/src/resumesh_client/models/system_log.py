import uuid

from sqlalchemy import JSON, Column, DateTime, String, Text, func

from resumesh_client.db import Base


class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    level = Column(String(20), nullable=False)
    module = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    user_id = Column(String(36), nullable=True)
    request_id = Column(String(100), nullable=True)
    ip_address = Column(String(45), nullable=True)
    endpoint = Column(String(255), nullable=True)
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


SystemLogModel = SystemLog
