import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await authService.loginUser(req.body);
        res.status(200).json({
            status: 'success',
            data
        });
    } catch (error) {
        next(error);
    }
};
