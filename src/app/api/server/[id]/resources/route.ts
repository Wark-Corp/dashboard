import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.PYRO_API_KEY;
    const panelUrl = process.env.PYRO_PANEL_URL;
    const { id } = await props.params;

    if (!apiKey || !panelUrl) {
        return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
    }

    try {
        const response = await fetch(`${panelUrl}/api/client/servers/${id}/resources`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            // If 404/403, might be offline or suspended or key issue
            return NextResponse.json({ current_state: 'offline' });
            // We default to offline if we can't fetch resources (often means server is off in Pterodactyl)
        }

        const data = await response.json();
        return NextResponse.json(data.attributes); // Returns { current_state: "running", ... }
    } catch (error) {
        console.error('Resources fetch error:', error);
        return NextResponse.json({ current_state: 'offline' });
    }
}
