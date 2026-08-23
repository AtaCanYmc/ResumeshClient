# ⚡ ResuMesh Client (Frontend & Backend)

[![Apache License 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev/)

This repository contains the standalone **ResuMesh Client** application, housing both the visitor-facing web interface and the public REST API service:
- **`frontend/`**: Visitor-facing React + Vite + TypeScript web application (`resumesh-web`).
- **`backend/`**: Python FastAPI REST API service (`resumesh-client`).

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

Spin up both frontend and backend services simultaneously:
```bash
docker compose up --build
```
- **Visitor Web Portal (UI)**: `http://localhost:8080`
- **Client Backend API**: `http://localhost:8000`
- **Interactive OpenAPI (Swagger) Docs**: `http://localhost:8000/docs`

---

### Option B: Local Manual Development Setup

#### 1. Backend Service (`backend/`)
```bash
cd backend
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uvicorn resumesh_client.main:app --host 0.0.0.0 --port 8000 --reload
# veya sanal ortamı aktifleştirmeden:
# .venv/bin/uvicorn resumesh_client.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Frontend Application (`frontend/`)
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing & Code Quality

### Backend Unit Tests (Pytest)
```bash
cd backend
.venv/bin/pytest tests -v
```

### Frontend Build & Lint (Vite + Oxlint)
```bash
cd frontend
npm run build
npm run test
```

---

## 📄 License

Distributed under the Apache License 2.0. See [LICENSE](LICENSE) for more information.
