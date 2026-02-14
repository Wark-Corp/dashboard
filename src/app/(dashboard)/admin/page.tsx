import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import UserAdminCard from "@/components/admin/UserAdminCard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const session = await auth();
    if (session?.user?.role !== 'EXECUTIVE') {
        redirect("/");
    }

    const users = await prisma.user.findMany({
        include: { serverAssignments: true },
        orderBy: { createdAt: 'desc' }
    });

    const roles = Object.values(Role);

    return (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Administración de Usuarios</h2>
                <p style={{ color: '#888' }}>Gestiona los roles y servidores asignados a cada miembro.</p>
            </div>

            {users.map((user: any) => (
                <UserAdminCard
                    key={user.id}
                    user={user}
                    availableRoles={roles}
                />
            ))}
        </div>
    );
}
