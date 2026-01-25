import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  const publicRoutes = ["/sign-in", "/sign-up", "/"];
  const authRoutes = ["/sign-in", "/sign-up"];

const onboardingSteps = {
    verifyEmail: "/sign-up/email-verification",
    selectImage: "/sign-up/email-verification/select-image",
    twoFA: "/sign-up/twoFA"
  };
  const isOnboardingRoute = Object.values(onboardingSteps).some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  let userState = {
    isValid: false,
    isVerified: false,
    hasAvatar: false,
    // is2faEnabled: false,
    // is2faVerified: false,
  }

  let isTokenExpired = false;


  if (accessToken) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(accessToken, secret);
      // console.log(payload);

      userState.isValid = true;
      userState.isVerified = !!payload.isVerified;
      userState.hasAvatar = !!payload.hasAvatar;
      // userState.is2faEnabled = !!payload.isTwoFaEnabled;
      // userState.is2faVerified = !!payload.isTwoFaAuthenticated;
    } catch (error) {
      if (error.code === "ERR_JWT_EXPIRED" || error.message.includes("exp")) {
        isTokenExpired = true;
      }
      console.log("Access token invalid:", error.message);// to remove later
    }
  }

  if ((isTokenExpired || !accessToken) && refreshToken) {
    try {
      const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,{
          method: "POST",
          headers: {
            Cookie: `refreshToken=${refreshToken}; accessToken=${accessToken || ""}`,
          },
        },
      );

      if (refreshResponse.ok) {
        const response = NextResponse.redirect(request.url);
        const setCookie = refreshResponse.headers.get("set-cookie");

        if (setCookie) {
          response.headers.set("Set-Cookie", setCookie);
        }

        console.log("✅ Token refreshed successfully via Middleware");
        return response
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
    }
  }

  if (!userState.isValid && !isPublicRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (userState.isValid) {
    if (pathname === "/") {
        return NextResponse.next();
      }
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!userState.isVerified) {
       if (pathname !== onboardingSteps.verifyEmail) {
         return NextResponse.redirect(new URL(onboardingSteps.verifyEmail, request.url));
       }
       return NextResponse.next();
    }

    // if (userState.is2faEnabled && !userState.is2faVerified) {
    //     if (pathname !== onboardingSteps.twoFactor) {
    //         return NextResponse.redirect(new URL(onboardingSteps.twoFactor, request.url));
    //     }
    //     return NextResponse.next();
    // }

    if (!userState.hasAvatar) {
       if (pathname !== onboardingSteps.selectImage) {
         return NextResponse.redirect(new URL(onboardingSteps.selectImage, request.url));
       }
       return NextResponse.next();
    }

    if (isOnboardingRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};