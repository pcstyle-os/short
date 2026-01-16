import { authkit } from '@workos-inc/authkit-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
    const { session, headers: authkitHeaders } = await authkit(request);
    const { pathname } = new URL(request.url);

    // Short app logic:
    // '/' -> Dashboard/Create -> Protected
    // '/dashboard' -> Protected
    // '/[code]' -> Public Redirect

    const isProtectedPath = pathname === '/' || pathname.startsWith('/dashboard');

    if (!isProtectedPath) {
        const response = NextResponse.next({
            request: { headers: new Headers(request.headers) },
        });
        for (const [key, value] of authkitHeaders) {
            if (key.toLowerCase() === 'set-cookie') {
                response.headers.append(key, value);
            } else {
                response.headers.set(key, value);
            }
        }
        return response;
    }

    if (!session.user) {
        const authUrl = new URL(process.env.NEXT_PUBLIC_AUTH_URL ?? 'https://auth.pcstyle.dev');
        authUrl.searchParams.set('returnTo', request.url);
        const response = NextResponse.redirect(authUrl);
        for (const [key, value] of authkitHeaders) {
            if (key.toLowerCase() === 'set-cookie') {
                response.headers.append(key, value);
            } else {
                response.headers.set(key, value);
            }
        }
        return response;
    }

    const response = NextResponse.next({
        request: { headers: new Headers(request.headers) },
    });
    for (const [key, value] of authkitHeaders) {
        if (key.toLowerCase() === 'set-cookie') {
            response.headers.append(key, value);
        } else {
            response.headers.set(key, value);
        }
    }
    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|pwa-icon.svg).*)',
    ],
};
