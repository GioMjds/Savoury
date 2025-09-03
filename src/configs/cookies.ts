// Server-side cookie utilities (only use in Server Components/Actions)
export async function getServerCookie(name: string): Promise<string | undefined> {
    const { cookies } = await import('next/headers');
    try {
        const cookieStore = cookies();
        return (await cookieStore).get(name)?.value;
    } catch (error) {
        console.warn('Server-side cookie access failed:', error);
        return undefined;
    }
}

// Client-side cookie utilities
export function getCookie(name: string): string | undefined {
    if (typeof window === 'undefined') {
        return undefined;
    }
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
    }
    return undefined;
}

export function setCookie(name: string, value: string, options: {
    expires?: Date;
    maxAge?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
} = {}): void {
    if (typeof window === 'undefined') {
        console.warn('setCookie can only be used on the client side');
        return;
    }

    let cookieString = `${name}=${value}`;
    
    if (options.expires) {
        cookieString += `; expires=${options.expires.toUTCString()}`;
    }
    
    if (options.maxAge) {
        cookieString += `; max-age=${options.maxAge}`;
    }
    
    if (options.path) {
        cookieString += `; path=${options.path}`;
    }
    
    if (options.domain) {
        cookieString += `; domain=${options.domain}`;
    }
    
    if (options.secure) {
        cookieString += `; secure`;
    }
    
    if (options.sameSite) {
        cookieString += `; samesite=${options.sameSite}`;
    }
    
    document.cookie = cookieString;
}

export function deleteCookie(name: string, options: {
    path?: string;
    domain?: string;
} = {}): void {
    setCookie(name, '', {
        ...options,
        expires: new Date(0),
    });
}