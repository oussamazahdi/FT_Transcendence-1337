import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose';

export async function middleware (request){

  // const accessToken = request.cookies.get("accessToken")?.value;
  // const refreshToken = request.cookies.get("refreshToken")?.value;

  // const { pathname } = request.nextUrl;

  // const publicRoutes = ['/sign-in', '/sign-up', '/'];
  // const authRoutes = ['/sign-in', '/sign-up']; 

  // const isPublicRoute = publicRoutes.includes(pathname);
  // const isAuthRoute = authRoutes.includes(pathname);

  // let isValidAccess = false;
  // let isAccessTokenExpired = false;

  // if (accessToken) {
  //   try {
  //     const secret = new TextEncoder().encode(process.env.JWT_SECRET); 
  //     await jwtVerify(accessToken, secret);
  //     isValidAccess = true;
  //   } catch (error) {
  //     if (error.code === 'ERR_JWT_EXPIRED') {
  //       isAccessTokenExpired = true;
  //     }
  //     console.log("Access token invalid:", error.message);
  //   }
  // }

  // if (isAccessTokenExpired && refreshToken) {
  //   try {
  //     const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
  //       method: 'POST',
  //       headers: {
  //         'Cookie': `refreshToken=${refreshToken}; accessToken=${accessToken}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     if (refreshResponse.ok) {

  //       const setCookieHeader = refreshResponse.headers.get('set-cookie');
  //       if (setCookieHeader) {
  //         response.headers.set('Set-Cookie', setCookieHeader);
  //       }
        
  //       console.log("Token refreshed successfully via Middleware");
  //       return NextResponse.next();
  //     } else {
  //       console.log("Refresh attempt failed");
  //     }
  //   } catch (error) {
  //     console.error("Error during token refresh:", error);
  //   }
  // }



  // if (!isPublicRoute && !isValidAccess) {
  //   const loginUrl = new URL('/sign-in', request.url);
  //   const response = NextResponse.redirect(loginUrl);
  //   response.cookies.delete("accessToken"); 

  //   if (isAccessTokenExpired && !refreshToken)
  //     response.cookies.delete("refreshToken");
  //   return response;
  // }

  // if (isAuthRoute && isValidAccess && pathname !== '/') {
  //    return NextResponse.redirect(new URL('/dashboard', request.url))
  // }

  // return NextResponse.next();
}

export const config = {
  // Apply to all routes except api, static files, images, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',]
}
