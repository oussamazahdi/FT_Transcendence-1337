// "use client"

// import React, { useState, useEffect } from 'react';

// const Page = () => {
//   const [gameData, setGameData] = useState({
//     player1NickName: "player 1",
//     player1Avatar: "/gameAvatars/Empty.jpeg",
//     player2NickName: "player 2",
//     player2Avatar: "/gameAvatars/Empty.jpeg",
//     paddleColor: "bg-gray-300",
//     ballColor: "bg-white",
//     boardColor: "bg-[#262626]",
//     scoreLimit: 5,
//     ballSpeed: 2,
//     paddleSize: 2,
//     player1Score: 0,
//     player2Score: 0,
//   });

//   useEffect(() => {
//     const dataline = localStorage.getItem("GameData");
//     if (dataline) {
//       setGameData(JSON.parse(dataline));
//     }
//   }, []);

//   return (
//     <div className="absolute top-28 inset-x-0 flex flex-col items-center text-white space-y-6">
//       {/* players + Score */}
//       <div className="flex flex-row items-center justify-between w-full lg:max-w-5xl px-5">
        
//         {/* Player 1 */}
//         <div className="flex gap-4 flex-col md:flex-row items-center">
//           <img
//             src={gameData.player1Avatar}
//             alt="player 1 avatar"
//             className="w-20 h-20 rounded-lg object-cover"
//           />
//           <div className="flex flex-col gap-1">
//             <h3 className="text-2xl font-semibold">{gameData.player1NickName}</h3>
//             <p className="text-xs text-[#858585]">w (up) / s (down)</p>
//           </div>
//         </div>

//         {/* Score */}
//         <div className="flex flex-col items-center">
//           <p className="text-3xl font-bold">{`${gameData.player1Score ?? 0} - ${gameData.player2Score ?? 0}`}</p>
//         </div>

//         {/* Player 2 */}
//         <div className="flex gap-4 flex-col md:flex-row items-center">
//           <div className="flex flex-col text-right gap-1">
//             <h3 className="text-2xl font-semibold">{gameData.player2NickName}</h3>
//             <p className="text-xs text-[#858585]">↑ (up) / ↓ (down)</p>
//           </div>
//           <img
//             src={gameData.player2Avatar}
//             alt="player 2 avatar"
//             className="w-20 h-20 rounded-lg object-cover"
//           />
//         </div>
//       </div>
//       {/* Game section */}
//       <div className='px-110 py-70 border bg-[#262626] rounded-xl '>
//         <h1>Game section</h1>
//       </div>
//       {/* buttons section */}
//       <div className="flex flex-row gap-6 mb-4">
//         <button className="px-6 py-2 bg-[#8D8D8D]/25 rounded-lg hover:bg-white/25 transition">Pause</button>
//         <button className="px-6 py-2 bg-[#8D8D8D]/25 rounded-lg hover:bg-white/25 transition">Restart</button>
//       </div>
//     </div>
//   );
// };

// export default Page;
// "use client"

// import React, { useRef, useState, useEffect } from 'react';

// const Page = () => {
//   const [gameData, setGameData] = useState({
//     player1NickName: "player 1",
//     player1Avatar: "/gameAvatars/Empty.jpeg",
//     player2NickName: "player 2",
//     player2Avatar: "/gameAvatars/Empty.jpeg",
//     paddleColor: "bg-gray-300",
//     ballColor: "bg-white",
//     boardColor: "bg-[#262626]",
//     scoreLimit: 5,
//     ballSpeed: 2,
//     paddleSize: 1,
//     player1Score: 0,
//     player2Score: 0,
//   });
//   console.log(gameData)
//   const width = 1010;
//   const height = 600;
//   useEffect(() => {
//     const dataline = localStorage.getItem("GameData");
//     if (dataline) {
//       setGameData(JSON.parse(dataline));
//     }

//   }, []);

//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  
  
//   const boardData = {
//     boardWidth : 1010,
//     boardHeight : 600,

//   }

//   const [firstPlayer, setFirstPlayer] = useState({
//     playerHeight : 80 * gameData.paddleSize,
//     playerWidth : -12,
//     playerX : 40,
//     playerY : (boardData.boardHeight / 2) - ((70 * gameData.paddleSize) / 2),
//   })
//   // const firstPlayer = {
//   //   playerHeight : 20 * gameData.,
//   //   playerWidth : 10
//   // }



//   useEffect(()=>{
//     const context = canvasRef.current?.getContext("2d");
//     if (!context) {
//       // console.log("failed to get context");
//       return;
//     };

//     context.fillStyle = "#D1D3D4";
//     context.fillRect(firstPlayer.playerX, firstPlayer.playerY, firstPlayer.playerWidth, firstPlayer.playerHeight);


//     console.log("player H : ", firstPlayer.playerHeight, gameData.paddleSize)
//     console.log("player W : ", firstPlayer.playerWidth)
//     console.log("player X : ", firstPlayer.playerX)
//     console.log("player Y : ", firstPlayer.playerY)
//     // context.clearRect(0, 0, width, height);
//     // context.strokeStyle = "red";
//     // context.lineWidth = 2;
//     // const bigX = 10, bigY = 10, bigW = width - 20, bigH = height - 20;
//     // context.strokeRect(bigX, bigY, bigW, bigH);
//   }, [width, height, firstPlayer.playerHeight])






//   return (
//     <div className="absolute top-28 inset-x-0 flex flex-col items-center text-white space-y-6">
//       {/* players + Score */}
//       <div className="flex flex-row items-center justify-between w-full lg:max-w-5xl px-5">
        
//         {/* Player 1 */}
//         <div className="flex gap-4 flex-col md:flex-row items-center">
//           <img
//             src={gameData.player1Avatar}
//             alt="player 1 avatar"
//             className="w-20 h-20 rounded-lg object-cover"
//           />
//           <div className="flex flex-col gap-1">
//             <h3 className="text-2xl font-semibold">{gameData.player1NickName}</h3>
//             <p className="text-xs text-[#858585]">w (up) / s (down)</p>
//           </div>
//         </div>

//         {/* Score */}
//         <div className="flex flex-col items-center">
//           <p className="text-3xl font-bold">{`${gameData.player1Score ?? 0} - ${gameData.player2Score ?? 0}`}</p>
//         </div>

//         {/* Player 2 */}
//         <div className="flex gap-4 flex-col md:flex-row items-center">
//           <div className="flex flex-col text-right gap-1">
//             <h3 className="text-2xl font-semibold">{gameData.player2NickName}</h3>
//             <p className="text-xs text-[#858585]">↑ (up) / ↓ (down)</p>
//           </div>
//           <img
//             src={gameData.player2Avatar}
//             alt="player 2 avatar"
//             className="w-20 h-20 rounded-lg object-cover"
//           />
//         </div>
//       </div>
//       {/* Game section */}
//       <div className='mx-4'>
//         <canvas ref={canvasRef} width={width} height={height} className={`${gameData.boardColor} w-full max-w-5xl  rounded-2xl border border-1 border-white/20`}/>
//       </div>
//       {/* buttons section */}
//       <div className="flex flex-row gap-6 mb-4">
//         <button className="px-6 py-2 bg-[#8D8D8D]/25 rounded-lg hover:bg-white/25 transition">Pause</button>
//         <button className="px-6 py-2 bg-[#8D8D8D]/25 rounded-lg hover:bg-white/25 transition">Restart</button>
//       </div>
//     </div>
//   );
// };

// export default Page;














// "use client";

// import React, { useRef, useState, useEffect, useCallback } from "react";

// const Page = () => {
//   const [gameData, setGameData] = useState({
//     player1NickName: "player 1",
//     player1Avatar: "/gameAvatars/Empty.jpeg",
//     player2NickName: "player 2",
//     player2Avatar: "/gameAvatars/Empty.jpeg",
//     paddleColor: "bg-gray-300",
//     ballColor: "bg-white",
//     boardColor: "bg-[#262626]",
//     scoreLimit: 5,
//     ballSpeed: 2,
//     paddleSize: 1,
//     player1Score: 0,
//     player2Score: 0,
//   });

//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const width = 1010;
//   const height = 600;

//   // 🧠 Load saved data once
//   useEffect(() => {
//     const dataLine = localStorage.getItem("GameData");
//     if (dataLine) setGameData(JSON.parse(dataLine));
//   }, []);

//   // 🎮 Player state
//   const [firstPlayer, setFirstPlayer] = useState({
//     playerHeight: 80 + 10 * gameData.paddleSize,
//     playerWidth: 12,
//     playerX: 40,
//     playerY: height / 2 - (80 + 10 * gameData.paddleSize) / 2,
//     velocityY: 0,
//   });

//   const [secondPlayer, setSecondPlayer] = useState({
//     playerHeight: 80 + 10 * gameData.paddleSize,
//     playerWidth: 12,
//     playerX: width - 52,
//     playerY: height / 2 - (80 + 10 * gameData.paddleSize) / 2,
//     velocityY: 0,
//   });

//   // 🕹 Handle key events safely (only one listener)
//   const handleKeyDown = useCallback((event: KeyboardEvent) => {
//     if (event.key === "w") {
//       setFirstPlayer((prev) => ({...prev,playerY: Math.max(0, prev.playerY - 40)}));
//     } else if (event.key === "s") {
//       setFirstPlayer((prev) => ({...prev,playerY: Math.min(height - prev.playerHeight, prev.playerY + 40)}));
//     }
//     else if (event.key === "ArrowUp") {
//       setSecondPlayer((prev) => ({...prev,playerY: Math.max(0, prev.playerY - 40)}));
//     }
//     else if (event.key === "ArrowDown") {
//       setSecondPlayer((prev) => ({...prev,playerY: Math.min(height - prev.playerHeight, prev.playerY + 40)}));
//     }

//   }, [height]);

//   // 🧹 Attach and clean up event listener
//   useEffect(() => {
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [handleKeyDown]);

//   // 🎨 Game rendering loop
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const draw = () => {
//       ctx.clearRect(0, 0, width, height);

//       // Board background
//       ctx.fillStyle = "#262626";
//       ctx.fillRect(0, 0, width, height);

//       // Player 1
//       ctx.fillStyle = "#D1D3D4";
//       ctx.fillRect(
//         firstPlayer.playerX,
//         firstPlayer.playerY,
//         firstPlayer.playerWidth,
//         firstPlayer.playerHeight
//       );

//       // Player 2
//       ctx.fillRect(
//         secondPlayer.playerX,
//         secondPlayer.playerY,
//         secondPlayer.playerWidth,
//         secondPlayer.playerHeight
//       );

//       requestAnimationFrame(draw);
//     };

//     draw();
//   }, [firstPlayer, secondPlayer]);

//   return (
//     
//   );
// };

// export default Page;






"use client"

import { stat } from "fs"
import React, { useRef, useState, useEffect } from "react"

export default function PingPongGame() {
  const paddleSpeed = 4
  const [score1, setScore1] = useState(0)
  const [score2, setScore2] = useState(0)
  const [isPause, setIsPause] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState("")

  const [players, setPlayers] = useState({
    player1: {
      nickName: "Player 1",
      avatar: "/gameAvatars/Empty.jpeg",
      color: "bg-gray-300",
    },
    player2: {
      nickName: "Player 2",
      avatar: "/gameAvatars/Empty.jpeg",
      color: "bg-gray-300",
    },
    boardColor: "bg-black/65",
    ballColor: "bg-white",
  })

  const gameStateRef = useRef({
    board: { width: 1024, height: 700, color: "#262626"  },
    ball: { x: 512, y: 350, velocityX: 5, velocityY: 5, speed: 5, radius: 10 },
    player1: { x: 30, y: 300, width: 20, height: 100 },
    player2: { x: 974, y: 300, width: 20, height: 100 },
    keys: { w: false, s: false, ArrowUp: false, ArrowDown: false },
    scoreLimit: 5,
  })

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // 🧠 Load saved GameData
  useEffect(() => {
    const dataLine = localStorage.getItem("GameData")
    if (!dataLine) return
    const data = JSON.parse(dataLine)

    const paddleHeight = 90 + (15 * data.paddleSize)
    const width = 1024
    const height = 700

    // Update ref (game logic)
    gameStateRef.current = {
      board: { width, height,
               color: "#262626" },
      ball: {
        x: width / 2,
        y: height / 2,
        velocityX: data.ballSpeed * 2,
        velocityY: data.ballSpeed * 1.5,
        speed: data.ballSpeed > 2 ? data.ballSpeed - 0.5 : data.ballSpeed - 1.5, // i have probleme here i need 
        radius: 10,
      },
      player1: { x: 40, y: height / 2 - paddleHeight / 2, width: 15, height: paddleHeight },
      player2: { x: width - 60, y: height / 2 - paddleHeight / 2, width: 15, height: paddleHeight },
      keys: { w: false, s: false, ArrowUp: false, ArrowDown: false },
      scoreLimit: data.scoreLimit,
    }

    // Update state (UI)
    setPlayers({
      player1: {
        nickName: data.player1NickName,
        avatar: data.player1Avatar,
        color: data.paddleColor,
      },
      player2: {
        nickName: data.player2NickName,
        avatar: data.player2Avatar,
        color: data.paddleColor,
      },
      boardColor: data.boardColor,
      ballColor: data.ballColor,
    })

    setScore1(data.player1Score || 0)
    setScore2(data.player2Score || 0)
  }, [])
  // 
  useEffect(()=>{
    const state = gameStateRef.current
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "w") state.keys.w = true
      if (e.key === "s") state.keys.s = true
      if (e.key === "ArrowUp") state.keys.ArrowUp = true
      if (e.key === "ArrowDown") state.keys.ArrowDown = true
      if (e.key === " ") setIsPause((p) => !p)
    }

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === "w") state.keys.w = false
      if (e.key === "s") state.keys.s = false
      if (e.key === "ArrowUp") state.keys.ArrowUp = false
      if (e.key === "ArrowDown") state.keys.ArrowDown = false
    }

    window.addEventListener("keydown", keyDownHandler)
    window.addEventListener("keyup", keyUpHandler)
    
    
    const gameLoop = () => {
      if (isPause || gameOver) return ;
      
      if (state.keys.w && state.player1.y > 0 ) state.player1.y -= paddleSpeed
      if (state.keys.s && (state.player1.y + state.player1.height) < state.board.height ) state.player1.y += paddleSpeed
      if (state.keys.ArrowUp && state.player2.y > 0 ) state.player2.y -= paddleSpeed
      if (state.keys.ArrowDown && (state.player2.y + state.player2.height) < state.board.height ) state.player2.y += paddleSpeed

      context.clearRect(0, 0, state.board.width, state.board.height)
      
      if (state.ball.y <= 0 || state.ball.y >= state.board.height) state.ball.velocityY *= -1;

      if (state.ball.x > state.player2.x && state.ball.y > state.player2.y && state.ball.y < state.player2.y + state.player2.height)
          state.ball.velocityX *= -1;
      if (state.ball.x < state.player1.x + state.player1.width && state.ball.y > state.player1.y && state.ball.y < state.player1.y + state.player1.height)
          state.ball.velocityX *= -1;










      // if(state.ball.y >= state.player1.y && state.ball.y <= (state.player1.y + state.player1.height) )
      //   if(state.ball.y - state.ball.radius < 0 || state.ball.y + state.ball.radius > canvas.height )
      // {
      //   state.ball.velocityX *= -1;

      // }

      // if (state.ball.y - state.ball.radius < 0 || state.ball.y + state.ball.radius > canvas.height) {
      //   state.ball.dy *= -1
      // }
      // if(state.ball.x >= state.player1.x && state.ball.x <= state.player1.x + state.player1.height)
      // {
      //   state.ball.velocityX *= -1;

      // }
      if (state.ball.x <= 0 || state.ball.x >= state.board.width) {
        // state.ball.velocityX *= -1;
        if (state.ball.x >= state.board.width)
          setScore1((s)=> s + 1)
        if (state.ball.x <= 0)
          setScore2((s)=> s + 1)
        state.ball.x = state.board.width / 2;
        state.ball.y = state.board.height / 2;
      }
      state.ball.x += state.ball.velocityX * state.ball.speed
      state.ball.y += state.ball.velocityY * state.ball.speed




      context.beginPath()
      context.setLineDash([15, 8])
      context.moveTo(state.board.width / 2, 0)
      context.lineTo(state.board.width / 2, state.board.height)
      context.strokeStyle = "#FFFFFF"
      context.stroke()

      context.beginPath();
      context.rect(state.player1.x, state.player1.y, state.player1.width, state.player1.height);
      context.fillStyle = "#D9D9D9";
      context.fill()
      
      context.beginPath();
      context.rect(state.player2.x, state.player2.y, state.player2.width, state.player2.height);
      context.fillStyle = "#D9D9D9";
      context.fill()
      
      context.beginPath()
      context.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2)
      context.fillStyle = "#D9D9D9";
      context.fill()

      requestAnimationFrame(gameLoop)
    }
    gameLoop();
  }, [gameStateRef.current, isPause, gameOver])

  return (
    <div className="absolute top-28 inset-x-0 flex flex-col items-center text-white space-y-6">
       {/* 🧑‍🤝‍🧑 Players + Score */}
       <div className="flex flex-row items-center justify-between w-full lg:max-w-5xl px-5">
         {/* Player 1 */}
         <div className="flex gap-1 flex-col  items-center">
           <img
            src={players.player1.avatar}
            alt="player 1 avatar"
            className="w-20 h-20 rounded-lg object-cover"
          />
          {/* <div className="flex flex-col gap-1"> */}
            <h3 className="text-2xl font-semibold">{players.player1.nickName}</h3>
            <p className="text-xs text-[#858585]">w (up) / s (down)</p>
          {/* </div> */}
        </div>

        {/* Score */}
        <div className="flex flex-col items-center">
          <p className="text-5xl font-bold">
            {`${score1} - ${score2}`}
          </p>
        </div>

        {/* Player 2 */}
        <div className="flex gap-1 flex-col  items-center">
          {/* <div className="flex flex-col text-right gap-1"> */}
          {/* </div> */}
          <img
            src={players.player2.avatar}
            alt="player 2 avatar"
            className="w-20 h-20 rounded-lg object-cover"
          />
            <h3 className="text-2xl font-semibold">{players.player2.nickName}</h3>
            <p className="text-xs text-[#858585]">↑ (up) / ↓ (down)</p>
        </div>
      </div>

      {/* 🎮 Game section */}
      <div className="mx-4">
        <canvas ref={canvasRef} width={gameStateRef.current.board.width} height={gameStateRef.current.board.height}
                className={`bg-[#262626] w-full max-w-240  rounded-2xl border border-white/20`}
        />
      </div>

      {/* ⏸️ Buttons */}
      <div className="flex flex-row gap-6 mb-4">
        <button className="px-6 py-2 bg-[#8D8D8D]/25 rounded-lg hover:bg-white/25 transition">
          Pause
        </button>
        <button className="px-6 py-2 bg-[#8D8D8D]/25 rounded-lg hover:bg-white/25 transition">
          Restart
        </button>
      </div>
    </div>

  )
}

// export default Page;



































