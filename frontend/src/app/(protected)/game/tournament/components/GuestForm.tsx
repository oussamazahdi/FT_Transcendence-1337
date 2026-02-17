import { DEFAULT_AVATARS } from "../types";
import Image from "next/image";

export function GuestForm({ guestFirst, guestLast, guestNick, guestAvatar, setGuestFirst, setGuestLast, setGuestNick, setGuestAvatar, isFull, onAdd }: {
guestFirst: string;
guestLast: string;
guestNick: string;
guestAvatar: string | null;
setGuestFirst: (v: string) => void;
setGuestLast: (v: string) => void;
setGuestNick: (v: string) => void;
setGuestAvatar: (v: string | null) => void;
isFull: boolean;
onAdd: () => void; }) {
  return (
    <div className="mt-4 rounded-2xl bg-white/5 w-full p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Guest player</p>
        <span className="text-xs text-white/40">No account needed</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col w-full items-center justify-center gap-3 rounded-2xl bg-black/20 p-3 ring-1 ring-white/10">
          <div className="h-28 w-28 shrink-0 aspect-square overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10">
            <Image 
								width={60}
							height={60}
              alt="Guest avatar"
              src={guestAvatar ?? DEFAULT_AVATARS[0] ?? "/gameAvatars/profile1.jpeg"}
              className="h-full  w-full object-cover"
            />
          </div>
          <div className="min-w-0 w-full text-center">
            <p className="w-full truncate text-sm font-semibold text-white">
              {guestFirst || guestLast ? `${guestFirst} ${guestLast}`.trim() : "Full Name"}
            </p>
            <p className="truncate text-xs text-white/55">@{guestNick || "nickname"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-white/60">First name</label>
            <input
							maxLength={15}
              value={guestFirst}
              onChange={(e) => setGuestFirst(e.target.value)}
              className="mt-1 w-full rounded-2xl bg-white/10 px-4 py-2.5 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
            />
          </div>

          <div>
            <label className="text-xs text-white/60">Last name</label>
            <input
							maxLength={15}
              value={guestLast}
              onChange={(e) => setGuestLast(e.target.value)}
              className="mt-1 w-full rounded-2xl bg-white/10 px-4 py-2.5 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
            />
          </div>

          <div>
            <label className="text-xs text-white/60">Nickname</label>
            <input
							maxLength={50}
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
                className={
                  active
                    ? "aspect-square overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/40 transition"
                    : "aspect-square overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10 transition hover:ring-white/25"
                }
                title="Select avatar"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="avatar" className="h-full w-full object-cover" />
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setGuestAvatar(null)}
            className={
              guestAvatar === null
                ? "aspect-square rounded-xl bg-white/10 text-white/80 ring-1 ring-white/40 transition"
                : "aspect-square rounded-xl bg-white/10 text-white/80 ring-1 ring-white/10 transition hover:ring-white/25"
            }
            title="Random / none"
          >
            ?
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={isFull}
        className={
          isFull
            ? "mt-4 w-full rounded-2xl px-4 py-2.5 text-sm font-semibold ring-1 transition bg-white/5 text-white/35 ring-white/10"
            : "mt-4 w-full rounded-2xl px-4 py-2.5 text-sm font-semibold ring-1 transition bg-white/15 text-white ring-white/15 hover:bg-white/20"
        }
      >
        Add player
      </button>
    </div>
  );
}
