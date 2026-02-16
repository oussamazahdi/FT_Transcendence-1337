import { UserLite, TournamentPlayer, DEFAULT_AVATARS } from "../types";

export function UsersPicker({ usersCount, search, setSearch, filteredUsers, selectedUserId, onPick, lockedUserId, players, socket }: {
  usersCount: number;
  search: string;
  setSearch: (v: string) => void;
  filteredUsers: UserLite[];
  selectedUserId: string | null;
  onPick: (id: string) => void;
  lockedUserId: string | null;
  players: TournamentPlayer[];
  socket: any;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/60">From users</p>
        <span className="text-xs text-white/40">{usersCount} available</span>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        <input
          value={search}
					maxLength={50}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-2xl bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
        />

        <div className="max-h-40 overflow-auto rounded-2xl ring-1 ring-white/10 custom-scrollbar">
          {filteredUsers.length === 0 ? (
            <div className="p-3 text-sm text-white/50">No users found.</div>
          ) : (
            <ul className="divide-y divide-white/5">
              {filteredUsers.slice(0, 12).map((u) => {
                const active = selectedUserId === u.id;
                const alreadyAdded = players.some((p) => p.id === u.id);
                const isYou = lockedUserId && u.id === lockedUserId;
                const disabled = alreadyAdded || isYou;

                const rowClass = disabled
                  ? "flex w-full items-center gap-3 px-3 py-2.5 text-left opacity-40"
                  : active
                  ? "flex w-full items-center gap-3 px-3 py-2.5 text-left bg-white/10"
                  : "flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5";

									return (
										<li key={u.id}>
											<div
												role="button"
												tabIndex={disabled ? -1 : 0}
												aria-disabled={disabled ? true : undefined}
												onClick={() => {
													if (disabled) return;
													onPick(u.id);
												}}
												onKeyDown={(e) => {
													if (disabled) return;
													if (e.key === "Enter" || e.key === " ") onPick(u.id);
												}}
												className={rowClass}
											>
													<div className="h-9 w-9 shrink-0 aspect-square overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10">
														{/* eslint-disable-next-line @next/next/no-img-element */}
														<img
															alt={u.username}
															src={u.avatarUrl ?? DEFAULT_AVATARS[0] ?? "/gameAvatars/profile1.jpeg"}
															className="h-full w-full object-cover"
														/>
												</div>
									
													<div className="min-w-0 flex-1">
														<p className="truncate text-sm font-semibold text-white">
															{u.username}{" "}
															{isYou && (
																<span className="ml-2 rounded-full bg-white/10 px-2 py-1 text-[11px] text-white/70 ring-1 ring-white/10">
																	You
															</span>
														)}
													</p>
													<p className="truncate text-xs text-white/55">@{u.username}</p>
												</div>
									
												<button
													type="button"
													onClick={(e) => {
														e.preventDefault();
														e.stopPropagation();
														if (!socket) return;
														if (isYou) return;
									
														socket.emit("chat:send", {
															receiverId: u.id,
															type: "text_message",
															content: "Ready to compete? Jump into our local tournament! 💥",
														});
													}}
													// disabled={isYou}
													className="rounded-full bg-white/10 hover:bg-white/20 px-2 py-1 text-[11px] text-white/60 ring-1 ring-white/10 cursor-pointer"
												>
													Join us
												</button>
									
												{alreadyAdded && (
													<span className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-white/60 ring-1 ring-white/10">
														Added
													</span>
												)}
												{isYou && !alreadyAdded && (
													<span className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-white/60 ring-1 ring-white/10">
														Player 1
													</span>
												)}
											</div>
										</li>
									);
									
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
