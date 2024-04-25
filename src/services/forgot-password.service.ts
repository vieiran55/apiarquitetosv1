// Importações de módulos e classes necessárias
import { EmailService } from "./email.service";
import { ForgotPasswordRepository } from "../repositories/forgot-password.repository";
import {
    NotFoundError,
    UnauthorizedError,
    BadRequestError,
} from "../middlewares/errors";

// Instâncias das classes responsáveis por operações relacionadas à recuperação de senha
const forgotPasswordRepository = new ForgotPasswordRepository();
const emailService = new EmailService();

// Classe que encapsula a lógica de negócios para a recuperação de senha
export class ForgotPasswordService {
    // Verifica se o e-mail existe e, se sim, fornece um token para a recuperação de senha
    async checkEmailExists(
        email: string
    ): Promise<{ exists: boolean; token: string }> {
        const { exists, token } =
            await forgotPasswordRepository.checkEmailExists(email);

        // Se o e-mail existe, verifica se o último registro foi criado dentro do período de cooldown
        if (exists) {
            const lastRecord =
                await forgotPasswordRepository.getLastTokenRecord(email);

            if (lastRecord) {
                const timeDifference =
                    Date.now() - lastRecord.created_at.getTime();
                const cooldownTime = 60 * 60 * 1000; // 1 hora em milissegundos

                // Se o último registro foi criado dentro do período de cooldown de 1 hora, lança um erro
                if (timeDifference < cooldownTime) {
                    const retryAfter = cooldownTime - timeDifference;
                    throw new BadRequestError(
                        `Retry again after ${Math.ceil(
                            retryAfter / (60 * 1000)
                        )} minutes`
                    );
                }
            }

            // Retorna o resultado da verificação
            return { exists, token: token || "" };
        } else {
            // Se o e-mail não existe, retorna o resultado da verificação
            return { exists, token: "" };
        }
    }

    // Cria um novo registro para a solicitação de recuperação de senha
    async createForgotPasswordRecord(
        email: string,
        token: string,
        user_id: string
    ): Promise<void> {
        await forgotPasswordRepository.createForgotPasswordRecord(email, token, user_id);
    }

    // Atualiza a senha do usuário no banco de dados
    async updatePassword(email: string, newPassword: string): Promise<void> {
        await forgotPasswordRepository.updatePassword(email, newPassword);
    }

    // Verifica se o token de recuperação de senha é válido
    async isTokenValid(email: string, token: string): Promise<void> {
        // Obtém o registro de recuperação de senha do banco de dados
        const forgotPasswordRecord =
            await forgotPasswordRepository.findRecordByEmailAndToken(
                email,
                token
            );

        // Lança um erro se o registro não for encontrado ou não tiver uma data de expiração
        if (!forgotPasswordRecord || !forgotPasswordRecord.expires_at) {
            throw new NotFoundError("Forgot password record not found");
        }

        const expiresAtDate = new Date(forgotPasswordRecord.expires_at);

        // Lança um erro se o token estiver expirado ou já foi utilizado
        if (expiresAtDate <= new Date() || forgotPasswordRecord.used) {
            throw new UnauthorizedError("Expired token");
        }

        try {
            // Marca o token como utilizado no banco de dados
            await forgotPasswordRepository.markTokenAsUsed(
                forgotPasswordRecord.id
            );
        } catch (error) {
            // Lança um erro se houver falha ao marcar o token como utilizado
            throw new Error("Failed to mark token as used");
        }
    }

    // Envia um e-mail contendo o código de recuperação de senha
    async sendForgotPasswordEmail(email: string, code: string): Promise<void> {
        try {
            // Chama o serviço de e-mail para enviar o código
            await emailService.sendForgotPasswordEmail(email, code);
        } catch (error) {
            // Trata erros relacionados ao envio de e-mail
            console.error("Error sending email:", error);
            throw new BadRequestError("Error sending email");
        }
    }

    // Função para resgatar o id_user do repositorio
    async getUserIDByEmail(email: string): Promise<string | null> {
        return await forgotPasswordRepository.getUserIDByEmail(email);
    }


}
