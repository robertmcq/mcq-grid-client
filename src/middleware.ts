import { NextRequest, NextResponse } from 'next/server';

// Routes that require an authenticated session cookie
const PROTECTED_PREFIXES = ['/dashboard', '/portal', '/account'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) return NextResponse.next();

  const session = req.cookies.get('mcq_session')?.value;

  if (!session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/portal/:path*', '/account/:path*'],
};
