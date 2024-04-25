// Importações de módulos e tipos necessários
import { prismaClient } from "../database/prisma.service";
import { ForgotPassword } from "../@types/forgot-password";
import bcrypt from "bcrypt";

// Classe responsável por interagir com o banco de dados para operações relacionadas à recuperação de senha
export class ForgotPasswordRepository {
    // Verifica se o e-mail existe na base de dados
    async checkEmailExists(email: string): Promise<{ exists: boolean; token?: string }> {
        const user = await prismaClient.users.findUnique({
            where: { email },
        });

        // Se o usuário não existe, retorna que o e-mail não existe
        if (!user) {
            return { exists: false };
        }

        // Gera um token aleatório em formato de string de 8 dígitos
        const token = Math.floor(10000000 + Math.random() * 90000000).toString();
        return { exists: true, token };
    }


    // verifica o nome do usuario na tabela através do email
    async getUserIDByEmail(email: string): Promise<string | null> {
        const user = await prismaClient.users.findUnique({
            where: { email },
            select: { id: true },
        });

        return user?.id || null;
    }
    

    // Obtém o último registro de token de recuperação de senha para um determinado e-mail
    async getLastTokenRecord(email: string): Promise<ForgotPassword | null> {
        const lastRecord = await prismaClient.forgot_password.findFirst({
            where: { email },
            orderBy: { created_at: "desc" },
        });

        return lastRecord || null;
    }

    // Cria um novo registro para a solicitação de recuperação de senha
    async createForgotPasswordRecord(email: string, token: string, user_id: string): Promise<ForgotPassword> {
        // Lança um erro se o token não for fornecido
        if (!token) {
            throw new Error("Token must be provided");
        }

        // Cria o registro no banco de dados com o e-mail, token e data de expiração
        return prismaClient.forgot_password.create({
            data: {
                email,
                token,
                expires_at: new Date(Date.now() + 20 * 60 * 1000), // 20 minutos
                user_id,
            },
        });
    }

    // Atualiza a senha do usuário no banco de dados
    async updatePassword(email: string, newPassword: string): Promise<void> {
        // Gera um salt e hash para a nova senha usando bcrypt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Atualiza a senha do usuário no banco de dados
        await prismaClient.users.update({
            where: { email },
            data: { password: hashedPassword },
        });
    }

    // Procura por um registro específico de token de recuperação de senha pelo e-mail e token
    async findRecordByEmailAndToken(email: string, token: string): Promise<ForgotPassword | null> {
        const record = await prismaClient.forgot_password.findFirst({
            where: { email, token },
            select: { id: true, email: true, token: true, expires_at: true, created_at: true, used: true },
        });

        return record || null;
    }

    // Marca um token de recuperação de senha como utilizado no banco de dados
    async markTokenAsUsed(id: string): Promise<void> {
        // Verifica se o registro existe antes de tentar atualizá-lo
        const existingRecord = await prismaClient.forgot_password.findUnique({
            where: { id },
        });

        // Lança um erro se o registro a ser atualizado não for encontrado
        if (!existingRecord) {
            console.error("Record to update not found.");
            throw new Error("Record to update not found.");
        }

        // Atualiza o registro marcando o token como utilizado
        await prismaClient.forgot_password.update({
            where: { id },
            data: { used: true },
        });
    }
}
