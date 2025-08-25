import { type NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	const isProtectedRoute =
		pathname.startsWith('/(protected)') ||
		pathname === '/login' ||
		pathname === '/register' ||
		pathname === '/forgot';

	const isPublicRoute =
		pathname.startsWith('/(public)') ||
		pathname === '/' ||
		pathname.startsWith('/feed') ||
		pathname.startsWith('/profile') ||
		pathname.startsWith('/search');

	const accessToken = req.cookies.get('access_token')?.value;
	const refreshToken = req.cookies.get('refresh_token')?.value;

	if (isProtectedRoute) {
		if (accessToken) {
			try {
				await verifyToken(accessToken as string);
				return NextResponse.redirect(new URL('/', req.url));
			} catch (error) {
				return NextResponse.next();
			}
		}
		return NextResponse.next();
	}

	if (isPublicRoute && pathname !== '/') {
		if (!accessToken && !refreshToken) {
			return NextResponse.redirect(new URL('/login', req.url));
		}

		// Verify access token
		if (accessToken) {
			try {
				await verifyToken(accessToken);
				return NextResponse.next();
			} catch (error) {
				if (refreshToken) {
					try {
						await verifyToken(refreshToken);
						return NextResponse.next();
					} catch (refreshError) {
						const response = NextResponse.redirect(new URL('/login', req.url));
						response.cookies.delete('access_token');
						response.cookies.delete('refresh_token');
						return response;
					}
				} else {
					const response = NextResponse.redirect(new URL('/login', req.url));
					response.cookies.delete('access_token');
					return response;
				}
			}
		}

		// Only refresh token exists
		if (refreshToken) {
			try {
				await verifyToken(refreshToken);
				return NextResponse.next();
			} catch (error) {
				const response = NextResponse.redirect(new URL('/login', req.url));
				response.cookies.delete('refresh_token');
				return response;
			}
		}

		// No valid tokens, redirect to login
		return NextResponse.redirect(new URL('/login', req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
