import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";

class UserController {

    public async getUsers(request: Request, response: Response) {
        //Get users from database
        const userRepository = getRepository(User);
        const users = await userRepository.find({
            select: ["id", "username", "role"]
        });

        response.send(users);
    }

    public async getMyProfile(request: Request, response: Response) {
        return response.send(response.locals.user);
    }

    public async getOneById(request: Request, response: Response) {
        const id: number = +request.params.id;
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id, {
                select: ["id", "username", "role"]
            });
            response.send(user);
        } catch (error) {
            response.status(404).send("User not found");
        }
    }

    public async createUser(request: Request, response: Response) {
        //Get parameters from the body
        let { username, password, role } = request.body;
        let user = new User();
        user.username = username;
        user.password = password;
        user.role = role;

        //Validade if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            response.status(400).send(errors);
            return;
        }

        user.hashPassword();
        const userRepository = getRepository(User);
        try {
            await userRepository.save(user);
        } catch (error) {
            response.status(409).send("username already in use");
            return;
        }

        response.status(201).send("User created");
    }

    public async editUser(request: Request, response: Response) {
        const id = request.params.id;
        const { username, role } = request.body;
        const userRepository = getRepository(User);
        let user;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            response.status(404).send("User not found");
            return;
        }

        user.username = username;
        user.role = role;
        const errors = await validate(user);
        if (errors.length > 0) {
            response.status(400).send(errors);
            return;
        }

        try {
            await userRepository.save(user);
        } catch (e) {
            response.status(409).send("username already in use");
            return;
        }
        response.status(204).send();
    }

    public async deleteUser(request: Request, response: Response) {
        const id = request.params.id;
        const userRepository = getRepository(User);
        try {
            await userRepository.findOneOrFail(id);
            userRepository.delete(id);
            response.status(204).send();
        } catch (error) {
            response.status(404).send("User not found");
        }
    }
}

export default new UserController();