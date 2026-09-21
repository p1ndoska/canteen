import { pool } from '../db.js';

const isValidDish = ({ name, image_url, weight, category_id }) =>
  typeof name === 'string' &&
  name.trim() !== '' &&
  (image_url === undefined || image_url === null || typeof image_url === 'string') &&
  typeof weight === 'string' &&
  weight.trim() !== '' &&
  Number.isInteger(Number(category_id));

export async function listDishes(_req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT d.id, d.name, d.image_url, d.weight, d.category_id, c.name AS category_name
       FROM dishes d LEFT JOIN categories c ON c.id = d.category_id
       ORDER BY d.id`,
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

export async function createDish(req, res) {
  const { name, image_url = '', weight, category_id } = req.body ?? {};
  if (!isValidDish({ name, image_url, weight, category_id })) {
    return res.status(400).json({ error: 'Заполните название, вес и категорию' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO dishes (name, image_url, weight, category_id) VALUES ($1, $2, $3, $4)
       RETURNING id, name, image_url, weight, category_id`,
      [name.trim(), image_url.trim(), weight.trim(), Number(category_id)],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ error: 'Категория не найдена' });
    }
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

export async function updateDish(req, res) {
  const { name, image_url = '', weight, category_id } = req.body ?? {};
  if (!isValidDish({ name, image_url, weight, category_id })) {
    return res.status(400).json({ error: 'Заполните название, вес и категорию' });
  }
  try {
    const { rows } = await pool.query(
      `UPDATE dishes SET name = $1, image_url = $2, weight = $3, category_id = $4
       WHERE id = $5 RETURNING id, name, image_url, weight, category_id`,
      [name.trim(), image_url.trim(), weight.trim(), Number(category_id), req.params.id],
    );
    if (!rows[0]) {
      return res.status(404).json({ error: 'Блюдо не найдено' });
    }
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ error: 'Категория не найдена' });
    }
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

export async function deleteDish(req, res) {
  try {
    const { rows } = await pool.query(
      'DELETE FROM dishes WHERE id = $1 RETURNING id',
      [req.params.id],
    );
    if (!rows[0]) {
      return res.status(404).json({ error: 'Блюдо не найдено' });
    }
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
