import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Pool } = pg;

const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgres://postgres:postgres@localhost:5433/canteen',
});

app.use(cors());
app.use(express.json());

const signToken = (user) =>
  jwt.sign({ sub: user.id, login: user.login }, jwtSecret, { expiresIn: '7d' });

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'ok', database: 'unavailable' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { login, password } = req.body ?? {};
  if (typeof login !== 'string' || typeof password !== 'string' || !login.trim() || password.length < 6) {
    return res
      .status(400)
      .json({ error: 'Логин обязателен, пароль — минимум 6 символов' });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (login, password_hash) VALUES ($1, $2) RETURNING id, login',
      [login.trim(), passwordHash],
    );
    const user = rows[0];
    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Такой логин уже занят' });
    }
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { login, password } = req.body ?? {};
  if (typeof login !== 'string' || typeof password !== 'string' || !login || !password) {
    return res.status(400).json({ error: 'Введите логин и пароль' });
  }
  try {
    const { rows } = await pool.query(
      'SELECT id, login, password_hash FROM users WHERE login = $1',
      [login.trim()],
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }
    res.json({ token: signToken(user), user: { id: user.id, login: user.login } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      login TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

init().catch((err) => {
  console.error('Failed to initialize:', err);
  process.exit(1);
});
