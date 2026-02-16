type LocalGameResultProps = {
  winnerName: string;
  score1: number;
  score2: number;
  isTournament?: boolean;
};

export function LocalGameResult({ winnerName, score1, score2, isTournament = false }: LocalGameResultProps) {
  return (
    <div className="absolute inset-0 rounded-2xl bg-black/60 flex flex-col items-center justify-center p-12 text-center text-white">
      <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4">Final Result</p>
      <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-2 leading-none">
        {winnerName}
        <br />
        Wins
      </h2>
      <p className="text-xs md:text-sm opacity-75">Final Score: {score1} - {score2}</p>
      {isTournament ? (
        <p className="mt-2 text-[11px] md:text-xs opacity-60">Returning to tournament in 3 seconds...</p>
      ) : null}
    </div>
  );
}
