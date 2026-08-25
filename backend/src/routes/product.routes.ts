import { Router } from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();
const writeLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', writeLimiter, authenticate, requireAdmin, createProduct);
router.put('/:id', writeLimiter, authenticate, requireAdmin, updateProduct);
router.delete('/:id', writeLimiter, authenticate, requireAdmin, deleteProduct);

export default router;
