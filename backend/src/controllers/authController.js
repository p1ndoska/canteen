import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';

const signToken = (user) =>
  jwt.sign({ sub: user.id, login: user.login }, jwtSecret, { expiresIn: '7d' });

export async function register(req, res) {
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
}

export async function login(req, res) {
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
}
