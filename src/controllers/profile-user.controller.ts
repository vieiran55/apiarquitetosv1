import { NextFunction, Request, Response } from "express";
import { ProfileService } from "../services/profile.service";
import { ProfileUser } from "../@types/profile-user";

// Instanciando o serviço de perfil
const profileService = new ProfileService();

// Exportando a classe do controlador de perfil
export class ProfileController {
    // Método assíncrono para lidar com requisições HTTP GET para obter todos os perfis
    async getAllProfiles(req: Request, res: Response): Promise<void> {
        try {
            // Chamando o serviço para obter todos os perfis
            const profiles = await profileService.getAllProfiles();
            // Respondendo com status 200 e os perfis em formato JSON
            res.status(200).json(profiles);
        } catch (error) {
            // Se ocorrer um erro, registrando-o no console e respondendo com status 500 e uma mensagem de erro JSON
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Método assíncrono para lidar com requisições HTTP GET por ID para obter um perfil específico
    async getProfileById(req: Request, res: Response): Promise<void> {
        // Obtendo o ID do perfil a partir dos parâmetros da requisição
        const profileId = req.params.id;
        try {
            // Chamando o serviço para obter o perfil pelo ID
            const profile = await profileService.getProfileById(profileId);
            // Verificando se o perfil foi encontrado e respondendo adequadamente
            if (profile) {
                res.status(200).json(profile);
            } else {
                res.status(404).json({ error: "Profile not found" });
            }
        } catch (error) {
            // Se ocorrer um erro, registrando-o no console e respondendo com status 500 e uma mensagem de erro JSON
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Método assíncrono para lidar com requisições HTTP POST para criar um novo perfil
    async createProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { cau, phone, dateOfBirth, city, state } = req.body;
            const { id } = req.user;

            const response = await profileService.createProfile({
                cau,
                phone,
                dateOfBirth,
                city,
                state,
                user_id: id,
            });

            return res.status(201).json(response);
        } catch (err) {
            next(err);
        }
    }

    // Método assíncrono para lidar com requisições HTTP PUT para atualizar um perfil existente no controlador
    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const profileData: Partial<ProfileUser> = req.body;

            const response = await profileService.updateProfile(
                id,
                profileData
            );

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }

    // Método assíncrono para lidar com requisições HTTP DELETE para excluir um perfil existente
    async deleteProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const response = await profileService.deleteProfile(id);

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}
