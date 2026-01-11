import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const aToken = cookieStore.get("accessToken");
  const rToken = cookieStore.get("refreshToken");

  if (!rToken || !aToken) return null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
      {
        headers: {
          Cookie: `accessToken=${aToken.value}; refreshToken=${rToken.value}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return null;
    }

    return data.userData;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}
