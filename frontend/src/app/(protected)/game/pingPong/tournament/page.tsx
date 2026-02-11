"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * CLEAN VERSION:
 * - Removed score modal + score state/logic
 * - Removed setMatchResult / getLoser (not used here anymore)
 * - Kept bracket rendering + champion display (based on stored results)
 * - Play Match now ONLY redirects to the local game page
 * - Keeps lock/advance hydration when returning to this page
 */

type TournamentPlayer = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  isGuest?: boolean;
};

type TournamentCreatePayload = {
  name: string;
  players: TournamentPlayer[];
};

type MatchStatus = "locked" | "ready" | "in_progress" | "completed";

type Match = {
  id: string;
  round: 1 | 2; // 1 = semi, 2 = final
  a: TournamentPlayer;
  b: TournamentPlayer;
  status: MatchStatus;

  scoreA?: number;
  scoreB?: number;

  winnerId?: string;
};

type TournamentState = {
  name: string;
  players: TournamentPlayer[];
  semis: Match[];
  final: Match;
  currentMatchId: string;
  createdAt: string;
  updatedAt: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function isValidTournamentState(x: unknown): x is TournamentState {
  if (!x || typeof x !== "object") return false;
  const s = x as TournamentState;
  return (
    typeof s.name === "string" &&
    Array.isArray(s.players) &&
    Array.isArray(s.semis) &&
    s.semis.length === 2 &&
    s.semis.every((m: any) => m && typeof m.id === "string" && (m.round === 1 || m.round === 2)) &&
    !!s.final &&
    typeof s.final.id === "string" &&
    typeof s.currentMatchId === "string"
  );
}

function loadStateSafe(): TournamentState | null {
  const raw = safeParse<unknown>(localStorage.getItem("tournament:state"));
  if (!isValidTournamentState(raw)) return null;
  return raw;
}

function makeMatchId() {
  return `m_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function buildBracket(players: TournamentPlayer[], name: string): TournamentState {
  // Assumes exactly 4 players
  const semis: Match[] = [
    { id: makeMatchId(), round: 1, a: players[0], b: players[1], status: "ready" },
    { id: makeMatchId(), round: 1, a: players[2], b: players[3], status: "locked" },
  ];

  const final: Match = {
    id: makeMatchId(),
    round: 2,
    a: semis[0].a, // temp
    b: semis[1].a, // temp
    status: "locked",
  };

  const now = new Date().toISOString();
  return {
    name,
    players,
    semis,
    final,
    currentMatchId: semis[0].id,
    createdAt: now,
    updatedAt: now,
  };
}

function saveState(state: TournamentState) {
  localStorage.setItem("tournament:state", JSON.stringify(state));
}

function findMatch(state: TournamentState, matchId: string): Match | null {
  const semi = state.semis.find((m) => m.id === matchId);
  if (semi) return semi;
  if (state.final.id === matchId) return state.final;
  return null;
}

function getWinner(match: Match): TournamentPlayer | null {
  if (!match.winnerId) return null;
  return match.winnerId === match.a.id ? match.a : match.b;
}

function computeNextCurrentMatchId(state: TournamentState): string {
  const [m1, m2] = state.semis;

  if (m1.status !== "completed") return m1.id;
  if (m2.status !== "completed") return m2.id;
  if (state.final.status !== "completed") return state.final.id;

  return state.final.id;
}

function advanceLocks(state: TournamentState): TournamentState {
  const next = structuredClone(state);

  if (!Array.isArray(next.semis) || next.semis.length < 2) {
    next.updatedAt = new Date().toISOString();
    return next;
  }

  const semi1 = next.semis[0];
  const semi2 = next.semis[1];

  if (semi1.status === "completed" && semi2.status === "locked") {
    semi2.status = "ready";
  }

  const w1 = getWinner(semi1);
  const w2 = getWinner(semi2);

  if (w1 && w2) {
    next.final.a = w1;
    next.final.b = w2;
    if (next.final.status === "locked") next.final.status = "ready";
  }

  next.currentMatchId = computeNextCurrentMatchId(next);
  next.updatedAt = new Date().toISOString();
  return next;
}

export default function TournamentPage() {
  const router = useRouter();

  const [state, setState] = useState<TournamentState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existing = loadStateSafe();
    if (existing) {
      const hydrated = advanceLocks(existing);
      saveState(hydrated);
      setState(hydrated);
      return;
    }

    const payload = safeParse<TournamentCreatePayload>(localStorage.getItem("tournament:create"));
    if (!payload || !payload.name || !Array.isArray(payload.players) || payload.players.length !== 4) {
      setError("Tournament setup not found. Please create a tournament first.");
      return;
    }

    const built = buildBracket(payload.players, payload.name);
    saveState(built);
    setState(built);
  }, []);

  const payload = useMemo(() => {
    if (!state) return null;
    return { name: state.name, players: state.players } satisfies TournamentCreatePayload;
  }, [state]);

  const semis = state?.semis ?? [];
  const finalMatch = state?.final ?? null;

  const champion = useMemo(() => {
    if (!finalMatch?.winnerId) return null;
    return finalMatch.winnerId === finalMatch.a.id ? finalMatch.a : finalMatch.b;
  }, [finalMatch]);

  const persist = (next: TournamentState) => {
    setState(next);
    saveState(next);
  };

  const resetTournament = () => {
    const create = safeParse<TournamentCreatePayload>(localStorage.getItem("tournament:create"));
    if (!create || create.players.length !== 4) return;
    const rebuilt = buildBracket(create.players, create.name);
    saveState(rebuilt);
    setError(null);
    setState(rebuilt);
  };

  const playMatch = (matchId: string) => {
    if (!state) return;

    const m = findMatch(state, matchId);
    if (!m) return;

    // Only current match is playable
    if (state.currentMatchId !== matchId) return;
    if (m.status !== "ready" && m.status !== "in_progress") return;

    // Mark in progress and persist before leaving
    const next = structuredClone(state);
    const mm = findMatch(next, matchId);
    if (mm && mm.status === "ready") mm.status = "in_progress";
    next.updatedAt = new Date().toISOString();
    persist(next);

    router.push(`/game/pingPong/local?mode=tournament&matchId=${matchId}`);
  };

  if (error) {
    return (
      <div className="min-h-[70vh] w-full flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-3xl bg-[#0F0F0F]/65 p-6 text-center ring-1 ring-white/10">
          <h1 className="text-xl font-semibold text-white">Tournament</h1>
          <p className="mt-2 text-sm text-white/70">{error}</p>
          <div className="mt-5 flex gap-3 justify-center">
            <button
              onClick={() => router.push("/game/pingPong")}
              className="rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
            >
              Back
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("tournament:create");
                localStorage.removeItem("tournament:state");
                router.push("/game/pingPong");
              }}
              className="rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!payload || !finalMatch || !state) {
    return (
      <div className="min-h-[70vh] w-full flex items-center justify-center">
        <div className="text-white/70">Loading tournament...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{payload.name}</h1>
          <p className="mt-1 text-sm text-white/60">Single-elimination • 4 players • Match-by-match</p>
          <p className="mt-1 text-xs text-white/45">
            Current match:{" "}
            <span className="text-white/80 font-semibold">
              {(() => {
                const cm = findMatch(state, state.currentMatchId);
                if (!cm) return "—";
                return `${cm.a.displayName} vs ${cm.b.displayName}`;
              })()}
            </span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/game/pingPong")}
            className="rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
          >
            Back
          </button>
          <button
            onClick={resetTournament}
            className="rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Players row */}
      <div className="mt-6 rounded-3xl bg-[#0F0F0F]/55 p-5 ring-1 ring-white/10">
        <p className="text-sm font-semibold text-white/70">Players</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {payload.players.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
              <div className="h-12 w-12 overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.avatarUrl ?? "/avatars/placeholder.png"}
                  alt={p.displayName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{p.displayName}</p>
                <p className="truncate text-xs text-white/55">@{p.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bracket */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Semis */}
        <div className="lg:col-span-2 rounded-3xl bg-[#0F0F0F]/55 p-5 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white/70">Round 1 (Semifinals)</p>
            <p className="text-xs text-white/45">Play match-by-match to advance</p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {semis.map((m, idx) => (
              <MatchCard
                key={m.id}
                title={`Match ${idx + 1}`}
                match={m}
                isCurrent={state.currentMatchId === m.id}
                onPlay={() => playMatch(m.id)}
              />
            ))}
          </div>
        </div>

        {/* Final + Champion */}
        <div className="rounded-3xl bg-[#0F0F0F]/55 p-5 ring-1 ring-white/10">
          <p className="text-sm font-semibold text-white/70">Final</p>

          <div className="mt-4">
            {finalMatch.status === "locked" ? (
              <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/60 ring-1 ring-white/10">
                Waiting for semifinal winners...
              </div>
            ) : (
              <MatchCard
                title="Championship"
                match={finalMatch}
                isCurrent={state.currentMatchId === finalMatch.id}
                onPlay={() => playMatch(finalMatch.id)}
              />
            )}
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-white/70">Champion</p>
            {champion ? (
              <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                <div className="h-14 w-14 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={champion.avatarUrl ?? "/avatars/placeholder.png"}
                    alt={champion.displayName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-white">{champion.displayName}</p>
                  <p className="truncate text-sm text-white/55">@{champion.username}</p>
                </div>
                <div className="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/10">
                  🏆 Winner
                </div>
              </div>
            ) : (
              <div className="mt-3 rounded-2xl bg-white/5 p-4 text-sm text-white/60 ring-1 ring-white/10">
                No winner yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optional actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-white/60">
          {finalMatch.winnerId ? "Tournament complete." : "Play the current match to progress."}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              localStorage.removeItem("tournament:create");
              localStorage.removeItem("tournament:state");
              router.push("/game/pingPong");
            }}
            className="rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
          >
            End Tournament
          </button>
        </div>
      </div>
    </div>
  );
}

function MatchCard({
  title,
  match,
  isCurrent,
  onPlay,
}: {
  title: string;
  match: Match;
  isCurrent: boolean;
  onPlay: () => void;
}) {
  const winner = getWinner(match);

  const canPlay = isCurrent && (match.status === "ready" || match.status === "in_progress");


  return (
    <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white/75">{title}</p>

        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1",
            match.status === "completed"
              ? "bg-green-500/10 text-green-200 ring-green-500/20"
              : match.status === "in_progress"
              ? "bg-yellow-500/10 text-yellow-200 ring-yellow-500/20"
              : match.status === "ready"
              ? "bg-blue-500/10 text-blue-200 ring-blue-500/20"
              : "bg-white/5 text-white/55 ring-white/10"
          )}
        >
          {match.status}
          {isCurrent && match.status !== "completed" ? " • current" : ""}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <PlayerRow player={match.a} score={match.scoreA} active={winner?.id === match.a.id} />
        <PlayerRow player={match.b} score={match.scoreB} active={winner?.id === match.b.id} />
      </div>

      {winner && (
        <div className="mt-3 rounded-2xl bg-white/5 p-3 text-sm text-white/70 ring-1 ring-white/10">
          Winner: <span className="font-semibold text-white">{winner.displayName}</span>
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          disabled={!canPlay}
          onClick={onPlay}
          className={cn(
            "flex-1 rounded-2xl px-4 py-2.5 text-sm font-semibold ring-1 transition",
            canPlay
              ? "bg-white/10 text-white ring-white/10 hover:bg-white/15"
              : "bg-white/5 text-white/40 ring-white/10 cursor-not-allowed"
          )}
        >
          Play Match
        </button>
      </div>
    </div>
  );
}

function PlayerRow({
  player,
  score,
  active,
}: {
  player: TournamentPlayer;
  score?: number;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl p-3 text-left ring-1 transition",
        active ? "bg-white/10 ring-white/25" : "bg-black/20 ring-white/10"
      )}
    >
      <div className="h-12 w-12 overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={player.avatarUrl ?? "/avatars/placeholder.png"}
          alt={player.displayName}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{player.displayName}</p>
        <p className="truncate text-xs text-white/55">@{player.username}</p>
      </div>

      <div className="rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-white/75 ring-1 ring-white/10">
        {typeof score === "number" ? score : "-"}
      </div>
    </div>
  );
}
