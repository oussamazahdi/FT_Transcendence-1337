"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { assets } from "@/assets/data";
import { useAuth } from "@/contexts/authContext";

const API = process.env.NEXT_PUBLIC_API_URL;

type AvatarSrc = string | StaticImageData;

type MatchHistoryProps = {
  classname?: string;
};

type SafeAvatarProps = {
  src?: AvatarSrc | null;
  alt?: string;
};

type RawMatch = {
  id?: number | string;

  player1_id?: number;
  player1_username?: string;
  player1_avatar?: string | null;

  player2_id?: number;
  player2_username?: string;
  player2_avatar?: string | null;

  player1_score?: number | string;
  player2_score?: number | string;

  created_at?: string;
};

type MatchHistoryResponse = {
  data?: RawMatch[] | { items?: RawMatch[] };
};

type NormalizedMatch = {
  id: string | number;
  player1: {
    id: number;
    username: string;
    avatar: AvatarSrc;
    score: string;
  };
  player2: {
    id: number;
    username: string;
    avatar: AvatarSrc;
    score: string;
  };
  createdAt: string;
};

const safeAvatarSrc = (src?: AvatarSrc | null): AvatarSrc => {
  if (!src) return assets.defaultProfile;
  if (typeof src === "string" && (src === "null" || src.trim() === "")) return assets.defaultProfile;
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
  const json = (await res.json().catch(() => ({} as T))) as T;
  return { res, json };
}

function normalizeHistoryPayload(json: MatchHistoryResponse): RawMatch[] {
  const payload = json?.data;
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && Array.isArray(payload.items)) return payload.items;
  return [];
}

function normalizeMatch(raw: RawMatch): NormalizedMatch | null {
  if (typeof raw.player1_id !== "number" || typeof raw.player2_id !== "number") return null;

  return {
    id: raw.id ?? `${raw.player1_id}-${raw.player2_id}-${raw.created_at ?? ""}`,
    player1: {
      id: raw.player1_id,
      username: raw.player1_username ?? "Unknown",
      avatar: safeAvatarSrc(raw.player1_avatar ?? null),
      score: String(raw.player1_score ?? 0),
    },
    player2: {
      id: raw.player2_id,
      username: raw.player2_username ?? "Unknown",
      avatar: safeAvatarSrc(raw.player2_avatar ?? null),
      score: String(raw.player2_score ?? 0),
    },
    createdAt: formatDate(raw.created_at),
  };
}

export default function MatchHistory({ classname = "" }: MatchHistoryProps) {
  useAuth(); // keep auth context hooked

  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<NormalizedMatch[]>([]);

  const loadHistory = useCallback(async () => {
    if (!API) {
      console.error("NEXT_PUBLIC_API_URL is not set");
      setMatches([]);
      return;
    }

    setLoading(true);
    try {
      const { res, json } = await fetchJson<MatchHistoryResponse>(`${API}/api/game/history`);
      if (res.status === 401 || !res.ok) {
        setMatches([]);
        return;
      }

      const list = normalizeHistoryPayload(json);

      const normalized = list
        .map((m) => normalizeMatch(m))
        .filter((m): m is NormalizedMatch => m !== null);

      setMatches(normalized);
    } catch (err) {
      console.error("Failed to load match history:", err);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const rows = useMemo(() => {
    return matches.map((m) => (
      <div
        key={m.id}
        className="flex justify-between items-center w-full h-12 bg-[#414141]/60 rounded-lg p-1 hover:bg-[#414141] transition"
      >
        <div className="flex items-center flex-1 gap-2 min-w-0 justify-start">
          <Link href={`/profile/${m.player1.id}`} className="shrink-0">
            <SafeAvatar src={m.player1.avatar} alt={`${m.player1.username} avatar`} />
          </Link>
          <Link href={`/profile/${m.player1.id}`} className="min-w-0">
            <p className="text-xs font-bold truncate">{m.player1.username}</p>
          </Link>
        </div>

        <div className="flex flex-col justify-center items-center w-24 shrink-0">
          <p className="text-sm font-bold whitespace-nowrap">
            {m.player1.score} - {m.player2.score}
          </p>
          <p className="text-[10px] text-gray-400 whitespace-nowrap">{m.createdAt}</p>
        </div>

        <div className="flex items-center justify-end flex-1 gap-2 min-w-0">
          <Link href={`/profile/${m.player2.id}`} className="min-w-0">
            <p className="text-xs font-bold truncate text-right">{m.player2.username}</p>
          </Link>
          <Link href={`/profile/${m.player2.id}`} className="shrink-0">
            <SafeAvatar src={m.player2.avatar} alt={`${m.player2.username} avatar`} />
          </Link>
        </div>
      </div>
    ));
  }, [matches]);

  return (
    <div className={`min-h-0 h-full bg-[#0F0F0F]/75 rounded-[20px] p-3 flex flex-col ${classname}`}>
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
