// "use client";

// import { createContext, useContext, useEffect, useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { io } from "socket.io-client";
// import { useAuth } from "./authContext";

// const SocketContext = createContext(null);
// const NotificationsContext = createContext({ notifications: [], setNotifications: () => {} });

// const API = process.env.NEXT_PUBLIC_API_URL


// export function SocketProvider({ children }) {
//   const { user } = useAuth();

// 	const router = useRouter();
//   const [socket, setSocket] = useState(null);
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     if (!user) {
//       if (socket) socket.disconnect();
//       setSocket(null);
//       setNotifications([]);
//       return;
//     }

//     const socketHolder = io(API, {
//       withCredentials: true,
//       transports: ["websocket"],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

// 		const handleMatchStarted = roomId => {
// 			router.push(`/game/pingPong/${roomId}`);
//       router.refresh();
//     };
// 		socketHolder.on("match-started", handleMatchStarted);
    
//     // function onNewNotification(notif){
//     //   console.log("**** notif:", notif);
//     //   setNotifications((prev)=> [notif, ...prev])
//     // }

//     // socketHolder.on("notification:new", onNewNotification);

//     setSocket(socketHolder);

//     return () => {
//       // socketHolder.off("notification:new", onNewNotification);
// 			socketHolder.off("match-started", handleMatchStarted);
//       socketHolder.disconnect();
//       setSocket(null);
//     };
//   }, [user]);

//   const notifValue = useMemo(
//     () => ({ notifications, setNotifications }),
//     [notifications]
//   );

//   return (
//     <SocketContext.Provider value={socket}>
//       <NotificationsContext.Provider value={notifValue}>
//         {children}
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



"use client";

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { useAuth } from "./authContext";

const SocketContext = createContext(null);

const NotificationsContext = createContext({
  notifications: [],
  setNotifications: () => {},
});

// ✅ new
const MatchContext = createContext({
  activeMatch: null,
  setActiveMatch: () => {},
});

const API = process.env.NEXT_PUBLIC_API_URL;

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // ✅ new
  const [activeMatch, setActiveMatch] = useState(null);

  useEffect(() => {
    if (!user) {
      if (socket) socket.disconnect();
      setSocket(null);
      setNotifications([]);
      setActiveMatch(null);
      return;
    }

    const socketHolder = io("http://localhost:3001", {
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const handleMatchStarted = (data) => {
			const roomId = typeof data === "string" ? data : data?.roomId;
			if (!roomId) return;
		
			setActiveMatch({
				roomId,
				payload: typeof data === "object" ? data : null,
				ts: Date.now(),
			});
		
			router.push(`/game/pingPong/${roomId}`);
		};
		

    socketHolder.on("match-started:accept", handleMatchStarted);
    // socketHolder.on("match-started", handleMatchStarted);

    setSocket(socketHolder);

    return () => {
      socketHolder.off("match-started:accept", handleMatchStarted);
      // socketHolder.off("match-started", handleMatchStarted);
      socketHolder.disconnect();
      setSocket(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // keep this stable; don't include `router` or it can rebind listeners more often than needed

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
        <MatchContext.Provider value={matchValue}>
          {children}
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

// ✅ new
export function useMatch() {
  return useContext(MatchContext);
}
