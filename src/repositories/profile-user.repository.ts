import { prismaClient } from "../database/prisma.service";
import { ProfileUser } from "../@types/profile-user";

// Exportando a classe do repositório de perfil
export class ProfileRepository {
    // Método assíncrono para encontrar todos os perfis no banco de dados
    async findAll(): Promise<ProfileUser[]> {
        // Utilizando o Prisma para encontrar todos os perfis e incluir informações sobre o usuário associado
        return await prismaClient.profiles.findMany({
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        email: true,
                        type: true,
                    },
                },
            },
        });
    }

    // Método assíncrono para encontrar um perfil pelo ID no banco de dados
    async findById(id: string): Promise<ProfileUser | null> {
        // Utilizando o Prisma para encontrar um perfil único pelo ID e incluir informações sobre o usuário associado
        return prismaClient.profiles.findUnique({
            where: { id },
            include: { users: true },
        });
    }

    // Método assíncrono para criar um novo perfil no banco de dados
    async create({
        cau,
        phone,
        dateOfBirth,
        city,
        state,
        user_id,
    }: ProfileUser) {
        const profileExists = await prismaClient.profiles.findUnique({
            where: {
                cau,
            },
        });

        if (profileExists) {
            throw new Error("CAU already exists");
        }

        const profile = await prismaClient.profiles.create({
            data: {
                user_id,
                cau,
                phone,
                dateOfBirth: new Date(dateOfBirth).toISOString(),
                city,
                state,
            },
        });

        return profile;
    }

    // Método assíncrono para atualizar um perfil no banco de dados
    async updateProfile(id: string, updatedProfileData: Partial<ProfileUser>) {
        const profileExists = await prismaClient.profiles.findMany({
            where: {
                id,
            },
        });

        if (!profileExists) {
            throw new Error("Profile does not exists");
        }

        const updatedProfile = await prismaClient.profiles.update({
            where: {
                id,
            },
            data: {
                cau: updatedProfileData.cau,
                phone: updatedProfileData.phone,
                dateOfBirth: updatedProfileData.dateOfBirth,
                city: updatedProfileData.city,
                state: updatedProfileData.state,
            },
        });

        return updatedProfile;
    }

    // Método assíncrono para excluir um perfil pelo ID no banco de dados
    async delete(id: string) {
        return await prismaClient.profiles.delete({
            where: { id },
        });
    }
}
