import { RegisterProject } from "../@types/register-project";
import { ProjectsRepository } from "../repositories/projects.repository";

export class ProjectsService {
    public async execute({
        user_id,
        name,
        description,
        file,
    }: RegisterProject) {
        const projectsRepository = new ProjectsRepository();

        const project = await projectsRepository.register({
            user_id,
            name,
            description,
            file,
        });
        return {
            message: "Project registered successfully",
            project,
        };
    }
}
