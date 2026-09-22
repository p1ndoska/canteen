import { pool } from '../db.js';

export async function listCategories(_req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, created_at FROM categories ORDER BY name',
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

export async function createCategory(req, res) {
  const { name } = req.body ?? {};
  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Название обязательно' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING id, name',
      [name.trim()],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Такая категория уже существует' });
    }
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

export async function updateCategory(req, res) {
  const { name } = req.body ?? {};
  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Название обязательно' });
  }
  try {
    const { rows } = await pool.query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING id, name',
      [name.trim(), req.params.id],
    );
    if (!rows[0]) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Такая категория уже существует' });
    }
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { rows } = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING id',
      [req.params.id],
    );
    if (!rows[0]) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
