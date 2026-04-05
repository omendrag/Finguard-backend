import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { verifyToken } from '../utils/jwt';
import { db } from '../utils/db';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Unauthorized: Missing or invalid token', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded: any = verifyToken(token);

        const user = await db.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user || user.status !== 'ACTIVE') {
            throw new AppError('Unauthorized: User not found or inactive', 401);
        }

        // Attach user info (except password)
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
        next();
    } catch (error) {
        next(new AppError('Unauthorized', 401));
    }
};

export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('Forbidden: Insufficient permissions', 403));
        }
        next();
    };
};
