# ⚡ ResuMesh Client (Frontend & Backend)

[![Apache License 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev/)

This repository contains the visitor-facing client application and API backend powering ResuMesh:
- **`backend/`**: Python FastAPI REST API service (`resumesh-client`).
- **`frontend/`**: Visitor-facing React + Vite + TypeScript web application (`resumesh-web`).

---

## 🏗️ Repository Architecture

```text
ResumeshClient/
├── backend/                  # Public FastAPI Client Service (Port 8000)
│   ├── src/resumesh_client/  # API endpoints, routers, and services
│   ├── tests/                # Pytest test suite
│   ├── pyproject.toml        # Python project metadata & dependencies
│   └── Dockerfile
├── frontend/                 # Visitor Web Application (Port 8080)
│   ├── src/                  # React components, pages, context, and styles
│   ├── public/               # Static web assets
│   ├── package.json          # Node dependencies & scripts
│   └── Dockerfile
├── docker-compose.yml        # Full-stack local orchestration
├── README.md
└── LICENSE
```

---

## 🚀 Quick Start

### Option A: Running with Docker Compose

Spin up both frontend and backend services:
```bash
docker compose up --build
```
- **Visitor Portal (UI)**: `http://localhost:8080`
- **Client Backend API**: `http://localhost:8000`
- **Swagger Documentation**: `http://localhost:8000/docs`

---

### Option B: Local Manual Development

#### 1. Backend Service (`backend/`)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -e /path/to/resumesh-core -e /path/to/resumesh-storage -e /path/to/resumesh-scrapers -e .
uvicorn resumesh_client.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Frontend Service (`frontend/`)
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing

### Backend Unit Tests
```bash
cd backend
.venv/bin/pytest tests -v
```

### Frontend Build & Lint
```bash
cd frontend
npm run build
```

---

## 📄 License

Distributed under the Apache License 2.0. See `LICENSE` for more information.
