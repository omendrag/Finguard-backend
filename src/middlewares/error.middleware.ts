import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    if (err.name === 'ZodError') {
        return res.status(400).json({
            status: 'fail',
            errors: err.issues || err.errors
        });
    }

    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
    });
};
