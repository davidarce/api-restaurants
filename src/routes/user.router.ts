import { Router } from 'express';
import { validateJwtToken, validateRole } from '../middlewares/auth.middleware';
import UserController from '../controller/user.controller';

const userRouter = Router();

// create users
userRouter.post('/', [validateJwtToken, validateRole(['ADMIN'])], UserController.createUser);
// get all users
userRouter.get('/', UserController.getUsers);
// get one user by id
userRouter.get('/:id([0-9]+)', UserController.getOneById);
// get my information
userRouter.get('/me', [validateJwtToken, validateRole(["ADMIN", "USER"])], UserController.getMyProfile);
// delete one user
userRouter.delete("/:id([0-9]+)", UserController.deleteUser);
// edit one user
userRouter.patch("/:id([0-9]+)", [validateJwtToken, validateRole(["ADMIN"])], UserController.editUser);

export default userRouter;