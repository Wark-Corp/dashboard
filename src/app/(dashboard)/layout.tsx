import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        // const session = await auth();
        // if (!session) {
        //     // redirect("/login");
        // }
    } catch (error) {
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
