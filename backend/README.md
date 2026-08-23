# ⚡ ResuMesh Client - Backend API Service

This directory contains the standalone **ResuMesh Client Backend API** service (`resumesh-client`), located inside the **ResumeshClient** monorepo (`backend/`).

It powers all visitor-facing REST endpoints, search filtering, article retrieval, project queries, CV PDF generation, and public content delivery.

---

## 🏗️ System Architecture

`resumesh-client` is built with **FastAPI** and integrates cleanly with:
- **`resumesh-core`**: Configuration settings, error handling, and domain schemas.
- **`resumesh-storage`**: Database ORM models, SQLAlchemy/Supabase repositories, and data access layers.
- **`resumesh-scrapers`**: Modular profile data scrapers framework.

---

## 🚀 Local Development Setup

### Prerequisites
- Python 3.10+
- Virtualenv

### Installation & Execution Steps

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies in editable mode:**
   ```bash
   pip install -e /path/to/resumesh-core -e /path/to/resumesh-storage -e /path/to/resumesh-scrapers -e .
   ```

4. **Start the local server:**
   ```bash
   source .venv/bin/activate
   uvicorn resumesh_client.main:app --host 0.0.0.0 --port 8000 --reload
   # veya doğrudan sanal ortam uvicorn binary'si ile:
   .venv/bin/uvicorn resumesh_client.main:app --host 0.0.0.0 --port 8000 --reload
   ```

---

## 📖 Interactive API Documentation

Once running, access docs from your browser:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🧪 Testing

Run pytest suite:
```bash
.venv/bin/pytest tests -v
```
