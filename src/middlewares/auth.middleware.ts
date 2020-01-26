import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import CacheManager from '../core/cache.manager';
import configuration from '../config';

const cacheManager = CacheManager.getInstance();

export async function validateJwtToken(request: Request, response: Response, next: NextFunction) {
    let token: string;
    let jwtPayload;

    if (request.headers && request.headers.authorization &&
        request.headers.authorization.split(' ')[0] === 'Bearer') {
        token = request.headers.authorization.split(' ')[1];

        try {
            const isTokenInvalid = await cacheManager.isTokenRevoked(token);
            if (isTokenInvalid) {
                response.status(401).send();
            } else {
                jwtPayload = <any>jwt.verify(token, configuration.jwtSecret);
                response.locals.jwtPayload = jwtPayload;
                // Call the nex middleware or controller
                next();
            }
        } catch (error) {
            response.status(401).send();
        }
    } else {
        response.status(401).send('Authorization token is not valid!');
    }
}

export function validateRole(roles: Array<string>) {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            //Get the user ID from previous midleware
            const id = response.locals.jwtPayload.userId;
            const userRepositoty = getRepository(User);
            let user: User = await userRepositoty.findOneOrFail(id, {
                select: ["id", "username", "role", "createdAt", "updatedAt"]
            });

            if (roles.indexOf(user.role) > -1) {
                response.locals.user = user;
                next();
            } else {
                response.status(401).send();
            }
        } catch (error) {
            response.status(401).send();
        }
    }
}
