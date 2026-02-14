export const autofetch = async(url:string, options:any) => {

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
      window.location.href = "/";
    }
  }
  return response
}
