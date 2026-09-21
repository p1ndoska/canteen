import { Router } from 'express';
import {
  listDishes,
  createDish,
  updateDish,
  deleteDish,
} from '../controllers/dishController.js';
import { requireRole } from '../controllers/authController.js';
import { upload } from '../upload.js';

const router = Router();
const adminOnly = requireRole('admin', 'superadmin');

router.get('/', listDishes);
router.post('/', adminOnly, upload.single('image'), createDish);
router.patch('/:id', adminOnly, upload.single('image'), updateDish);
router.delete('/:id', adminOnly, deleteDish);

export default router;
