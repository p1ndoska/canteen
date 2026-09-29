import { pool } from '../db.js';

export async function createOrder(req, res) {
  const { items } = req.body ?? {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Корзина пуста' });
  }
  const ids = items.map((i) => i.dish_id);
  if (items.some((i) => !Number.isInteger(i.dish_id) || !Number.isInteger(i.qty) || i.qty <= 0)) {
    return res.status(400).json({ error: 'Некорректные позиции заказа' });
  }
  try {
    const { rows: dishes } = await pool.query(
      'SELECT id, name, price FROM dishes WHERE id = ANY($1)',
      [ids],
    );
    const byId = new Map(dishes.map((d) => [d.id, d]));
    if (dishes.length !== new Set(ids).size) {
      return res.status(400).json({ error: 'Некоторые блюда не найдены' });
    }
    const orderItems = items.map((i) => {
      const d = byId.get(i.dish_id);
      return { dish_id: d.id, name: d.name, price: Number(d.price), qty: i.qty };
    });
    const total = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const { rows } = await pool.query(
      'INSERT INTO orders (user_id, items, total) VALUES ($1, $2, $3) RETURNING id, total, status, created_at',
      [req.user?.sub ?? null, JSON.stringify(orderItems), total],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

export async function listOrders(_req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT o.id, o.items, o.total, o.status, o.created_at, u.login AS user_login
       FROM orders o LEFT JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`,
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
