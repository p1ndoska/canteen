# canteen

Пустой fullstack-проект: React (Vite) + Express + PostgreSQL.

## Структура

- `frontend/` — React SPA на Vite
- `backend/` — Node.js + Express API
- `docker-compose.yml` — PostgreSQL 16

## Запуск

### Всё в Docker

```bash
docker compose up -d --build
```

- Фронтенд: http://localhost:8081 (`/api/*` проксируется на бэкенд)
- Бэкенд: http://localhost:3000
- PostgreSQL: localhost:5433

### Локально (без Docker для кода)

```bash
# 1. База данных (PostgreSQL на localhost:5433)
docker compose up -d db

# 2. Бэкенд (http://localhost:3000)
cd backend
cp .env.example .env
npm install
npm run dev

# 3. Фронтенд (http://localhost:5173)
cd frontend
npm install
npm run dev
```

Проверка: `GET http://localhost:3000/api/health` → `{"status":"ok","database":"connected"}`
