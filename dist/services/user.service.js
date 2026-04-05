"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = void 0;
const db_1 = require("../utils/db");
const errors_1 = require("../utils/errors");
const getAllUsers = async () => {
    return db_1.db.user.findMany({ select: { id: true, name: true, email: true, role: true, status: true, createdAt: true } });
};
exports.getAllUsers = getAllUsers;
const updateUser = async (id, data) => {
    const user = await db_1.db.user.findUnique({ where: { id } });
    if (!user)
        throw new errors_1.AppError('User not found', 404);
    return db_1.db.user.update({
        where: { id },
        data,
        select: { id: true, name: true, email: true, role: true, status: true }
    });
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    const user = await db_1.db.user.findUnique({ where: { id } });
    if (!user)
        throw new errors_1.AppError('User not found', 404);
    return db_1.db.user.delete({ where: { id } });
};
exports.deleteUser = deleteUser;
