"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useSocket } from "@/contexts/socketContext";

const SafeAvatar = ({ src, alt }) => {
  const safeSrc = src && src !== "null" ? src : assets.defaultProfile;
  return (<Image src={safeSrc} alt={alt || "avatar"} width={36} height={36} className="rounded-[6px] object-cover"/>);
};



const MessageNotif = ({ notif }) => {
  const username = notif?.user?.username || "Unknown";
  const avatar = notif?.user?.avatar;

  return (
    <div className="bg-[#414141]/60 p-2 flex gap-2 rounded-[8px] cursor-pointer hover:bg-[#414141] transition">
      <SafeAvatar src={avatar} alt="avatar" />
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
    <div className="bg-[#414141]/60 p-2 flex gap-2 rounded-[8px] cursor-pointer hover:bg-[#414141] transition">
      <SafeAvatar src={avatar} alt="avatar" />
      <div className="flex flex-col flex-1 items-start">
        <p className="text-[9px] truncate text-white">
          {username} sent you a friend invitation
        </p>

        <div className="flex mt-1 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject?.(notif.id);
            }}
            className="bg-[#442222] text-[#FF4848] hover:bg-[#3C1C1C] text-[8px] px-2 py-[2px] rounded"
          >
            Reject
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAccept?.(notif.id);
            }}
            className="bg-[#1E3A2F] text-[#4DFFB3] hover:bg-[#162A22] text-[8px] px-2 py-[2px] rounded"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

const GameInvite = ({ notif, onAccept, onReject }) => {
	const username = notif?.user?.username || "Unknown";
	const avatar = notif?.user?.avatar;

	return (
		<div className="bg-[#262626]/60 p-2 flex gap-2 rounded-[8px] cursor-pointer hover:bg-[#303030]/60 transition">
			<div className="flex-shrink-0"><SafeAvatar src={avatar} alt="avatar" /></div>

			<div className="flex flex-col flex-1 items-start">
				<p className="text-[9px] text-white">{username} invited you to Ping Pong game</p>

				<div className="flex mt-1 gap-2">
					<button
						// onClick={(e) => {
						//	 e.stopPropagation();
						//	 onReject?.(notif.id);
						// }}
						className="bg-[#442222] text-[#FF4848] hover:bg-[#3C1C1C] text-[8px] px-2 py-[2px] rounded">Reject</button>

					<button
						// onClick={(e) => {
						//	 e.stopPropagation();
						//	 onAccept?.(notif.id);
						// }}
						className="bg-[#1E3A2F] text-[#4DFFB3] hover:bg-[#162A22] text-[8px] px-2 py-[2px] rounded">Accept</button>
				</div>
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

	const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const onNewNotification = () => {
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification:new", onNewNotification);

    return () => {
      socket.off("notification:new", onNewNotification);
    };
  }, [socket]);

	const renderNotifications = useMemo(() => {
		return notifications.map((notif) => {
				const SpecificComponent = NOTIFICATION_COMPONENTS[notif.type];
				if (!SpecificComponent) return null;
				return ( <SpecificComponent key={notif.id} notif={notif} onAccept={''} onReject={''}/>);
			}).filter(Boolean);
	}, [notifications]);

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
		setUnreadCount(0);
		
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
	// setUnreadCount()

	useEffect(() => {
		loadUnreadCount();
	}, [loadUnreadCount]);

	const onBellClick = useCallback(async () => {
		setLoading(true);
		setUnreadCount(0)
		
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
			
			setIsOpen((v) => !v);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, [fetchNotifications, fetchUserById, normalizeBackendNotif, usersById, unreadCount]);

	return (
		<div ref={ref} className="relative hidden md:block">
			<button onClick={onBellClick} className="md:border border-[#9D9D9D]/40 rounded-[10px] md:p-3 hover:bg-[#000000]/40 cursor-pointer hover:scale-105 active:scale-95 transition relative">
				<BellAlertIcon className="h-5 w-5 text-white/60" />
				{unreadCount > 0 && (<span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">{unreadCount}</span>)}
			</button>

			{isOpen && (
				<div className="absolute right-0 top-full mt-2 max-h-[256px] bg-[#0F0F0F]/75 rounded-[10px] flex flex-col gap-1 p-2 overflow-y-auto z-50 custom-scrollbar min-w-[260px]">
					{loading ? ( <p className="text-[10px] text-white/60 text-center py-4">Loading...</p> ) : notifications.length > 0 ? renderNotifications : <p className="text-[10px] text-white/60 text-center py-4">No notifications</p> }
				</div>
			)}
		</div>
	);
}
