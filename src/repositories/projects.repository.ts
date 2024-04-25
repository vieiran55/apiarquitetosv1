import { RegisterProject } from "../@types/register-project";
import { prismaClient } from "../database/prisma.service";
import { randomUUID } from "node:crypto";

export class ProjectsRepository {
    public async register({
        user_id,
        name,
        description,
        file,
    }: RegisterProject) {
        const project = await prismaClient.projects.create({
            data: {
                id: randomUUID(),
                user_id,
                name,
                description,
                file,
                updated_at: new Date().toISOString(),
            },
        });

        return project;
    }
}
