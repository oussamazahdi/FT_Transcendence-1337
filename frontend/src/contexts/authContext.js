"use client"
import { useState, useEffect, useContext, createContext } from "react"

const AuthContext = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkUser = async () => {
      try{
        const response = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok){
          throw new Error("Failed to fetch user session")
        }

        const data = await response.json();
        setUser(data);
      }catch (err){
        console.log(err);
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