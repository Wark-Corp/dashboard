import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const apiKey = process.env.PYRO_API_KEY;
    const panelUrl = process.env.PYRO_PANEL_URL;
    const { id } = await props.params;
    // const { id } = params; // This old line was the issue, replacing the whole block.


    if (!apiKey || !panelUrl) {
        return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { signal } = body; // 'start', 'stop', 'restart', 'kill'

        // Attempt to use Client API for power actions
        // Note: Admin keys might not work here depending on panel configuration.
        // If this fails, we might need a Client API key.
        const response = await fetch(`${panelUrl}/api/client/servers/${id}/power`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ signal }),
        });

        if (!response.ok) {
            // If Client API fails, try to see if it's a 403/404 which might imply key issues
            // or if we should try an Application API approach (though usually App API doesn't do power)
            const errorText = await response.text();
            console.error('Power Action Error:', response.status, errorText);
            return NextResponse.json({ error: `Failed to execute power action: ${response.statusText}` }, { status: response.status });
        }

        // Power actions often return 204 No Content
        if (response.status === 204) {
            return NextResponse.json({ success: true });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Power action exception:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
