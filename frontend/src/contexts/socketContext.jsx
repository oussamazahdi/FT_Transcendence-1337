"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./authContext";

const SocketContext = createContext(null);
const NotificationsContext = createContext({ notifications: [], setNotifications: () => {} });


export function SocketProvider({ children }) {
	const { user } = useAuth();
	const [socket, setSocket] = useState(null);
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		if (!user) {
			if (socket) socket.disconnect();
			setSocket(null);
			setNotifications([]);
			return;
		}

		const socketHolder = io("http://localhost:3001", {
			withCredentials: true,
			transports: ["websocket"],
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
		});
		
		function onNewNotification(notif){
			console.log("**** notif:", notif);
			setNotifications((prev)=> [notif, ...prev])
		}

		socketHolder.on("notification:new", onNewNotification);

		setSocket(socketHolder);

		return () => {
			socketHolder.off("notification:new", onNewNotification);
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