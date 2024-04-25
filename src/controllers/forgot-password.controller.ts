// Importação de módulos necessários
import { Request, Response } from "express";
import { ForgotPasswordService } from "../services/forgot-password.service";
import { BadRequestError } from "../middlewares/errors";

// Instância do serviço responsável pela lógica de recuperação de senha
const forgotPasswordService = new ForgotPasswordService();

// Controlador para manipular solicitações relacionadas à recuperação de senha
export class ForgotPasswordController {
    // Verifica se o e-mail existe e, se sim, inicia o processo de recuperação de senha
    async checkEmailExists(req: Request, res: Response): Promise<void> {
        try {
            const { email, user_id } = req.body;

            // Se user_id não foi fornecido, busca o user_id associado ao e-mail
            const finalUserId =
                user_id ||
                (await forgotPasswordService.getUserIDByEmail(email));

            // Verifica se o e-mail existe e obtém um código de recuperação
            const { exists, token } =
                await forgotPasswordService.checkEmailExists(email);

            if (exists) {
                // Cria um registro indicando a solicitação de recuperação de senha
                await forgotPasswordService.createForgotPasswordRecord(
                    email,
                    token,
                    finalUserId
                );

                // Envia o código de recuperação por e-mail
                await forgotPasswordService.sendForgotPasswordEmail(
                    email,
                    token
                );

                // Responde com sucesso e inclui o token
                res.status(200).json({ message: "Email exists", token });
            } else {
                // Responde com erro se o e-mail não existe
                res.status(404).json({ error: "Email not found" });
            }
        } catch (error) {
            // Tratamento de erros durante o processo
            console.error(error);

            if (error instanceof BadRequestError) {
                // Responde com erro de requisição inválida
                res.status(400).json({ error: error.message });
            } else {
                // Responde com erro interno do servidor em casos não esperados
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }

    // Atualiza a senha do usuário com base no token recebido
    async updatePassword(req: Request, res: Response): Promise<void> {
        try {
            // Extrai informações da solicitação
            const { email, token, password } = req.body;

            // Verifica se o token é válido
            await forgotPasswordService.isTokenValid(email, token);

            // Atualiza a senha do usuário
            await forgotPasswordService.updatePassword(email, password);

            // Responde com sucesso após a atualização da senha
            res.status(200).json({ message: "Password updated successfully" });
        } catch (error) {
            // Tratamento de erros durante o processo
            console.error(error);

            if (
                error.name === "NotFoundError" ||
                error.name === "UnauthorizedError"
            ) {
                // Responde com erro de requisição inválida para tokens inválidos
                res.status(400).json({ error: error.message });
            } else {
                // Responde com erro interno do servidor em casos não esperados
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
}
