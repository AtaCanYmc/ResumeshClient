from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ArticleBase(BaseModel):
    title: str
    summary: Optional[str] = None
    platform: str
    url: str
    published_at: Optional[datetime] = None


class ArticleCreate(ArticleBase):
    pass


class ArticleUpdate(ArticleBase):
    pass


class ArticleResponse(ArticleBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
