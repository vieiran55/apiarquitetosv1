import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { User } from "../@types/user";

// Instanciando o serviço de usuário
const userService = new UserService();

// Exportando a classe do controlador de usuário
export class UserController {
    // Método assíncrono para lidar com requisições HTTP GET para obter todos os usuários
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            // Chamando o serviço para obter todos os usuários
            const users = await userService.getAllUsers();
            // Respondendo com status 200 e os usuários em formato JSON
            res.status(200).json(users);
        } catch (error) {
            // Se ocorrer um erro, registrando-o no console e respondendo com status 500 e uma mensagem de erro JSON
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Método assíncrono para lidar com requisições HTTP GET por ID para obter um usuário específico
    async getUserById(req: Request, res: Response): Promise<void> {
        // Obtendo o ID do usuário a partir dos parâmetros da requisição
        const userId = req.params.id;
        try {
            // Chamando o serviço para obter o usuário pelo ID
            const user = await userService.getUserById(userId);
            // Verificando se o usuário foi encontrado e respondendo adequadamente
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            // Se ocorrer um erro, registrando-o no console e respondendo com status 500 e uma mensagem de erro JSON
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Método assíncrono para lidar com requisições HTTP POST para criar um novo usuário
    async createUser(req: Request, res: Response): Promise<void> {
        // Obtendo os dados do usuário do corpo da requisição
        const userData: User = req.body;
        try {
            // Chamando o serviço para criar o usuário
            await userService.createUser(userData);
            // Respondendo com status 201 e uma mensagem de sucesso JSON
            res.status(201).json({ message: "User Created successfully" });
        } catch (error) {
            // Se ocorrer um erro, registrando-o no console e tratando erros específicos de duplicidade
            console.error(error);
            if (
                error.code === "P2002" &&
                error.meta.target.includes("username")
            ) {
                res.status(400).json({ error: "Username already exists" });
            } else if (
                error.code === "P2002" &&
                error.meta.target.includes("email")
            ) {
                res.status(400).json({ error: "Email already exists" });
            } else if (
                error.code === "P2002" &&
                error.meta.target.includes("name")
            ) {
                res.status(400).json({ error: "Name already exists" });
            } else {
                // Respondendo com status 500 e uma mensagem de erro JSON para outros erros
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }

    // Método assíncrono para lidar com requisições HTTP PUT para atualizar um usuário existente
    async updateUser(req: Request, res: Response): Promise<void> {
        // Obtendo o ID do usuário a ser atualizado dos parâmetros da requisição
        const userId = req.params.id;
        // Obtendo os dados do usuário a serem atualizados do corpo da requisição
        const userData: Partial<User> = req.body;
        try {
            // Chamando o serviço para atualizar o usuário
            const updatedUser = await userService.updateUser(userId, userData);
            // Verificando se o usuário foi atualizado com sucesso e respondendo adequadamente
            if (updatedUser) {
                res.status(200).json({ message: "User updated successfully" });
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            // Se ocorrer um erro, registrando-o no console e tratando erros específicos de duplicidade
            console.error(error);
            if (error.code === "P2002" && error.meta?.target) {
                const target = error.meta.target[0];
                let errorMessage = `The ${target} is already taken.`;
                if (target === "username") {
                    errorMessage = "The username is already taken.";
                }
                res.status(400).json({ error: errorMessage });
            } else {
                // Respondendo com status 500 e uma mensagem de erro JSON para outros erros
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }

    // Método assíncrono para lidar com requisições HTTP DELETE para excluir um usuário existente
    async deleteUser(req: Request, res: Response): Promise<void> {
        // Obtendo o ID do usuário a ser excluído dos parâmetros da requisição
        const userId = req.params.id;
        try {
            // Chamando o serviço para excluir o usuário
            const deletedUser = await userService.deleteUser(userId);
            // Verificando se o usuário foi excluído com sucesso e respondendo adequadamente
            if (deletedUser) {
                res.status(200).json({ message: "User deleted successfully" });
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            // Se ocorrer um erro, registrando-o no console e respondendo com status 500 e uma mensagem de erro JSON
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
