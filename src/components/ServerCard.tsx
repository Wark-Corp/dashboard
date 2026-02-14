'use client';

import { useState, useEffect } from 'react';

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
    role?: string;
}

export default function ServerCard({ server, role }: ServerCardProps) {
    const [loading, setLoading] = useState(false);
    const [realStatus, setRealStatus] = useState<string>('checking');
    const [message, setMessage] = useState('');

    const canControl = role === 'EXECUTIVE' || role === 'SYSADMIN';

    // Poll for status
    useEffect(() => {
        let interval: NodeJS.Timeout;

        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/server/${server.identifier}/resources`);
                if (res.ok) {
                    const data = await res.json();
                    setRealStatus(data.current_state || 'offline');
                }
            } catch (e) {
                console.error(e);
            }
        };

        checkStatus(); // Initial check
        interval = setInterval(checkStatus, 5000); // Poll every 5s

        return () => clearInterval(interval);
    }, [server.identifier]);

    const handlePower = async (signal: 'start' | 'restart' | 'stop' | 'kill') => {
        if (!canControl) return;
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
                throw new Error('Action failed');
            }

            setMessage(`Signal sent: ${signal}`);
            // Optimistic update (guess the next state)
            if (signal === 'start') setRealStatus('starting');
            if (signal === 'stop' || signal === 'kill') setRealStatus('stopping');

        } catch (err: any) {
            setMessage(`Error: action failed`);
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'running': return 'var(--status-running)';
            case 'offline': return 'var(--status-offline)';
            case 'starting': return 'var(--status-starting)';
            case 'stopping': return 'var(--status-starting)';
            default: return '#666';
        }
    };

    return (
        <div className="glass" style={{
            borderRadius: '16px',
            padding: '1.5rem',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--card-hover-border)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--card-border)';
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>{server.name}</h3>
                    <p style={{ color: '#666', fontSize: '0.8rem', fontFamily: 'monospace' }}>{server.identifier}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getStatusColor(realStatus),
                        boxShadow: `0 0 10px ${getStatusColor(realStatus)}`
                    }} className={realStatus === 'starting' || realStatus === 'shopping' ? 'animate-pulse' : ''} />
                    <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {server.suspended ? 'SUSPENDED' : realStatus}
                    </span>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '0.75rem',
                opacity: server.suspended || !canControl ? 0.5 : 1,
                pointerEvents: server.suspended || !canControl ? 'none' : 'auto'
            }}>
                <button
                    onClick={() => handlePower('start')}
                    disabled={loading || realStatus === 'running' || !canControl}
                    style={{
                        padding: '0.6rem',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        borderRadius: '8px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        color: '#22c55e',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)'}
                >
                    Start
                </button>
                <button
                    onClick={() => handlePower('restart')}
                    disabled={loading}
                    style={{
                        padding: '0.6rem',
                        border: '1px solid rgba(234, 179, 8, 0.2)',
                        borderRadius: '8px',
                        background: 'rgba(234, 179, 8, 0.1)',
                        color: '#eab308',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(234, 179, 8, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(234, 179, 8, 0.1)'}
                >
                    Reboot
                </button>
                <button
                    onClick={() => handlePower('kill')}
                    disabled={loading || realStatus === 'offline'}
                    style={{
                        padding: '0.6rem',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                >
                    Stop
                </button>
            </div>

            {message && (
                <div style={{
                    marginTop: '1rem',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    color: message.startsWith('Error') ? '#ef4444' : '#22c55e'
                }}>
                    {message}
                </div>
            )}
        </div>
    );
}
