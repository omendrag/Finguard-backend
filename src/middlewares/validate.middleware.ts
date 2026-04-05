import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error && (error as any).name === 'ZodError') {
                return res.status(400).json({
                    status: 'fail',
                errors: (error as ZodError).issues
                });
            }
            next(error);
        }
    };
};
