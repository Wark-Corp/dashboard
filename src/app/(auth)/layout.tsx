export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'radial-gradient(ellipse at top, #1a1a1a, #000000)',
            padding: '2rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                {children}
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
        </div>
    )
}
