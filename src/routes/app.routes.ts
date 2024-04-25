import { Router } from "express";
import { AuthUserController } from "../controllers/auth-user.controller";
import { ProjectsController } from "../controllers/projects.controller";
import { UserController } from "../controllers/user.controller";
import { ProfileController } from "../controllers/profile-user.controller";
import { ForgotPasswordController } from "../controllers/forgot-password.controller";
import { upload } from "../multer/config";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AppRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Middleware de autenticação
        const authMiddleware = new AuthMiddleware();

        // Rotas de usuário
        const userController = new UserController();

        this.router.post(
            "/users/register",
            userController.createUser.bind(userController)
        );

        // Login
        this.router.post("/users/auth", new AuthUserController().handler);

        this.router.get(
            "/users",
            authMiddleware.handler,
            userController.getAllUsers.bind(userController)
        );
        this.router.get(
            "/users/:id",
            authMiddleware.handler,
            userController.getUserById.bind(userController)
        );
        this.router.put(
            "/users/update/:id",
            authMiddleware.handler,
            userController.updateUser.bind(userController)
        );
        this.router.delete(
            "/users/delete/:id",
            authMiddleware.handler,
            userController.deleteUser.bind(userController)
        );

        // Rotas de perfil associadas a um usuário específico
        const profileController = new ProfileController();
        this.router.post(
            "/profiles/create",
            authMiddleware.handler,
            profileController.createProfile.bind(profileController)
        );
        this.router.get(
            "/profiles",
            authMiddleware.handler,
            profileController.getAllProfiles.bind(profileController)
        );
        this.router.put(
            "/profiles/update/:id",
            authMiddleware.handler,
            profileController.updateProfile.bind(profileController)
        );
        this.router.delete(
            "/profiles/delete/:id",
            authMiddleware.handler,
            profileController.deleteProfile.bind(profileController)
        );

        // Rota para criação de projeto e upload do arquivo
        this.router.post(
            "/projects/register",
            authMiddleware.handler,
            upload.single("file"),
            new ProjectsController().handler
        );

        // Rota para redefinição de senha
        this.router.post(
            "/forgot-password",
            new ForgotPasswordController().checkEmailExists
        );

        // Rota para redefinição de senha
        this.router.put(
            "/update-password",
            new ForgotPasswordController().updatePassword
        );
    }
}
