"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/contexts/socketContext";
import Image from "next/image";

export type TournamentPlayer = {
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

export type Match = {
  id: string;
  round: 1 | 2;
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

const TOURNAMENT_CREATE_STORAGE_KEY = "tournament:create";
const TOURNAMENT_STATE_STORAGE_KEY = "tournament:state";

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
  const raw = safeParse<unknown>(localStorage.getItem(TOURNAMENT_STATE_STORAGE_KEY));
  if (!isValidTournamentState(raw)) return null;
  return raw;
}

function saveState(state: TournamentState) {
  localStorage.setItem(TOURNAMENT_STATE_STORAGE_KEY, JSON.stringify(state));
}

function makeMatchId() {
  return `m_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function buildBracket(players: TournamentPlayer[], name: string): TournamentState {
  const semis: Match[] = [
    { id: makeMatchId(), round: 1, a: players[0], b: players[1], status: "ready" },
    { id: makeMatchId(), round: 1, a: players[2], b: players[3], status: "locked" },
  ];

  const final: Match = {
    id: makeMatchId(),
    round: 2,
    a: semis[0].a,
    b: semis[1].a,
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

function computeChampion(finalMatch: Match | null): TournamentPlayer | null {
  if (!finalMatch?.winnerId) return null;
  return finalMatch.winnerId === finalMatch.a.id ? finalMatch.a : finalMatch.b;
}

function getNextMatchInfo(state: TournamentState): { match: Match; label: string } {
  const m1 = state.semis[0];
  const m2 = state.semis[1];

  if (m1.status !== "completed") return { match: m1, label: "Semifinal 1" };
  if (m2.status !== "completed") return { match: m2, label: "Semifinal 2" };
  return { match: state.final, label: "Final" };
}

function buildNextRoundMessage(label: string, a: TournamentPlayer, b: TournamentPlayer) {
  return `🔥 ${label} is ready! @${a.username} vs @${b.username} — let’s see who advances 🏆`;
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="w-full max-w-7xl mx-auto px-4 py-8">{children}</div>;
}

function LoadingState() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center">
      <div className="text-white/70">Loading tournament...</div>
    </div>
  );
}

function ErrorState({
  title,
  message,
  onBack,
  onClear,
}: {
  title: string;
  message: string;
  onBack: () => void;
  onClear: () => void;
}) {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-[#0F0F0F]/65 p-6 text-center ring-1 ring-white/10">
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        <p className="mt-2 text-sm text-white/70">{message}</p>
        <div className="mt-5 flex gap-3 justify-center">
          <button
            onClick={onBack}
            className="rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
          >
            Back
          </button>
          <button
            onClick={onClear}
            className="rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

function TournamentHeader({
  name,
  currentMatchLabel,
  onBack,
  onReset,
}: {
  name: string;
  currentMatchLabel: string;
  onBack: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">{name}</h1>
        <p className="mt-1 text-sm text-white/60">Single-elimination • 4 players • Match-by-match</p>
        <p className="mt-1 text-xs text-white/45">
          Current match: <span className="text-white/80 font-semibold">{currentMatchLabel}</span>
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
        >
          Back
        </button>
        <button
          onClick={onReset}
          className="rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function PlayerAvatar({
  src,
  alt,
  sizeClassName,
  wrapperClassName,
}: {
  src: string;
  alt: string;
  sizeClassName: string;
  wrapperClassName: string;
}) {
  return (
    <div className={`${sizeClassName} shrink-0 aspect-square overflow-hidden ${wrapperClassName}`}>
      <Image width={60} height={60} src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

function PlayersSection({ players }: { players: TournamentPlayer[] }) {
  return (
    <div className="mt-6 rounded-3xl bg-[#0F0F0F]/55 p-5 ring-1 ring-white/10">
      <p className="text-sm font-semibold text-white/70">Players</p>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {players.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
            <PlayerAvatar
              src={p.avatarUrl ?? "/avatars/placeholder.png"}
              alt={p.username}
              sizeClassName="h-12 w-12"
              wrapperClassName="rounded-xl bg-white/10 ring-1 ring-white/10"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{p.username}</p>
              <p className="truncate text-xs text-white/55">@{p.username}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchStatusBadge({ status, isCurrent }: { status: MatchStatus; isCurrent: boolean }) {
  const base = "rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1";
  let variant = "bg-white/5 text-white/55 ring-white/10";

  if (status === "completed") variant = "bg-green-500/10 text-green-200 ring-green-500/20";
  if (status === "in_progress") variant = "bg-yellow-500/10 text-yellow-200 ring-yellow-500/20";
  if (status === "ready") variant = "bg-blue-500/10 text-blue-200 ring-blue-500/20";

  return (
    <span className={`${base} ${variant}`}>
      {status}
      {isCurrent && status !== "completed" ? " • current" : ""}
    </span>
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
  const rowClass =
    "flex items-center gap-3 rounded-2xl p-3 text-left ring-1 transition " +
    (active ? "bg-white/10 ring-white/25" : "bg-black/20 ring-white/10");

  return (
    <div className={rowClass}>
      <PlayerAvatar
        src={player.avatarUrl ?? "/avatars/placeholder.png"}
        alt={player.username}
        sizeClassName="h-12 w-12"
        wrapperClassName="rounded-xl bg-white/10 ring-1 ring-white/10"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{player.username}</p>
        <p className="truncate text-xs text-white/55">@{player.username}</p>
      </div>

      <div className="rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-white/75 ring-1 ring-white/10">
        {typeof score === "number" ? score : "-"}
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

  const buttonClass =
    "flex-1 rounded-2xl px-4 py-2.5 text-sm font-semibold ring-1 transition " +
    (canPlay
      ? "bg-white/10 text-white ring-white/10 hover:bg-white/15"
      : "bg-white/5 text-white/40 ring-white/10 cursor-not-allowed");

  return (
    <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white/75">{title}</p>
        <MatchStatusBadge status={match.status} isCurrent={isCurrent} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <PlayerRow player={match.a} score={match.scoreA} active={winner?.id === match.a.id} />
        <PlayerRow player={match.b} score={match.scoreB} active={winner?.id === match.b.id} />
      </div>

      {winner ? (
        <div className="mt-3 rounded-2xl bg-white/5 p-3 text-sm text-white/70 ring-1 ring-white/10">
          Winner: <span className="font-semibold text-white">@{winner.username}</span>
        </div>
      ) : null}

      <div className="mt-4 flex gap-3">
        <button type="button" disabled={!canPlay} onClick={onPlay} className={buttonClass}>
          Play Match
        </button>
      </div>
    </div>
  );
}

function SemisSection({
  semis,
  currentMatchId,
  onPlayMatch,
}: {
  semis: Match[];
  currentMatchId: string;
  onPlayMatch: (matchId: string) => void;
}) {
  return (
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
            isCurrent={currentMatchId === m.id}
            onPlay={() => onPlayMatch(m.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ChampionCard({ champion }: { champion: TournamentPlayer | null }) {
  return (
    <div className="mt-5">
      <p className="text-sm font-semibold text-white/70">Champion</p>

      {champion ? (
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
          <PlayerAvatar
            src={champion.avatarUrl ?? "/avatars/placeholder.png"}
            alt={champion.username}
            sizeClassName="h-14 w-14"
            wrapperClassName="rounded-2xl bg-white/10 ring-1 ring-white/10"
          />

          <div className="min-w-0">
            <p className="truncate text-base font-bold text-white">{champion.username}</p>
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
  );
}

function FinalAndChampionSection({
  finalMatch,
  currentMatchId,
  champion,
  onPlayMatch,
}: {
  finalMatch: Match;
  currentMatchId: string;
  champion: TournamentPlayer | null;
  onPlayMatch: (matchId: string) => void;
}) {
  return (
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
            isCurrent={currentMatchId === finalMatch.id}
            onPlay={() => onPlayMatch(finalMatch.id)}
          />
        )}
      </div>

      <ChampionCard champion={champion} />
    </div>
  );
}

function BracketLayout({
  semis,
  finalMatch,
  currentMatchId,
  champion,
  onPlayMatch,
}: {
  semis: Match[];
  finalMatch: Match;
  currentMatchId: string;
  champion: TournamentPlayer | null;
  onPlayMatch: (matchId: string) => void;
}) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <SemisSection semis={semis} currentMatchId={currentMatchId} onPlayMatch={onPlayMatch} />
      <FinalAndChampionSection
        finalMatch={finalMatch}
        currentMatchId={currentMatchId}
        champion={champion}
        onPlayMatch={onPlayMatch}
      />
    </div>
  );
}

function FooterActions({
  isComplete,
  onEndTournament,
}: {
  isComplete: boolean;
  onEndTournament: () => void;
}) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-white/60">
        {isComplete ? "Tournament complete." : "Play the current match to progress."}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onEndTournament}
          className="rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
        >
          End Tournament
        </button>
      </div>
    </div>
  );
}

export default function TournamentPage() {
  const router = useRouter();
  const socket = useSocket();

  const [state, setState] = useState<TournamentState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lastNotifiedMatchIdRef = useRef<string | null>(null);

  useEffect(() => {
    const existing = loadStateSafe();
    if (existing) {
      const hydrated = advanceLocks(existing);
      saveState(hydrated);
      setState(hydrated);
      return;
    }

    const payload = safeParse<TournamentCreatePayload>(localStorage.getItem(TOURNAMENT_CREATE_STORAGE_KEY));
    if (!payload || !payload.name || !Array.isArray(payload.players) || payload.players.length !== 4) {
      setError("Tournament setup not found. Please create a tournament first.");
      return;
    }

    const built = buildBracket(payload.players, payload.name);
    saveState(built);
    setState(built);
  }, []);

  useEffect(() => {
    if (!state) return;

    const { match: nextMatch, label } = getNextMatchInfo(state);

    if (!socket) return;
    if (nextMatch.status !== "ready") return;

    if (lastNotifiedMatchIdRef.current === nextMatch.id) return;
    lastNotifiedMatchIdRef.current = nextMatch.id;

    const message = buildNextRoundMessage(label, nextMatch.a, nextMatch.b);

    const receivers = Array.from(new Set([state.semis[0].b.id, state.semis[1].a.id, state.semis[1].b.id]));
    receivers.forEach((receiverId) => {
			socket.emit("chat:send", {
				receiverId: receiverId,
				type: "text_message",
				content: message,
			});
    });
  }, [state, socket]);

  const payload = useMemo(() => {
    if (!state) return null;
    return { name: state.name, players: state.players } satisfies TournamentCreatePayload;
  }, [state]);

  const finalMatch = state?.final ?? null;
  const champion = useMemo(() => computeChampion(finalMatch), [finalMatch]);

  useEffect(() => {
    if (!state?.final?.winnerId) return;
    localStorage.removeItem(TOURNAMENT_CREATE_STORAGE_KEY);
    localStorage.removeItem(TOURNAMENT_STATE_STORAGE_KEY);
  }, [state?.final?.winnerId]);

  const persist = (next: TournamentState) => {
    setState(next);
    saveState(next);
  };

  const resetTournament = () => {
    const create = safeParse<TournamentCreatePayload>(localStorage.getItem(TOURNAMENT_CREATE_STORAGE_KEY));
    if (!create || create.players.length !== 4) return;
    const rebuilt = buildBracket(create.players, create.name);
    saveState(rebuilt);
    setError(null);
    setState(rebuilt);

    lastNotifiedMatchIdRef.current = null;
  };

  const clearAndBack = () => {
    localStorage.removeItem(TOURNAMENT_CREATE_STORAGE_KEY);
    localStorage.removeItem(TOURNAMENT_STATE_STORAGE_KEY);
    router.push("/game");
  };

  const playMatch = (matchId: string) => {
    if (!state) return;

    const m = findMatch(state, matchId);
    if (!m) return;

    if (state.currentMatchId !== matchId) return;
    if (m.status !== "ready" && m.status !== "in_progress") return;

    const next = structuredClone(state);
    const mm = findMatch(next, matchId);
    if (mm && mm.status === "ready") mm.status = "in_progress";
    next.updatedAt = new Date().toISOString();
    persist(next);

    router.push(`/game/local?mode=tournament&matchId=${matchId}`);
  };

  if (error) {
    return (
      <ErrorState
        title="Tournament"
        message={error}
        onBack={() => router.push("/game")}
        onClear={clearAndBack}
      />
    );
  }

  if (!payload || !finalMatch || !state) return <LoadingState />;

  const currentMatchLabel = (() => {
    const cm = findMatch(state, state.currentMatchId);
    if (!cm) return "—";
    return `@${cm.a.username} vs @${cm.b.username}`;
  })();

  return (
    <PageShell>
      <TournamentHeader
        name={payload.name}
        currentMatchLabel={currentMatchLabel}
        onBack={() => router.push("/game")}
        onReset={resetTournament}
      />

      <PlayersSection players={payload.players} />

      <BracketLayout
        semis={state.semis}
        finalMatch={finalMatch}
        currentMatchId={state.currentMatchId}
        champion={champion}
        onPlayMatch={playMatch}
      />

      <FooterActions isComplete={!!finalMatch.winnerId} onEndTournament={clearAndBack} />
    </PageShell>
  );
}
