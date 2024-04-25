import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export class AuthMiddleware {
    public async handler(req: Request, res: Response, next: NextFunction) {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized",
            });
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            return res.status(404).json({
                status: "error",
                message: "Access token is required",
            });
        }

        // Realiza a verificação se o token é válido e decodifica passando o resultado para o obj req.user que será usado para acessar as informações do usuário autenticado nas requests necessárias
        jwt.verify(token, process.env.SECRET_KEY as string, (err, decode) => {
            if (err) {
                return res.status(400).json({
                    status: "error",
                    message: err.message,
                });
            }

            console.log(decode);
            req.user = decode;
            next();
        });
    }
}
