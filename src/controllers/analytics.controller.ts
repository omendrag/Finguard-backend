import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as analyticsService from '../services/analytics.service';

export const getSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const summary = await analyticsService.getDashboardSummary();
        res.status(200).json({ status: 'success', data: summary });
    } catch (error) {
        next(error);
    }
};
