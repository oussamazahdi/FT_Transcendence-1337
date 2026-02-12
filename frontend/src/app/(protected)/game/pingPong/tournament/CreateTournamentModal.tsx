"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type UserLite = {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string | null;
};

type TournamentPlayer = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  isGuest?: boolean;
};

type PlayerSlotStatus = "filled" | "waiting" | "empty";

type CreateTournamentModalProps = {
  open: boolean;
  onClose: () => void;
  users?: UserLite[];
  initialPlayers?: TournamentPlayer[];
  maxPlayers?: number;
  storageKey?: string;
  redirectTo?: string;
};

const DEFAULT_AVATARS = [
  "/gameAvatars/profile1.jpeg",
  "/gameAvatars/profile2.jpeg",
  "/gameAvatars/profile3.jpeg",
  "/gameAvatars/profile4.jpeg",
  "/gameAvatars/profile5.jpeg",
  "/gameAvatars/profile6.jpeg",
  "/gameAvatars/profile7.jpeg",
  "/gameAvatars/profile8.jpeg",
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function makeGuestId() {
  return `guest_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export default function CreateTournamentModal({
  open,
  onClose,
  users = [],
  initialPlayers = [],
  maxPlayers = 4,
  storageKey = "tournament:create",
  redirectTo = "/game/pingPong/tournament",
}: CreateTournamentModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const wasOpenRef = useRef(false); // ✅ guard open transition

  const [name, setName] = useState("");
  const [players, setPlayers] = useState<TournamentPlayer[]>(() =>
    initialPlayers.slice(0, maxPlayers)
  );

  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [guestFirst, setGuestFirst] = useState("");
  const [guestLast, setGuestLast] = useState("");
  const [guestNick, setGuestNick] = useState("");
  const [guestAvatar, setGuestAvatar] = useState<string | null>(
    DEFAULT_AVATARS[0] ?? null
  );

  const [error, setError] = useState<string | null>(null);

  const isFull = players.length >= maxPlayers;

  // ✅ Reset ONLY when modal transitions closed -> open (prevents infinite loop)
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      // opening now
      setError(null);
      setSearch("");
      setSelectedUserId(null);

      setGuestFirst("");
      setGuestLast("");
      setGuestNick("");
      setGuestAvatar(DEFAULT_AVATARS[0] ?? null);

      setPlayers(initialPlayers.slice(0, maxPlayers));
      // If you want to reset tournament name each time it opens, uncomment:
      // setName("");

      wasOpenRef.current = true;
    }

    if (!open && wasOpenRef.current) {
      // closed now
      wasOpenRef.current = false;
    }
  }, [open, initialPlayers, maxPlayers]);

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

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const onOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const addUserPlayer = () => {
    setError(null);

    if (isFull) return setError(`You can only add ${maxPlayers} players.`);
    if (!selectedUser) return setError("Select a player to add.");

    const exists = players.some((p) => p.id === selectedUser.id);
    if (exists) return setError("This player is already in the tournament.");

    setPlayers((prev) => [
      ...prev,
      {
        id: selectedUser.id,
        username: selectedUser.username,
        displayName: selectedUser.displayName ?? selectedUser.username,
        avatarUrl: selectedUser.avatarUrl ?? null,
        isGuest: false,
      },
    ]);

    setSelectedUserId(null);
    setSearch("");
  };

  const addGuestPlayer = () => {
    setError(null);

    if (isFull) return setError(`You can only add ${maxPlayers} players.`);

    const first = guestFirst.trim();
    const last = guestLast.trim();
    const nick = guestNick.trim();

    const displayName = [first, last].filter(Boolean).join(" ").trim();
    if (!displayName)
      return setError("Guest: first name + last name (or at least one) is required.");
    if (!nick) return setError("Guest: nickname is required.");

    const nickTaken = players.some(
      (p) => p.username.toLowerCase() === nick.toLowerCase()
    );
    if (nickTaken) return setError("Nickname already used by another player.");

    setPlayers((prev) => [
      ...prev,
      {
        id: makeGuestId(),
        username: nick,
        displayName,
        avatarUrl: guestAvatar,
        isGuest: true,
      },
    ]);

    setGuestFirst("");
    setGuestLast("");
    setGuestNick("");
    setGuestAvatar(DEFAULT_AVATARS[0] ?? null);
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setError(null);
  };

  const startTournament = () => {
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) return setError("Tournament name is required.");
    if (players.length !== maxPlayers)
      return setError(`You need exactly ${maxPlayers} players to start.`);

    localStorage.setItem(
      storageKey,
      JSON.stringify({ name: trimmedName, players })
    );

    onClose();
    router.push(redirectTo);
  };

  const slotCards = useMemo(() => {
    const slots: Array<{ status: PlayerSlotStatus; player?: TournamentPlayer }> =
      [];
    for (let i = 0; i < maxPlayers; i++) {
      const p = players[i];
      if (p) slots.push({ status: "filled", player: p });
      else
        slots.push({
          status:
            i < clamp(players.length + 1, 1, maxPlayers) ? "waiting" : "empty",
        });
    }
    return slots;
  }, [players, maxPlayers]);

  if (!open) return null;


  return (
		<div
		ref={overlayRef}
		onMouseDown={onOverlayMouseDown}
		className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[3px] p-4"
		aria-modal="true"
		role="dialog"
	>
		<div className="w-full max-w-5xl rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur-xl ring-1 ring-white/15">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h2 className="text-xl font-semibold tracking-tight text-white">
						Create Tournament
					</h2>
					<p className="mt-1 text-sm text-white/70">
						Add exactly {maxPlayers} players, then start the tournament.
					</p>
				</div>

				<button
					onClick={onClose}
					className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white/80 ring-1 ring-white/10 hover:bg-white/15"
				>
					Close
				</button>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Left */}
				<div className="rounded-2xl bg-black/25 p-5 ring-1 ring-white/10">
					<label className="block text-sm font-medium text-white/80">
						Tournament name :
					</label>
					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g. Friday Night Pong"
						className="mt-2 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
					/>

					<div className="mt-6">
						<div className="mb-3 flex items-center justify-between">
							<p className="text-sm font-medium text-white/80">Players :</p>
							<p className="text-xs text-white/50">
								{players.length}/{maxPlayers}
							</p>
						</div>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							{slotCards.map((slot, idx) => (
								<div
									key={idx}
									className={cn(
										"flex items-center gap-3 rounded-2xl p-3 ring-1",
										slot.status === "filled"
											? "bg-white/10 ring-white/10"
											: slot.status === "waiting"
											? "bg-white/5 ring-white/10"
											: "bg-transparent ring-white/5"
									)}
								>
									<div className="h-12 w-12 overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10">
										{slot.status === "filled" ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												alt={slot.player!.displayName}
												src={
													slot.player!.avatarUrl ??
													DEFAULT_AVATARS[0] ??
													"/gameAvatars/profile1.jpeg"
												}
												className="h-full w-full object-cover"
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center text-white/30">
												<span className="text-lg">👤</span>
											</div>
										)}
									</div>

									<div className="min-w-0 flex-1">
										{slot.status === "filled" ? (
											<>
												<p className="truncate text-sm font-semibold text-white">
													{slot.player!.displayName}
												</p>
												<p className="truncate text-xs text-white/55">
													@{slot.player!.username}
												</p>
											</>
										) : slot.status === "waiting" ? (
											<>
												<p className="text-sm font-semibold text-white/60">
													Player {idx + 1}
												</p>
												<p className="text-xs text-white/35">@Waiting ...</p>
											</>
										) : (
											<>
												<p className="text-sm font-semibold text-white/35">
													Player {idx + 1}
												</p>
												<p className="text-xs text-white/25">Empty</p>
											</>
										)}
									</div>

									{slot.status === "filled" && (
										<button
											onClick={() => removePlayer(slot.player!.id)}
											className="rounded-xl bg-white/10 px-2.5 py-2 text-xs text-white/75 ring-1 ring-white/10 hover:bg-white/15"
											title="Remove"
										>
											✕
										</button>
									)}
								</div>
							))}
						</div>
					</div>

					<div className="mt-6 flex items-center justify-between gap-3">
						<div className="min-h-[1.25rem] text-sm text-red-200">
							{error ?? ""}
						</div>

						<button
							onClick={startTournament}
							disabled={players.length !== maxPlayers }
							className={cn(
								"rounded-2xl px-5 py-3 text-sm font-semibold ring-1 transition",
								players.length === maxPlayers && name.trim()
									? "bg-white/15 text-white ring-white/15 hover:bg-white/20"
									: "bg-white/5 text-white/35 ring-white/10"
							)}
						>
							Start Tournament
						</button>
					</div>
				</div>

				{/* Right */}
				<div className="rounded-2xl bg-black/25 p-5 ring-1 ring-white/10">
					<div className="mb-3">
						<p className="text-sm font-medium text-white/80">Add Players :</p>
						<p className="mt-1 text-xs text-white/50">
							Add from your users list or create a guest player.
						</p>
					</div>

					{/* From users */}
					<div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
						<div className="flex items-center justify-between gap-3">
							<p className="text-xs font-semibold uppercase tracking-wide text-white/60">
								From users
							</p>
							<span className="text-xs text-white/40">
								{users.length} available
							</span>
						</div>

						<div className="mt-3 flex flex-col gap-3">
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search..."
								className="w-full rounded-2xl bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
							/>

							<div className="max-h-40 overflow-auto rounded-2xl ring-1 ring-white/10 custom-scrollbar">
								{filteredUsers.length === 0 ? (
									<div className="p-3 text-sm text-white/50">
										No users found.
									</div>
								) : (
									<ul className="divide-y divide-white/5">
										{filteredUsers.slice(0, 12).map((u) => {
											const active = selectedUserId === u.id;
											const disabled = players.some((p) => p.id === u.id);

											return (
												<li key={u.id}>
													<button
														type="button"
														disabled={disabled}
														onClick={() => setSelectedUserId(u.id)}
														className={cn(
															"flex w-full items-center gap-3 px-3 py-2.5 text-left",
															disabled ? "opacity-40" : "hover:bg-white/5",
															active ? "bg-white/10" : ""
														)}
													>
														<div className="h-9 w-9 overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10">
															{/* eslint-disable-next-line @next/next/no-img-element */}
															<img
																alt={u.displayName ?? u.username}
																src={u.avatarUrl ?? DEFAULT_AVATARS[0] ?? "/gameAvatars/profile1.jpeg"}
																className="h-full w-full object-cover"
															/>
														</div>

														<div className="min-w-0 flex-1">
															<p className="truncate text-sm font-semibold text-white">
																{u.displayName ?? u.username}
															</p>
															<p className="truncate text-xs text-white/55">
																@{u.username}
															</p>
														</div>

														{disabled && (
															<span className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-white/60 ring-1 ring-white/10">
																Added
															</span>
														)}
													</button>
												</li>
											);
										})}
									</ul>
								)}
							</div>

							<button
								type="button"
								onClick={addUserPlayer}
								disabled={!selectedUser || isFull}
								className={cn(
									"w-full rounded-2xl px-4 py-2.5 text-sm font-semibold ring-1 transition",
									selectedUser && !isFull
										? "bg-white/15 text-white ring-white/15 hover:bg-white/20"
										: "bg-white/5 text-white/35 ring-white/10"
								)}
							>
								Add player
							</button>
						</div>
					</div>

					{/* Guest */}
					<div className="mt-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
						<div className="flex items-center justify-between gap-3">
							<p className="text-xs font-semibold uppercase tracking-wide text-white/60">
								Guest player
							</p>
							<span className="text-xs text-white/40">No account needed</span>
						</div>

						<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-black/20 p-3 ring-1 ring-white/10">
								<div className="h-28 w-28 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										alt="Guest avatar"
										src={guestAvatar ?? DEFAULT_AVATARS[0] ?? "/gameAvatars/profile1.jpeg"}
										className="h-full w-full object-cover"
									/>
								</div>
								<div className="min-w-0 text-center">
									<p className="truncate text-sm font-semibold text-white">
										{guestFirst || guestLast
											? `${guestFirst} ${guestLast}`.trim()
											: "Full Name"}
									</p>
									<p className="truncate text-xs text-white/55">
										@{guestNick || "nickname"}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-3">
								<div>
									<label className="text-xs text-white/60">First name</label>
									<input
										value={guestFirst}
										onChange={(e) => setGuestFirst(e.target.value)}
										className="mt-1 w-full rounded-2xl bg-white/10 px-4 py-2.5 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
									/>
								</div>

								<div>
									<label className="text-xs text-white/60">Last name</label>
									<input
										value={guestLast}
										onChange={(e) => setGuestLast(e.target.value)}
										className="mt-1 w-full rounded-2xl bg-white/10 px-4 py-2.5 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
									/>
								</div>

								<div>
									<label className="text-xs text-white/60">Nickname</label>
									<input
										value={guestNick}
										onChange={(e) => setGuestNick(e.target.value)}
										className="mt-1 w-full rounded-2xl bg-white/10 px-4 py-2.5 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
									/>
								</div>
							</div>
						</div>

						<div className="mt-4">
							<p className="text-xs text-white/60">Choose avatar</p>
							<div className="mt-2 grid grid-cols-6 gap-2 sm:grid-cols-8">
								{DEFAULT_AVATARS.map((src) => {
									const active = guestAvatar === src;
									return (
										<button
											type="button"
											key={src}
											onClick={() => setGuestAvatar(src)}
											className={cn(
												"aspect-square overflow-hidden rounded-xl bg-white/10 ring-1 transition",
												active
													? "ring-white/40"
													: "ring-white/10 hover:ring-white/25"
											)}
											title="Select avatar"
										>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={src}
												alt="avatar"
												className="h-full w-full object-cover"
											/>
										</button>
									);
								})}

								<button
									type="button"
									onClick={() => setGuestAvatar(null)}
									className={cn(
										"aspect-square rounded-xl bg-white/10 text-white/80 ring-1 transition",
										guestAvatar === null
											? "ring-white/40"
											: "ring-white/10 hover:ring-white/25"
									)}
									title="Random / none"
								>
									?
								</button>
							</div>
						</div>

						<button
							type="button"
							onClick={addGuestPlayer}
							disabled={isFull}
							className={cn(
								"mt-4 w-full rounded-2xl px-4 py-2.5 text-sm font-semibold ring-1 transition",
								!isFull
									? "bg-white/15 text-white ring-white/15 hover:bg-white/20"
									: "bg-white/5 text-white/35 ring-white/10"
							)}
						>
							Add player
						</button>
					</div>
				</div>
			</div>

			{/* <div className="mt-6 flex items-center justify-center">
				<div className="h-1.5 w-24 rounded-full bg-white/10" />
			</div> */}
		</div>
	</div>
  );
}
