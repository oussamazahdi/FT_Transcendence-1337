import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api/",
  timeout: 5000
})
  const logout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if(response.ok){
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      triggerError(USER_ERROR[err.message] || USER_ERROR['default'])
    }
  };

export const autofetch = async(url, options) => {

  const response = await fetch(url, options);
  if (response.status === 401){
    try{
      const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,{
        method: "POST",
        credentials:"include"
      })
      if (!refreshResponse.ok)
        throw new Error("Refresh failed")

      console.log("Cookie Refreshed. Retrying original request...");

      return fetch(url, options);
    }catch(err){
      console.error("Session expired completely.");
      logout();
    }
  }
  return response
}