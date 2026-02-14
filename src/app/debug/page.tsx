import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
    const envCheck = {
        hasPyroKey: !!process.env.PYRO_API_KEY,
        hasPanelUrl: !!process.env.PYRO_PANEL_URL,
        hasAuthSecret: !!process.env.AUTH_SECRET,
        hasDbUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
    };

    let dbStatus = "Checking...";
    let userCount = -1;
    let dbError = "";

    try {
        userCount = await prisma.user.count();
        dbStatus = "Connected ✅";
    } catch (e: any) {
        dbStatus = "Failed ❌";
        dbError = e.message;
    }

    return (
        <div style={{ padding: '2rem', color: 'white', fontFamily: 'monospace' }}>
            <h1>Debug Dashboard</h1>

            <section style={{ marginBottom: '2rem' }}>
                <h2>Environment Variables</h2>
                <pre>{JSON.stringify(envCheck, null, 2)}</pre>
            </section>

            <section>
                <h2>Database Connection</h2>
                <p>Status: {dbStatus}</p>
                {userCount >= 0 && <p>User Count: {userCount}</p>}
                {dbError && (
                    <div style={{ background: '#300', padding: '1rem', marginTop: '1rem' }}>
                        <strong>Error:</strong>
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{dbError}</pre>
                    </div>
                )}
            </section>
        </div>
    );
}
