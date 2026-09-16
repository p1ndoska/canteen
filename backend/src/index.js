import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

const { Pool } = pg;

const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgres://postgres:postgres@localhost:5433/canteen',
});

app.use(cors());
app.use(express.json());

const signToken = (user) =>
  jwt.sign({ sub: user.id, login: user.login }, jwtSecret, { expiresIn: '7d' });

const normalizePhone = (phone) => {
  if (typeof phone !== 'string') return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return null;
  return `+${digits}`;
};

const hashCode = (code) =>
  crypto.createHash('sha256').update(code).digest('hex');

// Dev-режим: код "отправляется" в лог. Для реальных SMS подключить провайдера
// (Twilio и т.п.) по переменным окружения.
async function sendSms(phone, text) {
  console.log(`[sms:dev] to ${phone}: ${text}`);
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'ok', database: 'unavailable' });
  }
});

app.post('/api/auth/request-code', async (req, res) => {
  const phone = normalizePhone(req.body?.phone);
  if (!phone) {
    return res.status(400).json({ error: 'Введите корректный номер телефона' });
  }
  try {
    const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    await pool.query('DELETE FROM otp_codes WHERE phone = $1', [phone]);
    await pool.query(
      'INSERT INTO otp_codes (phone, code_hash, expires_at) VALUES ($1, $2, $3)',
      [phone, hashCode(code), new Date(Date.now() + OTP_TTL_MS)],
    );
    await sendSms(phone, `Ваш код входа: ${code}`);
    // devCode возвращается только в dev-режиме — без реального SMS-провайдера
    res.json({ sent: true, devCode: code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/auth/verify-code', async (req, res) => {
  const phone = normalizePhone(req.body?.phone);
  const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
  if (!phone || !code) {
    return res.status(400).json({ error: 'Введите номер телефона и код' });
  }
  try {
    const { rows } = await pool.query(
      `SELECT id, code_hash, expires_at, attempts FROM otp_codes
       WHERE phone = $1 AND used = false
       ORDER BY created_at DESC LIMIT 1`,
      [phone],
    );
    const otp = rows[0];
    if (!otp || otp.expires_at < new Date()) {
      return res.status(400).json({ error: 'Код истёк — запросите новый' });
    }
    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({ error: 'Слишком много попыток — запросите новый код' });
    }
    if (hashCode(code) !== otp.code_hash) {
      await pool.query('UPDATE otp_codes SET attempts = attempts + 1 WHERE id = $1', [otp.id]);
      return res.status(401).json({ error: 'Неверный код' });
    }
    await pool.query('UPDATE otp_codes SET used = true WHERE id = $1', [otp.id]);

    const { rows: users } = await pool.query(
      `INSERT INTO users (login, phone)
       VALUES ($1, $1)
       ON CONFLICT (phone) DO UPDATE SET phone = EXCLUDED.phone
       RETURNING id, login`,
      [phone],
    );
    const user = users[0];
    res.json({ token: signToken(user), user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
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
    if (!user || !user.password_hash || !(await bcrypt.compare(password, user.password_hash))) {
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
      password_hash TEXT,
      phone TEXT UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  // На случай существующей таблицы со старой схемой
  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT UNIQUE');
  await pool.query('ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS otp_codes (
      id SERIAL PRIMARY KEY,
      phone TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      attempts INT NOT NULL DEFAULT 0,
      used BOOLEAN NOT NULL DEFAULT false,
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
