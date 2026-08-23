from sqlalchemy import Column, String, Text

from resumesh_client.db import Base


class AppSetting(Base):
    __tablename__ = "app_settings"

    key = Column(String(255), primary_key=True, index=True)
    value = Column(Text, nullable=False)


AppSettingModel = AppSetting
