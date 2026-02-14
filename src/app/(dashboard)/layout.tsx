import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let session: any = null;
    try {
        session = await auth();
    } catch (error) {
        console.error("DashboardLayout Auth Error (Soft Fail):", error);
        // Do not redirect on error, just let session be null
    }

    if (!session) {
        // redirect("/login"); // Keep redirect disabled for now to allow debug
    }
    // If it's a redirect, rethrow it so Next.js handles it
    if ((error as Error).message === 'NEXT_REDIRECT') {
        throw error;
    }
    console.error("DashboardLayout Auth Error:", error);
    // On critical auth error, force redirect to login
    redirect("/login");
}

return <>{children}</>;
}
