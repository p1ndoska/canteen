import { Router } from 'express';
import {
  listDishes,
  createDish,
  updateDish,
  deleteDish,
} from '../controllers/dishController.js';
import { requireRole } from '../controllers/authController.js';

const router = Router();
const adminOnly = requireRole('admin', 'superadmin');

router.get('/', listDishes);
router.post('/', adminOnly, createDish);
router.patch('/:id', adminOnly, updateDish);
router.delete('/:id', adminOnly, deleteDish);

export default router;
