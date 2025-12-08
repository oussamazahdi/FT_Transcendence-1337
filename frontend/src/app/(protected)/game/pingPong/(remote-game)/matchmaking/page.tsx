'use client'

import React, { useState, useEffect } from 'react'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import Link from 'next/link'
import { players } from "@/assets/players.js"
import { io } from 'socket.io-client'
import { useRouter } from 'next/navigation'


const socket = io("http://localhost:3001", {
  transports: ["websocket"],
  autoConnect: false
});

type Player = {
  socketId: string;
  login: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

class GameSession {
  player1: Player;
  player2: Player;

  constructor() {
    this.player1 = {
      socketId: "",
      login: "",
      firstName: "",
      lastName: "",
      avatar: ""
    };
    this.player2 = {
      socketId: "",
      login: "",
      firstName: "",
      lastName: "",
      avatar: ""
    };
  }
}

export default function Matchmaking() {

  const [gameRoom, setGameRoom] = useState(new GameSession())
  const [status, setStatus] = useState("Searching for opponent...");
  const [timer, setTimer] = useState(false)
  const [matched, setMatched] = useState(false)
	const router = useRouter();

  // ✅ SET RANDOM PLAYER (CLIENT ONLY)
  useEffect(() => {
    const curPlayer = players[Math.floor(Math.random() * players.length)];

    setGameRoom(prev => ({
      ...prev,
      player1: {
        socketId: "",
        login: curPlayer.login,
        firstName: curPlayer.firstName,
        lastName: curPlayer.lastName,
        avatar: curPlayer.avatar
      }
    }));
  }, []);

  // ✅ SOCKET SETUP
  useEffect(() => {
    if (socket.connected) return;

    socket.connect();

    const handleConnect = () => {
      setGameRoom(prev => {
        const updated = {
          ...prev,
          player1: {
            ...prev.player1,
            socketId: socket.id!
          }
        };

        socket.emit("join-game", updated.player1);
        return updated;
      });

      setStatus("Waiting for opponent...");
    };

    const handleMatchFound = (playerData: Player) => {
      setGameRoom(prev => ({
        ...prev,
        player2: playerData
      }));

      setMatched(true);
      setStatus("Match found!");
      setTimer(true);
    };

    const handleDisconnect = () => {
      setStatus("Disconnected");
      setMatched(false);
      setTimer(false);
    };

    socket.on("connect", handleConnect);
    socket.on("match-found", handleMatchFound);
    socket.on("disconnect", handleDisconnect);

    // ✅ Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("match-found", handleMatchFound);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };

  }, []);

  return (
    <div className='flex flex-col items-center bg-[#0F0F0F]/65 p-10 rounded-3xl'>
      
      <h3 className='text-3xl font-extrabold'>Find Match</h3>
      <h3 className='mb-6 text-white/50'>{status}</h3>

      <div className="flex items-center justify-between gap-x-25">

        {/* PLAYER 1 */}
        <div className='flex flex-col items-center'>
          <img src={gameRoom.player1.avatar || "/gameAvatars/Empty.jpeg"}
            alt="profile"
            className="h-35 w-35 rounded-xl" />

          <h3 className='text-xl font-semibold'>
            {gameRoom.player1.firstName}
            {gameRoom.player1.lastName ? "." + gameRoom.player1.lastName[0] : ""}
          </h3>

          <h3 className='text-md font-medium text-[#6E6E6E]'>
            [{gameRoom.player1.login || "loading"}]
          </h3>
        </div>

        <span className="text-3xl font-extrabold">VS</span>

        {/* PLAYER 2 */}
        <div className='flex flex-col items-center'>
          <img
            src={gameRoom.player2.socketId ? gameRoom.player2.avatar : "/gameAvatars/Empty.jpeg"}
            alt="profile"
            className="h-35 w-35 rounded-xl"
          />

          <h3 className='text-xl font-semibold'>
            {gameRoom.player2.socketId
              ? gameRoom.player2.firstName + "." + gameRoom.player2.lastName[0]
              : "Player 2"}
          </h3>

          <h3 className='text-md font-medium text-[#6E6E6E]'>
            [{gameRoom.player2.socketId ? gameRoom.player2.login : "waiting"}]
          </h3>
        </div>
      </div>

      {/* TIMER */}
      {timer && (
        <CountdownTimer
          totalMinutes={0}
          totalSeconds={5}
          onFinish={() => {setTimer(true), router.push("/game/pingPong/local-game")}}
          startColor="#D9D9D9"
          endColor="#D9D9D9"
          size="md"
        />
      )}

      {/* BUTTONS */}
      {/* {!timer && matched && (
        <div className='flex gap-3 mt-5'>
          <Link href={"/game/pingPong"}>
            <button className='bg-[#0F0F0F]/65 text-white/40 hover:text-white px-3 py-2 rounded-md'>
              Start Game
            </button>
          </Link>

          <button onClick={() => window.location.reload()}
            className='bg-[#0F0F0F]/65 text-white/40 hover:text-white px-3 py-2 rounded-md'>
            Retry
          </button>
        </div>
      )} */}

    </div>
  )
}
