import { Router } from 'express';
import fs from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import {
  listDishes,
  createDish,
  updateDish,
  deleteDish,
} from '../controllers/dishController.js';
import { requireRole } from '../controllers/authController.js';
import { upload } from '../upload.js';

const execFileAsync = promisify(execFile);
const router = Router();
const adminOnly = requireRole('admin', 'superadmin');

const isHeic = (file) =>
  /\.(heic|heif)$/i.test(file.originalname) || /^image\/hei[cf]/i.test(file.mimetype);

const convertHeicToJpeg = async (file) => {
  const target = file.path.replace(/\.[^.]+$/, '.jpg');
  await execFileAsync('heif-convert', ['-q', '90', file.path, target]);
  fs.unlinkSync(file.path);
  file.filename = file.filename.replace(/\.[^.]+$/, '.jpg');
  file.path = target;
  file.mimetype = 'image/jpeg';
};

const uploadImage = (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'Файл слишком большой (максимум 15 МБ)'
        : err.message || 'Не удалось загрузить файл';
      return res.status(413).json({ error: message });
    }
    try {
      if (req.file && isHeic(req.file)) {
        await convertHeicToJpeg(req.file);
      }
      next();
    } catch (convertErr) {
      console.error(convertErr);
      if (req.file) fs.unlink(req.file.path, () => {});
      res.status(400).json({ error: 'Не удалось прочитать HEIC-файл' });
    }
  });
};

router.get('/', listDishes);
router.post('/', adminOnly, uploadImage, createDish);
router.patch('/:id', adminOnly, uploadImage, updateDish);
router.delete('/:id', adminOnly, deleteDish);

export default router;
