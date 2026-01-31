"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSocket } from "@/contexts/socketContext";
import { assets } from "@/assets/data";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const safeAvatarSrc = (src) => (src && src !== "null" ? src : assets.defaultProfile);

const SafeAvatar = ({ src, alt = "avatar" }) => (
  <Image
    src={safeAvatarSrc(src)}
    alt={alt}
    width={36}
    height={36}
    className="w-9 h-9 rounded-[6px] object-cover shrink-0"
  />
);

function isExpired(notif) {
  if (!notif) return true;
  if (notif.is_expired === 1) return true;
  if (!notif.expires_at) return false;
  const t = new Date(notif.expires_at).getTime();
  return Number.isFinite(t) ? Date.now() > t : false;
}

async function fetchJson(url, options) {
  let res;
  try {
    res = await fetch(url, options);
  } catch (e) {
    return { res: null, data: null, error: e };
  }
  const data = await res.json().catch(() => null);
  return { res, data, error: null };
}

export async function fetchUnreadNotificationsCount() {
  const { res, data } = await fetchJson(`${API}/api/notifications/unread-count`, {
    method: "GET",
    credentials: "include",
  });

	console.log("data:",data);

  if (!res || !res.ok) return 0;
  return Number(data?.unreadCount ?? 0);
}

/* -------------------- Notification items -------------------- */

const MessageNotif = ({ notif }) => {
  const username = notif?.sender_username || "Unknown";
  const avatar = notif?.sender_avatar;

  return (
    <div className="bg-[#414141]/60 p-2 flex gap-2 rounded-[8px] cursor-pointer hover:bg-[#414141] transition">
      <SafeAvatar src={avatar} />
      <div className="flex flex-col flex-1 min-w-0">
        <p className="text-[9px] truncate text-white">{username} sent you a message:</p>
        <p className="text-[8px] truncate text-[#929292]">{notif?.message || ""}</p>
      </div>
    </div>
  );
};

const FriendInvite = ({ notif, onAccept, onReject }) => {
  const username = notif?.sender_username || "Unknown";
  const avatar = notif?.sender_avatar;

  const expired = isExpired(notif);
  const pending = notif?.status === "pending" && !expired;

  return (
    <div className="bg-[#414141]/60 p-2 flex gap-2 rounded-[8px] hover:bg-[#414141] transition">
      <SafeAvatar src={avatar} />
      <div className="flex flex-col flex-1 items-start min-w-0">
        <p className="text-[9px] truncate text-white">{username} sent you a friend invitation</p>

        {pending ? (
          <div className="flex mt-1 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReject?.(notif);
              }}
              className="bg-[#442222] text-[#FF4848] hover:bg-[#3C1C1C] text-[8px] px-2 py-[2px] rounded"
            >
              Reject
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAccept?.(notif);
              }}
              className="bg-[#1E3A2F] text-[#4DFFB3] hover:bg-[#162A22] text-[8px] px-2 py-[2px] rounded"
            >
              Accept
            </button>
          </div>
        ) : (
          <span className="mt-1 text-[8px] text-white/40">Invitation {notif?.status || "expired"}</span>
        )}
      </div>
    </div>
  );
};

/********************************************************************************************************************************* */
/********************************************************************************************************************************* */
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
      router.push(`/game/${roomId}`);
    }
  );
}

/********************************************************************************************************************************* */
/********************************************************************************************************************************* */




const GameInvite = ({ notif, onAccept, onReject }) => {
  const username = notif?.sender_username || "Unknown";
  const avatar = notif?.sender_avatar;

  const expired = isExpired(notif);
  const pending = notif?.status === "pending" && !expired;

  return (
    <div className="bg-[#262626]/60 p-2 flex gap-2 rounded-md hover:bg-[#303030]/60 transition">
      <SafeAvatar src={avatar} />
      <div className="flex flex-col flex-1 items-start min-w-0">
        <p className="text-[9px] text-white truncate">{username} invited you to a Ping Pong game</p>

        {pending ? (
          <div className="flex mt-1 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReject?.(notif);
              }}
              className="bg-[#442222] text-[#FF4848] hover:bg-[#3C1C1C] text-[8px] px-2 py-1 rounded"
            >
              Reject
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAccept?.(notif);
              }}
              className="bg-[#1E3A2F] text-[#4DFFB3] hover:bg-[#162A22] text-[8px] px-2 py-1 rounded"
            >
              Accept
            </button>
          </div>
        ) : (
          <span className="mt-1 text-[8px] text-white/40">Invitation {notif?.status || "expired"}</span>
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

/* -------------------- Dropdown -------------------- */

export default function NotificationDropDown() {
  const router = useRouter();
  const socket = useSocket();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const ref = useRef(null);

  const fetchNotifications = useCallback(async () => {
    const { res, data } = await fetchJson(`${API}/api/notifications`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (!res || res.status === 401 || !res.ok) return null;
    const list = Array.isArray(data?.notifications) ? data.notifications: [];
    return list;
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // load unread count on mount
  // useEffect(() => {
  //   (async () => {
  //     const count = await fetchUnreadNotificationsCount().catch(() => 0);
  //     setUnreadCount(count);
  //   })();
  // }, []);

  // realtime: new notification
  useEffect(() => {
    if (!socket) return;

    const onNewNotification = (raw) => {
      if (!raw?.id) return;

      setUnreadCount((p) => p + 1);
      setNotifications((prev) => {
        if (prev.some((n) => n.id === raw.id)) return prev;
        return [raw, ...prev];
      });
    };

    socket.on("notification:new", onNewNotification);
    return () => socket.off("notification:new", onNewNotification);
  }, [socket]);

  // const postAction = useCallback(async (notifId, action) => {
  //   const id = Number(notifId);
  //   if (!Number.isInteger(id) || id <= 0) return { ok: false };

  //   const { res, data } = await fetchJson(`${API}/api/notifications/${id}/action`, {
  //     method: "POST",
  //     credentials: "include",
  //     headers: { "Content-Type": "application/json", Accept: "application/json" },
  //     body: JSON.stringify({ action }),
  //   });

  //   if (!res || !res.ok) return { ok: false, error: data?.message || res?.statusText };
  //   return { ok: true, data };
  // }, []);

  // const handleAccept = useCallback(
  //   async (notif) => {
  //     if (!notif?.id) return;
  //     if (notif.status !== "pending" || isExpired(notif)) return;

  //     // 1) mark accepted in DB
  //     const r = await postAction(notif.id, "accept");
  //     if (!r.ok) return;

  //     // 2) update UI
  //     setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, status: "accepted" } : n)));

  //     // 3) game invite special: emit + navigate
  //     if (notif.type === "game_invite") {
  //       const roomId = notif?.payload?.roomId;
  //       if (typeof roomId !== "string" || roomId.length === 0) return;

  //       if (socket) {
  //         if (!socket.connected) socket.connect();

  //         socket.emit("game:accept", { notifId: notif.id, roomId }, (ack) => {
  //           if (!ack?.ok) return;
  //           router.push(`/game/${roomId}`);
  //         });
  //       }
  //     }
  //   },
  //   [postAction, router, socket]
  // );

  const handleReject = useCallback(
    async (notif) => {
      if (!notif?.id) return;
      if (notif.status !== "pending" || isExpired(notif)) return;

      const r = await postAction(notif.id, "reject");
      if (!r.ok) return;

      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, status: "rejected" } : n)));
    },
    [postAction]
  );

	const handleAccept = useCallback((notifId)=> onAccept(notifId, socket));

  const renderNotifications = useMemo(() => {
    return notifications.map((notif) => {
        const Cmp = NOTIFICATION_COMPONENTS[notif.type];
        if (!Cmp) return null;
        return (<Cmp key={notif.id} notif={notif} onAccept={handleAccept} onReject={handleReject}/>);
      }).filter(Boolean);
  }, [notifications, handleAccept, handleReject]);

  const onBellClick = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchNotifications();
      if (!list) {
        setIsOpen(false);
        return;
      }

      setNotifications(list);
      setUnreadCount(0);
      setIsOpen((v) => !v);
    } finally {
      setLoading(false);
    }
  }, [fetchNotifications]);

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        type="button"
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

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 max-h-[256px] bg-[#0F0F0F]/75 rounded-[10px] flex flex-col gap-1 p-2 overflow-y-auto z-50 custom-scrollbar min-w-[260px]">
          {loading ? (
            <p className="text-[10px] text-white/60 text-center py-4">Loading...</p>
          ) : notifications.length > 0 ? (
            renderNotifications
          ) : (
            <p className="text-[10px] text-white/60 text-center py-4">No notifications</p>
          )}
        </div>
      )}
    </div>
  );
}
