import { AuthUser } from "../@types/auth-user";
import { AuthUserRepository } from "../repositories/auth-user.repository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class AuthUserService {
    public async execute({ email, password }: AuthUser) {
        const authUserRepository = new AuthUserRepository();

        const user = await authUserRepository.auth(email);

        if (!user) {
            throw new Error("E-mail ou senha incorretos.");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new Error("E-mail ou senha incorretos.");
        }

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
            },
            process.env.SECRET_KEY as string,
            { expiresIn: "7d" }
        );

        return {
            user: {
                name: user.name,
                username: user.username,
                email: user.email,
                type: user.type,
            },
            token,
        };
    }
}
