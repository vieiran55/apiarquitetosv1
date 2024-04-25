import { prismaClient } from "../database/prisma.service";

export class AuthUserRepository {
    public async auth(email: string) {
        const userExists = await prismaClient.users.findUnique({
            where: {
                email,
            },
        });

        return userExists;
    }
}
