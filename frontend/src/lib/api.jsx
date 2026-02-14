
const logout = async () => {
  try {
    const response = await autofetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
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

      return fetch(url, options);
    }catch(err){
      logout();
    }
  }
  return response
}
