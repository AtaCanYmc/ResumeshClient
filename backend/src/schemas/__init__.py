"""
ResuMesh Core Pydantic Schemas
"""

from schemas.app_settings import (
    AppSettings,
    AppSettingsCreate,
    AppSettingsResponse,
    AppSettingsUpdate,
)
from schemas.article import ArticleCreate, ArticleResponse, ArticleUpdate
from schemas.certificate import (
    CertificateCreate,
    CertificateResponse,
    CertificateUpdate,
)
from schemas.education import (
    EducationCreate,
    EducationResponse,
    EducationUpdate,
)
from schemas.experience import (
    ExperienceCreate,
    ExperienceResponse,
    ExperienceUpdate,
)
from schemas.generated_cv import GeneratedCVCreate, GeneratedCVResponse
from schemas.package import PackageCreate, PackageResponse, PackageUpdate
from schemas.post import PostCreate, PostResponse, PostUpdate
from schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from schemas.search import GlobalSearchResponse, SearchResultItem
from schemas.section import SectionCreate, SectionResponse, SectionUpdate
from schemas.skill import SkillCreate, SkillResponse, SkillUpdate
from schemas.social_link import (
    SocialLinkCreate,
    SocialLinkResponse,
    SocialLinkUpdate,
)
from schemas.system_log import SystemLogCreate, SystemLogResponse
from schemas.video import VideoCreate, VideoResponse, VideoUpdate

__all__ = [
    "AppSettings",
    "AppSettingsCreate",
    "AppSettingsResponse",
    "AppSettingsUpdate",
    "ArticleCreate",
    "ArticleResponse",
    "ArticleUpdate",
    "CertificateCreate",
    "CertificateResponse",
    "CertificateUpdate",
    "EducationCreate",
    "EducationResponse",
    "EducationUpdate",
    "ExperienceCreate",
    "ExperienceResponse",
    "ExperienceUpdate",
    "GeneratedCVCreate",
    "GeneratedCVResponse",
    "PackageCreate",
    "PackageResponse",
    "PackageUpdate",
    "PostCreate",
    "PostResponse",
    "PostUpdate",
    "ProjectCreate",
    "ProjectResponse",
    "ProjectUpdate",
    "SearchResultItem",
    "GlobalSearchResponse",
    "SectionCreate",
    "SectionResponse",
    "SectionUpdate",
    "SkillCreate",
    "SkillResponse",
    "SkillUpdate",
    "SocialLinkCreate",
    "SocialLinkResponse",
    "SocialLinkUpdate",
    "SystemLogCreate",
    "SystemLogResponse",
    "VideoCreate",
    "VideoResponse",
    "VideoUpdate",
]
