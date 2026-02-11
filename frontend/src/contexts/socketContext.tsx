// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useMemo,
//   type Dispatch,
//   type ReactNode,
//   type SetStateAction,
// } from "react";
// import { useRouter } from "next/navigation";
// import { io, type Socket } from "socket.io-client";
// import { useAuth } from "./authContext";

// type ChatReceivePayload = {
//   msgId: number | string;
//   senderId: number | string;
//   avatar?: string | null;
//   content: string;
//   sentAt: string;
// };

// type UsersStatusPayload = Array<string | number> | Record<string, boolean>;

// type ServerToClientEvents = {
//   "chat:receiver": (payload: ChatReceivePayload) => void;
//   "chat:error": (err: { message: string } | string) => void;
//   "match-started:accept": (payload: MatchStartedPayload) => void;
//   "users:status": (payload: UsersStatusPayload) => void;
// };

// type ClientToServerEvents = {
//   "chat:send": (payload: { receiverId: number | string; content: string }) => void;
// };

// type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

// type NotificationsValue = {
//   notifications: unknown[];
//   setNotifications: Dispatch<SetStateAction<unknown[]>>;
// };

// type MatchRoomId = string | number;

// type MatchStartedPayload = {
//   roomId?: MatchRoomId;
//   [key: string]: unknown;
// };

// type MatchValue = {
//   activeMatch: ActiveMatch | null;
//   setActiveMatch: Dispatch<SetStateAction<ActiveMatch | null>>;
// };

// type ActiveMatch = {
//   roomId: MatchRoomId;
//   payload: MatchStartedPayload | null;
//   ts: number;
// };

// const SocketContext = createContext<SocketType | null>(null);
// const NotificationsContext = createContext<NotificationsValue>({
//   notifications: [],
//   setNotifications: () => {},
// });
// const MatchContext = createContext<MatchValue>({
//   activeMatch: null,
//   setActiveMatch: () => {},
// });

// interface SocketProviderProps {
//   children: ReactNode;
// }

// export function SocketProvider({ children }: SocketProviderProps) {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [socket, setSocket] = useState<SocketType | null>(null);
//   const [notifications, setNotifications] = useState<unknown[]>([]);
//   const [activeMatch, setActiveMatch] = useState<ActiveMatch | null>(null);

//   useEffect(() => {
//     if (!user) {
//       if (socket) socket.disconnect();
//       setSocket(null);
//       setNotifications([]);
//       setActiveMatch(null);
//       return;
//     }

//     const socketHolder: SocketType = io("http://localhost:3001", {
//       withCredentials: true,
//       transports: ["websocket"],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     const handleMatchStarted = (data: MatchStartedPayload | MatchRoomId) => {
//       const roomId =
//         typeof data === "string" || typeof data === "number"
//           ? data
//           : data?.roomId;
//       if (!roomId) return;

//       setActiveMatch({
//         roomId,
//         payload: typeof data === "object" ? data : null,
//         ts: Date.now(),
//       });

//       router.push(`/game/pingPong/${roomId}`);
//     };
    
//     // function onNewNotification(notif){
//     //   console.log("**** notif:", notif);
//     //   setNotifications((prev)=> [notif, ...prev])
//     // }

//     // socketHolder.on("notification:new", onNewNotification);
//     socketHolder.on("match-started:accept", handleMatchStarted);

//     setSocket(socketHolder);

//     return () => {
//       // socketHolder.off("notification:new", onNewNotification);
//       socketHolder.off("match-started:accept", handleMatchStarted);
//       socketHolder.disconnect();
//       setSocket(null);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user]);

//   const notifValue = useMemo(
//     () => ({ notifications, setNotifications }),
//     [notifications]
//   );

//   const matchValue = useMemo(
//     () => ({ activeMatch, setActiveMatch }),
//     [activeMatch]
//   );

//   return (
//     <SocketContext.Provider value={socket}>
//       <NotificationsContext.Provider value={notifValue}>
//         <MatchContext.Provider value={matchValue}>
//           {children}
//         </MatchContext.Provider>
//       </NotificationsContext.Provider>
//     </SocketContext.Provider>
//   );
// }

// export function useSocket() {
//   return useContext(SocketContext);
// }

// export function useNotifications() {
//   return useContext(NotificationsContext);
// }

// export function useMatch() {
//   return useContext(MatchContext);
// }



"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./authContext";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Types
 * ─────────────────────────────────────────────────────────────────────────────
 */

type MatchRoomId = string | number;

type MatchStartedPayload = {
  roomId?: MatchRoomId;
  [key: string]: unknown;
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
 * Server -> Client events (what you .on(...) in the client)
 */
type ServerToClientEvents = {
  "chat:receiver": (payload: ChatReceivePayload) => void;
  "chat:error": (err: { message: string } | string) => void;
  "match-started:accept": (payload: MatchStartedPayload | MatchRoomId) => void;
  "users:status": (payload: UsersStatusPayload) => void;

  // If your server emits a response event instead of ack, add it here:
  // "game:invite:result": (res: InviteResponse) => void;
};

/**
 * Client -> Server events (what you .emit(...) from the client)
 * NOTE: to support the "ack" callback, type the handler with an optional 2nd param.
 */
type ClientToServerEvents = {
  "chat:send": (payload: { receiverId: number | string; content: string }) => void;

  // ✅ supports both:
  // socket.emit("game:invite", payload)
  // socket.emit("game:invite", payload, (res) => ...)
  "game:invite": (payload: GameInvitePayload, ack?: (res: InviteResponse) => void) => void;

  // add more emits as needed:
  // "users:status": () => void;
};

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Contexts
 * ─────────────────────────────────────────────────────────────────────────────
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

  // Prefer env var so you can change per environment.
  // Example: NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
  const socketUrl = useMemo(() => process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001", []);

  useEffect(() => {
    // If user logs out, tear down everything
    if (!user) {
      setNotifications([]);
      setActiveMatch(null);

      setSocket((prev) => {
        prev?.disconnect();
        return null;
      });

      return;
    }

    const socketHolder: SocketType = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const handleMatchStarted = (data: MatchStartedPayload | MatchRoomId) => {
      const roomId: MatchRoomId | undefined =
        typeof data === "string" || typeof data === "number" ? data : data?.roomId;

      if (!roomId) return;

      setActiveMatch({
        roomId,
        payload: typeof data === "object" && data !== null ? data : null,
        ts: Date.now(),
      });

      router.push(`/game/pingPong/${roomId}`);
    };

    socketHolder.on("match-started:accept", handleMatchStarted);

    setSocket(socketHolder);

    return () => {
      socketHolder.off("match-started:accept", handleMatchStarted);
      socketHolder.disconnect();
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
 * ─────────────────────────────────────────────────────────────────────────────
 * Hooks
 * ─────────────────────────────────────────────────────────────────────────────
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
