import { Router } from 'express';
import * as recordController from '../controllers/record.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createRecordSchema, updateRecordSchema, filterRecordSchema } from '../controllers/record.schema';

const router = Router();

router.use(authenticate);

// All roles can view records (as per my global records assumption)
router.get('/', validate(filterRecordSchema), recordController.getRecords);

// Only ADMINs can modify records
router.post('/', authorize(['ADMIN']), validate(createRecordSchema), recordController.createRecord);
router.put('/:id', authorize(['ADMIN']), validate(updateRecordSchema), recordController.updateRecord);
router.delete('/:id', authorize(['ADMIN']), recordController.deleteRecord);

export default router;
