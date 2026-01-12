"use client";
import { useState, useContext, createContext } from "react";
import { useRouter } from "next/navigation";

const UserContext = createContext(null);

export function UserProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser?.userData || {});
  const [friends, setFriends] = useState(initialUser?.friends || []);
  const [blocked, setBlocked] = useState(initialUser?.blocked || []);
  const [pendingRequests, setPendingRequests] = useState(initialUser?.pendingRequests || []);
  const [incomingRequest, setIncomingRequests] = useState(initialUser?.incomingRequests || []);
  const [globalError, setGlobalError] = useState(null);
  
  const router = useRouter();

  const login = (userData) => {
    setUser(userData);
    setFriends(initialUser.friends);
    setBlocked(initialUser.blocked);
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
      });
      setUser(null);
      setFriends(null);
      setBlocked(null);

      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  const sendFriendRequest = async (user) => {
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/requests/${user.id}`, {
        method:"POST",
        credentials:"include",
      })
      const data = await response.json();

      if(!response.ok)
        throw new Error (data.error)

      console.log("Friend Request sent succefully")

      setPendingRequests((prev) => [...prev, user]);
    }catch(err){
      console.log(err.message)
    }
  }

  const cancelRequest = async (user) => {
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/requests/${user.id}`, {
        method:"DELETE",
        credentials:"include",
      })
      const data = await response.json();

      if(!response.ok)
        throw new Error (data.error)

      console.log("Friend request cancled succefully")

      setPendingRequests(pendingRequests.filter(items => items.id !== user.id));
      setIncomingRequests(incomingRequest.filter(items => items.id !== user.id))
    }catch(err){
      console.log(err.message)
      triggerError(err.message || "Something went wrong!");
    }
  }

  const acceptRequest = async (user) => {
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/requests/${user.id}/accept`, {
        method:"POST",
        credentials:"include",
      })
      const data = await response.json();

      if(!response.ok)
        throw new Error (data.error)

      console.log("Friend request accepted succefully")

      setFriends((prev) => [...prev, user]);
      setIncomingRequests(incomingRequest.filter(items => items.id !== user.id))
    }catch(err){
      console.log(err.message)
    }
  }

  const removeFriend = async (user) => {
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/${user.id}`, {
        method:"DELETE",
        credentials:"include",
      })
      const data = await response.json();

      if(!response.ok)
        throw new Error (data.error)

      console.log("Friend removed sent succefully")

      setFriends(friends.filter(items => items.id !== user.id));
    }catch(err){
      console.log(err.message)
    }
  }

  const blockUser = async (user) => {
    try{
      const response = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/api/friends/blocks/${user.id}`,{
        method:"POST",
        credentials:"include",
      })

      const data = await response.json()
  
      if (!response.ok)
        throw new Error(data.error)
  
      console.log("user blocked succefully");
  
      setBlocked((prev) => [...prev, user]);
    }catch(err){
      console.log(err.message);
    }
  }

  const deblockUser = async (user) => {
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/blocks/${user.id}`,{
        method:"DELETE",
        credentials:"include"
      })
      const data = await response.json()
  
      if (!response.ok)
        throw new Error(data.error)
  
      console.log("user Deblocked succefully");
  
      setBlocked(blocked.filter(items => items.id !== user.id));
    }catch(err){
      console.log("Error in unblock", err.message)
    }
  }

  const triggerError = (message) => {
    setGlobalError(message);

    setTimeout(() => {
      setGlobalError(null);
    }, 3000);
  };

  return (
    <UserContext.Provider value={{ globalError, user, friends, pendingRequests, incomingRequest, blocked, triggerError, login, logout, updateUser, sendFriendRequest, cancelRequest, acceptRequest, removeFriend, setFriends, blockUser, deblockUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useAuth() {
  return useContext(UserContext);
}
