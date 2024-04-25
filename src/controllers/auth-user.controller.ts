import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AuthUserService } from "../services/auth-user.service";

const schema = z.object({
    email: z
        .string()
        .min(1, { message: "E-mail é obrigatório" })
        .email({ message: "Formato de e-mail inválido" }),
    password: z.string().min(5, { message: "Mínimo 5 caracteres" }),
});

export class AuthUserController {
    public async handler(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = schema.parse(req.body);

            const authUserService = new AuthUserService();

            const response = await authUserService.execute({ email, password });
            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}
