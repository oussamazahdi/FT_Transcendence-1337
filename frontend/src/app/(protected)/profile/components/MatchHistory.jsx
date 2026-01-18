"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/data";
import { useAuth } from "@/contexts/authContext";

const API = process.env.NEXT_PUBLIC_API_URL;

const safeAvatarSrc = (src) => (src && src !== "null" ? src : assets.defaultProfile);

const SafeAvatar = React.memo(function SafeAvatar({ src, alt = "avatar" }) {
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

function formatDate(input) {
  if (!input) return "";
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? String(input) : d.toLocaleString();
}

async function fetchJson(url) {
  const res = await fetch(url, { method: "GET", credentials: "include" });
  const json = await res.json().catch(() => ({}));
  return { res, json };
}

function normalizeUser(json) {
  return json?.userData ?? json?.user ?? null;
}

function normalizeHistoryPayload(json) {
  const payload = json?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function normalizeMatch(raw, u1, u2) {
  if (!raw) return null;

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

export default function MatchHistory({ classname = "" }) {
  useAuth(); // keep auth context hooked (even if user isn't used right now)

  const [loading, setLoading] = useState(false);
  const [usersById, setUsersById] = useState({});
  const [matches, setMatches] = useState([]);

  const usersByIdRef = useRef(usersById);
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
      const { res, json } = await fetchJson(`${API}/api/game/history`);
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

      let mergedUsers = currentUsers;

      if (missingIds.length > 0) {
        const results = await Promise.all(
          missingIds.map(async (id) => {
            const { res: uRes, json: uJson } = await fetchJson(`${API}/api/users/${id}`);
            if (!uRes.ok) return [id, null];
            return [id, normalizeUser(uJson)];
          })
        );

        const patch = {};
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
        .map((m) => normalizeMatch(m, mergedUsers[m.player1_id], mergedUsers[m.player2_id]))
        .filter(Boolean);

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
          <SafeAvatar src={match.player1.avatar} alt={`${match.player1.username} avatar`} />
          <p className="text-xs font-bold truncate">{match.player1.username}</p>
        </div>

        <div className="flex flex-col justify-center items-center w-24 shrink-0">
          <p className="text-sm font-bold whitespace-nowrap">
            {match.player1.score} - {match.player2.score}
          </p>
          <p className="text-[10px] text-gray-400 whitespace-nowrap">{match.createdAt}</p>
        </div>

        <div className="flex items-center justify-end flex-1 gap-2 min-w-0">
          <p className="text-xs font-bold truncate">{match.player2.username}</p>
          <SafeAvatar src={match.player2.avatar} alt={`${match.player2.username} avatar`} />
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
