import { Router } from 'express';
import { createOrder, listOrders } from '../controllers/orderController.js';
import { requireRole } from '../controllers/authController.js';

const router = Router();

router.get('/', requireRole('admin', 'superadmin'), listOrders);
router.post('/', requireRole('user', 'admin', 'superadmin'), createOrder);

export default router;
