// Importando o repositório de usuário e o tipo User
import { UserRepository } from "../repositories/user.repository";
import { User } from "../@types/user";

// Instanciando o repositório de usuário
const userRepository = new UserRepository();

// Exportando a classe de serviço de usuário
export class UserService {
    // Método assíncrono para obter todos os usuários
    async getAllUsers(): Promise<User[]> {
        // Chamando o método correspondente no repositório de usuário
        return userRepository.findAll();
    }

    // Método assíncrono para obter um usuário pelo ID
    async getUserById(id: string): Promise<User | null> {
        // Chamando o método correspondente no repositório de usuário
        return userRepository.findById(id);
    }

    // Método assíncrono para criar um novo usuário
    async createUser(user: User): Promise<User> {
        // Chamando o método correspondente no repositório de usuário
        return userRepository.create(user);
    }

    // Método assíncrono para atualizar um usuário
    async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
        // Chamando o método correspondente no repositório de usuário
        return userRepository.update(id, userData);
    }

    // Método assíncrono para excluir um usuário pelo ID
    async deleteUser(id: string): Promise<User | null> {
        // Chamando o método correspondente no repositório de usuário
        return userRepository.delete(id);
    }
}
