import React from "react";
import Image from "next/image";
import { TournamentPlayer, PlayerSlotStatus, DEFAULT_AVATARS } from "../types";

export function PlayersGrid({ slots, lockedUserId, onRemove,}: {
  slots: Array<{ status: PlayerSlotStatus; player?: TournamentPlayer }>;
  lockedUserId: string | null;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {slots.map((slot, idx) => (
        <PlayerSlotCard key={idx} idx={idx} slot={slot} lockedUserId={lockedUserId} onRemove={onRemove}/>
      ))}
    </div>
  );
}

function PlayerSlotCard({ idx, slot, lockedUserId, onRemove }: {
  idx: number;
  slot: { status: PlayerSlotStatus; player?: TournamentPlayer };
  lockedUserId: string | null;
  onRemove: (id: string) => void;
}) {
  const isLocked =
    slot.status === "filled" &&
    lockedUserId &&
    slot.player?.id === lockedUserId &&
    idx === 0;

  const base = "flex items-center gap-3 rounded-2xl p-3 ring-1";
  const filled = "bg-white/10 ring-white/10";
  const waiting = "bg-white/5 ring-white/10";
  const empty = "bg-transparent ring-white/5";

  const cardClass =
    slot.status === "filled" ? `${base} ${filled}` : slot.status === "waiting" ? `${base} ${waiting}` : `${base} ${empty}`;

  return (
    <div className={cardClass}>
      <div className="h-12 w-12 shrink-0 aspect-square overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10">
        {slot.status === "filled" ? (
          <Image
						width={500}
						height={500}
            alt={slot.player!.username}
            src={slot.player!.avatarUrl ?? DEFAULT_AVATARS[0] ?? "/gameAvatars/profile1.jpeg"}
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
              {slot.player!.username}{" "}
              {isLocked && (
                <span className="ml-2 rounded-full bg-white/10 px-2 py-1 text-[11px] text-white/70 ring-1 ring-white/10">
                  You (Player 1)
                </span>
              )}
            </p>
            <p className="truncate text-xs text-white/55">@{slot.player!.username}</p>
          </>
        ) : slot.status === "waiting" ? (
          <>
            <p className="text-sm font-semibold text-white/60">Player {idx + 1}</p>
            <p className="text-xs text-white/35">@Waiting ...</p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-white/35">Player {idx + 1}</p>
            <p className="text-xs text-white/25">Empty</p>
          </>
        )}
      </div>

      {slot.status === "filled" && (
        <button
          onClick={() => onRemove(slot.player!.id)}
          disabled={!!isLocked}
          className={
            isLocked
              ? "rounded-xl bg-white/10 px-2.5 py-2 text-xs text-white/75 ring-1 ring-white/10 opacity-40 cursor-not-allowed"
              : "rounded-xl bg-white/10 px-2.5 py-2 text-xs text-white/75 ring-1 ring-white/10 hover:bg-white/15"
          }
          title={isLocked ? "Player 1 cannot be removed" : "Remove"}
        >
          ✕
        </button>
      )}
    </div>
  );
}
