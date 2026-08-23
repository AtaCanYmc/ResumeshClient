from typing import Generic, List, Optional, Type, TypeVar

from sqlalchemy.orm import Session

T = TypeVar("T")


class BaseRepository(Generic[T]):
    def __init__(self, db: Session, model_cls: Type[T]):
        self.db = db
        self.model_cls = model_cls

    def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        return self.db.query(self.model_cls).offset(skip).limit(limit).all()

    def get_by_id(self, item_id: str) -> Optional[T]:
        return (
            self.db.query(self.model_cls)
            .filter(getattr(self.model_cls, "id") == item_id)
            .first()
        )

    def create(self, obj: T) -> T:
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def update(self, item_id: str, data: dict) -> Optional[T]:
        item = self.get_by_id(item_id)
        if not item:
            return None
        for key, value in data.items():
            if value is not None:
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete(self, item_id: str) -> bool:
        item = self.get_by_id(item_id)
        if not item:
            return False
        self.db.delete(item)
        self.db.commit()
        return True
