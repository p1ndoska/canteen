import { Router } from 'express';
import { createOrder, listMyOrders, listOrders, updateOrderStatus } from '../controllers/orderController.js';
import { optionalAuth, requireRole } from '../controllers/authController.js';

const router = Router();

router.get('/', requireRole('admin', 'superadmin'), listOrders);
router.get('/mine', requireRole('user', 'admin', 'superadmin'), listMyOrders);
router.post('/', optionalAuth, createOrder);
router.patch('/:id', requireRole('admin', 'superadmin'), updateOrderStatus);

export default router;
