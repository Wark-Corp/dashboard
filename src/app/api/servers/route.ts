import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.PYRO_API_KEY;
    const panelUrl = process.env.PYRO_PANEL_URL;

    if (!apiKey || !panelUrl) {
        return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
    }

    try {
        // Attempt to fetch from Application API (Admin)
        const response = await fetch(`${panelUrl}/api/application/servers`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch servers: ${response.statusText}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
