export const authConfig = {
    pages: {
        signIn: '/login',
        newUser: '/register',
    },
    providers: [],
    callbacks: {
        authorized({ auth, request }: any) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/register');

            // Check if accessing protected routes
            if (isOnDashboard) {
                // Exclude API and static files
                if (request.nextUrl.pathname.startsWith('/api') ||
                    request.nextUrl.pathname.startsWith('/_next') ||
                    request.nextUrl.pathname.includes('.')) {
                    return true;
                }

                if (isLoggedIn) return true;
                return false; // Redirect to login
            } else if (isLoggedIn) {
                // If on login/register but logged in, redirect to home
                return Response.redirect(new URL('/', request.nextUrl));
            }

            return true;
        },
    },
};
