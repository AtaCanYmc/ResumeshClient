"""
settings_store.py — Storage helper for settings, sections, and social_links tables.
Provides robust fallback defaults if database query fails or tables are empty.
"""

import json
import logging
from typing import Any, Dict, List

from sqlalchemy.orm import Session

from resumesh_client.config import settings
from resumesh_client.models.app_settings import AppSetting
from resumesh_client.models.section import Section
from resumesh_client.models.social_link import SocialLink

logger = logging.getLogger(__name__)


def get_default_avatar_url() -> str:
    if settings.SUPABASE_URL:
        base_url = settings.SUPABASE_URL.rstrip("/")
        return f"{base_url}/storage/v1/object/public/avatars/profile_pic.jpeg"
    return "/api/v1/avatar/profile_pic.jpeg"


DEFAULT_SECTIONS: Dict[str, bool] = {
    "educations": True,
    "articles": True,
    "projects": True,
    "certificates": True,
    "videos": True,
    "experiences": True,
    "skills": True,
    "posts": True,
}

DEFAULT_SOCIALS: List[Dict[str, Any]] = [
    {
        "id": "github",
        "platform": "github",
        "url": "https://github.com/AtaCanYmc",
        "label": "GitHub",
    },
    {
        "id": "linkedin",
        "platform": "linkedin",
        "url": "https://www.linkedin.com/in/ata-can-yaymac%C4%B1/",
        "label": "LinkedIn",
    },
    {
        "id": "devto",
        "platform": "devto",
        "url": "https://dev.to/atacanymc",
        "label": "Dev.to",
    },
    {
        "id": "medium",
        "platform": "medium",
        "url": "https://medium.com/@atacanymc",
        "label": "Medium",
    },
]

DEFAULT_MARQUEE: List[str] = [
    "React.js",
    "Vite.js",
    "Java",
    "SpringBoot",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "PL/SQL",
    "C#",
    ".NET",
    "Supabase",
    "Firebase",
    "MongoDB",
    "Docker",
    "Node.js",
    "Next.js",
    "GraphQL",
]


def get_default_en() -> Dict[str, Any]:
    return {
        "hero": {
            "name": "Ata Can",
            "fullName": "Ata Can Yaymacı",
            "avatarSubtitle": "Crafting digital experiences",
            "avatarImage": get_default_avatar_url(),
            "title": "I bridge the gap between AI Workflows and Financial Technologies.",
            "description": (
                "With a Computer Engineering background from Dokuz Eylul University, "
                "I specialize in scalable backend architectures and automation processes. "
                "I transform complex data into meaningful insights using modern web technologies."
            ),
            "resumeLink": "/resumes/resume.pdf",
        },
        "metrics": [
            {
                "id": 1,
                "icon": "code",
                "value": "25+",
                "label": "Active Projects",
                "color": "blue",
            },
            {
                "id": 2,
                "icon": "book",
                "value": "40+",
                "label": "Technical Articles",
                "color": "indigo",
            },
            {
                "id": 3,
                "icon": "star",
                "value": "4+",
                "label": "Years Experience",
                "color": "purple",
            },
        ],
    }


def get_default_tr() -> Dict[str, Any]:
    return {
        "hero": {
            "name": "Ata Can",
            "fullName": "Ata Can Yaymacı",
            "avatarSubtitle": "Dijital deneyimler tasarlıyorum",
            "avatarImage": get_default_avatar_url(),
            "title": "Yapay Zeka İş Akışları ve Finansal Teknolojiler arasında köprü kuruyorum.",
            "description": (
                "Dokuz Eylül Üniversitesi Bilgisayar Mühendisliği geçmişimle, "
                "ölçeklenebilir backend mimarileri ve otomasyon süreçleri üzerine çalışıyorum. "
                "Modern web teknolojileriyle karmaşık verileri anlamlı içgörülere dönüştürüyorum."
            ),
            "resumeLink": "/resumes/resume.pdf",
        },
        "metrics": [
            {
                "id": 1,
                "icon": "code",
                "value": "25+",
                "label": "Aktif Proje",
                "color": "blue",
            },
            {
                "id": 2,
                "icon": "book",
                "value": "40+",
                "label": "Teknik Makale",
                "color": "indigo",
            },
            {
                "id": 3,
                "icon": "star",
                "value": "4+",
                "label": "Yıl Deneyim",
                "color": "purple",
            },
        ],
    }


DEFAULT_FOOTER: Dict[str, Any] = {"email": "atacanymc@gmail.com"}


def get_kv_defaults() -> Dict[str, Any]:
    return {
        "footer": DEFAULT_FOOTER,
        "marquee": DEFAULT_MARQUEE,
        "en": get_default_en(),
        "tr": get_default_tr(),
    }


def get_all_settings(db: Session) -> Dict[str, Any]:
    stored = {}
    try:
        rows = db.query(AppSetting).all()
        for row in rows:
            if isinstance(row.value, str):
                try:
                    stored[row.key] = json.loads(row.value)
                except Exception:
                    stored[row.key] = row.value
            else:
                stored[row.key] = row.value
    except Exception as exc:
        logger.warning(f"Failed to query app_settings from DB: {exc}")

    result = {**get_kv_defaults(), **stored}

    # Ensure avatarImage is set to active avatar URL
    for lang in ["en", "tr"]:
        if lang in result and isinstance(result[lang], dict):
            hero = result[lang].get("hero")
            if isinstance(hero, dict):
                current_img = hero.get("avatarImage")
                if not current_img or current_img in [
                    "/images/profile_pic.jpeg",
                    "profile_pic.jpeg",
                ]:
                    hero["avatarImage"] = get_default_avatar_url()

    # Fetch sections from sections table
    try:
        db_sections = db.query(Section).order_by(Section.order_index.asc()).all()
        if db_sections:
            result["sections"] = {s.key: s.is_active for s in db_sections}
        else:
            result["sections"] = DEFAULT_SECTIONS
    except Exception as exc:
        logger.warning(f"Failed to query sections from DB: {exc}")
        result["sections"] = DEFAULT_SECTIONS

    # Fetch socials from social_links table
    try:
        db_socials = db.query(SocialLink).order_by(SocialLink.order_index.asc()).all()
        if db_socials:
            result["socials"] = [
                {
                    "id": s.id,
                    "platform": s.platform,
                    "label": s.label,
                    "url": s.url,
                    "icon": s.icon,
                    "order_index": s.order_index,
                    "is_active": s.is_active,
                }
                for s in db_socials
            ]
        else:
            result["socials"] = DEFAULT_SOCIALS
    except Exception as exc:
        logger.warning(f"Failed to query social_links from DB: {exc}")
        result["socials"] = DEFAULT_SOCIALS

    return result
