"use client"
import { useState, useEffect, useContext, createContext } from "react"
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try{
        console.log("fetching User data");
        const response = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        })

        const data = await response.json();
        console.log(data);
        if (!response.ok){
          throw new Error("Failed to fetch user session")
        }

        setUser(data.userData);
      }catch (err){
        // router.push('/sign-in');
        console.log("failed to fetch", err);
        setUser(null);
      }finally{
        setIsLoading(false);
      }
    }

    checkUser();
  },[])

  const login = (userData) => {
    setUser(userData);
  }

  const logout = () => {
    setUser(null);
  }

  const updateUser = (newData) => {
    setUser((prev) => ({...prev, ...newData}));
  }

  return (
    <AuthContext.Provider value={{ user,  isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}