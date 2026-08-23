"""
ResuMesh Client Core Interfaces
"""

from abc import ABC, abstractmethod
from typing import Any, List


class IScraperService(ABC):
    """Abstract interface for external data scrapers."""

    @abstractmethod
    async def fetch_data(self, username: str, **kwargs) -> List[Any]:
        """Fetch items for the given username or resource identifier."""
        pass


class IRepository(ABC):
    """Base repository interface."""

    pass
