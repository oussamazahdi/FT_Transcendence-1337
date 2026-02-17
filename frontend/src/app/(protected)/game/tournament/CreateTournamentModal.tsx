"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/contexts/socketContext";
import { useAuth } from "@/contexts/authContext";
import { TournamentPlayer, CreateTournamentModalProps, DEFAULT_AVATARS, TournamentUtiles, UseAuthResult, LockedUserId } from "./types";
import { ModalShell } from "./components/ModalShell";
import { TournamentNameInput } from "./components/TournamentNameInput";
import { PlayersGrid } from "./components/PlayersGrid";
import { ErrorAndStart } from "./components/ErrorAndStart";
import { UsersPicker } from "./components/UsersPicker";
import { GuestForm } from "./components/GuestForm";
import { AddUserButton } from "./components/AddUserButton";

const STORAGEKEY:string = "tournament:create";
const REDIRECTTO:string =  "/game/tournament";
const MAXPLAYERS:number = 4

export default function CreateTournamentModal({ open, onClose, users = [], initialPlayers = [], onStart,}: CreateTournamentModalProps) {
	// Comment: for external hooks or reactions
	const router = useRouter();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const wasOpenRef = useRef(false);

	// Comment: Ui states to easy update the UI
 	const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [guestFirst, setGuestFirst] = useState("");
  const [guestLast, setGuestLast] = useState("");
  const [guestNick, setGuestNick] = useState("");
  const [guestAvatar, setGuestAvatar] = useState<string | null>(DEFAULT_AVATARS[0] ?? null);
	const [error, setError] = useState<string | null>(null);

  const socket = useSocket();
  const { user } = useAuth() as UseAuthResult;

	// Comment: Normalize loged user obj
  const lockedUserId: LockedUserId = user?.id != null ? String(user.id) : null;

  const lockedPlayer: TournamentPlayer | null = useMemo(
    () => TournamentUtiles.buildLockedPlayer(lockedUserId, users, user),
    [lockedUserId, users, user]
  );

	// Comment: initialize name of tournament, players array
  const [name, setName] = useState("");
  const [players, setPlayers] = useState<TournamentPlayer[]>(() =>
    TournamentUtiles.normalizePlayersWithLockedFirst(lockedPlayer, initialPlayers, MAXPLAYERS)
  );

	// Comment: check if tounament is full (cant add other players)
  const isFull = players.length >= MAXPLAYERS;

	// Comment: Clean all UI when open the modle
  const resetForOpen = useCallback(() => {
    setError(null);
    setSearch("");
    setSelectedUserId(null);
    setGuestFirst("");
    setGuestLast("");
    setGuestNick("");
    setGuestAvatar(DEFAULT_AVATARS[0] ?? null);
    setPlayers(
      TournamentUtiles.normalizePlayersWithLockedFirst(lockedPlayer, initialPlayers, MAXPLAYERS)
    );
  }, [initialPlayers, lockedPlayer, MAXPLAYERS]);


	// Comment: reset when model go from close to open, keep the locked player at the first box, 
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      resetForOpen();
      wasOpenRef.current = true;
    }
    if (!open && wasOpenRef.current) {
      wasOpenRef.current = false;
    }
  }, [open, resetForOpen]);

  useEffect(() => {
    if (!open) return;
    setPlayers((prev) => {
      const next = TournamentUtiles.normalizePlayersWithLockedFirst(lockedPlayer, prev, MAXPLAYERS);
      const same = next.length === prev.length && next.every((p, i) => p.id === prev[i]?.id);
      return same ? prev : next;
    });
  }, [open, lockedPlayer]);

	// Comment: Close modle on ESC, click outside of modle
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

	// Comment: filter users by search input (query), pic user, array describing UI slots (filled/waiting/empty)
  const filteredUsers = useMemo(() => TournamentUtiles.filterUsers(users, search), [users, search]);
  const selectedUser = useMemo(() => TournamentUtiles.findSelectedUser(users, selectedUserId), [users, selectedUserId]);
  const slots = useMemo(() => TournamentUtiles.buildSlots(players, MAXPLAYERS), [players, MAXPLAYERS]);

  // Comment:
  // A) addUserPlayer: add an existing registered user to tournament
  // B) addGuestPlayer: create and add a guest player
  // C) removePlayer: remove a player (except locked Player 1)
  // D) startTournament: validate and then start tournament
  const addUserPlayer = useCallback(() => {
    setError(null);

    if (isFull) return setError(`You can only add ${MAXPLAYERS} players.`);
    if (!selectedUser) return setError("Select a player to add.");
    if (lockedUserId && selectedUser.id === lockedUserId) return setError("You are already Player 1.");
    if (players.some((ply) => ply.id === selectedUser.id))
      return setError("This player is already in the tournament.");

    setPlayers((prev) =>
      TournamentUtiles.normalizePlayersWithLockedFirst(
        lockedPlayer,
        [...prev, TournamentUtiles.toPlayer(selectedUser)],
        MAXPLAYERS
      )
    );
		// Reset picker after adding
    setSelectedUserId(null);
    setSearch("");
  }, [isFull, lockedPlayer, lockedUserId, MAXPLAYERS, players, selectedUser]);

  const addGuestPlayer = useCallback(() => {
    setError(null);

    if (isFull) return setError(`You can only add ${MAXPLAYERS} players.`);

    const first = guestFirst.trim();
    const last = guestLast.trim();
    const nick = guestNick.trim();

		// Require at least a name piece + nickname
    const displayName = [first, last].filter(Boolean).join(" ").trim();
    if (!displayName)
      return setError("Guest: first name + last name (or at least one) is required.");
    if (!nick) return setError("Guest: nickname is required.");

		// Prevent nickname collisions
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

    setPlayers((prev) =>
      TournamentUtiles.normalizePlayersWithLockedFirst(lockedPlayer, [...prev, guest], MAXPLAYERS)
    );

		// Reset guest form after adding
    setGuestFirst("");
    setGuestLast("");
    setGuestNick("");
    setGuestAvatar(DEFAULT_AVATARS[0] ?? null);
  }, [guestAvatar, guestFirst, guestLast, guestNick, isFull, lockedPlayer, MAXPLAYERS, players]);

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

		// Ensure the logged-in user is still Player 1
    if (lockedUserId && (!players[0] || players[0].id !== lockedUserId)) {
      return setError("You must be Player 1.");
    }

		// Must have exact number of players
    if (players.length !== MAXPLAYERS)
      return setError(`You need exactly ${MAXPLAYERS} players to start.`);

		// If parent wants to handle start (ex: via socket), call it
    if (onStart) {
      onStart({ name: trimmedName, players });
      onClose();
      return;
    }

		// Otherwise store locally then navigate
    localStorage.setItem(STORAGEKEY, JSON.stringify({ name: trimmedName, players }));
    onClose();
    router.push(REDIRECTTO);
  }, [lockedUserId, MAXPLAYERS, name, onClose, onStart, players, REDIRECTTO, router, STORAGEKEY]);

	// Comment: check if tournament can start
  const canStart = players.length === MAXPLAYERS && name.trim().length > 0;

	// Comment: modle closed
  if (!open) return null;

  return (
    <ModalShell overlayRef={overlayRef} onOverlayMouseDown={onOverlayMouseDown} onClose={onClose}>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-black/25 p-5 ring-1 ring-white/10">
          <TournamentNameInput name={name} setName={setName} />

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-white/80">Players :</p>
              <p className="text-xs text-white/50">
                {players.length}/{MAXPLAYERS}
              </p>
            </div>

            <PlayersGrid slots={slots} lockedUserId={lockedUserId} onRemove={removePlayer} />
          </div>

          <ErrorAndStart error={error} canStart={canStart} onStart={startTournament} />
        </div>

        <div className="rounded-2xl bg-black/25 p-5 ring-1 ring-white/10">
          <div className="mb-3">
            <p className="text-sm font-medium text-white/80">Add Players :</p>
            <p className="mt-1 text-xs text-white/50">
              Add from your users list or create a guest player.
            </p>
          </div>

          <UsersPicker usersCount={users.length} search={search} setSearch={setSearch} filteredUsers={filteredUsers} selectedUserId={selectedUserId}
            onPick={(id) => setSelectedUserId(id)} lockedUserId={lockedUserId} players={players} socket={socket} />

          <div className="mt-3">
            <AddUserButton disabled={!selectedUser || isFull} onClick={addUserPlayer} />
          </div>

          <GuestForm guestFirst={guestFirst} guestLast={guestLast} guestNick={guestNick} guestAvatar={guestAvatar} setGuestFirst={setGuestFirst}
						setGuestLast={setGuestLast} setGuestNick={setGuestNick} setGuestAvatar={setGuestAvatar} isFull={isFull} onAdd={addGuestPlayer} />
				</div>
      </div>
    </ModalShell>
  );
}
