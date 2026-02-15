import Image from "next/image";

type Player = {
  username: string;
  firstname?: string;
  lastname?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  score: number;
};

type Game = {
  player1: Player;
  player2: Player;
};

export function PlayerCard({ player }: { player: Player }) {
  const firstName = player.firstName ?? player.firstname ?? "";
  const lastName = player.lastName ?? player.lastname;

	const avatarSrc = player?.avatar ?? "/game/gameAvatars/Empty.jpeg";

  return (
    <div className="flex flex-col items-center">
      <Image src={avatarSrc} alt={"player avatar"} width={200} height={200}
        className="w-14 h-14 rounded-lg object-cover"/>
      <p className="font-semibold">
        {firstName}.{lastName?.[0]}
      </p>
      <span className="text-sm text-gray-400">
        [{player.username}]
      </span>
    </div>
  );
}

export function ScoreBoard({ game }: { game: Game }) {
  return (
    <div className="flex justify-between w-full max-w-5xl px-4 py-2">
      <PlayerCard player={game.player1} />
      <p className="text-xl md:text-4xl font-bold">
        {game.player1.score} - {game.player2.score}
      </p>
      <PlayerCard player={game.player2} />
    </div>
  );
}
