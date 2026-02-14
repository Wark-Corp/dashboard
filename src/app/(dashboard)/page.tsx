import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ServerCard from "@/components/ServerCard";

import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// ... existing imports

async function getServers(user: any) {
  // 1. Fetch all servers from API (Executive needs all, others need to filter)
  const apiKey = process.env.PYRO_API_KEY;
  const panelUrl = process.env.PYRO_PANEL_URL;

  if (!apiKey || !panelUrl) return [];

  let allServers = [];
  try {
    const response = await fetch(`${panelUrl}/api/application/servers`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      next: { revalidate: 30 }
    });
    const data = await response.json();
    allServers = data.data || [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }

  console.log(`[getServers] Processing role: ${user.role} for user: ${user.email}`);

  // 2. Filter based on Role
  if (user.role === 'EXECUTIVE') {
    return allServers;
  }

  if (user.role === 'END_USER') {
    return [];
  }

  // 3. For SysAdmin/Support, get assignments from DB
  const assignments = await prisma.serverAssignment.findMany({
    where: { userId: user.id },
    select: { serverId: true }
  });

  const assignedIds = assignments.map(a => a.serverId);
  console.log(`[getServers] Found ${assignedIds.length} assignments in DB:`, assignedIds);

  // Filter API results
  const filtered = allServers.filter((server: any) => {
    const apiId = server.attributes.id.toString();
    const apiUuid = server.attributes.identifier;
    const isMatched = assignedIds.includes(apiId) || assignedIds.includes(apiUuid);

    // Log matches only in dev or if needed, but for now let's see why it fails
    if (isMatched) console.log(`[getServers] Matched server: ${server.attributes.name} (${apiId}/${apiUuid})`);
    return isMatched;
  });

  console.log(`[getServers] Returning ${filtered.length} servers after filtering.`);
  return filtered;
}

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/login");

  try {
    const servers = await getServers(session.user);

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
              <ServerCard key={server.attributes.id} server={server.attributes} role={session.user.role as string} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error: any) {
    console.error("Dashboard Server Error:", error);
    return (
      <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>
        <h1>Error Loading Dashboard Data</h1>
        <p>Hubo un problema cargando los servidores. Por favor, intenta de nuevo más tarde.</p>
        {process.env.NODE_ENV === 'development' && <pre>{error.message}</pre>}
      </div>
    );
  }
}
