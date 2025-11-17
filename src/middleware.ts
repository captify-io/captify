import { auth } from '@/lib/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    '/auth/signin',
    '/auth/error',
    '/api/auth',      // NextAuth API routes (session, signin, callback, etc.)
    '/api/health',
  ];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Redirect to signin if not logged in and trying to access protected route
  if (!isLoggedIn && !isPublicPath) {
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return Response.redirect(signInUrl);
  }

  // Allow the request to proceed
  return;
});

export const config = {
  matcher: [
    // Exclude static files and images
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
