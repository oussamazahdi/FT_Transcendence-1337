"use client";
// import React from "react";
// import { assets } from "@/assets/data";
// import Image from "next/image";
// import { useAuth } from "@/contexts/authContext";

// const WinOrLose = (player1, player2) => {};
// const MatchHistoryData = [
//   {
//     id: "1",
//     player1: { username: "sarif", avatar: assets.soufiixPdp, score: "10" },
//     player2: { username: "ozahdi", avatar: assets.mohcinePdp, score: "8" },
//     createdAt: "25/11/2025 10:55",
//   },
//   {
//     id: "2",
//     player1: { username: "kael-ala", avatar: assets.kamalPdp, score: "9" },
//     player2: { username: "sarif", avatar: assets.soufiixPdp, score: "14" },
//     createdAt: "25/11/2025 10:55",
//   },
//   {
//     id: "3",
//     player1: { username: "ozahdi", avatar: assets.mohcinePdp, score: "17" },
//     player2: { username: "kael-ala", avatar: assets.kamalPdp, score: "0" },
//     createdAt: "25/11/2025 10:55",
//   },
//   {
//     id: "4",
//     player1: { username: "sarif", avatar: assets.soufiixPdp, score: "10" },
//     player2: { username: "ozahdi", avatar: assets.mohcinePdp, score: "8" },
//     createdAt: "25/11/2025 10:55",
//   },
//   {
//     id: "5",
//     player1: { username: "kael-ala", avatar: assets.kamalPdp, score: "9" },
//     player2: { username: "sarif", avatar: assets.soufiixPdp, score: "14" },
//     createdAt: "25/11/2025 10:55",
//   },
//   {
//     id: "6",
//     player1: { username: "ozahdi", avatar: assets.mohcinePdp, score: "17" },
//     player2: { username: "kael-ala", avatar: assets.kamalPdp, score: "0" },
//     createdAt: "25/11/2025 10:55",
//   },
//   {
//     id: "7",
//     player1: { username: "sarif", avatar: assets.soufiixPdp, score: "10" },
//     player2: { username: "ozahdi", avatar: assets.mohcinePdp, score: "8" },
//     createdAt: "25/11/2025 10:55",
//   },
//   {
//     id: "8",
//     player1: { username: "kael-ala", avatar: assets.kamalPdp, score: "9" },
//     player2: { username: "sarif", avatar: assets.soufiixPdp, score: "14" },
//     createdAt: "25/11/2025 10:55",
//   },
//   {
//     id: "9",
//     player1: { username: "ozahdi", avatar: assets.mohcinePdp, score: "17" },
//     player2: { username: "kael-ala", avatar: assets.kamalPdp, score: "0" },
//     createdAt: "25/11/2025 10:55",
//   },
// ];

// const renderHistory = MatchHistoryData.map((match) => (
//   <div
//     key={match.id}
//     className="flex justify-between items-center w-full h-12 bg-[#414141]/60 rounded-lg p-1 hover:bg-[#414141]"
//   >
//     <div className="flex items-center flex-1 gap-2 min-w-0 justify-start">
//       <Image
//         src={match.player1.avatar}
//         alt="avatar"
//         width={40}
//         height={40}
//         className="rounded-md shrink-0"
//       />
//       <p className="text-xs font-bold truncate">{match.player1.username}</p>
//     </div>
//     <div className="flex flex-col justify-center items-center w-24 shrink-0">
//       <p className="text-sm font-bold whitespace-nowrap">
//         {match.player1.score} - {match.player2.score}
//       </p>
//       <p className="text-[10px] text-gray-400 whitespace-nowra">
//         {match.createdAt}
//       </p>
//     </div>
//     <div className="flex items-center justify-end flex-1 gap-2 min-w-0">
//       <p className="text-xs font-bold truncate">{match.player2.username}</p>
//       <Image
//         src={match.player2.avatar}
//         alt="avatar"
//         width={40}
//         height={40}
//         className="rounded-md shrink-0"
//       />
//     </div>
//   </div>
// ));

// const MatchHistory = ({ classname }) => {
//   const { user } = useAuth();

//   return (
//     <div
//       className={`min-h-0 h-full bg-[#0F0F0F]/75 rounded-[20px] p-3 flex flex-col ${classname}`}
//     >
//       <p className="font-bold text-sm shrink-0">Match history</p>
//       <div className="flex flex-col gap-1 w-full mt-2 overflow-y-auto custom-scrollbar flex-1 min-h-0">
//         {renderHistory}
//       </div>
//     </div>
//   );
// };

// export default MatchHistory;






// import React, { useCallback, useState } from "react";
// import { assets } from "@/assets/data";
// import Image from "next/image";
// import { useAuth } from "@/contexts/authContext";

// const WinOrLose = (player1, player2) => {};
// const MatchHistoryData = [
//   {
//     id: "1",
//     player1: { username: "sarif", avatar: assets.soufiixPdp, score: "10" },
//     player2: { username: "ozahdi", avatar: assets.mohcinePdp, score: "8" },
//     createdAt: "25/11/2025 10:55",
//   },
//   {
//     id: "2",
//     player1: { username: "kael-ala", avatar: assets.kamalPdp, score: "9" },
//     player2: { username: "sarif", avatar: assets.soufiixPdp, score: "14" },
//     createdAt: "25/11/2025 10:55",
//   },
//   {
//     id: "3",
//     player1: { username: "ozahdi", avatar: assets.mohcinePdp, score: "17" },
//     player2: { username: "kael-ala", avatar: assets.kamalPdp, score: "0" },
//     createdAt: "25/11/2025 10:55",
//   },
//   {
//     id: "4",
//     player1: { username: "sarif", avatar: assets.soufiixPdp, score: "10" },
//     player2: { username: "ozahdi", avatar: assets.mohcinePdp, score: "8" },
//     createdAt: "25/11/2025 10:55",
//   },
//   {
//     id: "5",
//     player1: { username: "kael-ala", avatar: assets.kamalPdp, score: "9" },
//     player2: { username: "sarif", avatar: assets.soufiixPdp, score: "14" },
//     createdAt: "25/11/2025 10:55",
//   },
//   {
//     id: "6",
//     player1: { username: "ozahdi", avatar: assets.mohcinePdp, score: "17" },
//     player2: { username: "kael-ala", avatar: assets.kamalPdp, score: "0" },
//     createdAt: "25/11/2025 10:55",
//   },
//   {
//     id: "7",
//     player1: { username: "sarif", avatar: assets.soufiixPdp, score: "10" },
//     player2: { username: "ozahdi", avatar: assets.mohcinePdp, score: "8" },
//     createdAt: "25/11/2025 10:55",
//   },
//   {
//     id: "8",
//     player1: { username: "kael-ala", avatar: assets.kamalPdp, score: "9" },
//     player2: { username: "sarif", avatar: assets.soufiixPdp, score: "14" },
//     createdAt: "25/11/2025 10:55",
//   },
//   {
//     id: "9",
//     player1: { username: "ozahdi", avatar: assets.mohcinePdp, score: "17" },
//     player2: { username: "kael-ala", avatar: assets.kamalPdp, score: "0" },
//     createdAt: "25/11/2025 10:55",
//   },
// ];

// const renderHistory = MatchHistoryData.map((match) => (
//   <div
//     key={match.id}
//     className="flex justify-between items-center w-full h-12 bg-[#414141]/60 rounded-lg p-1 hover:bg-[#414141]"
//   >
//     <div className="flex items-center flex-1 gap-2 min-w-0 justify-start">
//       <Image
//         src={match.player1.avatar}
//         alt="avatar"
//         width={40}
//         height={40}
//         className="rounded-md shrink-0"
//       />
//       <p className="text-xs font-bold truncate">{match.player1.username}</p>
//     </div>
//     <div className="flex flex-col justify-center items-center w-24 shrink-0">
//       <p className="text-sm font-bold whitespace-nowrap">
//         {match.player1.score} - {match.player2.score}
//       </p>
//       <p className="text-[10px] text-gray-400 whitespace-nowra">
//         {match.createdAt}
//       </p>
//     </div>
//     <div className="flex items-center justify-end flex-1 gap-2 min-w-0">
//       <p className="text-xs font-bold truncate">{match.player2.username}</p>
//       <Image
//         src={match.player2.avatar}
//         alt="avatar"
//         width={40}
//         height={40}
//         className="rounded-md shrink-0"
//       />
//     </div>
//   </div>
// ));



// const fetchNotifications = useCallback(async () => {
// 	setUnreadCount(0);
	
// 	const res = await fetch("http://localhost:3001/api/notifications", { credentials: "include" });
// 	const data = await res.json().catch(() => ({}));

// 	if (res.status === 401 || !res.ok) {
	// 		setIsOpen(false);
	// 		setLoading(false);
	// 		return null;
	// 	}
	
	// 	return Array.isArray(data?.userData) ? data.userData : [];
	// }, []);
	
	
// const fetchMatchHistory = useCallback(async ()=>{
// 	const res = fetch("http://localhost:3001/api/game/history", { credentials: "include" });
// 	const matches = (await res).json().catch(()=>({}));
		
// 	if (res.status === 401 || !res.ok) return null;

// 	return (Array.isArray(data?.data) ? data.data : []);
// })

// const MatchHistory = ({ classname }) => {
  
// 	const [usersById, setUsersById] = useState({});
	
// 	const { user } = useAuth();



//   return (
//     <div
//       className={`min-h-0 h-full bg-[#0F0F0F]/75 rounded-[20px] p-3 flex flex-col ${classname}`}
//     >
//       <p className="font-bold text-sm shrink-0">Match history</p>
//       <div className="flex flex-col gap-1 w-full mt-2 overflow-y-auto custom-scrollbar flex-1 min-h-0">
//         {renderHistory}
//       </div>
//     </div>
//   );
// };

// export default MatchHistory;




"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/data";
import { useAuth } from "@/contexts/authContext";

const SafeAvatar = ({ src }) => {
  const safeSrc = src && src !== "null" ? src : assets.defaultProfile;

  return (
    <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-md">
      <Image src={safeSrc} alt="avatar" fill sizes="56px" className="object-cover"/>
    </div>
  );
};

function formatDate(input) {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return String(input);
  return d.toLocaleString();
}

export default function MatchHistory({ classname }) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [usersById, setUsersById] = useState({});
  const [matches, setMatches] = useState([]);

  const fetchUserById = useCallback(async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json().catch(() => ({}));
    return data?.userData ?? data?.user ?? null;
  }, []);

  const fetchMatchHistory = useCallback(async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/game/history`, {
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401 || !res.ok) return null;

    const payload = data?.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.items)) return payload.items;

    return [];
  }, []);

  const normalizeMatch = useCallback((raw, u1, u2) => {
    if (!raw) return null;
    return {
      id: raw.id,
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
  }, []);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchMatchHistory();
      if (!list) return;

      const ids = [
        ...new Set(
          list
            .flatMap((m) => [m.player1_id, m.player2_id])
            .filter((v) => Number.isInteger(v) || typeof v === "number")
        ),
      ];

      const missing = ids.filter((id) => usersById[id] == null);

      let nextUsersById = usersById;

      if (missing.length > 0) {
        const results = await Promise.all(missing.map((id) => fetchUserById(id)));

        nextUsersById = { ...usersById };
        missing.forEach((id, idx) => {
          const u = results[idx];
          if (u) nextUsersById[id] = u;
        });

        setUsersById(nextUsersById);
      }

      const normalized = list
        .map((m) =>
          normalizeMatch(m, nextUsersById[m.player1_id], nextUsersById[m.player2_id])
        )
        .filter(Boolean);

      setMatches(normalized);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [fetchMatchHistory, fetchUserById, normalizeMatch, usersById]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const renderHistory = useMemo(
    () =>
      matches.map((match) => (
        <div
          key={match.id}
          className="flex justify-between items-center w-full h-12 bg-[#414141]/60 rounded-lg p-1 hover:bg-[#414141]"
        >
          <div className="flex items-center flex-1 gap-2 min-w-0 justify-start">
            <SafeAvatar src={match.player1.avatar} />
            <p className="text-xs font-bold truncate">{match.player1.username}</p>
          </div>

          <div className="flex flex-col justify-center items-center w-24 shrink-0">
            <p className="text-sm font-bold whitespace-nowrap">
              {match.player1.score} - {match.player2.score}
            </p>
            <p className="text-[10px] text-gray-400 whitespace-nowrap">
              {match.createdAt}
            </p>
          </div>

          <div className="flex items-center justify-end flex-1 gap-2 min-w-0">
            <p className="text-xs font-bold truncate">{match.player2.username}</p>
            <SafeAvatar src={match.player2.avatar} />
          </div>
        </div>
      )),
    [matches]
  );

  return (
    <div className={`min-h-0 h-full bg-[#0F0F0F]/75 rounded-[20px] p-3 flex flex-col ${classname}`}>
      <p className="font-bold text-sm shrink-0">Match history</p>

      <div className="flex flex-col gap-1 w-full mt-2 overflow-y-auto custom-scrollbar flex-1 min-h-0">
        {loading ? (
          <p className="text-[10px] text-white/60 text-center py-4">Loading...</p>
        ) : matches.length > 0 ? (
          renderHistory
        ) : (
          <p className="text-[10px] text-white/60 text-center py-4">No matches</p>
        )}
      </div>
    </div>
  );
}
