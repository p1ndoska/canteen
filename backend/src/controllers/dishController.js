import { pool } from '../db.js';

const isValidDish = ({ name, weight, category_id, price, stock }) =>
  typeof name === 'string' &&
  name.trim() !== '' &&
  typeof weight === 'string' &&
  weight.trim() !== '' &&
  Number.isInteger(Number(category_id)) &&
  !Number.isNaN(Number(price)) &&
  Number(price) >= 0 &&
  (stock === undefined || stock === '' || (Number.isInteger(Number(stock)) && Number(stock) >= 0));

const imageUrl = (req) => (req.file ? `/uploads/${req.file.filename}` : '');

export async function listDishes(_req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT d.id, d.name, d.image_url, d.weight, d.price, d.description, d.stock, d.category_id, c.name AS category_name
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
  const { name, weight, category_id, price, description, stock } = req.body ?? {};
  if (!isValidDish({ name, weight, category_id, price, stock })) {
    return res.status(400).json({ error: 'Заполните название, вес, цену и категорию' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO dishes (name, image_url, weight, price, description, stock, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, image_url, weight, price, description, stock, category_id`,
      [name.trim(), imageUrl(req), weight.trim(), Number(price), (description ?? '').trim(), Number(stock) || 0, Number(category_id)],
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
  const { name, weight, category_id, price, description, stock } = req.body ?? {};
  if (!isValidDish({ name, weight, category_id, price, stock })) {
    return res.status(400).json({ error: 'Заполните название, вес, цену и категорию' });
  }
  try {
    const { rows: existing } = await pool.query(
      'SELECT image_url FROM dishes WHERE id = $1',
      [req.params.id],
    );
    if (!existing[0]) {
      return res.status(404).json({ error: 'Блюдо не найдено' });
    }
    const { rows } = await pool.query(
      `UPDATE dishes SET name = $1, image_url = $2, weight = $3, price = $4, description = $5, stock = $6, category_id = $7
       WHERE id = $8 RETURNING id, name, image_url, weight, price, description, stock, category_id`,
      [name.trim(), imageUrl(req) || existing[0].image_url, weight.trim(), Number(price), (description ?? '').trim(), Number(stock) || 0, Number(category_id), req.params.id],
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
