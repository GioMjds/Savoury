import { type NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const authRoutes = ['/login', '/register', '/forgot', '/'];
    const protectedRoutes = ['/feed', '/profile', '/search', '/new'];
    const publicRoutes = ['/about', '/community', '/contact', '/privacy', '/dev'];

    const accessToken = req.cookies.get('access_token')?.value;

    const hasValidAuth = async (): Promise<boolean> => {
        if (accessToken) {
            try {
                await verifyToken(accessToken);
                return true;
            } catch (error) {
                return false;
            }
        }
        return false;
    };

    if (authRoutes.includes(pathname)) {
        const isAuthenticated = await hasValidAuth();
        if (isAuthenticated) {
            return NextResponse.redirect(new URL('/feed', req.url));
        }
        return NextResponse.next();
    }

    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        const isAuthenticated = await hasValidAuth();

        if (!isAuthenticated) {
            const response = NextResponse.redirect(new URL('/login', req.url));
            if (accessToken) response.cookies.delete('access_token');
            return response;
        }

        if (!accessToken) {
            try {
                return NextResponse.next();
            } catch (error) {
                const response = NextResponse.redirect(new URL('/login', req.url));
                response.cookies.delete('refresh_token');
                return response;
            }
        }

        return NextResponse.next();
    }

    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest|.*\\..*).*)'],
};