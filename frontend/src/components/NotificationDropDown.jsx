"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useSocket } from "@/contexts/socketContext.tsx";
import { ComponentUtils } from "@/lib/utils";
import { GameInvite } from "@/components/ui/GameInvite";
import { FriendInvite } from "./ui/FriendInvite";
import { MessageNotif } from "./ui/MessageNotif";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const NOTIFICATION_COMPONENTS = {
	game_invite: GameInvite,
	friend_invite: FriendInvite,
	friend_request: FriendInvite,
	message: MessageNotif,
};

async function requestJson(url, options) {
	try {
		const res = await fetch(url, options);
		const data = await res.json().catch(() => null);
		return { res, data, error: null };
	} catch (error) {
		return { res: null, data: null, error };
	}
}

export async function fetchUnreadNotificationsCount() {
	const { res, data } = await requestJson(`${API_BASE_URL}/api/notifications/unread-count`, {
		method: "GET",
		credentials: "include",
		headers: { Accept: "application/json" },
	});

	if (!res || !res.ok) return 0;
	return Number(data?.unreadCount ?? 0);
}

export default function NotificationDropDown() {
	const router = useRouter();
	const socket = useSocket();

	const dropdownRef = useRef(null);

	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const [notifications, setNotifications] = useState([]);

	const fetchNotificationsList = useCallback(async () => {
		const { res, data } = await requestJson(`${API_BASE_URL}/api/notifications`, {
			method: "GET",
			credentials: "include",
			headers: { Accept: "application/json" },
		});

		if (!res || res.status === 401 || !res.ok) return null;
		return Array.isArray(data?.notifications) ? data.notifications : [];
	}, []);

	const postNotificationAction = useCallback(async (notifId, action) => {
		const id = Number(notifId);
		if (!Number.isInteger(id) || id <= 0) return { ok: false };

		const { res, data } = await requestJson(`${API_BASE_URL}/api/notifications/${id}/action`,{
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json", Accept: "application/json" },
				body: JSON.stringify({ action }),
			}
		);

		if (!res || !res.ok) return { ok: false, error: data?.message || res?.statusText };
		return { ok: true, data };
	}, []);

	const loadNotificationById = useCallback(async (notifId) => {
		const id = Number(notifId);
		if (!Number.isInteger(id) || id <= 0) return null;

		const { res, data } = await requestJson(`${API_BASE_URL}/api/notifications/${id}`, {
			method: "GET",
			credentials: "include",
			headers: { Accept: "application/json" },
		});

		if (!res || !res.ok) return null;
		return data?.notif ?? null;
	}, []);

	const closeDropdownOnOutsideClick = useCallback((event) => {
		if (!dropdownRef.current) return;
		if (!dropdownRef.current.contains(event.target)) setIsOpen(false);
	}, []);

	const connectSocketIfNeeded = useCallback(() => {
		if (!socket) return false;
		if (!socket.connected) socket.connect();
		return true;
	}, [socket]);

	const syncUnreadCountOnMount = useCallback(async () => {
		const count = await fetchUnreadNotificationsCount().catch(() => 0);
		setUnreadCount(count);
	}, []);

	const addIncomingNotification = useCallback((raw) => {
		if (!raw?.id) return;

		setUnreadCount((prev) => prev + 1);
		setNotifications((prev) => {
			if (prev.some((n) => n.id === raw.id)) return prev;
			return [raw, ...prev];
		});
	}, []);

	const rejectNotification = useCallback(
		async (notif) => {
			if (!notif?.id) return;
			if (notif.status !== "pending") return;
			if (ComponentUtils.isExpired(notif)) return;

			const r = await postNotificationAction(notif.id, "reject");
			if (!r.ok) return;

			setNotifications((prev) =>
				prev.map((n) => (n.id === notif.id ? { ...n, status: "rejected" } : n))
			);
		},
		[postNotificationAction]
	);

	const acceptGameInvite = useCallback(
		async (notifId) => {
			const notif = await loadNotificationById(notifId);
			if (!notif) return;

			if (notif.status !== "pending") return;

			const roomId = notif?.payload?.roomId;
			if (typeof roomId !== "string" || roomId.length === 0) return;

			const senderId = Number(notif?.sender_id);
			const receiverId = Number(notif?.receiver_id);
			if (!Number.isInteger(senderId) || senderId <= 0) return;
			if (!Number.isInteger(receiverId) || receiverId <= 0) return;
			if (senderId === receiverId) return;

			const r = await postNotificationAction(notif.id, "accept");
			if (!r.ok) return;

			if (!connectSocketIfNeeded()) return;
			setIsOpen(false);

			socket.emit("game:accept", { notifId: Number(notif.id), roomId }, (ack) => {
				if (!ack?.ok){
					// console.log("=======>:");
					return;
				} 
				// router.push(`/game/pingPong/${roomId}`);
			});
		},
		[loadNotificationById, postNotificationAction, connectSocketIfNeeded, socket, router]
	);

	const handleBellClick = useCallback(async () => {
		setLoading(true);
		try {
			const list = await fetchNotificationsList();
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
	}, [fetchNotificationsList]);

	const renderedNotifications = useMemo(() => {
		return notifications.map((notif) => {
				const Cmp = NOTIFICATION_COMPONENTS[notif.type];
				if (!Cmp) return null;
				return (
					<Cmp key={notif.id} notif={notif} onAccept={acceptGameInvite} onReject={rejectNotification}/>
				);
			}).filter(Boolean);
	}, [notifications, acceptGameInvite, rejectNotification]);

	useEffect(() => {
		syncUnreadCountOnMount();
	}, [syncUnreadCountOnMount]);

	useEffect(() => {
		if (!isOpen) return;

		document.addEventListener("mousedown", closeDropdownOnOutsideClick);
		return () => document.removeEventListener("mousedown", closeDropdownOnOutsideClick);
	}, [isOpen, closeDropdownOnOutsideClick]);

	useEffect(() => {
		if (!socket) return;

		socket.on("notification:new", addIncomingNotification);
		return () => socket.off("notification:new", addIncomingNotification);
	}, [socket, addIncomingNotification]);

	return (
		<div ref={dropdownRef} className="relative hidden md:block">
			<button type="button" onClick={handleBellClick} aria-label="Open notifications"
				className="md:border border-[#9D9D9D]/40 rounded-[10px] md:p-3 hover:bg-[#000000]/40 cursor-pointer hover:scale-105 active:scale-95 transition relative">
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
					) : notifications.length > 0 ? renderedNotifications : (
						<p className="text-[10px] text-white/60 text-center py-4">No notifications</p>
					)}
				</div>
			)}
		</div>
	);
}
