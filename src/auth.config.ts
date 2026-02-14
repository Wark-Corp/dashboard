import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
        newUser: '/register',
    },
    providers: [],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAuthPage = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');

            // Allow auth pages
            if (isAuthPage) {
                if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
                return true;
            }

            // Allow API routes and static assets (handled by matcher too)
            if (nextUrl.pathname.startsWith('/api')) return true;

            // Protect dashboard (root and subpaths)
            if (!isLoggedIn) {
                return false; // Redirect to login
            }

            return true;
        },
    },
} satisfies NextAuthConfig;
