import Image from "next/image";

const safeAvatarSrc = (src) => (src && src !== "null" ? src : assets.defaultProfile);

const SafeAvatar = ({ src, alt = "avatar" }) => (
  <Image src={safeAvatarSrc(src)} alt={alt} width={36} height={36} className="w-9 h-9 rounded-sm object-cover shrink-0"/>
);

export const MessageNotif = ({ notif }) => {
  const username = notif?.sender_username || "Unknown";
  const avatar = notif?.sender_avatar;

  return (
    <div className="bg-[#414141]/60 p-2 flex gap-2 rounded-sm cursor-pointer hover:bg-[#414141] transition">
      <SafeAvatar src={avatar} />
      <div className="flex flex-col flex-1 min-w-0">
        <p className="text-[9px] truncate text-white">{username} sent you a message:</p>
        <p className="text-[8px] truncate text-[#929292]">{notif?.message || ""}</p>
      </div>
    </div>
  );
};