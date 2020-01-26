import { Request, Response } from "express";
import restaurantService from '../services/restaurant.service'
import { User } from '../entity/User';

class RestaurantController {

    async searchRestaurants(request: Request, response: Response) {
        try {
            const user: User = response.locals.user;
            const { location, latitude, longitude } = request.query;
            if (!location && !(latitude && longitude)) {
                response.status(400).send('Please specify a location or a latitude and longitude');
            } else {
                const result = await restaurantService.search(request.query, user);
                response.status(200).send(result);
            }
        } catch (error) {
            response.send(error);
        }
    }

    async getHistory(request: Request, response: Response) {
        try {
            const userId: number = response.locals.jwtPayload.userId;
            const result = await restaurantService.getSearchHistory(userId, request.query.limit);
            response.status(200).send(result);
        } catch (error) {
            response.send(error);
        }
    }
}

export default new RestaurantController();