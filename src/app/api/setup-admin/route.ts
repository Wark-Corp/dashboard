import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const secret = searchParams.get('secret');

    // Simple security check
    if (secret !== 'wark-admin-setup-2026') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role: 'EXECUTIVE' }
        });

        return NextResponse.json({
            success: true,
            message: `User ${email} is now an EXECUTIVE.`,
            user: { email: user.email, role: user.role }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
