import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || session.user.role !== 'EXECUTIVE') {
        redirect("/");
    }

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ padding: '2rem 0', borderBottom: '1px solid var(--card-border)', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Panel de Administración</h1>
                <p style={{ color: '#888' }}>Gestión de Usuarios y Roles</p>
            </div>
            {children}
        </div>
    );
}
