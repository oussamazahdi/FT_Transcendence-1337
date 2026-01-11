// "use client";

// import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
// import { BellAlertIcon } from "@heroicons/react/24/outline";
// import Image from "next/image";
// import { assets } from "@/assets/data";
// import { useSocket } from "@/contexts/socketContext";
// import { use } from "react";

// const SafeAvatar = ({ src, alt }) => {
//   const safeSrc = src && src !== "null" ? src : assets.defaultProfile;
//   return (
//     <Image
//       src={safeSrc}
//       alt={alt || "avatar"}
//       width={36}
//       height={36}
//       className="rounded-[6px] object-cover"
//     />
//   );
// };

// const GameInvite = ({ notif, onAccept, onReject }) => {
//   const username = notif?.user?.username || "Unknown";
//   const avatar = notif?.user?.avatar;

//   return (
//     <div className="bg-[#414141]/60 p-2 flex gap-2 rounded-[8px] cursor-pointer hover:bg-[#414141] transition">
//       <div className="flex-shrink-0">
//         <SafeAvatar src={avatar} alt="avatar" />
//       </div>

//       <div className="flex flex-col flex-1 items-start">
//         <p className="text-[9px] text-white">
//           {username} invited you to Ping Pong game
//         </p>

//         <div className="flex mt-1 gap-2">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onReject?.(notif.id);
//             }}
//             className="bg-[#442222] text-[#FF4848] hover:bg-[#3C1C1C] text-[8px] px-2 py-[2px] rounded"
//           >
//             Reject
//           </button>

//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onAccept?.(notif.id);
//             }}
//             className="bg-[#1E3A2F] text-[#4DFFB3] hover:bg-[#162A22] text-[8px] px-2 py-[2px] rounded"
//           >
//             Accept
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MessageNotif = ({ notif }) => {
//   const username = notif?.user?.username || "Unknown";
//   const avatar = notif?.user?.avatar;

//   return (
//     <div className="bg-[#414141]/60 p-2 flex gap-2 rounded-[8px] cursor-pointer hover:bg-[#414141] transition">
//       <SafeAvatar src={avatar} alt="avatar" />
//       <div className="flex flex-col flex-1 min-w-0">
//         <p className="text-[9px] truncate text-white">{username} sent you a message:</p>
//         <p className="text-[8px] truncate text-[#929292]">{notif?.message || ""}</p>
//       </div>
//     </div>
//   );
// };

// const FriendInvite = ({ notif, onAccept, onReject }) => {
//   const username = notif?.user?.username || "Unknown";
//   const avatar = notif?.user?.avatar;

//   return (
//     <div className="bg-[#414141]/60 p-2 flex gap-2 rounded-[8px] cursor-pointer hover:bg-[#414141] transition">
//       <SafeAvatar src={avatar} alt="avatar" />
//       <div className="flex flex-col flex-1 items-start">
//         <p className="text-[9px] truncate text-white">
//           {username} sent you a friend invitation
//         </p>

//         <div className="flex mt-1 gap-2">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onReject?.(notif.id);
//             }}
//             className="bg-[#442222] text-[#FF4848] hover:bg-[#3C1C1C] text-[8px] px-2 py-[2px] rounded"
//           >
//             Reject
//           </button>

//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onAccept?.(notif.id);
//             }}
//             className="bg-[#1E3A2F] text-[#4DFFB3] hover:bg-[#162A22] text-[8px] px-2 py-[2px] rounded"
//           >
//             Accept
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const NOTIFICATION_COMPONENTS = {
//   game_invite: GameInvite,
//   friend_invite: FriendInvite,
//   friend_request: FriendInvite,
//   message: MessageNotif,
// };

// function safeParsePayload(payload) {
//   if (payload == null) return null;
//   if (typeof payload === "object") return payload;
//   try {
//     return JSON.parse(payload);
//   } catch {
//     return null;
//   }
// }

// function normalizeBackendNotif(raw, senderUser) {
//   const user = senderUser || {
//     id: raw.sender_id ?? "unknown",
//     username: "Unknown",
//     avatar: assets.defaultProfile,
//   };

//   return {
//     id: String(raw.id),
//     type: raw.type,
//     title: raw.title ?? "",
//     message: raw.message ?? "",
//     status: raw.status ?? "pending",
//     is_read: raw.is_read ?? 0,
//     created_at: raw.created_at ?? null,
//     expires_at: raw.expires_at ?? null,
//     payload: safeParsePayload(raw.payload),
//     sender_id: raw.sender_id,
//     receiver_id: raw.receiver_id,
//     user,
//   };
// }

// const NotificationDropDown = () => {
//   const socket = useSocket();

//   const [isOpen, setIsOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [usersById, setUsersById] = useState({});
//   const ref = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const fetchUserById = useCallback(async (id) => {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
//       credentials: "include",
//     });
//     const data = await res.json().catch(() => ({}));
//     if (!res.ok) return null;

//     const u = data?.userData;
//     if (!u) return null;

//     return {
//       id: u.id,
//       username: u.username ?? "Unknown",
//       avatar: u.avatar ?? assets.defaultProfile,
//     };
//   }, []);

//   const fetchNotifications = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
//         credentials: "include",
//       });
//       const data = await res.json().catch(() => ({}));

//       if (res.status === 401) {
//         setIsOpen(false);
//         setLoading(false);
//         return;
//       }
//       if (!res.ok) {
//         setLoading(false);
//         return;
//       }

//       const list = Array.isArray(data?.userData) ? data.userData : [];
//       const senderIds = [...new Set(list.map((n) => n.sender_id).filter(Boolean))];
//       const missing = senderIds.filter((id) => usersById[id] == null);

//       if (missing.length > 0) {
//         const results = await Promise.all(missing.map((id) => fetchUserById(id)));
//         setUsersById((prev) => {
//           const next = { ...prev };
//           missing.forEach((id, idx) => {
//             const u = results[idx];
//             if (u) next[id] = u;
//           });
//           return next;
//         });
//       }

//       setNotifications(list.map((raw) => normalizeBackendNotif(raw, usersById[raw.sender_id])));
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//     }
//   }, [usersById, fetchUserById]);

//   // ✅ When we later learn user info, update "Unknown" entries
//   useEffect(() => {
//     setNotifications((prev) =>
//       prev.map((n) => {
//         const sender = n.sender_id;
//         if (!sender) return n;
//         const u = usersById[sender];
//         if (!u) return n;
//         if (n.user?.username && n.user.username !== "Unknown") return n;
//         return { ...n, user: u };
//       })
//     );
//   }, [usersById]);

//   const handleAccept = (notifId) => setNotifications((prev) => prev.filter((n) => n.id !== notifId));
//   const handleReject = (notifId) => setNotifications((prev) => prev.filter((n) => n.id !== notifId));

//   // ✅ IMPORTANT: this is what makes the badge update instantly
//   const onNewNotification = useCallback(
//     async (rawNotif) => {
//       if (!rawNotif?.id) return;

//       const id = String(rawNotif.id);
//       const senderId = rawNotif.sender_id;

//       // fetch missing sender user (optional)
//       if (senderId && usersById[senderId] == null) {
//         const u = await fetchUserById(senderId);
//         if (u) setUsersById((prev) => ({ ...prev, [senderId]: u }));
//       }

//       setNotifications((prev) => {
//         if (prev.some((n) => n.id === id)) return prev;

//         const normalized = normalizeBackendNotif(rawNotif, usersById[senderId]);

//         // ✅ ensure it increases unreadCount
//         normalized.is_read = 0;

//         return [normalized, ...prev];
//       });
//     },
//     [usersById, fetchUserById]
//   );

//   // ✅ Register socket listener once + cleanup
//   useEffect(() => {
//     if (!socket) return;
//     socket.on("notification:new", onNewNotification);
//     return () => socket.off("notification:new", onNewNotification);
//   }, [socket, onNewNotification]);

//   const renderNotifications = useMemo(() => {
//     return notifications
//       .map((notif) => {
//         const SpecificComponent = NOTIFICATION_COMPONENTS[notif.type];
//         if (!SpecificComponent) return null;
//         return (
//           <SpecificComponent
//             key={notif.id}
//             notif={notif}
//             onAccept={handleAccept}
//             onReject={handleReject}
//           />
//         );
//       })
//       .filter(Boolean);
//   }, [notifications]);

//   const onBellClick = async () => {
//     const nextOpen = !isOpen;
//     setIsOpen(nextOpen);
//     if (nextOpen) await fetchNotifications();
//   };

//   // ✅ badge uses unread notifications
//   const unreadCount = notifications.reduce((acc, n) => acc + (n.is_read ? 0 : 1), 0);

//   return (
//     <div ref={ref} className="relative hidden md:block">
//       <button
//         onClick={onBellClick}
//         className="md:border border-[#9D9D9D]/40 rounded-[10px] md:p-3 hover:bg-[#000000]/40 cursor-pointer hover:scale-105 active:scale-95 transition relative"
//       >
//         <BellAlertIcon className="h-5 w-5 text-white/60" />
//         {unreadCount > 0 && (<span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">{unreadCount}</span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 top-full mt-2 max-h-[256px] bg-[#0F0F0F]/75 rounded-[10px] flex flex-col gap-1 p-2 overflow-y-auto z-50 custom-scrollbar min-w-[260px]">
//           {loading ? (
//             <p className="text-[10px] text-white/60 text-center py-4">Loading...</p>
//           ) : notifications.length > 0 ? (
//             renderNotifications
//           ) : (
//             <p className="text-[10px] text-white/60 text-center py-4">No notifications</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationDropDown;


















"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BellAlertIcon } from "@heroicons/react/24/outline";

export async function fetchUnreadNotificationsCount() {
	const res = await fetch("http://localhost:3001/api/notifications/unread-count", {
		method: "GET",
		credentials: "include",
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		return (err);
	}

	const data = await res.json().catch(() => ({}));
	return Number(data?.unreadCount ?? 0);
}

export default function NotificationDropDown() {
	const ref = useRef(null);

	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [usersById, setUsersById] = useState({});
	const [unreadCount, setUnreadCount] = useState(0);
	const [notifications, setNotifications] = useState([]);

	const fetchUserById = useCallback(async (id) => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, { credentials: "include" });
		if (!res.ok) return null;

		const data = await res.json().catch(() => ({}));
		const user = data?.userData;

		return user ?? null;
	}, []);

	const normalizeBackendNotif = useCallback((raw, senderUser) => {
		return { ...raw,
			user: senderUser ?? null,
		};
	}, []);

	const fetchNotifications = useCallback(async () => {
		const res = await fetch("http://localhost:3001/api/notifications", { credentials: "include" });
		const data = await res.json().catch(() => ({}));

		if (res.status === 401 || !res.ok) {
			setIsOpen(false);
			setLoading(false);
			return null;
		}

		return Array.isArray(data?.userData) ? data.userData : [];
	}, []);

	const loadUnreadCount = useCallback(async () => {
		try {
			const count = await fetchUnreadNotificationsCount();
			setUnreadCount(count);
		} catch (error) {
			console.error(error);
		}
	}, []);

	useEffect(() => {
		loadUnreadCount();
	}, [loadUnreadCount]);

	const onBellClick = useCallback(async () => {
		setLoading(true);
		try {
			const list = await fetchNotifications();
			if (!list) return;

			const senderIds = [...new Set(list.map((n) => n.sender_id).filter(Boolean))];
			const missing = senderIds.filter((id) => usersById[id] == null);

			let nextUsersById = usersById;

			if (missing.length > 0) {
				const results = await Promise.all(missing.map((id) => fetchUserById(id)));

				nextUsersById = { ...usersById };
				missing.forEach((id, idx) => {
					const u = results[idx];
					if (u) nextUsersById[id] = u;
				});

				setUsersById(nextUsersById);
			}

			const normalized = list.map((raw) =>
				normalizeBackendNotif(raw, nextUsersById[raw.sender_id])
			);

			setNotifications(normalized);
			setUnreadCount(0);
			setIsOpen((v) => !v);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, [fetchNotifications, fetchUserById, normalizeBackendNotif, usersById, unreadCount]);

	return (
		<div ref={ref} className="relative hidden md:block">
			<button
				onClick={onBellClick}
				className="md:border border-[#9D9D9D]/40 rounded-[10px] md:p-3 hover:bg-[#000000]/40 cursor-pointer hover:scale-105 active:scale-95 transition relative"
			>
				<BellAlertIcon className="h-5 w-5 text-white/60" />
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
						{unreadCount}
					</span>
				)}
			</button>

			{/* Dropdown UI (optional; your original was commented) */}
			{isOpen && (
  <div className="absolute right-0 top-full mt-2 max-h-[256px] bg-[#0F0F0F]/75 rounded-[10px] flex flex-col gap-1 p-2 overflow-y-auto z-50 custom-scrollbar min-w-[260px]">
    {loading ? (
      <p className="text-[10px] text-white/60 text-center py-4">
        Loading...
      </p>
    ) : notifications.length > 0 ? (
      notifications.map((n) => (
        <div
          key={n.id}
          className="p-2 rounded bg-white/5 flex gap-2 items-start"
        >
          <img
            src={n.user?.avatar}
            alt={n.user?.username}
						className="w-11 h-11 rounded-md"
          />

          <div className="flex flex-col">
            <div className="text-xs text-white/80">
              {n.title}
            </div>
            <div className="text-[10px] text-white/60">
              {n.message}
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-[10px] text-white/60 text-center py-4">
        No notifications
      </p>
    )}
  </div>
)}

		</div>
	);
}
