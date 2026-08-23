import json
import uuid

import pytest
from resumesh_client.db import SessionLocal, engine
from resumesh_client.models.app_settings import AppSetting
from resumesh_client.models.article import Article
from resumesh_client.models.certificate import Certificate
from resumesh_client.models.education import Education
from resumesh_client.models.experience import Experience
from resumesh_client.models.generated_cv import GeneratedCV
from resumesh_client.models.package import Package
from resumesh_client.models.post import Post
from resumesh_client.models.project import Project
from resumesh_client.models.section import Section
from resumesh_client.models.skill import Skill
from resumesh_client.models.social_link import SocialLink
from resumesh_client.models.system_log import SystemLog
from resumesh_client.models.video import Video
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError


def test_database_engine_connectivity():
    """Verify raw database connection health."""
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1")).scalar()
        assert result == 1


def test_db_session_commit_and_rollback():
    """Verify session commit and rollback mechanics."""
    db = SessionLocal()
    try:
        proj = Project(name="Test DB Project", description="Testing DB Session")
        db.add(proj)
        db.commit()
        db.refresh(proj)
        assert proj.id is not None

        # Verify existence
        fetched = db.query(Project).filter(Project.id == proj.id).first()
        assert fetched is not None
        assert fetched.name == "Test DB Project"

        # Test Rollback
        proj2 = Project(name="Rollback Project")
        db.add(proj2)
        db.rollback()
        uncommitted = db.query(Project).filter(Project.name == "Rollback Project").first()
        assert uncommitted is None
    finally:
        db.close()


def test_all_models_crud():
    """Verify creation and retrieval for all 14 ORM models."""
    db = SessionLocal()
    try:
        # 1. Project
        p = Project(name="Project Model Test", title="Title", description="Desc")
        db.add(p)

        # 2. Article
        art = Article(
            title="Article Test",
            platform="MEDIUM",
            url=f"https://medium.com/test-article-crud-{uuid.uuid4()}",
        )
        db.add(art)

        # 3. Experience
        exp = Experience(company_name="Tech Corp", title="Developer")
        db.add(exp)

        # 4. Education
        edu = Education(school="University", degree="B.S.", field_of_study="CS")
        db.add(edu)

        # 5. Certificate
        cert = Certificate(name="Cert Test", issuing_organization="Org")
        db.add(cert)

        # 6. Skill
        sk = Skill(name="Python", category="Backend", icon_name="python")
        db.add(sk)

        # 7. Package
        pkg = Package(title="Pkg Test", platform="pypi", url="https://pypi.org/pkg")
        db.add(pkg)

        # 8. Post
        pst = Post(title="Post Test", description="Content", platform="devto")
        db.add(pst)

        # 9. Video
        vid = Video(
            title="Video Test",
            platform="youtube",
            url="https://youtube.com",
            profile="user",
        )
        db.add(vid)

        # 10. SocialLink
        soc = SocialLink(
            id=str(uuid.uuid4()),
            platform="github",
            label="GitHub",
            url="https://github.com",
        )
        db.add(soc)

        # 11. Section
        sec = Section(
            id=str(uuid.uuid4()),
            key=f"test_sec_key_{uuid.uuid4()}",
            title="Test Section",
        )
        db.add(sec)

        # 12. AppSetting
        app_set = AppSetting(key=f"test_unique_key_{uuid.uuid4()}", value=json.dumps({"theme": "dark"}))
        db.add(app_set)

        # 13. SystemLog
        sys_log = SystemLog(level="INFO", module="client-backend", message="Test Log Message")
        db.add(sys_log)

        # 14. GeneratedCV
        cv_item = GeneratedCV(
            job_title="Software Engineer",
            company_name="Tech Corp",
            cv_content_markdown="# CV Content",
            pdf_file_path="/cvs/test.pdf",
        )
        db.add(cv_item)

        db.commit()

        # Assertions
        assert db.query(Project).filter(Project.id == p.id).first() is not None
        assert db.query(Article).filter(Article.id == art.id).first() is not None
        assert db.query(Experience).filter(Experience.id == exp.id).first() is not None
        assert db.query(Education).filter(Education.id == edu.id).first() is not None
        assert db.query(Certificate).filter(Certificate.id == cert.id).first() is not None
        assert db.query(Skill).filter(Skill.id == sk.id).first() is not None
        assert db.query(Package).filter(Package.id == pkg.id).first() is not None
        assert db.query(Post).filter(Post.id == pst.id).first() is not None
        assert db.query(Video).filter(Video.id == vid.id).first() is not None
        assert db.query(SocialLink).filter(SocialLink.id == soc.id).first() is not None
        assert db.query(Section).filter(Section.id == sec.id).first() is not None
        assert db.query(AppSetting).filter(AppSetting.key == app_set.key).first() is not None
        assert db.query(SystemLog).filter(SystemLog.id == sys_log.id).first() is not None
        assert db.query(GeneratedCV).filter(GeneratedCV.id == cv_item.id).first() is not None
    finally:
        db.close()


def test_unique_constraint_enforcement():
    """Verify unique constraint triggers IntegrityError on duplicate keys."""
    db = SessionLocal()
    try:
        unique_key = f"unique_setting_{uuid.uuid4()}"
        set1 = AppSetting(key=unique_key, value=json.dumps({"val": 1}))
        db.add(set1)
        db.commit()

        set2 = AppSetting(key=unique_key, value=json.dumps({"val": 2}))
        db.add(set2)
        with pytest.raises(IntegrityError):
            db.commit()
        db.rollback()
    finally:
        db.close()
