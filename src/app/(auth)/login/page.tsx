'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions';
import styles from '../auth.module.css';
import Link from 'next/link';
import Image from 'next/image';

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <button className={styles['auth-button']} disabled={pending}>
            {pending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
    );
}

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    return (
        <div className={styles['auth-container']}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Image src="/logo.png" alt="Wark Corp" width={60} height={60} style={{ borderRadius: '12px' }} />
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(to right, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Bienvenido de nuevo
                </h1>
                <p style={{ color: '#a1a1a1', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Gestiona tus servidores Pyrodactyl
                </p>
            </div>

            <form action={dispatch}>
                <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    required
                    className={styles['auth-input']}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    required
                    className={styles['auth-input']}
                />
                <LoginButton />

                {errorMessage && (
                    <div style={{ color: '#ef4444', marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                        {errorMessage}
                    </div>
                )}
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#a1a1a1', fontSize: '0.875rem' }}>
                ¿No tienes cuenta? <Link href="/register" style={{ color: '#fff', textDecoration: 'underline' }}>Regístrate</Link>
            </div>
        </div>
    );
}
