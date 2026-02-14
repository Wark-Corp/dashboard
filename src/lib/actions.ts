'use server'

import { signIn } from '@/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'

export async function registerUser(prevState: string | undefined, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) return 'Please fill in all fields';

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return 'Email already in use';

        const passwordHash = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
            },
        });

        return 'success';
    } catch (error) {
        console.error('Registration error:', error);
        return 'Failed to create user';
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
