import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as recordService from '../services/record.service';

export const createRecord = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const record = await recordService.createRecord(req.body, req.user.id);
        res.status(201).json({ status: 'success', data: record });
    } catch (error) {
        next(error);
    }
};

export const getRecords = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await recordService.getRecords(req.query);
        res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        next(error);
    }
};

export const updateRecord = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const record = await recordService.updateRecord(req.params.id as string, req.body);
        res.status(200).json({ status: 'success', data: record });
    } catch (error) {
        next(error);
    }
};

export const deleteRecord = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        await recordService.deleteRecord(req.params.id as string);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
