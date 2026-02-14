import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function PublicDebug() {
    let dbStatus = "Checking...";
    let dbError = null;
    let usersCount = 0;

    try {
        usersCount = await prisma.user.count();
        dbStatus = "Connected! ✅";
    } catch (e: any) {
        dbStatus = "Failed ❌";
        dbError = e.message;
    }

    const pyroApiKey = process.env.PYRO_API_KEY ? "Set ✅" : "Missing ❌";
    const pyroUrl = process.env.PYRO_PANEL_URL ? "Set ✅" : "Missing ❌";
    const authSecret = process.env.AUTH_SECRET ? "Set ✅" : "Missing ❌";

    return (
        <div style={{ padding: '2rem', background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'monospace' }}>
            <h1>Public Debug Page</h1>
            <hr />
            <div style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #333' }}>
                <h3>Database</h3>
                <p>Status: {dbStatus}</p>
                <p>Users in DB: {usersCount}</p>
                {dbError && <p style={{ color: 'red' }}>Error: {dbError}</p>}
            </div>

            <div style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #333' }}>
                <h3>Environment Variables</h3>
                <p>PYRO_API_KEY: {pyroApiKey}</p>
                <p>PYRO_PANEL_URL: {pyroUrl}</p>
                <p>AUTH_SECRET: {authSecret}</p>
                <p>NODE_ENV: {process.env.NODE_ENV}</p>
            </div>

            <p>Go back to <a href="/" style={{ color: 'lightblue' }}>Dashboard</a></p>
        </div>
    );
}
