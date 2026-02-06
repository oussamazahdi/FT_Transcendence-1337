export function PlayerCard({ player }) {
  return (
    <div className="flex flex-col items-center">
      <img
        src={player.avatar}
        className="w-14 h-14 rounded-lg object-cover"
      />
      <p className="font-semibold">
        {player.firstName}.{player.lastName?.[0]}
      </p>
      <span className="text-sm text-gray-400">
        [{player.username}]
      </span>
    </div>
  );
}

export function ScoreBoard({ game }) {
  return (
    <div className="flex justify-between w-full max-w-5xl px-4 mt-6 mb-5">
      <PlayerCard player={game.player1} />
      <p className="text-xl md:text-4xl font-bold">
        {game.player1.score} - {game.player2.score}
      </p>
      <PlayerCard player={game.player2} />
    </div>
  );
}