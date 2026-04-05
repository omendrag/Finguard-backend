"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecord = exports.updateRecord = exports.getRecords = exports.createRecord = void 0;
const db_1 = require("../utils/db");
const errors_1 = require("../utils/errors");
const createRecord = async (data, userId) => {
    return db_1.db.financialRecord.create({
        data: {
            ...data,
            date: new Date(data.date),
            userId
        }
    });
};
exports.createRecord = createRecord;
const getRecords = async (filters) => {
    const { type, category, startDate, endDate, page = '1', limit = '10' } = filters;
    const where = {};
    if (type)
        where.type = type;
    if (category)
        where.category = category;
    if (startDate || endDate) {
        where.date = {};
        if (startDate)
            where.date.gte = new Date(startDate);
        if (endDate)
            where.date.lte = new Date(endDate);
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    const [records, total] = await Promise.all([
        db_1.db.financialRecord.findMany({
            where,
            skip,
            take,
            orderBy: { date: 'desc' },
            include: { createdBy: { select: { id: true, name: true, email: true } } }
        }),
        db_1.db.financialRecord.count({ where })
    ]);
    return { records, total, page: parseInt(page), limit: parseInt(limit) };
};
exports.getRecords = getRecords;
const updateRecord = async (id, data) => {
    const record = await db_1.db.financialRecord.findUnique({ where: { id } });
    if (!record)
        throw new errors_1.AppError('Record not found', 404);
    return db_1.db.financialRecord.update({
        where: { id },
        data: {
            ...data,
            ...(data.date && { date: new Date(data.date) })
        }
    });
};
exports.updateRecord = updateRecord;
const deleteRecord = async (id) => {
    const record = await db_1.db.financialRecord.findUnique({ where: { id } });
    if (!record)
        throw new errors_1.AppError('Record not found', 404);
    return db_1.db.financialRecord.delete({ where: { id } });
};
exports.deleteRecord = deleteRecord;
