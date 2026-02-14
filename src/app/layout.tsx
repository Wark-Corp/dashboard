import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wark Corporation Dashboard",
  description: "Pyrodactyl Server Management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session: any = null;
  try {
    session = await auth();
  } catch (e) {
    console.error("RootLayout auth error:", e);
  }

  return (
    <html lang="es">
      <body className={inter.className}>
        <header style={{
          padding: '1rem 2rem',
          borderBottom: '1px solid var(--card-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Image src="/logo.png" alt="Logo" width={32} height={32} style={{ borderRadius: '6px' }} />
            <h1 style={{
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: '#fff'
            }}>
              Wark Corporation
            </h1>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {session ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/account" style={{ textAlign: 'right', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <div style={{ color: '#fff' }}>{session.user?.name || session.user?.email}</div>
                  <div style={{ color: '#666', fontSize: '0.75rem' }}>Administrator</div>
                </Link>
                <form action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/login" });
                }}>
                  <button type="submit" className="logout-btn" style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}>
                    Log out
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" style={{
                color: '#a1a1a1',
                fontSize: '0.875rem',
                fontWeight: 500
              }}>
                Log in
              </Link>
            )}
          </nav>
        </header>
        <main style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
