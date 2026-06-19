import { prisma } from "@/shared/lib/prisma";
import { UserRole } from "@prisma/client";
import { compare } from "bcryptjs";

export async function authenticate(email: string, password: string) {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { email: trimmedEmail },
    });

    if (!user?.passwordHash || user.role !== UserRole.admin) {
        return null;
    }

    const valid = await compare(password, user.passwordHash);
    
    if (!valid) {
        return null;
    }

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    };
}