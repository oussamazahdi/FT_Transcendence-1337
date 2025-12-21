import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");
  // const refreshToken = cookieStore.get("refreshToken");

  if (!token) return null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
      {
        headers: {
          Cookie: `accessToken=${token.value}`,
        },
      },
    );

    if (!response.ok) {
      return null;
    }
    const data = await response.json();

    return data.userData;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}
