import { Router } from 'express';
import { createOrder, listOrders } from '../controllers/orderController.js';
import { optionalAuth, requireRole } from '../controllers/authController.js';

const router = Router();

router.get('/', requireRole('admin', 'superadmin'), listOrders);
router.post('/', optionalAuth, createOrder);

export default router;
