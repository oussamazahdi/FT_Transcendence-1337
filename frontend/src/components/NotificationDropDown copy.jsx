
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useSocket } from "@/contexts/socketContext";
import { assets } from "@/assets/data";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";


const safeAvatarSrc = (src) => (src && src !== "null" ? src : assets.defaultProfile);

const SafeAvatar = ({ src, alt = "avatar" }) => {
  return (
    <Image src={safeAvatarSrc(src)} alt={alt} width={36} height={36} className="w-9 h-9 rounded-3 object-cover shrink-0"/>
  );
};

const MessageNotif = ({ notif }) => {
  const username = notif?.user?.username || "Unknown";
  const avatar = notif?.user?.avatar;

  return (
    <div className="bg-[#414141]/60 p-2 flex gap-2 rounded-4 cursor-pointer hover:bg-[#414141] transition">
      <SafeAvatar src={avatar} />
      <div className="flex flex-col flex-1 min-w-0">
        <p className="text-[9px] truncate text-white">{username} sent you a message:</p>
        <p className="text-[8px] truncate text-[#929292]">{notif?.message || ""}</p>
      </div>
    </div>
  );
};

const FriendInvite = ({ notif, onAccept, onReject }) => {
  const username = notif?.user?.username || "Unknown";
  const avatar = notif?.user?.avatar;

  return (
    <div className="bg-[#414141]/60 p-2 flex gap-2 rounded-4 hover:bg-[#414141] transition">
      <SafeAvatar src={avatar} />
      <div className="flex flex-col flex-1 items-start min-w-0">
        <p className="text-[9px] truncate text-white">{username} sent you a friend invitation</p>

        {notif?.status === "pending" ? (
          <div className="flex mt-1 gap-2">
            <button onClick={(e) => {
                e.stopPropagation();
                onReject?.(notif.id);
              }} className="bg-[#442222] text-[#FF4848] hover:bg-[#3C1C1C] text-[8px] px-2 py-2 rounded">
              Reject
            </button>

            <button onClick={(e) => {
                e.stopPropagation();
                onAccept?.(notif.id);
              }} className="bg-[#1E3A2F] text-[#4DFFB3] hover:bg-[#162A22] text-[8px] px-2 py-2 rounded">
              Accept
            </button>
          </div>
        ) : (
          <span className="mt-1 text-[8px] text-white/40">Invitation expired</span>
        )}
      </div>
    </div>
  );
};
/*************************************************************************************** */
/**
 * 
 * @notification_id
 * @sender_id
 * @sender_socket_id
 * @receiver_id
 * @receiver_socket_id
 * @room_id
 * 
 */

// async function onAccept(notifId, socket) {

// 	if(!socket) return;
// 	if(!socket.connected) socket.connect();

// 	const id = Number(notifId);
// 	if (!Number.isInteger(id) || id <= 0) return ;

// 	const base = process.env.NEXT_PUBLIC_API_URL;
//   if (!base) {
//     console.error("Missing Backend API url");
//     return ;
//   }

// 	let res;
// 	try{
// 		res = await fetch(`${base}/api/notifications/${id}`, { method: "GET", credentials: "include", headers: { Accept: "application/json" } });
// 	} catch (error) {
// 		console.error(`fetch data from ${base}/api/notifications/${id} failed:`, error);
// 		return ;
// 	}

// 	if (!res.ok) return ;

// 	let notif;
// 	try{
// 		const notifObj = await res.json()
// 		notif = notifObj.notif;
// 		if (!notif) throw new Error("different API response shapes")
// 	} catch(error) {
// 		console.log("Invalid JSON response:", error);
// 		return ;
// 	}

// 	if (notif?.status !== "pending") return ;

// 	const roomId = notif?.payload?.roomId;
//   if (!roomId || typeof roomId !== "string") return ;


//   const senderId = Number(notif?.sender_id);
//   const receiverId = Number(notif?.receiver_id);

//   if (!Number.isInteger(senderId) || senderId <= 0 || senderId === receiverId) return;
//   if (!Number.isInteger(receiverId) || receiverId <= 0 || senderId === receiverId) return;






// 	socket.emit("game:accept", {});
// }

async function onAccept(notifId, socket) {
	
  if (!socket) return;
  if (!socket.connected) socket.connect();

  const id = Number(notifId);
  if (!Number.isInteger(id) || id <= 0) return;

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    console.error("Missing Backend API url");
    return;
  }

  let notif;
  try {
    const res = await fetch(`${base}/api/notifications/${id}`, { method: "GET", credentials: "include", headers: { Accept: "application/json" },});
    if (!res.ok) return;

    const data = await res.json();
    notif = data?.notif;
    if (!notif) throw new Error("Unexpected API response shape");
  } catch (err) {
    console.error("Failed to load notification:", err);
    return;
  }

  if (notif?.status !== "pending") return;

  const roomId = notif?.payload?.roomId;
  if (typeof roomId !== "string" || roomId.length === 0) return;

  const senderId = Number(notif?.sender_id);
  const receiverId = Number(notif?.receiver_id);
  if (!Number.isInteger(senderId) || senderId <= 0) return;
  if (!Number.isInteger(receiverId) || receiverId <= 0) return;
  if (senderId === receiverId) return;

  try {
    const res = await fetch(`${base}/api/notifications/${id}/action`, {method: "POST", credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ action: "accept" }),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      console.error("Accept failed:", res.status, msg);
      return;
    }
  } catch (err) {
    console.error("Accept request failed:", err);
    return;
  }

  socket.emit("game:accept",{ notifId: id, roomId },
    (ack) => {
      if (!ack?.ok) {
        console.error("Socket accept failed:", ack?.error || ack);
        return;
      }
      // optional: navigate or update UI here
      // router.push(`/game/${roomId}`);
    }
  );
}






	/*************************************************************************************** */

const GameInvite = ({ notif, onAccept, onReject }) => {
  const username = notif?.user?.username || "Unknown";
  const avatar = notif?.user?.avatar;

  const isExpiredByTime =
    notif?.expires_at ? Date.now() > new Date(notif.expires_at).getTime() : false;

  const isPending = notif?.status === "pending" && !isExpiredByTime;

  return (
    <div className="bg-[#262626]/60 p-2 flex gap-2 rounded-md hover:bg-[#303030]/60 transition">
      <SafeAvatar src={avatar} />
			<div className="flex flex-col flex-1 items-start min-w-0">
        <p className="text-[9px] text-white truncate">{username} invited you to a Ping Pong game</p>

        {isPending ? (
          <div className="flex mt-1 gap-2">
            <button onClick={(e) => {
                e.stopPropagation();
                onReject?.(notif.id);
              }} className="bg-[#442222] text-[#FF4848] hover:bg-[#3C1C1C] text-[8px] px-2 py-1 rounded">Reject</button>

            <button onClick={(e) => {
                e.stopPropagation();
                onAccept?.(notif.id);
              }} className="bg-[#1E3A2F] text-[#4DFFB3] hover:bg-[#162A22] text-[8px] px-2 py-1 rounded">Accept</button>
          </div>
				) : (
          <span className="mt-1 text-[8px] text-white/40">Invitation {notif?.status}</span>
        )}
      </div>
    </div>
  );
};

const NOTIFICATION_COMPONENTS = {
  game_invite: GameInvite,
  friend_invite: FriendInvite,
  friend_request: FriendInvite,
  message: MessageNotif,
};

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

export async function fetchUnreadNotificationsCount() {
  const { res, data } = await fetchJson(`${API}/api/notifications/unread-count`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) return 0;
  return Number(data?.unreadCount ?? 0);
}




































export default function NotificationDropDown() {

	const socket = useSocket();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [usersById, setUsersById] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const ref = useRef(null);

	/********************************************************************************************************************** */
  const fetchUserById = useCallback(async (id) => {
    if (!id) return null;

    const { res, data } = await fetchJson(`${API}/api/users/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return null;
    return data?.userData ?? null;
  }, []);

	/********************************************************************************************************************** */
  const normalizeNotif = useCallback((raw, senderUser) => {
    return {
      ...raw,
      user: senderUser ?? raw.user ?? null,
    };
  }, []);

	/********************************************************************************************************************** */
  const fetchNotifications = useCallback(async () => {
    const { res, data } = await fetchJson(`${API}/api/notifications`, {
      method: "GET",
      credentials: "include",
    });

    if (res.status === 401 || !res.ok) return null;
    return Array.isArray(data?.userData) ? data.userData : [];
  }, []);



  // Click outside to close (only when open)
	/********************************************************************************************************************** */
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Load unread count on mount
	/********************************************************************************************************************** */
  useEffect(() => {
    (async () => {
      try {
        const count = await fetchUnreadNotificationsCount();
        setUnreadCount(count);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Socket: new notification
	/********************************************************************************************************************** */
  useEffect(() => {
    if (!socket) return;

    const onNewNotification = async (raw) => {
      try {
        setUnreadCount((p) => p + 1);

        // fetch sender user if missing
        const senderId = raw?.sender_id;
        let user = usersById[senderId];

        if (!user && senderId) {
          user = await fetchUserById(senderId);
          if (user) setUsersById((prev) => ({ ...prev, [senderId]: user }));
        }

        const normalized = normalizeNotif(raw, user);

        setNotifications((prev) => {
          // avoid duplicates by id
          if (prev.some((n) => n.id === normalized.id)) return prev;
          return [normalized, ...prev];
        });
      } catch (e) {
        console.error(e);
      }
    };

    socket.on("notification:new", onNewNotification);
    return () => socket.off("notification:new", onNewNotification);
  }, [socket, fetchUserById, normalizeNotif, usersById]);

	/********************************************************************************************************************** */
  const onAction = useCallback(async (id, action) => {
    // action: "accept" | "reject"
    try {
      const { res } = await fetchJson(`${API}/api/notifications/${id}/action`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      // even if backend returns something else, we update UI
      if (!res.ok) return;

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: action === "accept" ? "accepted" : "rejected" } : n
        )
      );
    } catch (e) {
      console.error(e);
    }
  }, []);

	/********************************************************************************************************************** */
  const onAccept = useCallback((id) => onAction(id, "accept"), [onAction]);
  const onReject = useCallback((id) => onAction(id, "reject"), [onAction]);

	/********************************************************************************************************************** */
  const renderNotifications = useMemo(() => {
    return notifications
      .map((notif) => {
        const Cmp = NOTIFICATION_COMPONENTS[notif.type];
        if (!Cmp) return null;
        return <Cmp key={notif.id} notif={notif} onAccept={onAccept} onReject={onReject} />;
      })
      .filter(Boolean);
  }, [notifications, onAccept, onReject]);

	/********************************************************************************************************************** */
	const resolveUsersForNotifs = useCallback(
		async (list) => {
			const senderIds = [...new Set(list.map((notif) => notif.sender_id).filter(Boolean))];
			const missing = senderIds.filter((id) => usersById[id] == null);
			
			if (missing.length === 0) return usersById;
			const results = await Promise.all(missing.map((id) => fetchUserById(id)));
			const next = { ...usersById };
			
			missing.forEach((id, idx) => {
				if (results[idx])
					next[id] = results[idx];
			});

			setUsersById(next);
			return next;
		},
		[fetchUserById, usersById]
	);

	/********************************************************************************************************************** */
  const onBellClick = useCallback(async () => {
    setLoading(true);

    try {
      const list = await fetchNotifications();
      if (!list) {
        setIsOpen(false);
        return;
      }

      const nextUsers = await resolveUsersForNotifs(list);

      const normalized = list.map((raw) => normalizeNotif(raw, nextUsers[raw.sender_id]));
      setNotifications(normalized);

      setUnreadCount(0);
      setIsOpen((v) => !v);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [fetchNotifications, normalizeNotif, resolveUsersForNotifs]);
	/********************************************************************************************************************** */

  return (
    <div ref={ref} className="relative hidden md:block">
      <button onClick={onBellClick} className="md:border border-[#9D9D9D]/40 rounded-[10px] md:p-3 hover:bg-[#000000]/40 cursor-pointer hover:scale-105 active:scale-95 transition relative">
        <BellAlertIcon className="h-5 w-5 text-white/60" />
        {unreadCount > 0 && (<span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">{unreadCount}</span>)}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 max-h-[256px] bg-[#0F0F0F]/75 rounded-[10px] flex flex-col gap-1 p-2 overflow-y-auto z-50 custom-scrollbar min-w-[260px]">
          {loading ? (<p className="text-[10px] text-white/60 text-center py-4">Loading...</p>) : notifications.length > 0 ? (renderNotifications) : (<p className="text-[10px] text-white/60 text-center py-4">No notifications</p>)}
        </div>
      )}
    </div>
  );
}




