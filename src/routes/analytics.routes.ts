import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Only ANALYST and ADMIN can view analytics
router.use(authenticate);
router.use(authorize(['ANALYST', 'ADMIN']));

router.get('/summary', analyticsController.getSummary);

export default router;
