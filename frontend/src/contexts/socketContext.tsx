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
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./authContext";

type ChatReceivePayload = {
  msgId: number | string;
  senderId: number | string;
  avatar?: string | null;
  content: string;
  sentAt: string;
};

type ServerToClientEvents = {
  "chat:receiver": (payload: ChatReceivePayload) => void;
  "chat:error": (err: { message: string } | string) => void;
};

type ClientToServerEvents = {
  "chat:send": (payload: { receiverId: number | string; content: string }) => void;
};

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

type NotificationsValue = {
  notifications: unknown[];
  setNotifications: Dispatch<SetStateAction<unknown[]>>;
};

const SocketContext = createContext<SocketType | null>(null);
const NotificationsContext = createContext<NotificationsValue>({
  notifications: [],
  setNotifications: () => {},
});

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [notifications, setNotifications] = useState<unknown[]>([]);

  useEffect(() => {
    if (!user) {
      if (socket) socket.disconnect();
      setSocket(null);
      setNotifications([]);
      return;
    }

    const socketHolder: SocketType = io(process.env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    // function onNewNotification(notif){
    //   console.log("**** notif:", notif);
    //   setNotifications((prev)=> [notif, ...prev])
    // }

    // socketHolder.on("notification:new", onNewNotification);

    setSocket(socketHolder);

    return () => {
      // socketHolder.off("notification:new", onNewNotification);
      socketHolder.disconnect();
      setSocket(null);
    };
  }, [user]);

  const notifValue = useMemo(
    () => ({ notifications, setNotifications }),
    [notifications]
  );

  return (
    <SocketContext.Provider value={socket}>
      <NotificationsContext.Provider value={notifValue}>
        {children}
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
