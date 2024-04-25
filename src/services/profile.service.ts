// Importando o repositório de perfil e o tipo ProfileUser
import { ProfileRepository } from "../repositories/profile-user.repository";
import { ProfileUser } from "../@types/profile-user";

// Instanciando o repositório de perfil
const profileRepository = new ProfileRepository();

// Exportando a classe de serviço de perfil
export class ProfileService {
    // Método assíncrono para obter todos os perfis
    async getAllProfiles(): Promise<ProfileUser[]> {
        // Chamando o método correspondente no repositório de perfil
        return await profileRepository.findAll();
    }

    // Método assíncrono para obter um perfil pelo ID
    async getProfileById(id: string): Promise<ProfileUser | null> {
        // Chamando o método correspondente no repositório de perfil
        return profileRepository.findById(id);
    }

    // Método assíncrono para criar um novo perfil
    async createProfile({
        cau,
        phone,
        dateOfBirth,
        city,
        state,
        user_id,
    }: ProfileUser) {
        await profileRepository.create({
            cau,
            phone,
            dateOfBirth,
            city,
            state,
            user_id,
        });
        return {
            message: "Profile Created Successfully",
        };
    }

    // Método assíncrono para atualizar um perfil
    async updateProfile(id: string, profileData: Partial<ProfileUser>) {
        // Chamando o método correspondente no repositório de perfil
        await profileRepository.updateProfile(id, profileData);

        return {
            message: "Profile Updated successfully",
        };
    }

    // Método assíncrono para excluir um perfil pelo ID
    async deleteProfile(id: string) {
        // Chamando o método correspondente no repositório de perfil
        await profileRepository.delete(id);

        return {
            message: "Profile Deleted successfully",
        };
    }
}
