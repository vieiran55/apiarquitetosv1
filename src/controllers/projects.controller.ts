import { Request, Response, NextFunction } from "express";
import { ProjectsService } from "../services/projects.service";

export class ProjectsController {
    public async handler(req: Request, res: Response, next: NextFunction) {
        try {
            const { id: user_id } = req.user;
            const { name, description } = req.body;
            const { path } = req.file as Express.Multer.File;

            const projectsService = new ProjectsService();

            const response = await projectsService.execute({
                user_id,
                name,
                description,
                file: path,
            });
            return res.status(201).json(response);
        } catch (err) {
            next(err);
        }
    }
}
