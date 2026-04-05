import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.updateUser(req.params.id as string, req.body);
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userService.deleteUser(req.params.id as string);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
