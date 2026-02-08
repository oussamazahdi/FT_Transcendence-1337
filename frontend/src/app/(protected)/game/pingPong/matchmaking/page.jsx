"use client";

import { useAuth } from "@/contexts/authContext";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DoorOpen, RotateCcw } from "lucide-react";
import { useSocket } from "@/contexts/socketContext.tsx";
import { PlayerCard } from "./PlayerCard";

const makeEmptyPlayer = () => ({
  id: 0,
  socketId: "",
  firstName: "",
  lastName: "",
  username: "",
  avatar: "",
  score: 0,
  roomId: "",
});

export default function Matchmaking() {
  const { user } = useAuth();
  const socket = useSocket();
  const router = useRouter();

  const emptyPlayer = useMemo(() => makeEmptyPlayer(), []);
  const [status, setStatus] = useState("Searching for opponent...");
  const [player1, setPlayer1] = useState(emptyPlayer);
  const [player2, setPlayer2] = useState(emptyPlayer);
  const [canExit, setCanExit] = useState(true);
  const [canTryAgain, setCanTryAgain] = useState(false);

  const joinedRef = useRef(false);
  const navigatedRef = useRef(false);

  // Keep player1 identity in sync with user (works on refresh too).
  useEffect(() => {
    if (!user) {
      setPlayer1(emptyPlayer);
      return;
    }

    setPlayer1((prev) => ({
      ...prev,
      id: user.id,
      firstName: user.firstname,
      lastName: user.lastname,
      username: user.username,
      avatar: user.avatar,
    }));
  }, [user, emptyPlayer]);

  const joinGame = useCallback(() => {
    if (!user || !socket) return;
    if (joinedRef.current) return;

    socket.emit("join-game", {
      id: user.id,
      firstName: user.firstname,
      lastName: user.lastname,
      username: user.username,
      avatar: user.avatar,
    });

    joinedRef.current = true;
    setStatus("Waiting for opponent...");
    setCanTryAgain(false);
  }, [user, socket]);

  const handleExit = useCallback(() => {
    if (!socket || !canExit) return;

    navigatedRef.current = true;
    socket.emit("leave-game");

    // Optional: you can disconnect, but if you do, make sure you reconnect when coming back.
    socket.disconnect();

    router.push("/game/pingPong");
  }, [socket, canExit, router]);

  const handleTryAgain = useCallback(() => {
		window.location.reload(true)
  }, [emptyPlayer, socket, joinGame]);

  useEffect(() => {
    if (!user || !socket || navigatedRef.current) return;

    // Ensure connected after refresh / after a previous disconnect.
    if (!socket.connected) socket.connect();

    const onConnect = () => {
      setPlayer1((prev) => ({ ...prev, socketId: socket.id || "" }));
      joinGame();
    };

    const onDisconnect = () => {
      // You can optionally show a status; keeps UX transparent.
      setStatus("Disconnected. Reconnecting...");
      joinedRef.current = false;
    };

    const handleMatchFound = (opponent) => {
      setPlayer2(opponent || emptyPlayer);
      setStatus("Match Found!");
      setCanExit(false);
    };

    const handleMatchCanceled = () => {
      setPlayer2(emptyPlayer);
      setStatus("Opponent left. Try again.");
      setCanExit(true);
      setCanTryAgain(true);
      joinedRef.current = false;
    };

    const handleMatchStarted = (roomId) => {
      navigatedRef.current = true;
      router.push(`/game/pingPong/${roomId}`);
      router.refresh();
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("match-found", handleMatchFound);
    socket.on("match-canceled", handleMatchCanceled);
    socket.on("match-started", handleMatchStarted);

    // If already connected when this effect runs, run connect logic immediately.
    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("match-found", handleMatchFound);
      socket.off("match-canceled", handleMatchCanceled);
      socket.off("match-started", handleMatchStarted);
    };
  }, [user, socket, router, joinGame, emptyPlayer]);

  return (
    <div className="w-full max-w-3xl rounded-3xl bg-[#0F0F0F]/65 p-6 sm:p-10 flex flex-col items-center gap-6 mx-8 my-2">
      <div className="text-center">
        <h3 className="text-2xl sm:text-3xl font-extrabold">Find Match</h3>
        <p className="mt-1 text-white/50">{status}</p>
      </div>

      <div className="flex w-full flex-col sm:flex-row items-center justify-center gap-6 sm:gap-16">
        <PlayerCard player={player1} label="You" />
        <span className="text-2xl sm:text-3xl font-extrabold">VS</span>
        <PlayerCard player={player2} label="Opponent" />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <button onClick={handleTryAgain} disabled={!canTryAgain}
        className={`flex items-center gap-2 rounded-md px-6 py-2 font-medium transition ${ canTryAgain
				? "bg-[#1E3A2F] text-[#4DFFB3] hover:bg-[#162A22]" : "bg-[#252525] text-[#717171] cursor-not-allowed"}`}>
          <RotateCcw size={18} />
          Try Again
        </button>

        <button onClick={handleExit} disabled={!canExit}
				className={`flex items-center gap-2 rounded-md px-6 py-2 font-medium transition ${ canExit
        ? "bg-[#442222] text-[#FF4848] hover:bg-[#3C1C1C]" : "bg-[#252525] text-[#717171] cursor-not-allowed"}`}>
          <DoorOpen size={18} />
          Exit
        </button>
      </div>
    </div>
  );
}
