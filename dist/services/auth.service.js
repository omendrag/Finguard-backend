"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../utils/db");
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
const registerUser = async (data) => {
    const existingUser = await db_1.db.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        throw new errors_1.AppError('Email is already registered', 400);
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    const user = await db_1.db.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role || 'VIEWER'
        }
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const user = await db_1.db.user.findUnique({ where: { email: data.email } });
    if (!user) {
        throw new errors_1.AppError('Invalid email or password', 401);
    }
    if (user.status !== 'ACTIVE') {
        throw new errors_1.AppError('User is inactive', 403);
    }
    const isMatch = await bcrypt_1.default.compare(data.password, user.password);
    if (!isMatch) {
        throw new errors_1.AppError('Invalid email or password', 401);
    }
    const token = (0, jwt_1.signToken)({ id: user.id, role: user.role });
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};
exports.loginUser = loginUser;
