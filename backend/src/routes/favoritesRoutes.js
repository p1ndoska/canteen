import { Router } from 'express'
import { requireRole } from '../controllers/authController.js'
import {
  listFavorites,
  addFavorite,
  removeFavorite,
} from '../controllers/favoritesController.js'

const router = Router()

const requireAuth = requireRole('user', 'admin', 'superadmin')

router.get('/', requireAuth, listFavorites)
router.post('/:dishId', requireAuth, addFavorite)
router.delete('/:dishId', requireAuth, removeFavorite)

export default router
