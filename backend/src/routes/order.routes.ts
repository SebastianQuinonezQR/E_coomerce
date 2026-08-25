import { Router } from 'express';
import { createOrder, getOrders, getOrder, updateOrderStatus } from '../controllers/order.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();
const orderLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });

router.use(authenticate);
router.use(orderLimiter);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', requireAdmin, updateOrderStatus);

export default router;
