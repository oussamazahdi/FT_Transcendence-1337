"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./authContext";

export type GameInvitePayload = {
  user: string | number;
  roomId: string;
  gameType: "pingpong";
};

export type InviteResponse = {
  ok: boolean;
  message?: string;
  notification?: string;
};

type ChatReceivePayload = {
  msgId: number | string;
  senderId: number | string;
  avatar?: string | null;
  content: string;
  sentAt: string;
};

type UsersStatusPayload = Array<string | number> | Record<string, boolean>;

type ServerToClientEvents = {
  "chat:receiver": (payload: ChatReceivePayload) => void;
  "chat:error": (err: { message: string } | string) => void;
  "match-started:accept": (payload: MatchStartedPayload) => void;
  "users:status": (payload: UsersStatusPayload) => void;
};

type ClientToServerEvents = {
  "chat:send": (payload: { receiverId: number | string; content: string; type: string}) => void;
	"game:invite": (payload: GameInvitePayload, ack?: (res: InviteResponse) => void) => void;
};

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

type NotificationsValue = {
  notifications: unknown[];
  setNotifications: Dispatch<SetStateAction<unknown[]>>;
};

type MatchRoomId = string | number;

type MatchStartedPayload = {
  roomId?: MatchRoomId;
  [key: string]: unknown;
};

type MatchValue = {
  activeMatch: ActiveMatch | null;
  setActiveMatch: Dispatch<SetStateAction<ActiveMatch | null>>;
};

type ActiveMatch = {
  roomId: MatchRoomId;
  payload: MatchStartedPayload | null;
  ts: number;
};

const SocketContext = createContext<SocketType | null>(null);
const NotificationsContext = createContext<NotificationsValue>({
  notifications: [],
  setNotifications: () => {},
});
const MatchContext = createContext<MatchValue>({
  activeMatch: null,
  setActiveMatch: () => {},
});

const OnlineStatusContext = createContext<Set<string>>(new Set());

interface SocketProviderProps {
  children: ReactNode;
}
type OnlineStatusPayload = Array<string | number> | Record<string, boolean> | null | undefined;

export function SocketProvider({ children }: SocketProviderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [notifications, setNotifications] = useState<unknown[]>([]);
  const [activeMatch, setActiveMatch] = useState<ActiveMatch | null>(null);

  const [onlineIds, setOnlineIds] = useState<string[]>([]);
  
  useEffect(() => {
    if (!user) {
      if (socket) socket.disconnect();
      setSocket(null);
      setNotifications([]);
      setActiveMatch(null);
      setOnlineIds([]);
      return;
    }

    const socketHolder: SocketType = io("http://localhost:3001", {
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const handleMatchStarted = (data: MatchStartedPayload | MatchRoomId) => {
      const roomId = typeof data === "string" || typeof data === "number" ? data : data?.roomId;
      if (!roomId) return;

      setActiveMatch({
        roomId,
        payload: typeof data === "object" ? data : null,
        ts: Date.now(),
      });

      router.push(`/game/pingPong/${roomId}`);
    };
    
    // function onNewNotification(notif){
    //   console.log("**** notif:", notif);
    //   setNotifications((prev)=> [notif, ...prev])
    // }

    // socketHolder.on("notification:new", onNewNotification);
    socketHolder.on("match-started:accept", handleMatchStarted);

    //handle OnlineStatus
    const onUsersStatus = (data: OnlineStatusPayload) => {
      if (Array.isArray(data)) {
        const ids = data
          .filter((id) => typeof id === "string" || typeof id === "number")
          .map((id) => String(id));
        setOnlineIds(ids);
      } else {
        setOnlineIds([]);
      }
    };
    socketHolder.on("users:status", onUsersStatus);
    setSocket(socketHolder);
    return () => {
      // socketHolder.off("notification:new", onNewNotification);
      socketHolder.off("match-started:accept", handleMatchStarted);
      socketHolder.off("users:status", onUsersStatus);
      socketHolder.disconnect();
      setSocket(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const notifValue = useMemo(
    () => ({ notifications, setNotifications }),
    [notifications]
  );

  const matchValue = useMemo(
    () => ({ activeMatch, setActiveMatch }),
    [activeMatch]
  );

    const onlineSet = useMemo(() => new Set(onlineIds),[onlineIds]);

  return (
    <SocketContext.Provider value={socket}>
      <NotificationsContext.Provider value={notifValue}>
        <MatchContext.Provider value={matchValue}>
          <OnlineStatusContext.Provider value={onlineSet}>
            {children}
          </OnlineStatusContext.Provider>
        </MatchContext.Provider>
      </NotificationsContext.Provider>
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

export function useNotifications() {
  return useContext(NotificationsContext);
}

export function useMatch() {
  return useContext(MatchContext);
}

export function useStatus() {
  return useContext(OnlineStatusContext)
}