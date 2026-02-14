import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ServerCard from "@/components/ServerCard";

async function getServers() {
  const apiKey = process.env.PYRO_API_KEY;
  const panelUrl = process.env.PYRO_PANEL_URL;

  if (!apiKey || !panelUrl) return [];

  try {
    const response = await fetch(`${panelUrl}/api/application/servers`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      next: { revalidate: 30 } // Cache for 30 seconds
    });

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/login");

  const servers = await getServers();

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{
        marginBottom: '3rem',
        paddingBottom: '2rem',
        borderBottom: '1px solid var(--card-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'end'
      }}>
        <div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(to right, #fff, #888)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            Dashboard
          </h2>
          <p style={{ color: '#888' }}>
            Bienvenido, <span style={{ color: '#fff' }}>{session.user?.name || 'Administrador'}</span>.
          </p>
        </div>
        <div style={{
          padding: '0.5rem 1rem',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '99px',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.875rem',
          color: '#aaa'
        }}>
          {servers.length} Servidores Activos
        </div>
      </div>

      {servers.length === 0 ? (
        <div style={{
          padding: '4rem',
          textAlign: 'center',
          border: '1px dashed var(--card-border)',
          borderRadius: '16px',
          color: '#666'
        }}>
          No se encontraron servidores o hubo un error de conexión.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {servers.map((server: any) => (
            <ServerCard key={server.attributes.id} server={server.attributes} />
          ))}
        </div>
      )}
    </div>
  );
}
