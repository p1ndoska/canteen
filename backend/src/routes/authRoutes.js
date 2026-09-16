import { Router } from 'express';
import {
  register,
  login,
  listUsers,
  updateUserRole,
  requireRole,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', requireRole('superadmin'), listUsers);
router.patch('/users/:id/role', requireRole('superadmin'), updateUserRole);

export default router;
