export function ErrorAndStart({ error, canStart, onStart }: { error: string | null; canStart: boolean; onStart: () => void;}) {
  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      <div className="min-h-[1.25rem] text-sm text-red-200">{error ?? ""}</div>

      <button
        onClick={onStart}
        disabled={!canStart}
        className={canStart ? "rounded-2xl px-5 py-3 text-sm font-semibold ring-1 transition bg-white/15 text-white ring-white/15 hover:bg-white/20"
            : "rounded-2xl px-5 py-3 text-sm font-semibold ring-1 transition bg-white/5 text-white/35 ring-white/10"
        }>
        Start Tournament
      </button>
    </div>
  );
}