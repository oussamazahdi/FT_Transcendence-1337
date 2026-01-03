"use client";

import { useAuth } from "@/contexts/authContext";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { DoorOpen, RotateCcw } from "lucide-react";

const socket = io("http://localhost:3001", {
  transports: ["websocket"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const emptyPlayer = () => ({
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
  const router = useRouter();

  const [status, setStatus] = useState("Searching for opponent...");
  const [player1, setPlayer1] = useState(emptyPlayer());
  const [player2, setPlayer2] = useState(emptyPlayer());
  const [canExit, setCanExit] = useState(true);
  const [canTryAgain, setCanTryAgain] = useState(false);

  const joinedRef = useRef(false);
  const navigatedRef = useRef(false);

  useEffect(() => {
    if (!user) return;

    setPlayer1({ ...emptyPlayer(),
      firstName: user.firstname,
      lastName: user.lastname,
      username: user.username,
      avatar: user.avatar,
    });
  }, [user]);

  const joinGame = () => {
    socket.emit("join-game", {
      firstName: user.firstname,
      lastName: user.lastname,
      username: user.username,
      avatar: user.avatar,
    });
    joinedRef.current = true;
    setStatus("Waiting for opponent...");
    setCanTryAgain(false);
  };

  const handleExit = () => {
    if (!canExit) return;

    navigatedRef.current = true;
    socket.emit("leave-game");
    socket.disconnect();
    router.push("/game/pingPong");
  };

  const handleTryAgain = () => {
		// router.refresh();
		window.location.reload();
    // if (!canTryAgain) return;

    // setPlayer2(emptyPlayer());
    // joinGame();
  };

  useEffect(() => {
    if (!user || navigatedRef.current) return;

    if (!socket.connected) socket.connect();

    const handleConnect = () => {
      setPlayer1(prev => ({ ...prev, socketId: socket.id }));
      if (!joinedRef.current) joinGame();
    };

    const handleMatchFound = opponent => {
      setPlayer2(opponent);
      setStatus("Match Found!");
      setCanExit(false);
    };

    const handleMatchCanceled = () => {
      setPlayer2(emptyPlayer());
      setStatus("Opponent left. Try again.");
      setCanExit(true);
      setCanTryAgain(true);
      joinedRef.current = false;
    };

    const handleMatchStarted = roomId => {
      router.push(`/game/pingPong/${roomId}`);
      router.refresh();
    };

    socket.on("connect", handleConnect);
    socket.on("match-found", handleMatchFound);
    socket.on("match-canceled", handleMatchCanceled);
    socket.on("match-started", handleMatchStarted);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("match-found", handleMatchFound);
      socket.off("match-canceled", handleMatchCanceled);
      socket.off("match-started", handleMatchStarted);
    };
  }, [user, router]);

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
        <button
          onClick={handleTryAgain}
          disabled={!canTryAgain}
          className={`flex items-center gap-2 rounded-md px-6 py-2 font-medium transition ${
            canTryAgain
              ? "bg-[#1E3A2F] text-[#4DFFB3] hover:bg-[#162A22]"
              : "bg-[#252525] text-[#717171] cursor-not-allowed"
          }`}
        >
          <RotateCcw size={18} />
          Try Again
        </button>

        <button
          onClick={handleExit}
          disabled={!canExit}
          className={`flex items-center gap-2 rounded-md px-6 py-2 font-medium transition ${
            canExit
              ? "bg-[#442222] text-[#FF4848] hover:bg-[#3C1C1C]"
              : "bg-[#252525] text-[#717171] cursor-not-allowed"
          }`}
        >
          <DoorOpen size={18} />
          Exit
        </button>
      </div>
    </div>
  );
}

function PlayerCard({ player, label }) {
  const isActive = !!player.socketId;

  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={isActive ? player.avatar : "/gameAvatars/Empty.jpeg"}
        alt="profile"
        className="h-28 w-28 sm:h-36 sm:w-36 rounded-xl object-cover"
      />
      <h3 className="mt-2 text-lg sm:text-xl font-semibold">
        {isActive
          ? `${player.firstName}.${player.lastName?.[0]}`
          : label}
      </h3>
      <p className="text-sm font-medium text-[#6E6E6E]">
        [{isActive ? player.username : "waiting"}]
      </p>
    </div>
  );
}
