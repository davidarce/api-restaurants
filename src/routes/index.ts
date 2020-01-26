import { Router, Request, Response } from "express";
import auth from "./auth.router";
import user from "./user.router";
import restaurant from "./restaurant.router";

const routes = Router();

routes.use('/auth', auth);
routes.use('/users', user);
routes.use('/restaurants', restaurant);

export default routes;
