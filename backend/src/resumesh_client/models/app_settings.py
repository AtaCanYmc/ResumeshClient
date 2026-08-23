from resumesh_client.db import Base
from sqlalchemy import Column, String, Text


class AppSetting(Base):
    __tablename__ = "app_settings"

    key = Column(String(255), primary_key=True, index=True)
    value = Column(Text, nullable=False)


AppSettingModel = AppSetting
