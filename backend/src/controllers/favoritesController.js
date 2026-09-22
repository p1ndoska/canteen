import { pool } from '../db.js'

export async function listFavorites(req, res) {
  const { rows } = await pool.query(
    'SELECT dish_id FROM favorites WHERE user_id = $1',
    [req.user.sub],
  )
  res.json(rows.map((r) => r.dish_id))
}

export async function addFavorite(req, res) {
  const dishId = Number(req.params.dishId)
  if (!Number.isInteger(dishId)) return res.status(400).json({ error: 'Некорректный блюдо' })
  try {
    await pool.query(
      'INSERT INTO favorites (user_id, dish_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.sub, dishId],
    )
    res.status(201).json({ ok: true })
  } catch (err) {
    if (err.code === '23503') return res.status(404).json({ error: 'Блюдо не найдено' })
    throw err
  }
}

export async function removeFavorite(req, res) {
  const dishId = Number(req.params.dishId)
  await pool.query(
    'DELETE FROM favorites WHERE user_id = $1 AND dish_id = $2',
    [req.user.sub, dishId],
  )
  res.json({ ok: true })
}
