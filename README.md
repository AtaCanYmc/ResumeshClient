# ⚡ ResuMesh Client Backend API

[![Apache License 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

This repository contains the standalone **ResuMesh Client Backend API** service (`resumesh-client`). It powers all visitor-facing and client-side portfolio read/write operations, CV tailoring requests, search querying, and content delivery for ResuMesh.

---

## 🏗️ System Architecture

`resumesh-client` is built with **FastAPI** and integrates cleanly with:
- **`resumesh-core`**: Core settings, schemas, and error handling abstractions.
- **`resumesh-storage`**: Database ORM models, Supabase/SQLAlchemy repositories, and data access layers.
- **`resumesh-scrapers`**: Modular scrapers framework for developer profiles.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Virtualenv

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AtaCanYmc/ResumeshClient.git
   cd ResumeshClient
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -e .
   ```

4. **Run the server:**
   ```bash
   uvicorn resumesh_client.main:app --host 0.0.0.0 --port 8000 --reload
   ```

Once running:
- **API Base URL**: `http://localhost:8000`
- **Interactive Swagger Documentation**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

---

## 🧪 Running Tests

```bash
pytest tests -v
```

---

## 📄 License

Distributed under the Apache License 2.0. See `LICENSE` for more information.
