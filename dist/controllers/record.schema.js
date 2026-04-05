"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterRecordSchema = exports.updateRecordSchema = exports.createRecordSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createRecordSchema = zod_1.default.object({
    body: zod_1.default.object({
        amount: zod_1.default.number().positive(),
        type: zod_1.default.enum(['INCOME', 'EXPENSE']),
        category: zod_1.default.string().min(1),
        date: zod_1.default.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
        notes: zod_1.default.string().optional()
    })
});
exports.updateRecordSchema = zod_1.default.object({
    body: zod_1.default.object({
        amount: zod_1.default.number().positive().optional(),
        type: zod_1.default.enum(['INCOME', 'EXPENSE']).optional(),
        category: zod_1.default.string().min(1).optional(),
        date: zod_1.default.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format").optional(),
        notes: zod_1.default.string().optional()
    })
});
exports.filterRecordSchema = zod_1.default.object({
    query: zod_1.default.object({
        type: zod_1.default.enum(['INCOME', 'EXPENSE']).optional(),
        category: zod_1.default.string().optional(),
        startDate: zod_1.default.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format").optional(),
        endDate: zod_1.default.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format").optional(),
        page: zod_1.default.string().regex(/^\d+$/).optional(),
        limit: zod_1.default.string().regex(/^\d+$/).optional()
    })
});
