from datetime import datetime
from typing import Optional, Union

from pydantic import BaseModel, ConfigDict, HttpUrl


class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    platform: str
    url: Union[HttpUrl, str]
    thumbnail: Optional[Union[HttpUrl, str]] = None
    profile: str


class VideoCreate(VideoBase):
    pass


class VideoUpdate(VideoBase):
    pass


class VideoResponse(VideoBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
