export function PlayerCard({ player, label }) {
  const hasIdentity = !!player?.username || !!player?.id;
  const displayName = hasIdentity ? `${player.firstName || ""}${player.lastName ? `.${player.lastName[0]}` : ""}` : label;

  return (
    <div className="flex flex-col items-center text-center">
      <img src={hasIdentity && player.avatar ? player.avatar : "/gameAvatars/Empty.jpeg"} alt="profile" className="h-28 w-28 sm:h-36 sm:w-36 rounded-xl object-cover"/>
      <h3 className="mt-2 text-lg sm:text-xl font-semibold">{displayName}</h3>
      <p className="text-sm font-medium text-[#6E6E6E]">
        [{hasIdentity ? player.username : "waiting"}]
      </p>
    </div>
  );
}