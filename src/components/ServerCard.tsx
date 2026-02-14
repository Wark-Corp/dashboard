'use client';

import { useState } from 'react';

interface ServerAttributes {
    id: number;
    uuid: string;
    identifier: string;
    name: string;
    description: string;
    status: string | null;
    suspended: boolean;
}

interface ServerCardProps {
    server: ServerAttributes;
}

export default function ServerCard({ server }: ServerCardProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePower = async (signal: 'start' | 'restart' | 'stop' | 'kill') => {
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch(`/api/server/${server.identifier}/power`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ signal }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error executing action');
            }

            setMessage(`Action ${signal} sent successfully`);
        } catch (err: any) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '12px',
            padding: '1.5rem',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            position: 'relative',
            overflow: 'hidden'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--accent-color)' }}>{server.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>ID: {server.identifier}</p>
                <div style={{
                    display: 'inline-block',
                    marginTop: '0.5rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    background: server.suspended ? 'var(--danger-color)' : 'var(--success-color)',
                    color: 'black',
                    fontWeight: 600
                }}>
                    {server.suspended ? 'Suspended' : (server.status || 'Active')}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                <button
                    onClick={() => handlePower('start')}
                    disabled={loading}
                    style={{
                        padding: '0.5rem',
                        border: 'none',
                        borderRadius: '6px',
                        background: 'var(--success-color)',
                        color: 'black',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    Start
                </button>
                <button
                    onClick={() => handlePower('restart')}
                    disabled={loading}
                    style={{
                        padding: '0.5rem',
                        border: 'none',
                        borderRadius: '6px',
                        background: 'var(--warning-color)',
                        color: 'black',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    Restart
                </button>
                <button
                    onClick={() => handlePower('kill')}
                    disabled={loading}
                    style={{
                        padding: '0.5rem',
                        border: 'none',
                        borderRadius: '6px',
                        background: 'var(--danger-color)',
                        color: 'black',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    Stop
                </button>
            </div>

            {message && (
                <div style={{
                    marginTop: '1rem',
                    fontSize: '0.875rem',
                    color: message.startsWith('Error') ? 'var(--danger-color)' : 'var(--success-color)'
                }}>
                    {message}
                </div>
            )}
        </div>
    );
}
