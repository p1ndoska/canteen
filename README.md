# canteen

Пустой fullstack-проект: React (Vite) + Express + PostgreSQL.

## Структура

- `frontend/` — React SPA на Vite
- `backend/` — Node.js + Express API
- `docker-compose.yml` — PostgreSQL 16

## Запуск

```bash
# 1. База данных (PostgreSQL на localhost:5433)
docker compose up -d

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
