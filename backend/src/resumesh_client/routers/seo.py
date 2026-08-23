from fastapi import APIRouter, Depends, Response
from resumesh_client.db import get_db
from resumesh_client.models.project import Project

router = APIRouter(tags=["seo"])


@router.get("/sitemap.xml", response_class=Response)
async def get_sitemap(db=Depends(get_db)):
    projects = db.query(Project).all()
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        "  <url><loc>http://localhost:8080/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>",
        "  <url><loc>http://localhost:8080/projects</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>",
    ]
    for p in projects:
        xml_lines.append(
            f"  <url><loc>http://localhost:8080/projects/{p.id}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>"
        )
    xml_lines.append("</urlset>")
    return Response(content="\n".join(xml_lines), media_type="application/xml")


@router.get("/robots.txt", response_class=Response)
async def get_robots_txt():
    content = "User-agent: *\nAllow: /\nSitemap: http://localhost:8080/sitemap.xml\n"
    return Response(content=content, media_type="text/plain")
