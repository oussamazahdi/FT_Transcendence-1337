"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { useSocket } from "@/contexts/socketContext";
import { ComponentUtils } from "@/lib/utils";
import { GameInvite } from "@/components/ui/GameInvite";
import { FriendInvite } from "./ui/FriendInvite";
import { MessageNotif } from "./ui/MessageNotif";
import { autofetch } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type NotificationType =
  | "game_invite"
  | "friend_invite"
  | "friend_request"
  | "message"
  | (string & {});

type NotificationItem = {
  id: number | string;
  type: NotificationType;
  status?: "pending" | "accepted" | "rejected" | string;
  message?: string;
  sender_id?: number | string;
  receiver_id?: number | string;
  sender_username?: string;
  sender_avatar?: string | null;
  payload?: {
    roomId?: string;
    [key: string]: unknown;
  };
  is_expired?: number | boolean;
  expires_at?: string | null;
  [key: string]: unknown;
};

type NotificationListResponse = {
  notifications?: NotificationItem[];
};

type NotificationByIdResponse = {
  notif?: NotificationItem | null;
};

type NotificationActionResponse = {
  message?: string;
  [key: string]: unknown;
};

type UnreadCountResponse = {
  unreadCount?: number;
};

/**
 * ✅ Make these REQUIRED so they match GameInvite/FriendInvite props
 */
export type NotificationComponentProps = {
  notif: NotificationItem;
  onAccept: (value: NotificationItem | NotificationItem["id"]) => void;
  onReject: (notif: NotificationItem) => void;
};

/**
 * Minimal socket shape required by this component.
 * This avoids unsafe casting to a custom socket type.
 */
type NotificationSocket = {
  connected: boolean;
  connect: () => void;
  on: (event: "notification:new", cb: (payload: NotificationItem) => void) => void;
  off: (event: "notification:new", cb: (payload: NotificationItem) => void) => void;
  emit: (
    event: "game:accept",
    payload: { notifId: number; roomId: string },
    ack: (response?: { ok?: boolean; [key: string]: unknown }) => void
  ) => void;
};

const NOTIFICATION_COMPONENTS: Record<string, ComponentType<NotificationComponentProps>> = {
  game_invite: GameInvite,
  friend_invite: FriendInvite,
  friend_request: FriendInvite,
  message: MessageNotif,
};

type JsonResult<T> = {
  res: Response | null;
  data: T | null;
  error: unknown;
};

async function requestJson<T = unknown>(url: string, options?: RequestInit): Promise<JsonResult<T>> {
  try {
    const res = await autofetch(url, options);
    const data = (await res.json().catch(() => null)) as T | null;
    return { res, data, error: null };
  } catch (error) {
    return { res: null, data: null, error };
  }
}

export async function fetchUnreadNotificationsCount() {
  const { res, data } = await requestJson<UnreadCountResponse>(
    `${API_BASE_URL}/api/notifications/unread-count`,
    {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    }
  );

  if (!res || !res.ok) return 0;
  return Number(data?.unreadCount ?? 0);
}

type NotificationDropDownProps = {
  containerClassName?: string;
  buttonClassName?: string;
  panelClassName?: string;
};

export default function NotificationDropDown({
  containerClassName = "relative hidden md:block",
  buttonClassName = "md:border border-[#9D9D9D]/40 rounded-[10px] md:p-3 hover:bg-[#000000]/40 cursor-pointer hover:scale-105 active:scale-95 transition relative",
  panelClassName = "absolute right-0 top-full mt-2 max-h-64 bg-[#0F0F0F]/75 rounded-[10px] flex flex-col gap-1 p-2 overflow-y-auto z-50 custom-scrollbar min-w-65",
}: NotificationDropDownProps = {}) {
  const socket = useSocket() as unknown as NotificationSocket | null;

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotificationsList = useCallback(async () => {
    const { res, data } = await requestJson<NotificationListResponse>(`${API_BASE_URL}/api/notifications`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (!res || res.status === 401 || !res.ok) return null;
    return Array.isArray(data?.notifications) ? data.notifications : [];
  }, []);

  const postNotificationAction = useCallback(async (notifId: NotificationItem["id"], action: string) => {
    const id = Number(notifId);
    if (!Number.isInteger(id) || id <= 0) return { ok: false as const };

    const { res, data } = await requestJson<NotificationActionResponse>(`${API_BASE_URL}/api/notifications/${id}/action`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ action }),
    });

    if (!res || !res.ok) return { ok: false as const, error: data?.message || res?.statusText };
    return { ok: true as const, data };
  }, []);

  const loadNotificationById = useCallback(async (notifId: NotificationItem["id"]) => {
    const id = Number(notifId);
    if (!Number.isInteger(id) || id <= 0) return null;

    const { res, data } = await requestJson<NotificationByIdResponse>(`${API_BASE_URL}/api/notifications/${id}`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (!res || !res.ok) return null;
    return data?.notif ?? null;
  }, []);

  const closeDropdownOnOutsideClick = useCallback((event: MouseEvent) => {
    if (!dropdownRef.current) return;
    const target = event.target;
    if (target instanceof Node && !dropdownRef.current.contains(target)) setIsOpen(false);
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

  const addIncomingNotification = useCallback((raw: NotificationItem) => {
    if (!raw?.id) return;

    setUnreadCount((prev) => prev + 1);
    setNotifications((prev) => {
      if (prev.some((n) => n.id === raw.id)) return prev;
      return [raw, ...prev];
    });
  }, []);

  const rejectNotification = useCallback(
    async (notif: NotificationItem) => {
      if (!notif?.id) return;
      if (notif.status !== "pending") return;
      if (ComponentUtils.isExpired(notif)) return;

      const r = await postNotificationAction(notif.id, "reject");
      if (!r.ok) return;

      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, status: "rejected" } : n)));
    },
    [postNotificationAction]
  );

  const acceptGameInvite = useCallback(
    async (value: NotificationItem | NotificationItem["id"]) => {
      const notifId = typeof value === "object" && value !== null ? value.id : value;

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

      if (!connectSocketIfNeeded() || !socket) return;

      setIsOpen(false);

      socket.emit("game:accept", { notifId: Number(notif.id), roomId }, (ack) => {
        if (!ack?.ok) return;
      });
    },
    [loadNotificationById, postNotificationAction, connectSocketIfNeeded, socket]
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

  const renderedNotifications = useMemo<React.ReactElement[]>(() => {
    return notifications
      .map((notif) => {
        const Cmp = NOTIFICATION_COMPONENTS[notif.type];
        if (!Cmp) return null;

        return (
          <Cmp
            key={String(notif.id)}
            notif={notif}
            onAccept={acceptGameInvite}
            onReject={rejectNotification}
          />
        );
      })
      .filter((item): item is React.ReactElement => item !== null);
  }, [notifications, acceptGameInvite, rejectNotification]);

  useEffect(() => {
    void syncUnreadCountOnMount();
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
    <div ref={dropdownRef} className={containerClassName}>
      <button
        type="button"
        onClick={handleBellClick}
        aria-label="Open notifications"
        className={buttonClassName}
      >
        <BellAlertIcon className="h-5 w-5 text-white/60" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={panelClassName}>
          {loading ? (
            <p className="text-[10px] text-white/60 text-center py-4">Loading...</p>
          ) : notifications.length > 0 ? (
            renderedNotifications
          ) : (
            <p className="text-[10px] text-white/60 text-center py-4">No notifications</p>
          )}
        </div>
      )}
    </div>
  );
}
