# 🖥️ ResuMesh Client - Visitor Portfolio UI

This directory contains the visitor-facing React single-page web application (`resumesh-web`) for ResuMesh, located inside the **ResumeshClient** monorepo (`frontend/`).

It is built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS** for recruiters and visitors to browse skills, projects, certificates, experiences, and articles.

---

## 🛠️ Tech Stack & Tooling

- **Framework:** React 19 + Vite 8
- **Language:** TypeScript (`StrictMode` enforced)
- **Styling:** Tailwind CSS + Lucide React Icons
- **Linter & Code Quality:** Oxlint + Prettier
- **UI Sandbox:** Storybook 10
- **Testing:** Vitest + React Testing Library

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 20+
- Running `backend/` service on `http://localhost:8000` (optional for live data)

### Installation & Execution

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```

4. **Start Vite Development Server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:8080](http://localhost:8080) (or the port indicated by Vite) in your browser.

---

## 📚 Component Sandbox & Testing

### Storybook UI Component Catalog
```bash
npm run storybook
```
*Launches Storybook at `http://localhost:6006`.*

### Running Vitest Unit Tests
```bash
npm run test
```

### Production Build
```bash
npm run build
```
