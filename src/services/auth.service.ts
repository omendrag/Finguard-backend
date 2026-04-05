import bcrypt from 'bcrypt';
import { db } from '../utils/db';
import { signToken } from '../utils/jwt';
import { AppError } from '../utils/errors';

export const registerUser = async (data: any) => {
    const existingUser = await db.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        throw new AppError('Email is already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await db.user.create({
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

export const loginUser = async (data: any) => {
    const user = await db.user.findUnique({ where: { email: data.email } });
    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    if (user.status !== 'ACTIVE') {
        throw new AppError('User is inactive', 403);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid email or password', 401);
    }

    const token = signToken({ id: user.id, role: user.role });
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
};
