import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose';

// even in sign-in
// !isverified always rederect to email verification
// !isuserverified && isverified redirect to selecte image 
export async function middleware(request) {

  const accessToken = request.cookies.get("accessToken")?.value;
  // console.log(accessToken);
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
  // const isOnboardingRoute = onboardingRoutes.some(route => pathname.includes(route));

  let isValidAccess = false;
  let isAccessTokenExpired = false;
  let isVerified = false;
  let isUserVerified = false;

  if (accessToken) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(accessToken, secret);

      isValidAccess = true;
      // Default to token payload values as fallback
      isVerified = payload.isUserVerified === true;
      isUserVerified = payload.hasAvatar === true;

      // FETCH FRESH DATA FROM BACKEND
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: {
            'Cookie': `accessToken=${accessToken}; refreshToken=${refreshToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Update status with fresh data from DB
          isVerified = data.userData.isverified === 1 || data.userData.isverified === true;
          isUserVerified = !!data.userData.avatar;
        }
      } catch (fetchError) {
        console.error("Failed to fetch fresh user data in middleware, falling back to token:", fetchError.message);
      }

    } catch (error) {
      if (error.code === 'ERR_JWT_EXPIRED') {
        isAccessTokenExpired = true;
      }
      console.log("Access token invalid:", error.message);
    }
  }

  if ((isAccessTokenExpired || !accessToken) && refreshToken) {
    try {
      const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Cookie': `refreshToken=${refreshToken}; accessToken=${accessToken}`,
        }
      });

      if (refreshResponse.ok) {

        const setCookieHeader = refreshResponse.headers.get('set-cookie'); // updates the cookies cuz we're doing server to server fetch
        const response = NextResponse.next();
        if (setCookieHeader) {
          response.headers.set('Set-Cookie', setCookieHeader);
        }

        console.log("Token refreshed successfully via Middleware");
        return response;
      } else {
        console.log("Refresh attempt failed");
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
    }
  }

  // if (isOnboardingRoute) {
  //   if (isValidAccess) {
  //     if (pathname === '/sign-up/email-verification') {
  //       if (isVerified) {
  //         return NextResponse.redirect(new URL("/sign-up/email-verification/selecte-image", request.url));
  //       }
  //       else {
  //         return (NextResponse.next());
  //       }
  //     }
  //     if (pathname === '/sign-up/email-verification/selecte-image') {
  //       if (isVerified) {
  //         if (isUserVerified) {
  //           return NextResponse.redirect(new URL("/dashboard", request.url));
  //         } else {
  //           return (NextResponse.next());
  //         }
  //       } else {
  //         return NextResponse.redirect(new URL("/sign-up/email-verification", request.url));
  //       }
  //     }
  //   } else {
  //     return NextResponse.redirect(new URL("/sign-in", request.url));
  //   }
  // }


  if (!isPublicRoute && !isValidAccess) {
    const loginUrl = new URL('/sign-in', request.url);
    const response = NextResponse.redirect(loginUrl);
    // response.cookies.delete("accessToken");

    if (isAccessTokenExpired && !refreshToken) {
      // response.cookies.delete("refreshToken");
    }
    return response;
  }

  // if (!isVerified) {
  //       return NextResponse.redirect(new URL('/sign-up/email-verification', request.url));
  //   }
  // if (!isUserVerified) {
  //        return NextResponse.redirect(new URL('/sign-up/email-verification/selecte-image', request.url));
  // }

  if (isAuthRoute && isValidAccess && isVerified && isUserVerified && pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next();
}

export const config = {
  // Apply to all routes except api, static files, images, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',]
}
