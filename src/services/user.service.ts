import { db } from '../utils/db';
import { AppError } from '../utils/errors';

export const getAllUsers = async () => {
    return db.user.findMany({ select: { id: true, name: true, email: true, role: true, status: true, createdAt: true } });
};

export const updateUser = async (id: string, data: any) => {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) throw new AppError('User not found', 404);

    return db.user.update({
        where: { id },
        data,
        select: { id: true, name: true, email: true, role: true, status: true }
    });
};

export const deleteUser = async (id: string) => {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) throw new AppError('User not found', 404);

    return db.user.delete({ where: { id } });
};
