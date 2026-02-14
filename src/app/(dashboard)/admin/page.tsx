import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { updateUserRole, assignServer, removeServerAssignment } from "@/lib/admin-actions";

export default async function AdminPage() {
    const users = await prisma.user.findMany({
        include: { serverAssignments: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
            {users.map((user: any) => (
                <div key={user.id} className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{user.name}</h3>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>{user.email}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <form action={async (formData) => {
                                'use server'
                                await updateUserRole(user.id, formData.get('role') as Role);
                            }}>
                                <select
                                    name="role"
                                    defaultValue={user.role}
                                    style={{
                                        padding: '0.5rem',
                                        background: 'rgba(0,0,0,0.5)',
                                        color: '#fff',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '6px'
                                    }}
                                    onChange={(e) => e.target.form?.requestSubmit()}
                                >
                                    {Object.values(Role).map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </form>
                        </div>
                    </div>

                    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
                        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>Servidores Asignados</h4>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                            {user.serverAssignments.length === 0 && <span style={{ color: '#666', fontSize: '0.8rem' }}>Ninguno</span>}
                            {user.serverAssignments.map((assignment: any) => (
                                <form key={assignment.id} action={async () => {
                                    'use server'
                                    await removeServerAssignment(assignment.id);
                                }}>
                                    <button style={{
                                        padding: '0.2rem 0.6rem',
                                        background: 'rgba(34, 197, 94, 0.1)',
                                        border: '1px solid rgba(34, 197, 94, 0.2)',
                                        color: '#fff',
                                        borderRadius: '99px',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        {assignment.serverName || assignment.serverId}
                                        <span style={{ color: '#ef4444' }}>×</span>
                                    </button>
                                </form>
                            ))}
                        </div>

                        <form action={async (formData) => {
                            'use server'
                            const serverId = formData.get('serverId') as string;
                            if (!serverId) return;
                            await assignServer(user.id, serverId, `Server ${serverId}`);
                        }} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                name="serverId"
                                placeholder="ID del Servidor (ej. 136)"
                                style={{
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid var(--card-border)',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    fontSize: '0.875rem'
                                }}
                            />
                            <button type="submit" style={{
                                padding: '0.5rem 1rem',
                                background: '#fff',
                                color: '#000',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: 600
                            }}>+</button>
                        </form>
                    </div>
                </div>
            ))}
        </div>
    );
}
