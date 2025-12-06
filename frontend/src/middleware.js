import { NextResponse } from 'next/server'

export function middleware (request){

  const token = request.cookies.get("accessToken");

  const { pathname } = request.nextUrl;

  const publicRoutes = ['/sign-in', '/sign-up', '/'];
  const authRoutes = ['/sign-in', '/sign-up']; 

  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  if (isAuthRoute && token && pathname !== '/') {
     return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next();
}

export const config = {
  // Apply to all routes except api, static files, images, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',]
}
