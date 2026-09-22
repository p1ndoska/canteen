import { Router } from 'express';
import {
  register,
  login,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  requireRole,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', requireRole('superadmin'), listUsers);
router.post('/users', requireRole('superadmin'), createUser);
router.patch('/users/:id', requireRole('superadmin'), updateUser);
router.delete('/users/:id', requireRole('superadmin'), deleteUser);

export default router;
