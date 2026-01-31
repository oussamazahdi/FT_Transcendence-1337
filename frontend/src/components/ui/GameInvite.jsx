import { ComponentUtils } from "@/lib/utils";
import Image from "next/image";

const safeAvatarSrc = (src) => (src && src !== "null" ? src : assets.defaultProfile);

const SafeAvatar = ({ src, alt = "avatar" }) => (
  <Image
    src={safeAvatarSrc(src)}
    alt={alt}
    width={36}
    height={36}
    className="w-9 h-9 rounded-sm object-cover shrink-0"
  />
);

export const GameInvite = ({ notif, onAccept, onReject }) => {
  const username = notif?.sender_username || "Unknown";
  const avatar = notif?.sender_avatar;

  const expired = ComponentUtils.isExpired(notif);
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
                onAccept?.(notif.id);
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