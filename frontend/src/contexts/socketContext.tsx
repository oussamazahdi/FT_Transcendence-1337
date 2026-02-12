"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./authContext";

/**
 * Types
 */

type MatchRoomId = string;

type MatchStartedPayload = {
  roomId: MatchRoomId;
  [key: string]: string;
};

type ActiveMatch = {
  roomId: MatchRoomId;
  payload: MatchStartedPayload | null;
  ts: number;
};

type MatchValue = {
  activeMatch: ActiveMatch | null;
  setActiveMatch: Dispatch<SetStateAction<ActiveMatch | null>>;
};

type NotificationsValue = {
  notifications: unknown[];
  setNotifications: Dispatch<SetStateAction<unknown[]>>;
};

type ChatReceivePayload = {
  msgId: number | string;
  senderId: number | string;
  avatar?: string | null;
  content: string;
  sentAt: string;
};

type UsersStatusPayload = Array<string | number> | Record<string, boolean>;

export type InviteResponse = {
  ok: boolean;
  message?: string;
  notification?: string;
};

export type GameInvitePayload = {
  user: string | number;
  roomId: string;
  gameType: "pingpong";
};

/**
 * Server -> Client events
 */
type ServerToClientEvents = {
  "chat:receiver": (payload: ChatReceivePayload) => void;
  "chat:error": (err: { message: string } | string) => void;
  "match-started:accept": (payload: MatchStartedPayload | MatchRoomId) => void;
  "users:status": (payload: UsersStatusPayload) => void;
};

/**
 * Client -> Server events
 */
type ClientToServerEvents = {
  "chat:send": (payload: { receiverId: number | string; content: string }) => void;
  "game:invite": (payload: GameInvitePayload, ack?: (res: InviteResponse) => void) => void;
};

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * Contexts
 */

const SocketContext = createContext<SocketType | null>(null);

const NotificationsContext = createContext<NotificationsValue>({
  notifications: [],
  setNotifications: () => {},
});

const MatchContext = createContext<MatchValue>({
  activeMatch: null,
  setActiveMatch: () => {},
});

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [socket, setSocket] = useState<SocketType | null>(null);
  const [notifications, setNotifications] = useState<unknown[]>([]);
  const [activeMatch, setActiveMatch] = useState<ActiveMatch | null>(null);

  const socketRef = useRef<SocketType | null>(null);

  const socketUrl = useMemo(() => process.env.NEXT_PUBLIC_SOCKET_URL, []);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setActiveMatch(null);

      socketRef.current?.disconnect();
      socketRef.current = null;

      setSocket(null);
      return;
    }

    if (socketRef.current) {
      setSocket(socketRef.current);
      return;
    }

    const socketHolder: SocketType = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 100,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socketRef.current = socketHolder;
    setSocket(socketHolder);

    const handleMatchStarted = (data: MatchStartedPayload | MatchRoomId) => {
      const roomId: MatchRoomId  = typeof data === "string" ? String(data) : data?.roomId;

      if (!roomId) return;

      setActiveMatch({
        roomId,
        payload: typeof data === "object" && data !== null ? data : null,
        ts: Date.now(),
      });

      router.push(`/game/pingPong/${roomId}`);
    };

    socketHolder.on("match-started:accept", handleMatchStarted);

    return () => {
      socketHolder.off("match-started:accept", handleMatchStarted);
      socketHolder.disconnect();

      socketRef.current = null;
      setSocket(null);
    };
  }, [user, router, socketUrl]);

  const notifValue = useMemo(
    () => ({ notifications, setNotifications }),
    [notifications]
  );

  const matchValue = useMemo(
    () => ({ activeMatch, setActiveMatch }),
    [activeMatch]
  );

  return (
    <SocketContext.Provider value={socket}>
      <NotificationsContext.Provider value={notifValue}>
        <MatchContext.Provider value={matchValue}>{children}</MatchContext.Provider>
      </NotificationsContext.Provider>
    </SocketContext.Provider>
  );
}

/**
 * Hooks
 */

export function useSocket(): SocketType | null {
  return useContext(SocketContext);
}

export function useNotifications(): NotificationsValue {
  return useContext(NotificationsContext);
}

export function useMatch(): MatchValue {
  return useContext(MatchContext);
}
