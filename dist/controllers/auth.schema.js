"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.registerSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string().min(2, "Name must be at least 2 characters"),
        email: zod_1.default.string().email("Invalid email format"),
        password: zod_1.default.string().min(6, "Password must be at least 6 characters"),
        role: zod_1.default.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional()
    })
});
exports.loginSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: zod_1.default.string().email("Invalid email format"),
        password: zod_1.default.string().min(1, "Password is required")
    })
});
