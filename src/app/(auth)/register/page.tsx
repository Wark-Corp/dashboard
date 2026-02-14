'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { registerUser } from '@/lib/actions';
import styles from '../auth.module.css';
import Link from 'next/link';
import Image from 'next/image';

function RegisterButton() {
    const { pending } = useFormStatus();
    return (
        <button className={styles['auth-button']} disabled={pending}>
            {pending ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
    );
}

export default function RegisterPage() {
    const [state, dispatch] = useActionState(registerUser, undefined);

    return (
        <div className={styles['auth-container']}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Image src="/logo.png" alt="Wark Corp" width={60} height={60} style={{ borderRadius: '12px' }} />
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>Crear Cuenta</h1>
                <p style={{ color: '#a1a1a1', fontSize: '0.875rem' }}>Únete a Wark Corporation</p>
            </div>

            {state === 'success' ? (
                <div style={{ textAlign: 'center', color: '#22c55e' }}>
                    <p>¡Cuenta creada exitosamente!</p>
                    <Link href="/login" style={{ display: 'block', marginTop: '1rem', color: '#fff', textDecoration: 'underline' }}>
                        Ir a Iniciar Sesión
                    </Link>
                </div>
            ) : (
                <form action={dispatch}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre completo"
                        required
                        className={styles['auth-input']}
                    />
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
                    <RegisterButton />

                    {state && (
                        <div style={{ color: '#ef4444', marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                            {state}
                        </div>
                    )}
                </form>
            )}

            {state !== 'success' && (
                <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#a1a1a1', fontSize: '0.875rem' }}>
                    ¿Ya tienes cuenta? <Link href="/login" style={{ color: '#fff', textDecoration: 'underline' }}>Inicia Sesión</Link>
                </div>
            )}
        </div>
    );
}
