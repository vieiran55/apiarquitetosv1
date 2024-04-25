import { profiles, TypeUser } from "@prisma/client";

export interface User {
    id: string;
    name: string;
    email: string;
    username: string; 
    password: string;
    type?: TypeUser | null;
    updated_at: Date;
    created_at: Date;

    profiles?: profiles;
}