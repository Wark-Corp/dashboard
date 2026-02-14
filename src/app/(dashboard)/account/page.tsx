import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
    const session = await auth();
    if (!session) redirect("/login");

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', background: 'linear-gradient(to right, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Mi Cuenta
            </h1>

            <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #333, #000)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: '#fff' }}>
                        {session.user?.name?.[0] || 'U'}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{session.user?.name || 'Usuario'}</h2>
                        <p style={{ color: '#888' }}>{session.user?.email}</p>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Seguridad</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Autenticación de Dos Factores (2FA)</h4>
                            <p style={{ fontSize: '0.875rem', color: '#666' }}>Añade una capa extra de seguridad a tu cuenta.</p>
                        </div>
                        <button disabled style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--card-border)',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#666',
                            cursor: 'not-allowed',
                            fontSize: '0.875rem'
                        }}>
                            Próximamente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
