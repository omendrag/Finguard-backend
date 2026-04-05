import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateUserSchema } from '../controllers/user.schema';

const router = Router();

// Only ADMINs can access user management routes
router.use(authenticate);
router.use(authorize(['ADMIN']));

router.get('/', userController.getUsers);
router.put('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
