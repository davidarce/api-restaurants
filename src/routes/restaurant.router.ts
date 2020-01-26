import { Router } from 'express';
import { validateJwtToken, validateRole } from '../middlewares/auth.middleware';
import RestaurantController from '../controller/restaurant.controller';

const restaurantRouter = Router();

// search restaurants
restaurantRouter.get('/search', [validateJwtToken, validateRole(['ADMIN', 'USER'])],
    RestaurantController.searchRestaurants);
// get search history
restaurantRouter.get('/search/history', [validateJwtToken, validateRole(['ADMIN', 'USER'])],
    RestaurantController.getHistory);

export default restaurantRouter;