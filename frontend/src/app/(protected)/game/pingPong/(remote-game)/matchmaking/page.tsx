'use client'

import React, { useState, useEffect } from 'react'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import Link from 'next/link'
import { players } from "@/assets/players.js"
import { io } from 'socket.io-client'
import { useRouter } from 'next/navigation'
import FindMatch from '@/components/RemoteGame/findMatch'


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

  useEffect(() => {
    const curPlayer = players[Math.floor(Math.random() * players.length)];
			setGameRoom(prev => ({...prev, player1: {
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
			setTimeout(setMatched, 3000, true);
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

	return(
		<>
			{!matched ? 
				<FindMatch gameRoom={gameRoom} />: <h1>hola</h1>
			}
		</>
	)
}
