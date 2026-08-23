from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class ProjectBase(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    stars: Optional[int] = 0
    watchers: Optional[int] = 0
    forks: Optional[int] = 0
    languages: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    created_at: Optional[datetime] = None

    def model_post_init(self, __context):
        if not self.name and self.title:
            self.name = self.title
        elif not self.title and self.name:
            self.title = self.name


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
