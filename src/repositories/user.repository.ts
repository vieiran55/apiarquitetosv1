import { prismaClient } from "../database/prisma.service";
import { User } from "../@types/user";
import bcrypt from "bcrypt";

// Exportando a classe do repositório de usuário
export class UserRepository {
    // Método assíncrono para encontrar todos os usuários no banco de dados
    async findAll(): Promise<User[]> {
        // Utilizando o Prisma para encontrar todos os usuários
        return prismaClient.users.findMany();
    }

    // Método assíncrono para encontrar um usuário pelo ID no banco de dados
    async findById(id: string): Promise<User | null> {
        // Utilizando o Prisma para encontrar um usuário único pelo ID
        return prismaClient.users.findUnique({
            where: { id },
        });
    }

    // Método assíncrono para criar um novo usuário no banco de dados
    async create(user: User): Promise<User> {
        // Gerando um salt para o bcrypt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Verificando se a senha do usuário está presente
        if (!user.password) {
            throw new Error("User password is missing.");
        }

        // Hashing da senha usando bcrypt
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // Criando um novo usuário no banco de dados, incluindo a senha hashada e o perfil se fornecido
        const newUser = await prismaClient.users.create({
            data: {
                ...user,
                password: hashedPassword,
                profiles: user.profiles ? { create: user.profiles } : undefined,
            },
        });

        return newUser;
    }

    // Método assíncrono para atualizar um usuário no banco de dados
    async update(id: string, userData: Partial<User>): Promise<User | null> {
        // Verificando se a senha está presente nos dados a serem atualizados
        if (userData.password) {
            // Gerando um salt e hash para a nova senha usando bcrypt
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            userData.password = hashedPassword;
        }

        // Atualizando o usuário no banco de dados, incluindo o profile se fornecido
        const updatedUser = await prismaClient.users.update({
            where: { id },
            data: {
                ...userData,
                profiles: userData.profiles
                    ? {
                          upsert: {
                              update: userData.profiles,
                              create: userData.profiles,
                          },
                      }
                    : undefined,
            },
        });

        return updatedUser;
    }

    // Método assíncrono para excluir um usuário pelo ID no banco de dados
    async delete(id: string): Promise<User | null> {
        // Utilizando o Prisma para excluir um usuário pelo ID
        return prismaClient.users.delete({
            where: { id },
        });
    }
}
