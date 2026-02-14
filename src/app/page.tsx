'use client';

import { useEffect, useState } from 'react';
import ServerCard from '@/components/ServerCard';

interface Server {
  object: string;
  attributes: {
    id: number;
    uuid: string;
    identifier: string;
    name: string;
    description: string;
    status: string | null;
    suspended: boolean;
  };
}

export default function Home() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchServers() {
      try {
        const res = await fetch('/api/servers');
        if (!res.ok) {
          throw new Error(`Failed to fetch servers: ${res.statusText}`);
        }
        const data = await res.json();
        if (data.data) {
          setServers(data.data);
        } else {
          console.error('Unexpected API response format:', data);
          setError('Formato de respuesta API inesperado');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchServers();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-0.05em',
            background: 'linear-gradient(to right, #fff, #666)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Gestiona tus servidores Pyrodactyl</p>
        </div>
      </header>

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Cargando servidores...
        </div>
      )}

      {error && (
        <div style={{
          padding: '1rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--danger-color)',
          borderRadius: '8px',
          color: 'var(--danger-color)'
        }}>
          Error: {error}
        </div>
      )}

      {!loading && !error && servers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          No se encontraron servidores.
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {servers.map((server) => (
          <ServerCard key={server.attributes.id} server={server.attributes} />
        ))}
      </div>
    </div>
  );
}
