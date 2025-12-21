"use client"
import { useState, useContext, createContext } from "react"
import { useRouter } from "next/navigation";

const UserContext = createContext(null);

export function UserProvider({ children, initialUser }){
  const [user, setUser] = useState(initialUser);
  const router = useRouter();

  const login = (userData) => {
    setUser(userData);
  }

  const logout = async () => {
    try {
      await fetch(`${process.env.API_URL}/api/auth/logout`, { method: 'POST' }); 
      setUser(null);
      
      router.push('/sign-in'); 
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  const updateUser = (newData) => {
    setUser((prev) => ({...prev, ...newData}));
  }

  return (
    <UserContext.Provider value={{ user,  login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useAuth() {
  return useContext(UserContext);
}