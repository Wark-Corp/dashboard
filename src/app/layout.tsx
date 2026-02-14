import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Google Fonts via Next.js
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wark Corporation Dashboard",
  description: "Pyrodactyl Server Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <header style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid var(--card-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(10, 10, 10, 0.8)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <h1 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 700, 
                background: 'var(--primary-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Wark Corporation
            </h1>
            <nav>
                {/* Future nav items */}
            </nav>
        </header>
        <main style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
            {children}
        </main>
      </body>
    </html>
  );
}
