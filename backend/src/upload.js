import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';

export const uploadDir = path.resolve('uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

const heicExt = /\.(heic|heif)$/i;

export const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    // HEIC с Windows может приходить без image/*-mimetype — смотрим и на расширение
    if (/^image\//.test(file.mimetype) || heicExt.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Можно загружать только изображения'));
    }
  },
});
