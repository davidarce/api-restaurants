import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../entity/User";
import configuration from "../config";
import CacheManager from "../core/cache.manager";

class AuthController {

    private cacheManager: CacheManager;

    constructor() {
        this.cacheManager = CacheManager.getInstance();
        this.logout = this.logout.bind(this);
    }

    public async login(request: Request, response: Response) {
        // Check if username and password are set
        let { username, password } = request.body;

        if (!(username && password)) {
            response.status(400).send('Invalid username or password!');
        }

        // Get user from database
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail({ where: { username } });
            if (user.checkIfUnencryptedPasswordIsValid(password)) {
                //Sing JWT, valid for 1 hour
                const token = jwt.sign({ userId: user.id, username: user.username },
                    configuration.jwtSecret, { expiresIn: "1h" });
                //Send the jwt in the response
                response.send({ token: token });
            } else {
                response.status(401).send();
            }
        } catch (error) {
            response.status(401).send('Invalid username or password!');
        }
    }

    async logout(request: Request, response: Response) {
        let token: string;
        try {
            if (request.headers && request.headers.authorization &&
                request.headers.authorization.split(' ')[0] === 'Bearer') {
                token = request.headers.authorization.split(' ')[1];
                await this.revokeToken(token);
                response.status(200).send();
            } else {
                response.status(401).send();
            }
        } catch (error) {
            response.status(500).send();
        }
    }

    async changePassword(request: Request, response: Response) {
        //Get ID from JWT
        const id: number = response.locals.jwtPayload.userId;

        //Get parameters from the body
        const { oldPassword, newPassword } = request.body;
        if (!(oldPassword && newPassword)) {
            response.status(400).send('oldPassword and newPassword cannot be null or empty!');
        }

        //Get user from the database
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(id);
            //Check if old password matchs
            if (user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
                //Validate password lenght
                user.password = newPassword;
                const errors = await validate(user);
                if (errors.length > 0) {
                    response.status(400).send(errors);
                    return;
                }
                //Hash the new password and save
                user.hashPassword();
                userRepository.save(user);
                response.status(204).send();
            } else {
                response.status(401).send();
            }
        } catch (id) {
            response.status(401).send();
        }
    }

    private async revokeToken(token: string) {
        await this.cacheManager.addTokenInBlackList(token);
    }
}

export default new AuthController();