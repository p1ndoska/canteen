import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { pool } from './db.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'ok', database: 'unavailable' });
  }
});

app.use('/api/auth', authRoutes);

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      login TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await pool.query(
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'",
  );
  // Убираем схему телефонного входа, если она была применена
  await pool.query('DROP TABLE IF EXISTS otp_codes');
  await pool.query('ALTER TABLE users DROP COLUMN IF EXISTS phone');

  const superadminLogin = (process.env.SUPERADMIN_LOGIN || 'admin').trim();
  const superadminPassword = process.env.SUPERADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(superadminPassword, 10);
  await pool.query(
    "INSERT INTO users (login, password_hash, role) VALUES ($1, $2, 'superadmin') ON CONFLICT (login) DO NOTHING",
    [superadminLogin, passwordHash],
  );
  console.log(`Superadmin account ready (login: ${superadminLogin})`);
  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

init().catch((err) => {
  console.error('Failed to initialize:', err);
  process.exit(1);
});
