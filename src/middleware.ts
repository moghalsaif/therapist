import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/signin', '/signup', '/reset-password'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isPublicRoute = PUBLIC_ROUTES.includes(req.nextUrl.pathname);
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');

  // Allow API routes to handle their own auth
  if (isApiRoute) {
    return res;
  }

  // Redirect authenticated users away from public routes
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL('/find-therapist', req.url));
  }

  // Redirect unauthenticated users to signin
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/', '/onboarding', '/prompt'],
}; 