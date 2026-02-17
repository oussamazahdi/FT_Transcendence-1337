"use client";

import Image from "next/image";

export type MatchPlayer = {
  id: number | string;
  socketId?: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar?: string | null;
  score?: number;
  roomId?: string;
};

type PlayerCardProps = {
  player: MatchPlayer;
  label: string;
};

export function PlayerCard({ player, label }: PlayerCardProps) {
  const hasIdentity = Boolean(player?.username) || Boolean(player?.id);

  const displayName = hasIdentity
    ? `${player.firstName ?? ""}${player.lastName ? `.${player.lastName[0]}` : ""}`
    : label;

  const avatarSrc =
    hasIdentity && player.avatar ? player.avatar : "/gameAvatars/Empty.jpeg";

  return (
    <div className="flex flex-col items-center text-center">
      <Image width={100} height={100} src={avatarSrc} alt="profile" className="h-28 w-28 sm:h-36 sm:w-36 rounded-xl object-cover"/>
      <h3 className="mt-2 text-lg sm:text-xl font-semibold">{displayName}</h3>
      <p className="text-sm font-medium text-[#6E6E6E]">
        [{hasIdentity ? player.username : "waiting"}]
      </p>
    </div>
  );
}
