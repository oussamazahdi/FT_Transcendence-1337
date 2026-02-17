"use client";
import { useState, useContext, createContext, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { USER_ERROR } from "@/lib/utils.ts";
import { User, fullUser } from "@/types/index"
import { autofetch } from "@/lib/api";


interface UserCtxValue {
  user: User | null;
  friends: any[];
  blocked: any[];
  pendingRequests: any[];
  incomingRequest: any[];
  gameSetting: any[];
  globalError: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  triggerError: (message: string) => void;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  updateUser: (newData: Partial<User>) => void;
  sendFriendRequest: (user: any) => Promise<void>;
  cancelRequest: (user: any) => Promise<void>;
  acceptRequest: (user: any) => Promise<void>;
  removeFriend: (user: any) => Promise<void>;
  blockUser: (user: any) => Promise<void>;
  unblockUser: (user: any) => Promise<void>;
  refreshFriendReq: () => Promise<void>;
  updateGameSettings: (data: any) => Promise<any>;
  setFriends: React.Dispatch<React.SetStateAction<any[]>>;
  notification:any
  setNotification:React.Dispatch<React.SetStateAction<any[]>>;
  blockers:any
}
interface UserProviderProps {
  children: ReactNode,
  initialUser?: fullUser | null,
}

const UserCtx = createContext<UserCtxValue | undefined>(undefined);

export function UserProvider({ children, initialUser }: UserProviderProps) {

  const [user, setUser] = useState<User | null>(initialUser?.userData || null);
  const [friends, setFriends] = useState<any[]>(initialUser?.friends || []);
  const [blocked, setBlocked] = useState<any[]>(initialUser?.blocked || []);
  const [pendingRequests, setPendingRequests] = useState<any[]>(initialUser?.pendingRequests || []);
  const [incomingRequest, setIncomingRequests] = useState<any[]>(initialUser?.incomingRequests || []);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [gameSetting, setGameSetting] = useState<any>(initialUser?.gameSetting || [])
  const [notification, setNotification] = useState<any[]>(initialUser?.notification || []);
  const blockers = initialUser?.blockers
  const router = useRouter();

	const triggerError = useCallback((message: string) => {
    setGlobalError(message);

    setTimeout(() => {
      setGlobalError(null);
    }, 3000);
  }, []);

  const refreshFriendReq = useCallback(async () => {
    try {
      const [incomreqRes, pendReqRes, friendsRes, blockedRes, playerSettingsRes, notificationsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/requests`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/requests/sent`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/blocks`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/game/settings`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, { credentials: "include" })

      ]);

      if (incomreqRes.ok) {
        const data = await incomreqRes.json();
        setIncomingRequests(data.requestsList || []);
      }

      if (pendReqRes.ok) {
        const data = await pendReqRes.json();
        setPendingRequests(data.Requests || []);
      }

      if (friendsRes.ok) {
        const data = await friendsRes.json();
        setFriends(data.friendList || []);
      }

      if (blockedRes.ok) {
        const data = await blockedRes.json();
        setBlocked(data.blockedUsers || []);
      }

      if (playerSettingsRes.ok) {
        const data = await playerSettingsRes.json();
        setGameSetting(data.settings || []);
      }

      if (notificationsRes.ok) {
        const data = await notificationsRes.json();
        setNotification(data?.userData || []);
      }

    } catch (err) {
      triggerError("An unexpected error occurred. Please try again.");
    }
  },[triggerError]);

  const login = (userData: User) => {
    setUser(userData);
    refreshFriendReq();
  };

  const logout = async () => {
    try {
      const response = await autofetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      

      if (!response.ok) 
        throw new Error("An unexpected error occurred. Please try again.")

      router.push("/");
      router.refresh();
      setUser(null);
      setFriends([]);
      setBlocked([]);
      setPendingRequests([]);
      setIncomingRequests([]);
      setGameSetting([]);
    } catch (err: any) {
      router.refresh()
    }
  };

  const updateUser = (newData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...newData } : null));
  };

  const sendFriendRequest = async (user: any) => {
    try {
      const response = await autofetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/requests/${user.id}`, {
        method: "POST",
        credentials: "include",
      })
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error)

      setPendingRequests((prev: any) => [...prev, user]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : typeof err === "string" ? err : "default";
      triggerError(USER_ERROR[msg] ?? USER_ERROR.default);
    }
  }

  const cancelRequest = async (user: any) => {
    try {
      const response = await autofetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/requests/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error)

      setPendingRequests(pendingRequests.filter((items: any) => items.id !== user.id));
      setIncomingRequests(incomingRequest.filter((items: any) => items.id !== user.id))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : typeof err === "string" ? err : "default";
      triggerError(USER_ERROR[msg] ?? USER_ERROR.default);
    }
  }

  const acceptRequest = async (user: any) => {
    try {
      const response = await autofetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/requests/${user.id}/accept`, {
        method: "POST",
        credentials: "include",
      })
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error)

      setFriends((prev: any) => [...prev, user]);
      setIncomingRequests(incomingRequest.filter((items: any) => items.id !== user.id))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : typeof err === "string" ? err : "default";
      triggerError(USER_ERROR[msg] ?? USER_ERROR.default);
    }
  }

  const removeFriend = async (user: any) => {
    try {
      const response = await autofetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error)

      setFriends(friends.filter((items: any) => items.id !== user.id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : typeof err === "string" ? err : "default";
      triggerError(USER_ERROR[msg] ?? USER_ERROR.default);
    }
  }

  const blockUser = async (user: any) => {
    try {
      const response = await autofetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/blocks/${user.id}`, {
        method: "POST",
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok)
        throw new Error(data.error)

      setBlocked((prev: any) => [...prev, user]);
      setFriends(friends.filter((items: any) => items.id !== user.id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : typeof err === "string" ? err : "default";
      triggerError(USER_ERROR[msg] ?? USER_ERROR.default);
    }
  }

  const unblockUser = async (user: any) => {
    try {
      const response = await autofetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/blocks/${user.id}`, {
        method: "DELETE",
        credentials: "include"
      })
      const data = await response.json()

      if (!response.ok)
        throw new Error(data.error)

      setBlocked(blocked.filter((items: any) => items.id !== user.id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : typeof err === "string" ? err : "default";
      triggerError(USER_ERROR[msg] ?? USER_ERROR.default);
    }
  }

  const updateGameSettings = async (data: any) => {
    try {
      const payload: Record<string, any> = {};
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

      const res = await autofetch(
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
    } catch (err: any) {
      return { ok: false, status: 0, error: err?.message || "NETWORK_ERROR" };
    }
  };

  return (
    <UserCtx.Provider
      value= {{globalError, user, friends, pendingRequests, incomingRequest, blocked, blockers, setUser, triggerError, login, logout, updateUser, sendFriendRequest, cancelRequest, acceptRequest, removeFriend, setFriends, blockUser, unblockUser, refreshFriendReq, gameSetting, updateGameSettings, notification, setNotification}}>
       { children }
    </UserCtx.Provider>
  );
}

export function useAuth() {
  const context = useContext(UserCtx);
  if (context === undefined) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
}