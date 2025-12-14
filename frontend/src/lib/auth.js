import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const aToken = cookieStore.get("accessToken");
  const rToken = cookieStore.get("refreshToken");

  if (!token)
      return (null);
  
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: {
        'Cookie': `accessToken=${aToken}; refreshToken=${rToken}`
      }
    });

    if(!response.ok){
      return null
    }
    const data = await response.json();

    return(data.UserData);
  }catch(error){
    console.error("Failed to fetch user:", error);
    return null
  }
}