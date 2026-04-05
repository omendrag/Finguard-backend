"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.updateUserSchema = zod_1.default.object({
    body: zod_1.default.object({
        role: zod_1.default.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
        status: zod_1.default.enum(['ACTIVE', 'INACTIVE']).optional()
    })
});
