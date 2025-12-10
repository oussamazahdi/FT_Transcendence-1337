import React, { useEffect, useState } from "react"
import { CountdownTimer } from "@/components/ui/CountdownTimer"

type Player = {
  socketId?: string
  login?: string
  firstName?: string
  lastName?: string
  avatar?: string
}

type GameRoom = {
  player1: Player
  player2: Player
}

export default function FindMatch({ gameRoom }: { gameRoom: GameRoom }) {

  const [timer, setTimer] = useState(false)
  const [status, setStatus] = useState("Waiting for opponent...")

  useEffect(() => {
    if (gameRoom.player1.socketId && gameRoom.player2.socketId) {
      setTimer(true)
      setStatus("Match found!")
    }
  }, [gameRoom.player1.socketId, gameRoom.player2.socketId])

  return (
    <div className='flex flex-col items-center bg-[#0F0F0F]/65 p-10 rounded-3xl'>
      
      <h3 className='text-3xl font-extrabold'>Find Match</h3>
      <h3 className='mb-6 text-white/50'>{status}</h3>

      <div className="flex items-center justify-between gap-x-25">

        <div className='flex flex-col items-center'>
          <img
            src={gameRoom.player1.avatar || "/gameAvatars/Empty.jpeg"}
            alt="profile"
            className="h-35 w-35 rounded-xl"
          />

          <h3 className='text-xl font-semibold'>
            {gameRoom.player1.firstName || "Player 1"}
            {gameRoom.player1.lastName ? "." + gameRoom.player1.lastName[0] : ""}
          </h3>

          <h3 className='text-md font-medium text-[#6E6E6E]'>
            [{gameRoom.player1.login || "loading"}]
          </h3>
        </div>

        <span className="text-3xl font-extrabold">VS</span>

        <div className='flex flex-col items-center'>
          <img
            src={gameRoom.player2.socketId 
              ? gameRoom.player2.avatar 
              : "/gameAvatars/Empty.jpeg"}
            alt="profile"
            className="h-35 w-35 rounded-xl"
          />

          <h3 className='text-xl font-semibold'>
            {gameRoom.player2.socketId
              ? gameRoom.player2.firstName + "." + gameRoom.player2.lastName?.[0]
              : "Player 2"}
          </h3>

          <h3 className='text-md font-medium text-[#6E6E6E]'>
            [{gameRoom.player2.socketId ? gameRoom.player2.login : "waiting"}]
          </h3>
        </div>
      </div>

      {timer && (
        <CountdownTimer
          totalMinutes={0}
          totalSeconds={3}
          onFinish={() => console.log("Timer finished")}
          startColor="#D9D9D9"
          endColor="#D9D9D9"
          size="md"
        />
      )}

    </div>
  )
}
