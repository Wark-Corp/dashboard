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
        // If it's a redirect, rethrow it so Next.js handles it
        if ((error as Error).message === 'NEXT_REDIRECT') {
            throw error;
        }
        console.error("DashboardLayout Auth Error (Soft Fail):", error);
        // Do not redirect on error, just let session be null
    }

    if (!session) {
        // For debugging, we don't redirect to /login yet if auth fails
        // redirect("/login");
    }

    return <>{children}</>;
}
