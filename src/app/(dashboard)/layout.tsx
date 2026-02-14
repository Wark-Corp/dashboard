import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Auth check is handled in individual pages or the RootLayout
    return <>{children}</>;
}
