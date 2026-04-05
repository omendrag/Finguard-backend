"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const errors_1 = require("../utils/errors");
const jwt_1 = require("../utils/jwt");
const db_1 = require("../utils/db");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errors_1.AppError('Unauthorized: Missing or invalid token', 401);
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await db_1.db.user.findUnique({
            where: { id: decoded.id }
        });
        if (!user || user.status !== 'ACTIVE') {
            throw new errors_1.AppError('Unauthorized: User not found or inactive', 401);
        }
        // Attach user info (except password)
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
        next();
    }
    catch (error) {
        next(new errors_1.AppError('Unauthorized', 401));
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new errors_1.AppError('Forbidden: Insufficient permissions', 403));
        }
        next();
    };
};
exports.authorize = authorize;
