import React from "react";

export function TournamentNameInput({ name, setName }: { name: string; setName: (v: string) => void;}) {
  return (
    <>
      <label className="block text-sm font-medium text-white/80">
        Tournament name :
      </label>
      <input
				maxLength={50}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Friday Night Pong"
        className="mt-2 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
      />
    </>
  );
}