'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: Role) {
    const session = await auth();
    if (session?.user.role !== 'EXECUTIVE') {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole }
        });
        revalidatePath('/', 'layout');
    } catch (error) {
        console.error("Error updating user role:", error);
        throw error;
    }
}

export async function assignServer(userId: string, serverId: string, serverName: string) {
    const session = await auth();
    if (session?.user.role !== 'EXECUTIVE') {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.serverAssignment.create({
            data: {
                userId,
                serverId,
                serverName
            }
        });
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (e) {
        console.error("Error assigning server:", e);
        return { success: false, error: 'Server already assigned or invalid' };
    }
}

export async function removeServerAssignment(assignmentId: string) {
    const session = await auth();
    if (session?.user.role !== 'EXECUTIVE') {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.serverAssignment.delete({
            where: { id: assignmentId }
        });
        revalidatePath('/', 'layout');
    } catch (error) {
        console.error("Error removing server assignment:", error);
        throw error;
    }
}
