import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.PYRO_API_KEY;
    const panelUrl = process.env.PYRO_PANEL_URL;

    const results = {
        config: {
            apiKeySet: !!apiKey,
            panelUrlSet: !!panelUrl,
            panelUrl: panelUrl,
        },
        connection: {},
        error: null as string | null
    };

    if (!apiKey || !panelUrl) {
        return NextResponse.json({ ...results, error: "Missing environment variables" }, { status: 500 });
    }

    try {
        const response = await fetch(`${panelUrl}/api/application/servers`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        const status = response.status;
        const statusText = response.statusText;

        let data = null;
        try {
            data = await response.json();
        } catch (e) {
            data = "Could not parse JSON response";
        }

        results.connection = {
            status,
            statusText,
            data
        };

        return NextResponse.json(results);
    } catch (error: any) {
        return NextResponse.json({ ...results, error: error.message }, { status: 500 });
    }
}
