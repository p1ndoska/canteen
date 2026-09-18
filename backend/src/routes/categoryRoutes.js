import { Router } from 'express';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { requireRole } from '../controllers/authController.js';

const router = Router();
const adminOnly = requireRole('admin', 'superadmin');

router.get('/', listCategories);
router.post('/', adminOnly, createCategory);
router.patch('/:id', adminOnly, updateCategory);
router.delete('/:id', adminOnly, deleteCategory);

export default router;
