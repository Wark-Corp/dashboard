'use client';

import { useState, useTransition, useEffect } from "react";
import { saveUserAdminChanges } from "@/lib/admin-actions";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";

interface UserAdminCardProps {
    user: {
        id: string;
        name: string | null;
        email: string | null;
        role: Role;
        serverAssignments: { serverId: string; serverName: string | null }[];
    };
    availableRoles: string[];
}

export default function UserAdminCard({ user, availableRoles }: UserAdminCardProps) {
    const router = useRouter();
    const [role, setRole] = useState<Role>(user.role);
    const [serverIds, setServerIds] = useState<string[]>(
        user.serverAssignments.map(a => a.serverId)
    );
    const [newServerId, setNewServerId] = useState("");
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Reset local state when props change (after revalidation/refresh)
    useEffect(() => {
        setRole(user.role);
        setServerIds(user.serverAssignments.map(a => a.serverId));
    }, [user.role, user.serverAssignments]);

    const hasChanges =
        role !== user.role ||
        JSON.stringify([...serverIds].sort()) !== JSON.stringify(user.serverAssignments.map(a => a.serverId).sort());

    const handleSave = () => {
        setMessage(null);
        startTransition(async () => {
            const result = await saveUserAdminChanges(user.id, role, serverIds);
            if (result.success) {
                setMessage({ type: 'success', text: 'Cambios guardados correctamente' });
                router.refresh(); // Force refresh to sync Server Components
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: 'Error al guardar cambios' });
            }
        });
    };

    const addServer = (e: React.FormEvent) => {
        e.preventDefault();
        if (newServerId && !serverIds.includes(newServerId)) {
            setServerIds([...serverIds, newServerId]);
            setNewServerId("");
        }
    };

    const removeServer = (id: string) => {
        setServerIds(serverIds.filter(s => s !== id));
    };

    return (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px', border: hasChanges ? '1px solid rgba(255,255,255,0.3)' : '1px solid var(--card-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{user.name || 'Sin nombre'}</h3>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>{user.email}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                        disabled={isPending}
                        style={{
                            padding: '0.4rem 0.8rem',
                            background: 'rgba(0,0,0,0.5)',
                            color: '#fff',
                            border: '1px solid var(--card-border)',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        {availableRoles.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleSave}
                        disabled={isPending || !hasChanges}
                        style={{
                            padding: '0.5rem 1.25rem',
                            background: hasChanges ? '#fff' : 'rgba(255,255,255,0.1)',
                            color: hasChanges ? '#000' : '#666',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: (isPending || !hasChanges) ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}
                    >
                        {isPending ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    {message && (
                        <p style={{
                            fontSize: '0.75rem',
                            color: message.type === 'success' ? '#22c55e' : '#ef4444',
                            marginTop: '0.25rem'
                        }}>
                            {message.text}
                        </p>
                    )}
                </div>
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: '#aaa', fontWeight: 500 }}>
                    Servidores Asignados
                </h4>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    {serverIds.length === 0 && (
                        <span style={{ color: '#666', fontSize: '0.8rem', fontStyle: 'italic' }}>Ninguno</span>
                    )}
                    {serverIds.map(serverId => (
                        <div key={serverId} style={{
                            padding: '0.25rem 0.75rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#fff',
                            borderRadius: '99px',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            ID: {serverId}
                            <button
                                onClick={() => removeServer(serverId)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    padding: '0 0.25rem',
                                    lineHeight: 1
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <form onSubmit={addServer} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={newServerId}
                        onChange={(e) => setNewServerId(e.target.value)}
                        placeholder="ID del Servidor (ej. 136)"
                        style={{
                            flex: 1,
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid var(--card-border)',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.875rem'
                        }}
                    />
                    <button type="submit" style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        border: '1px solid var(--card-border)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }}>+</button>
                </form>
            </div>
        </div>
    );
}
