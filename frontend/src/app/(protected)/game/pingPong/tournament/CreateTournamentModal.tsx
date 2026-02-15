"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/contexts/socketContext";
import { useAuth } from "@/contexts/authContext";
import { TournamentPlayer, PlayerSlotStatus, CreateTournamentModalProps, DEFAULT_AVATARS, TournamentUtiles } from "./types";
import { ModalShell } from "./components/ModalShell";
import { TournamentNameInput } from "./components/TournamentNameInput";
import { PlayersGrid } from "./components/PlayersGrid";
import { ErrorAndStart } from "./components/ErrorAndStart";
import { UsersPicker } from "./components/UsersPicker";
import { GuestForm } from "./components/GuestForm";


function AddUserButton({ disabled, onClick }: { disabled: boolean; onClick: () => void;}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={ disabled
      	? "w-full rounded-2xl px-4 py-2.5 text-sm font-semibold ring-1 transition bg-white/5 text-white/35 ring-white/10"
        : "w-full rounded-2xl px-4 py-2.5 text-sm font-semibold ring-1 transition bg-white/15 text-white ring-white/15 hover:bg-white/20"}>
      Add player
    </button>
  );
}

export default function CreateTournamentModal({
  open,
  onClose,
  users = [],
  initialPlayers = [],
  maxPlayers = 4,
  storageKey = "tournament:create",
  redirectTo = "/game/pingPong/tournament",
  onStart,
}: CreateTournamentModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const wasOpenRef = useRef(false);

  const socket = useSocket();
  const { user } = useAuth() as {
    user?: {
      id?: string | number;
      username?: string;
      displayName?: string;
      avatar?: string | null;
      avatarUrl?: string | null;
      firstname?: string;
      lastname?: string;
    } | null;
  };

  const lockedUserId = user?.id != null ? String(user.id) : null;

  const lockedPlayer: TournamentPlayer | null = useMemo(() => {
    if (!lockedUserId) return null;

    const fromUsers = users.find((u) => u.id === lockedUserId);
    if (fromUsers) return TournamentUtiles.toPlayer(fromUsers);

    const displayName =
      user?.displayName ??
      [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim() ??
      user?.username ??
      "You";

    return {
      id: lockedUserId,
      username: user?.username ?? "you",
      displayName: displayName || "You",
      avatarUrl: user?.avatarUrl ?? user?.avatar ?? DEFAULT_AVATARS[0] ?? null,
      isGuest: false,
    };
  }, [lockedUserId, users, user]);

  const [name, setName] = useState("");
  const [players, setPlayers] = useState<TournamentPlayer[]>(() =>
    TournamentUtiles.normalizePlayersWithLockedFirst(lockedPlayer, initialPlayers, maxPlayers)
  );

  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [guestFirst, setGuestFirst] = useState("");
  const [guestLast, setGuestLast] = useState("");
  const [guestNick, setGuestNick] = useState("");
  const [guestAvatar, setGuestAvatar] = useState<string | null>(DEFAULT_AVATARS[0] ?? null);

  const [error, setError] = useState<string | null>(null);

  const isFull = players.length >= maxPlayers;

  // Reset only when opens
  const resetForOpen = useCallback(() => {
    setError(null);
    setSearch("");
    setSelectedUserId(null);
    setGuestFirst("");
    setGuestLast("");
    setGuestNick("");
    setGuestAvatar(DEFAULT_AVATARS[0] ?? null);

    setPlayers(TournamentUtiles.normalizePlayersWithLockedFirst(lockedPlayer, initialPlayers, maxPlayers));
  }, [initialPlayers, lockedPlayer, maxPlayers]);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      resetForOpen();
      wasOpenRef.current = true;
    }
    if (!open && wasOpenRef.current) {
      wasOpenRef.current = false;
    }
  }, [open, resetForOpen]);

  // Keep locked first (if loads later)
  useEffect(() => {
    if (!open) return;
    setPlayers((prev) => {
      const next = TournamentUtiles.normalizePlayersWithLockedFirst(lockedPlayer, prev, maxPlayers);
      const same =
        next.length === prev.length && next.every((p, i) => p.id === prev[i]?.id);
      return same ? prev : next;
    });
  }, [open, lockedPlayer, maxPlayers]);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const onOverlayMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const dn = (u.displayName ?? "").toLowerCase();
      const un = u.username.toLowerCase();
      return dn.includes(q) || un.includes(q);
    });
  }, [users, search]);

  const selectedUser = useMemo(() => {
    if (!selectedUserId) return null;
    return users.find((u) => u.id === selectedUserId) ?? null;
  }, [users, selectedUserId]);

  const slots = useMemo(() => {
    const out: Array<{ status: PlayerSlotStatus; player?: TournamentPlayer }> = [];
    for (let i = 0; i < maxPlayers; i++) {
      const p = players[i];
      if (p) out.push({ status: "filled", player: p });
      else out.push({ status: i < TournamentUtiles.clamp(players.length + 1, 1, maxPlayers) ? "waiting" : "empty" });
    }
    return out;
  }, [players, maxPlayers]);

  const addUserPlayer = useCallback(() => {
    setError(null);

    if (isFull) return setError(`You can only add ${maxPlayers} players.`);
    if (!selectedUser) return setError("Select a player to add.");
    if (lockedUserId && selectedUser.id === lockedUserId) return setError("You are already Player 1.");
    if (players.some((p) => p.id === selectedUser.id)) return setError("This player is already in the tournament.");

    setPlayers((prev) => TournamentUtiles.normalizePlayersWithLockedFirst(lockedPlayer, [...prev, TournamentUtiles.toPlayer(selectedUser)], maxPlayers));
    setSelectedUserId(null);
    setSearch("");
  }, [isFull, lockedPlayer, lockedUserId, maxPlayers, players, selectedUser]);

  const addGuestPlayer = useCallback(() => {
    setError(null);

    if (isFull) return setError(`You can only add ${maxPlayers} players.`);

    const first = guestFirst.trim();
    const last = guestLast.trim();
    const nick = guestNick.trim();

    const displayName = [first, last].filter(Boolean).join(" ").trim();
    if (!displayName) return setError("Guest: first name + last name (or at least one) is required.");
    if (!nick) return setError("Guest: nickname is required.");

    if (players.some((p) => p.username.toLowerCase() === nick.toLowerCase())) {
      return setError("Nickname already used by another player.");
    }

    const guest: TournamentPlayer = {
      id: TournamentUtiles.makeGuestId(),
      username: nick,
      displayName,
      avatarUrl: guestAvatar,
      isGuest: true,
    };

    setPlayers((prev) => TournamentUtiles.normalizePlayersWithLockedFirst(lockedPlayer, [...prev, guest], maxPlayers));

    setGuestFirst("");
    setGuestLast("");
    setGuestNick("");
    setGuestAvatar(DEFAULT_AVATARS[0] ?? null);
  }, [guestAvatar, guestFirst, guestLast, guestNick, isFull, lockedPlayer, maxPlayers, players]);

  const removePlayer = useCallback(
    (id: string) => {
      if (lockedUserId && id === lockedUserId) return setError("Player 1 (you) cannot be removed.");
      setPlayers((prev) => prev.filter((p) => p.id !== id));
      setError(null);
    },
    [lockedUserId]
  );

  const startTournament = useCallback(() => {
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) return setError("Tournament name is required.");

    if (lockedUserId && (!players[0] || players[0].id !== lockedUserId)) {
      return setError("You must be Player 1.");
    }

    if (players.length !== maxPlayers) return setError(`You need exactly ${maxPlayers} players to start.`);

    if (onStart) {
      onStart({ name: trimmedName, players });
      onClose();
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify({ name: trimmedName, players }));
    onClose();
    router.push(redirectTo);
  }, [lockedUserId, maxPlayers, name, onClose, onStart, players, redirectTo, router, storageKey]);

  const canStart = players.length === maxPlayers && name.trim().length > 0;

  if (!open) return null;

  return (
    <ModalShell overlayRef={overlayRef} onOverlayMouseDown={onOverlayMouseDown} onClose={onClose}>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left */}
        <div className="rounded-2xl bg-black/25 p-5 ring-1 ring-white/10">
          <TournamentNameInput name={name} setName={setName} />

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-white/80">Players :</p>
              <p className="text-xs text-white/50">
                {players.length}/{maxPlayers}
              </p>
            </div>

            <PlayersGrid slots={slots} lockedUserId={lockedUserId} onRemove={removePlayer} />
          </div>

          <ErrorAndStart error={error} canStart={canStart} onStart={startTournament} />
        </div>

        {/* Right */}
        <div className="rounded-2xl bg-black/25 p-5 ring-1 ring-white/10">
          <div className="mb-3">
            <p className="text-sm font-medium text-white/80">Add Players :</p>
            <p className="mt-1 text-xs text-white/50">
              Add from your users list or create a guest player.
            </p>
          </div>

          <UsersPicker usersCount={users.length} search={search} setSearch={setSearch} filteredUsers={filteredUsers}
					selectedUserId={selectedUserId} onPick={(id) => setSelectedUserId(id)} lockedUserId={lockedUserId} players={players} socket={socket}/>

          <div className="mt-3">
            <AddUserButton disabled={!selectedUser || isFull} onClick={addUserPlayer} />
          </div>

          <GuestForm guestFirst={guestFirst} guestLast={guestLast} guestNick={guestNick} guestAvatar={guestAvatar} setGuestFirst={setGuestFirst}
            setGuestLast={setGuestLast} setGuestNick={setGuestNick} setGuestAvatar={setGuestAvatar} isFull={isFull} onAdd={addGuestPlayer}/>
        </div>
      </div>
    </ModalShell>
  );
}
