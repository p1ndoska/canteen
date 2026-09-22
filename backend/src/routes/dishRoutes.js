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

const uploadImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'Файл слишком большой (максимум 5 МБ)'
        : 'Не удалось загрузить файл';
      return res.status(413).json({ error: message });
    }
    next();
  });
};

router.get('/', listDishes);
router.post('/', adminOnly, uploadImage, createDish);
router.patch('/:id', adminOnly, uploadImage, updateDish);
router.delete('/:id', adminOnly, deleteDish);

export default router;
