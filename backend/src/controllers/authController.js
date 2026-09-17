import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';

const signToken = (user) =>
  jwt.sign({ sub: user.id, login: user.login, role: user.role }, jwtSecret, {
    expiresIn: '7d',
  });

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
      'INSERT INTO users (login, password_hash) VALUES ($1, $2) RETURNING id, login, role',
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

export function requireRole(...roles) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }
    try {
      const payload = jwt.verify(token, jwtSecret);
      if (!roles.includes(payload.role)) {
        return res.status(403).json({ error: 'Недостаточно прав' });
      }
      req.user = payload;
      next();
    } catch {
      res.status(401).json({ error: 'Недействительный токен' });
    }
  };
}

export async function listUsers(_req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT id, login, role, created_at FROM users ORDER BY id',
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

export async function createUser(req, res) {
  const { login, password, role } = req.body ?? {};
  if (typeof login !== 'string' || !login.trim() || typeof password !== 'string' || password.length < 6) {
    return res
      .status(400)
      .json({ error: 'Логин обязателен, пароль — минимум 6 символов' });
  }
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Допустимые роли: user, admin' });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (login, password_hash, role) VALUES ($1, $2, $3) RETURNING id, login, role',
      [login.trim(), passwordHash, role],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Такой логин уже занят' });
    }
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

export async function updateUser(req, res) {
  const { login, password, role } = req.body ?? {};
  const updates = [];
  const values = [];
  if (login !== undefined) {
    if (typeof login !== 'string' || !login.trim()) {
      return res.status(400).json({ error: 'Логин не может быть пустым' });
    }
    values.push(login.trim());
    updates.push(`login = $${values.length}`);
  }
  if (password !== undefined && password !== '') {
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Пароль — минимум 6 символов' });
    }
    values.push(await bcrypt.hash(password, 10));
    updates.push(`password_hash = $${values.length}`);
  }
  if (role !== undefined) {
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Допустимые роли: user, admin' });
    }
    values.push(role);
    updates.push(`role = $${values.length}`);
  }
  if (!updates.length) {
    return res.status(400).json({ error: 'Нечего обновлять' });
  }
  values.push(req.params.id);
  try {
    const { rows } = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${values.length} AND role <> 'superadmin' RETURNING id, login, role`,
      values,
    );
    if (!rows[0]) {
      return res.status(404).json({ error: 'Пользователь не найден или это суперадмин' });
    }
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Такой логин уже занят' });
    }
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

export async function deleteUser(req, res) {
  try {
    const { rows } = await pool.query(
      "DELETE FROM users WHERE id = $1 AND role <> 'superadmin' RETURNING id",
      [req.params.id],
    );
    if (!rows[0]) {
      return res.status(404).json({ error: 'Пользователь не найден или это суперадмин' });
    }
    res.status(204).end();
  } catch (err) {
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
      'SELECT id, login, password_hash, role FROM users WHERE login = $1',
      [login.trim()],
    );
    const user = rows[0];
    if (!user || !user.password_hash || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }
    res.json({
      token: signToken(user),
      user: { id: user.id, login: user.login, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
