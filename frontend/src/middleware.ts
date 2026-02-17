import { NextRequest, NextResponse } from "next/server";
import { JWTVerifyResult, jwtVerify } from "jose";

type payloadType = {
	userId:number
	isVerified: boolean
	hasAvatar : boolean
	status2fa : boolean
	session2FA : boolean
}

const ROOM_CHECK_TIMEOUT_MS = 3000;

function extractRoomId(pathname: string): string | null {
  const publicRoutes = [
    "/game/local",
    "/game/tournament",
    "/game/matchmaking",
  ];

  const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith(route));

  if (isPublic) return null;
	
  if (!pathname.startsWith("/game/")) return null;
	
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length >= 2) {
    return parts[1];
  }

  return null;
}



export async function middleware(request:NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  const publicRoutes = ["/sign-in", "/sign-up", "/"];
  const authRoutes = ["/sign-in", "/sign-up"];

	const onboardingSteps = {
    verifyEmail: "/sign-up/email-verification",
    selectImage: "/sign-up/email-verification/select-image",
    twoFA: "/sign-in/twoFA"
  };
  const isOnboardingRoute = Object.values(onboardingSteps).some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  let userState = {
		id: 0,
    isValid: false,
    isVerified: false,
    hasAvatar: false,
    is2faEnabled: false,
    is2faVerified: false,
  }

  let isTokenExpired = false;


  if (accessToken) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload }:JWTVerifyResult<payloadType> = await jwtVerify(accessToken, secret);

			userState.id = payload.userId;
      userState.isValid = true;
      userState.isVerified = !!payload.isVerified;
      userState.hasAvatar = !!payload.hasAvatar;
      userState.is2faEnabled = !!payload.status2fa;
      userState.is2faVerified = !!payload.session2FA;
    } catch (error:any) {
			if (error.code === "ERR_JWT_EXPIRED" || error.message.includes("exp")) {
				isTokenExpired = true;
      }
    }
  }

  if ((isTokenExpired || !accessToken) && refreshToken) {
    try {
      const refreshResponse = await fetch(`${process.env.SERVER_SIDE_API_URL}/api/auth/refresh`,{
          method: "POST",
          headers: {
            Cookie: `refreshToken=${refreshToken}; accessToken=${accessToken}`,
          },
        },
      );

      if (refreshResponse.ok) {
        const response = NextResponse.redirect(request.url);
        const setCookie = refreshResponse.headers.get("set-cookie");

        if (setCookie) {
          response.headers.set("Set-Cookie", setCookie);
        }
        return response
      }else {
        const response = NextResponse.redirect(new URL("/sign-in", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
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

    if (userState.is2faEnabled && userState.is2faVerified) {
        if (pathname !== onboardingSteps.twoFA) {
            return NextResponse.redirect(new URL(onboardingSteps.twoFA, request.url));
        }
        return NextResponse.next();
    }

    if (!userState.hasAvatar) {
       if (pathname !== onboardingSteps.selectImage) {
         return NextResponse.redirect(new URL(onboardingSteps.selectImage, request.url));
       }
       return NextResponse.next();
    }

    if (isOnboardingRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
		
		const roomId = extractRoomId(pathname);
		if(roomId){
			const roomGuardRedirect = () => NextResponse.redirect(new URL('/game', request.url));
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), ROOM_CHECK_TIMEOUT_MS);

			try{
				const RoomRes = await fetch(`${process.env.SERVER_SIDE_API_URL}/api/game/rooms/${roomId}/action`, {
					method: "GET",
					headers: {
						Cookie: `refreshToken=${refreshToken}; accessToken=${accessToken || ""}`,
					},
					signal: controller.signal,
				});

				if (!RoomRes.ok) return roomGuardRedirect();

				let Room: unknown;
				try {
					Room = await RoomRes.json();
				} catch {
					return roomGuardRedirect();
				}

				const game = (Room as { Game?: { player1?: { id?: number | string }; player2?: { id?: number | string } } })?.Game;
				if (!game) return roomGuardRedirect();

				const player1Id = Number(game.player1?.id);
				const player2Id = Number(game.player2?.id);
				if (userState.id !== player1Id && userState.id !== player2Id)
					return roomGuardRedirect();
			}catch(error){
				return roomGuardRedirect();
			} finally {
				clearTimeout(timeoutId);
			}
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
