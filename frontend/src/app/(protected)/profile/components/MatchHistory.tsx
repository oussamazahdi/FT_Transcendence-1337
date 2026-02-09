"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { assets } from "@/assets/data";
import { useAuth } from "@/contexts/authContext";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

type AvatarSrc = string | StaticImageData;

type MatchHistoryProps = {
  classname?: string;
};

type SafeAvatarProps = {
  src?: AvatarSrc | null;
  alt?: string;
};

type MinimalUser = {
  id?: number | string;
  username?: string;
  avatar?: AvatarSrc | null;
};

type UsersById = Record<number, MinimalUser>;

type RawMatch = {
  id?: number | string;
  player1_id?: number;
  player2_id?: number;
  player1_score?: number | string;
  player2_score?: number | string;
  created_at?: string;
};

type MatchHistoryResponse = {
  data?: RawMatch[] | { items?: RawMatch[] };
};

type UserResponse = {
  userData?: MinimalUser;
  user?: MinimalUser;
};

type NormalizedMatch = {
  id: string | number;
  player1: {
    id: number;
    username: string;
    avatar?: AvatarSrc | null;
    score: string;
  };
  player2: {
    id: number;
    username: string;
    avatar?: AvatarSrc | null;
    score: string;
  };
  createdAt: string;
};

const safeAvatarSrc = (src?: AvatarSrc | null): AvatarSrc => {
  if (!src) return assets.defaultProfile;
  if (typeof src === "string" && src === "null") return assets.defaultProfile;
  return src;
};

const SafeAvatar = React.memo(function SafeAvatar({ src, alt = "avatar" }: SafeAvatarProps) {
  return (
    <Image
      src={safeAvatarSrc(src)}
      alt={alt}
      width={40}
      height={40}
      className="w-10 h-10 rounded-md shrink-0 object-cover"
    />
  );
});

function formatDate(input?: string | number | Date | null) {
  if (!input) return "";
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? String(input) : d.toLocaleString();
}

async function fetchJson<T = unknown>(url: string): Promise<{ res: Response; json: T }> {
  const res = await fetch(url, { method: "GET", credentials: "include" });
  const json = await res.json().catch(() => ({} as T));
  return { res, json };
}

function normalizeUser(json: UserResponse): MinimalUser | null {
  return json?.userData ?? json?.user ?? null;
}

function normalizeHistoryPayload(json: MatchHistoryResponse): RawMatch[] {
  const payload = json?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function normalizeMatch(
  raw: RawMatch | null | undefined,
  u1: MinimalUser | null | undefined,
  u2: MinimalUser | null | undefined
): NormalizedMatch | null {
  if (!raw || typeof raw.player1_id !== "number" || typeof raw.player2_id !== "number") return null;

  return {
    id: raw.id ?? `${raw.player1_id}-${raw.player2_id}-${raw.created_at}`,
    player1: {
      id: raw.player1_id,
      username: u1?.username ?? "Unknown",
      avatar: u1?.avatar,
      score: String(raw.player1_score ?? 0),
    },
    player2: {
      id: raw.player2_id,
      username: u2?.username ?? "Unknown",
      avatar: u2?.avatar,
      score: String(raw.player2_score ?? 0),
    },
    createdAt: formatDate(raw.created_at),
  };
}

export default function MatchHistory({ classname = "" }: MatchHistoryProps) {
  useAuth(); // keep auth context hooked (even if user isn't used right now)

  const [loading, setLoading] = useState<boolean>(false);
  const [usersById, setUsersById] = useState<UsersById>({});
  const [matches, setMatches] = useState<NormalizedMatch[]>([]);

  const usersByIdRef = useRef<UsersById>(usersById);
  useEffect(() => {
    usersByIdRef.current = usersById;
  }, [usersById]);

  const loadHistory = useCallback(async () => {
    if (!API) {
      console.error("NEXT_PUBLIC_API_URL is not set");
      setMatches([]);
      return;
    }

    setLoading(true);
    try {
      // 1) fetch history
      const { res, json } = await fetchJson<MatchHistoryResponse>(`${API}/api/game/history`);
      if (res.status === 401 || !res.ok) {
        setMatches([]);
        return;
      }

      const list = normalizeHistoryPayload(json);

      // 2) collect unique player ids
      const ids = Array.from(
        new Set(
          list
            .flatMap((m) => [m?.player1_id, m?.player2_id])
            .filter((id) => typeof id === "number" && Number.isFinite(id))
        )
      );

      // 3) fetch only missing users
      const currentUsers = usersByIdRef.current;
      const missingIds = ids.filter((id) => currentUsers[id] == null);

      let mergedUsers: UsersById = currentUsers;

      if (missingIds.length > 0) {
        const results = await Promise.all(
          missingIds.map(async (id): Promise<[number, MinimalUser | null]> => {
            const { res: uRes, json: uJson } = await fetchJson<UserResponse>(
              `${API}/api/users/${id}`
            );
            if (!uRes.ok) return [id, null];
            return [id, normalizeUser(uJson)];
          })
        );

        const patch: UsersById = {};
        for (const [id, u] of results) {
          if (u) patch[id] = u;
        }

        if (Object.keys(patch).length > 0) {
          mergedUsers = { ...currentUsers, ...patch };
          setUsersById(mergedUsers);
        }
      }

      // 4) normalize matches for UI
      const normalized = list
        .map((m) => {
          const player1Id = typeof m.player1_id === "number" ? m.player1_id : null;
          const player2Id = typeof m.player2_id === "number" ? m.player2_id : null;
          return normalizeMatch(
            m,
            player1Id != null ? mergedUsers[player1Id] : null,
            player2Id != null ? mergedUsers[player2Id] : null
          );
        })
        .filter((match): match is NormalizedMatch => match !== null);
      setMatches(normalized);
    } catch (err) {
      console.error("Failed to load match history:", err);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const rows = useMemo(() => {
    return matches.map((match) => (
      <div
        key={match.id}
        className="flex justify-between items-center w-full h-12 bg-[#414141]/60 rounded-lg p-1 hover:bg-[#414141] transition"
      >
        <div className="flex items-center flex-1 gap-2 min-w-0 justify-start">
					<Link href={`/profile/${match.player1.id}`}>
          	<SafeAvatar src={match.player1.avatar} alt={`${match.player1.username} avatar`} />
					</Link>
					<Link href={`/profile/${match.player1.id}`}>
          	<p className="text-xs font-bold truncate">{match.player1.username}</p>
					</Link>
        </div>

        <div className="flex flex-col justify-center items-center w-24 shrink-0">
          <p className="text-sm font-bold whitespace-nowrap">{match.player1.score} - {match.player2.score}</p>
          <p className="text-[10px] text-gray-400 whitespace-nowrap">{match.createdAt}</p>
        </div>

        <div className="flex items-center justify-end flex-1 gap-2 min-w-0">
					<Link href={`/profile/${match.player2.id}`}>
          	<p className="text-xs font-bold truncate">{match.player2.username}</p>
					</Link>
					<Link href={`/profile/${match.player2.id}`}>
          	<SafeAvatar src={match.player2.avatar} alt={`${match.player2.username} avatar`} />
					</Link>
        </div>
      </div>
    ));
  }, [matches]);

  return (
    <div
      className={`min-h-0 h-full bg-[#0F0F0F]/75 rounded-[20px] p-3 flex flex-col ${classname}`}
    >
      <p className="font-bold text-sm shrink-0">Match history</p>

      <div className="flex flex-col gap-1 w-full mt-2 overflow-y-auto custom-scrollbar flex-1 min-h-0">
        {loading ? (
          <p className="text-[10px] text-white/60 text-center py-4">Loading...</p>
        ) : matches.length > 0 ? (
          rows
        ) : (
          <p className="text-[10px] text-white/60 text-center py-4">No matches</p>
        )}
      </div>
    </div>
  );
}
