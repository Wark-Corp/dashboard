'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body style={{ background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
                <h2 style={{ color: '#ef4444' }}>Algo salió muy mal (Global Error)</h2>
                <div style={{ maxWidth: '600px', background: '#111', padding: '1rem', borderRadius: '8px', margin: '1rem', overflow: 'auto' }}>
                    <p><strong>Mensaje:</strong> {error.message}</p>
                    <p><strong>Digest:</strong> {error.digest}</p>
                </div>
                <button onClick={() => reset()} style={{ padding: '0.5rem 1rem', background: '#fff', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Intentar de nuevo
                </button>
            </body>
        </html>
    )
}
