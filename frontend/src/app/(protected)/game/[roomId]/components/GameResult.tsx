type Player = {
  username: string;
  score: number;
};

type Game = {
  player1: Player;
  player2: Player;
};

type GameResultProps = {
  game: Game;
  width: number;
  height: number;
};

export function GameResult({ game, width, height }: GameResultProps) {
  const winner = game.player1.score > game.player2.score ? game.player1 : game.player2;

  return (
    <div style={{ width, height }}
      className="absolute top-0 left-0 bg-black/60 flex flex-col items-center justify-center p-12 text-center text-white rounded-2xl">
      <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4">Final Result</p>
      <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-2 leading-none">
        {winner.username}<br />Wins
      </h2>
      <p className="text-xs md:text-sm opacity-60">
        Total Score: {game.player1.score} — {game.player2.score}
      </p>
    </div>
  );
}
