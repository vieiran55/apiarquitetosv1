// @types/profile-user.ts

import { States } from "@prisma/client";

export interface ProfileUser {
    user_id: string;
    cau: string;
    phone: string;
    dateOfBirth: Date;
    city: string;
    state: States;
}
