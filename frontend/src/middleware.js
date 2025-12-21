import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose';

export async function middleware(request) {

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  const publicRoutes = ['/sign-in', '/sign-up', '/'];
  const authRoutes = ['/sign-in', '/sign-up'];

  const onboardingRoutes = [
    '/sign-up/email-verification',
    '/sign-up/email-verification/selecte-image'
  ];

  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isOnboardingRoute = onboardingRoutes.some(route => pathname.includes(route));

  let isValidAccess = false;
  let isAccessTokenExpired = false;
  let isVerified = false;
  let hasAvatar = false;

  if (accessToken) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(accessToken, secret);

      isValidAccess = true;
      // Read flags from token payload
      isVerified = payload.isVerified === true;
      hasAvatar = payload.hasAvatar === true;
      console.log("waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa reb :",payload);
      console.log("🔍 After fetch - isVerified:", isVerified, "hasAvatar:", hasAvatar);

    } catch (error) {
      // Check for expiration
      if (error.code === 'ERR_JWT_EXPIRED' || error.message.includes('exp')) {
        isAccessTokenExpired = true;
      }
      console.log("Access token invalid:", error.message);
    }
  }

  // TOKEN REFRESH LOGIC
  if ((isAccessTokenExpired || !accessToken) && refreshToken) {
    try {
      const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Cookie': `refreshToken=${refreshToken}; accessToken=${accessToken || ''}`,
        }
      });

      if (refreshResponse.ok) {
        const response = NextResponse.next();
        
        // Get the Set-Cookie headers from the refresh response
        const setCookieHeaders = refreshResponse.headers.get('set-cookie');
        
        if (setCookieHeaders) {
          response.headers.set('Set-Cookie', setCookieHeaders);
        }

        console.log("✅ Token refreshed successfully via Middleware");
        return response;
      } else {
        console.log("❌ Refresh attempt failed - Status:", refreshResponse.status);
        // Clear invalid cookies
        const response = NextResponse.redirect(new URL('/sign-in', request.url));
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        return response;
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
    }
  }

  // ONBOARDING FLOW
  if (isOnboardingRoute) {
    if (isValidAccess) {
      if (pathname === '/sign-up/email-verification') {
        if (isVerified) {
          return NextResponse.redirect(new URL("/sign-up/email-verification/selecte-image", request.url));
        }
        else {
          return NextResponse.next();
        }
      }
      if (pathname === '/sign-up/email-verification/selecte-image') {
        if (isVerified) {
          if (hasAvatar) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          } else {
            return NextResponse.next();
          }
        } else {
          return NextResponse.redirect(new URL("/sign-up/email-verification", request.url));
        }
      }
    } else {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Redirect to login if accessing protected route without valid token
  if (!isPublicRoute && !isValidAccess) {
    const loginUrl = new URL('/sign-in', request.url);
    const response = NextResponse.redirect(loginUrl);

    if (isAccessTokenExpired && !refreshToken) {
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
    }
    return response;
  }

  // Force incomplete onboarding for authenticated users
  console.log("🚨 Checking onboarding redirect - isValidAccess:", isValidAccess, "pathname:", pathname, "isVerified:", isVerified, "hasAvatar:", hasAvatar);
  if (isValidAccess && !isOnboardingRoute && !isAuthRoute && pathname !== '/') {
    if (!isVerified) {
      return NextResponse.redirect(new URL('/sign-up/email-verification', request.url));
    }
    if (!hasAvatar) {
      return NextResponse.redirect(new URL('/sign-up/email-verification/selecte-image', request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isValidAccess && isVerified && hasAvatar && pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
}