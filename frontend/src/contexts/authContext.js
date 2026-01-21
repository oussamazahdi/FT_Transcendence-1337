"use client";
import { useState, useContext, createContext } from "react";
import { useRouter } from "next/navigation";
import { USER_ERROR } from "@/lib/utils";

const UserContext = createContext(null);

export function UserProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser?.userData || {});
  const [friends, setFriends] = useState(initialUser?.friends || []);
  const [blocked, setBlocked] = useState(initialUser?.blocked || []);
  const [pendingRequests, setPendingRequests] = useState(initialUser?.pendingRequests || []);
  const [incomingRequest, setIncomingRequests] = useState(initialUser?.incomingRequests || []);
  const [globalError, setGlobalError] = useState(null);
	const [gameSetting, setGameSetting] = useState(initialUser?.gameSetting || []);
	const [notification, setNotification] = useState(initialUser?.notification || []);
  
  const router = useRouter();

  const login = (userData) => {
    setUser(userData);
    setFriends(initialUser?.friends || []);
    setBlocked(initialUser?.blocked || []);
    setPendingRequests(initialUser?.pendingRequests || []);
    setIncomingRequests(initialUser?.incomingRequest || [])
		setGameSetting(initialUser?.gameSetting || [])
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
      triggerError(USER_ERROR[err.message] || USER_ERROR['default'])
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
      triggerError(USER_ERROR[err.message] || USER_ERROR['default'])
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
      triggerError(USER_ERROR[err.message] || USER_ERROR['default'])
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
      triggerError(USER_ERROR[err.message] || USER_ERROR['default'])
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
      triggerError(USER_ERROR[err.message] || USER_ERROR['default'])
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
      triggerError(USER_ERROR[err.message] || USER_ERROR['default'])
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
      setFriends(friends.filter(items => items.id !== user.id));
    }catch(err){
      triggerError(USER_ERROR[err.message] || USER_ERROR['default'])
    }
  }

  const refreshFriendReq = async () => {
    try {
      const [incomreqRes, pendReqRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/requests`,{credentials:"include"}),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/requests/sent`,{credentials:"include"})
      ]);

      if (incomreqRes.ok) {
          const data = await incomreqRes.json();
          setIncomingRequests(data.requestsList || []);
      }
      
      if (pendReqRes.ok) {
          const data = await pendReqRes.json();
          setPendingRequests(data.Requests || []);
      }

    } catch (err) {
      console.log("Failed to refresh friend data", err);
    }
  };

	const updateGameSettings = async (data) => {
		try {
			// console.log("*******************************************************> ", data);
	
			const payload = {};
			const allowedKeys = new Set([
				"player_xp",
				"player_level",
				"game_mode",
				"ball_speed",
				"score_limit",
				"paddle_size",
			]);
	
			for (const [key, value] of Object.entries(data ?? {})) {
				if (!allowedKeys.has(key)) continue;
				if (value === undefined) continue;
				payload[key] = value;
			}
	
			if (Object.keys(payload).length === 0) {
				return { ok: false, status: 400, error: "NO_FIELDS_TO_UPDATE" };
			}
	
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/game/update-settings`,
				{
					method: "PATCH",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				}
			);
	
			const json = await res.json().catch(() => ({}));
	
			if (!res.ok) {
				return {
					ok: false,
					status: res.status,
					error: json?.message || json?.error || "UPDATE_FAILED",
					details: json,
				};
			}
	
			return { ok: true, status: res.status, data: json };
		} catch (err) {
			return { ok: false, status: 0, error: err?.message || "NETWORK_ERROR" };
		}
	};
	

  const triggerError = (message) => {
    setGlobalError(message);

    setTimeout(() => {
      setGlobalError(null);
    }, 3000);
  };

  return (
    <UserContext.Provider value={{ globalError, user, friends, pendingRequests, incomingRequest, blocked, triggerError, login, logout, updateUser, sendFriendRequest, cancelRequest, acceptRequest, removeFriend, setFriends, blockUser, deblockUser, refreshFriendReq, gameSetting, updateGameSettings, notification }}>
      {children}
    </UserContext.Provider>
  );
}

export function useAuth() {
  return useContext(UserContext);
}
