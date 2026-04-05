import { db } from '../utils/db';
import { AppError } from '../utils/errors';

export const createRecord = async (data: any, userId: string) => {
    return db.financialRecord.create({
        data: {
            ...data,
            date: new Date(data.date),
            userId
        }
    });
};

export const getRecords = async (filters: any) => {
    const { type, category, startDate, endDate, page = '1', limit = '10' } = filters;
    const where: any = {};

    if (type) where.type = type;
    if (category) where.category = category;
    if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate);
        if (endDate) where.date.lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [records, total] = await Promise.all([
        db.financialRecord.findMany({
            where,
            skip,
            take,
            orderBy: { date: 'desc' },
            include: { createdBy: { select: { id: true, name: true, email: true } } }
        }),
        db.financialRecord.count({ where })
    ]);

    return { records, total, page: parseInt(page), limit: parseInt(limit) };
};

export const updateRecord = async (id: string, data: any) => {
    const record = await db.financialRecord.findUnique({ where: { id } });
    if (!record) throw new AppError('Record not found', 404);

    return db.financialRecord.update({
        where: { id },
        data: {
            ...data,
            ...(data.date && { date: new Date(data.date) })
        }
    });
};

export const deleteRecord = async (id: string) => {
    const record = await db.financialRecord.findUnique({ where: { id } });
    if (!record) throw new AppError('Record not found', 404);

    return db.financialRecord.delete({ where: { id } });
};
