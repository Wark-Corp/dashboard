'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>
            <h2>Algo salió mal!</h2>
            <p style={{ color: 'red', margin: '1rem 0' }}>{error.message}</p>
            <div style={{ background: '#222', padding: '1rem', borderRadius: '8px', overflow: 'auto', textAlign: 'left', margin: '1rem auto', maxWidth: '800px' }}>
                <pre>{error.stack}</pre>
            </div>
            <button
                onClick={() => reset()}
                style={{ padding: '0.5rem 1rem', background: 'white', color: 'black', border: 'none', borderRadius: '4px' }}
            >
                Intentar de nuevo
            </button>
        </div>
    )
}
