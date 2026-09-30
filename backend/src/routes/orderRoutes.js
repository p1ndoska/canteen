import { Router } from 'express';
import { createOrder, listOrders, updateOrderStatus } from '../controllers/orderController.js';
import { optionalAuth, requireRole } from '../controllers/authController.js';

const router = Router();

router.get('/', requireRole('admin', 'superadmin'), listOrders);
router.post('/', optionalAuth, createOrder);
router.patch('/:id', requireRole('admin', 'superadmin'), updateOrderStatus);

export default router;
