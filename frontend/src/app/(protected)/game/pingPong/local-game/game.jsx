// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import { GameUtiles } from "./lib/utils";
// import {GAME_MODE, GAME_WIDTH, GAME_HEIGHT} from "@/components/ui/GameMode"
// import { useAuth } from "@/contexts/authContext";

// /**
//  * 
//  *@if_p1_p2_not_existe : choise default
//  *@set : player1 {username, avatar}
//  *@set : player2 {username, avatar}
//  *@get : game settings
//  *@set : game settings
//  *
//  *  
//  */

//  const defaultSettings = {
// 	player1: {
// 		nickName: "Player 1",
// 		avatar: "/gameAvatars/Empty.jpeg",
// 		score:0,
// 	},
// 	player2: {
// 		nickName: "Player 2",
// 		avatar: "/gameAvatars/Empty.jpeg",
// 		score:0,
// 	},
// }

// const GameMap = null;
// const bgReady = false;

// export function preloadBackground(image) {
//   if (GameMap) return;
//   GameMap = new Image();
//   GameMap.src = image;
//   GameMap.onload = () => {
//     bgReady = true;
//   };
//   GameMap.onerror = () => {
//     bgReady = false;
//   };
// }


// const buildInitialPlayerData = (gameStateRef, gameSetting) => {

// 	const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4;
// 	const direction = Math.random() > 0.5 ? 1 : -1;
// 	const gameMode = GAME_MODE[gameSetting.game_mode];
// 	const paddleHeight = 90 + 15 * gameSetting.paddle_size;

// 	gameStateRef.current = {
// 		board: { GAME_WIDTH, GAME_HEIGHT, image:  gameMode.image},
// 		ball: {
// 			x: GAME_WIDTH / 2,
// 			y: GAME_HEIGHT / 2,
// 			velocityX: Math.cos(angle) * gameSetting.ball_speed * direction,
// 			velocityY: Math.sin(angle) * gameSetting.ball_speed,
// 			speed: gameSetting.ball_speed > 2 ? 0.6 * gameSetting.ball_speed : 0.5 * gameSetting.ball_speed,
// 			radius: 10,
// 		},
// 		player1: {
// 			x: 40,
// 			y: GAME_HEIGHT / 2 - paddleHeight / 2,
// 			width: 15,
// 			height: paddleHeight,
// 		},
// 		player2: {
// 			x: GAME_WIDTH - 60,
// 			y: GAME_HEIGHT / 2 - paddleHeight / 2,
// 			width: 15,
// 			height: paddleHeight,
// 		},
// 		keys: { w: false, s: false, ArrowUp: false, ArrowDown: false },
// 		scoreLimit: gameSetting.score_limit,
// 	}
// 	preloadBackground(gameMode.image);
// }





// export function PingPongGame({ p1data, p2data }) {
// 	const {user, gameSetting} = useAuth()
  

// 	const [player1, setPlayer1] = useState(p1data || defaultSettings.player1);
// 	const [player2, setPlayer2] = useState(p2data || defaultSettings.player2);
//   const [isPause, setIsPause] = useState(false);
//   const [gameOver, setGameOver] = useState(false);
//   const [players, setPlayers] = useState(defaultSettings);
//   const [winner, setWinner] = useState("");
	

//   const isPauseRef = useRef(false);
// 	const printRef = useRef(false);
// 	const canvasRef = useRef(null);
// 	const animationRef = useRef(null);
//   const gameStateRef = useRef({
//     board: { width: GAME_WIDTH, height: GAME_HEIGHT },
//     ball: { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, velocityX: 5, velocityY: 5, speed: gameSetting.ball_speed, radius: 10 },
//     player1: { x: 30, y: ((GAME_HEIGHT / 2) - 50), width: 20, height: 100 },
//     player2: { x: GAME_WIDTH - 50, y: (GAME_HEIGHT / 2) - 50, width: 20, height: 100 },
//     keys: { w: false, s: false, ArrowUp: false, ArrowDown: false },
//     scoreLimit: gameSetting.score_limit,
//   });


//   useEffect(() => {


// 		buildInitialPlayerData(gameStateRef, gameSetting);
    

//   }, []);

//   useEffect(() => {
//     const state = gameStateRef.current;
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const context = canvas.getContext("2d");
//     if (!context) return;

// 		const { onKeyDown, onKeyUp } = GameUtiles.createKeyboardHandlers({
// 			stateRef: gameStateRef,
// 			togglePause,
// 		});

// 		window.addEventListener("keydown", onKeyDown);
// 		window.addEventListener("keyup", onKeyUp);

//     const gameLoop = () => {
//       if (isPauseRef.current || gameOver) {
//         animationRef.current = requestAnimationFrame(gameLoop);
//         return;
//       }

//       context.clearRect(0, 0, state.board.width, state.board.height);
			
// 			GameUtiles.paddleMovement(state);
// 			GameUtiles.ballCollisions(state);
// 			GameUtiles.handleScoring(state, setScore1, setScore2);
// 			GameUtiles.ballMovement(state);
// 			GameUtiles.drawLocalFrame(context, state, players);

//       animationRef.current = requestAnimationFrame(gameLoop);
//     };

//     animationRef.current = requestAnimationFrame(gameLoop);

//     return () => {
//       window.removeEventListener("keydown", onKeyDown);
//       window.removeEventListener("keyup", onKeyUp);
//       if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     };
//   }, [gameOver, players]);

//   const togglePause = () => {
//     setIsPause((prev) => {
//       const newValue = !prev;
//       isPauseRef.current = newValue;
//       return newValue;
//     });
//   };

//   return (
//     <div className="trelative inset-x-0 flex flex-col items-center text-white space-y-6">
//       <div className="flex flex-row items-center justify-between w-full lg:max-w-5xl px-5">
//         <div className="flex gap-1 flex-col items-center">
//           <img
//             src={players.player1.avatar}
//             alt="player 1 avatar"
//             className="w-20 h-20 rounded-lg object-cover"
//           />
//           <h3 className="text-2xl font-semibold">{players.player1.nickName}</h3>
//           <p className="text-xs text-[#858585]">w (up) / s (down)</p>
//         </div>

//         <div className="flex flex-col items-center">
//           <p className="text-5xl font-bold">{`${score1} - ${score2}`}</p>
//         </div>

//         <div className="flex gap-1 flex-col items-center">
//           <img
//             src={players.player2.avatar}
//             alt="player 2 avatar"
//             className="w-20 h-20 rounded-lg object-cover"
//           />
//           <h3 className="text-2xl font-semibold">{players.player2.nickName}</h3>
//           <p className="text-xs text-[#858585]">↑ (up) / ↓ (down)</p>
//         </div>
//       </div>

//       <div className="mx-4">
//         <canvas
//           ref={canvasRef}
//           width={gameStateRef.current.board.width}
//           height={gameStateRef.current.board.height}
//           className={`bg-[${players.boardColor}] w-full max-w-240 rounded-2xl border border-white/20`}
//         />
//       </div>

//       <div className="flex flex-row gap-6 mb-4">
//         <button
//           className="px-6 py-2 bg-[#8D8D8D]/25 rounded-lg hover:bg-white/25 transition"
//           onClick={togglePause}
//         >
//           {isPause ? "Resume" : "Pause"}
//         </button>
//         <button className="px-6 py-2 bg-[#8D8D8D]/25 rounded-lg hover:bg-white/25 transition">
//           Restart
//         </button>
//       </div>
//     </div>
//   );
// }




"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameUtiles } from "./lib/utils";
import { GAME_MODE, GAME_WIDTH, GAME_HEIGHT } from "@/components/ui/GameMode";

// ------------------------
// Background image cache
// ------------------------
let gameMapImg = null;
let bgReady = false;

export function preloadBackground(imageUrl) {
  if (!imageUrl) return;
  if (gameMapImg && gameMapImg.src === imageUrl) return;

  bgReady = false;
  gameMapImg = new Image();
  gameMapImg.src = imageUrl;
  gameMapImg.onload = () => {
    bgReady = true;
  };
  gameMapImg.onerror = () => {
    bgReady = false;
  };
}

export function getBackgroundImage() {
  return { image: gameMapImg, ready: bgReady };
}

// ------------------------
// Helpers
// ------------------------
const DEFAULT_AVATAR = "/gameAvatars/Empty.jpeg";

const toNumber = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const buildPlayers = ({ p1, p2, mode }) => {
  const paddleColor = mode?.paddle || "#D9D9D9";
  const ballColor = mode?.ball || "#D9D9D9";

  return {
    player1: {
      nickName: p1?.nickName || p1?.username || "Player 1",
      avatar: p1?.avatar || DEFAULT_AVATAR,
      color: paddleColor,
    },
    player2: {
      nickName: p2?.nickName || p2?.username || "Player 2",
      avatar: p2?.avatar || DEFAULT_AVATAR,
      color: paddleColor,
    },
    boardColor: "#262626", // fallback canvas bg (map image drawn by renderer)
    ballColor,
  };
};

const initGameState = ({ gameSetting, mode }) => {
  const width = GAME_WIDTH || 1024;
  const height = GAME_HEIGHT || 700;

  const paddleSize = toNumber(gameSetting?.paddle_size, 1);
  const paddleHeight = 90 + 15 * paddleSize;

  const ballSpeed = toNumber(gameSetting?.ball_speed, 3);
  const scoreLimit = toNumber(gameSetting?.score_limit, 5);

  const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4;
  const direction = Math.random() > 0.5 ? 1 : -1;

  preloadBackground(mode?.image);

  return {
    board: { width, height },
    ball: {
      x: width / 2,
      y: height / 2,
      velocityX: Math.cos(angle) * ballSpeed * direction,
      velocityY: Math.sin(angle) * ballSpeed,
      speed: ballSpeed > 2 ? 0.6 * ballSpeed : 0.5 * ballSpeed,
      radius: 10,
    },
    player1: {
      x: 40,
      y: height / 2 - paddleHeight / 2,
      width: 15,
      height: paddleHeight,
    },
    player2: {
      x: width - 60,
      y: height / 2 - paddleHeight / 2,
      width: 15,
      height: paddleHeight,
    },
    keys: { w: false, s: false, ArrowUp: false, ArrowDown: false },
    scoreLimit,
  };
};

/**
 * Props (replace localStorage):
 * - p1: { username, nickName?, avatar }
 * - p2: { username, nickName?, avatar }
 * - gameSetting: { ball_speed, score_limit, paddle_size, game_mode }
 * - gameMode: optional override (else resolved from GAME_MODE[gameSetting.game_mode])
 */
export function PingPongGame({ p1, p2, gameSetting, gameMode }) {
  const mode = useMemo(() => {
    if (gameMode) return gameMode;
    const key = gameSetting?.game_mode;
    return key ? GAME_MODE?.[key] : null;
  }, [gameMode, gameSetting]);

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [isPause, setIsPause] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");

  const isPauseRef = useRef(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const gameStateRef = useRef(initGameState({ gameSetting, mode }));

  const [players, setPlayers] = useState(() => buildPlayers({ p1, p2, mode }));

  const togglePause = useCallback(() => {
    setIsPause((prev) => {
      const next = !prev;
      isPauseRef.current = next;
      return next;
    });
  }, []);

  // Re-init when settings/players change
  useEffect(() => {
    gameStateRef.current = initGameState({ gameSetting, mode });
    setPlayers(buildPlayers({ p1, p2, mode }));

    setScore1(0);
    setScore2(0);
    setGameOver(false);
    setWinner("");
    setIsPause(false);
    isPauseRef.current = false;
  }, [p1, p2, gameSetting, mode]);

  // Game loop + keyboard
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const { onKeyDown, onKeyUp } = GameUtiles.createKeyboardHandlers({
      stateRef: gameStateRef,
      togglePause,
    });

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const gameLoop = () => {
      const state = gameStateRef.current;

      if (!isPauseRef.current && !gameOver) {
        context.clearRect(0, 0, state.board.width, state.board.height);

        GameUtiles.paddleMovement(state);
        GameUtiles.ballCollisions(state);
        GameUtiles.handleScoring(state, setScore1, setScore2);
        GameUtiles.ballMovement(state);

        GameUtiles.drawLocalFrame(context, state, players, getBackgroundImage());
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [players, gameOver, togglePause]);

  return (
    <div className="relative inset-x-0 flex flex-col items-center text-white space-y-6">
      <div className="flex flex-row items-center justify-between w-full lg:max-w-5xl px-5">
        <div className="flex gap-1 flex-col items-center">
          <img
            src={players.player1.avatar}
            alt="player 1 avatar"
            className="w-20 h-20 rounded-lg object-cover"
          />
          <h3 className="text-2xl font-semibold">{players.player1.nickName}</h3>
          <p className="text-xs text-[#858585]">w (up) / s (down)</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-5xl font-bold">{`${score1} - ${score2}`}</p>
          {gameOver ? (
            <p className="mt-1 text-sm text-[#BDBDBD]">
              {winner ? `${winner} wins` : "Game over"}
            </p>
          ) : null}
        </div>

        <div className="flex gap-1 flex-col items-center">
          <img
            src={players.player2.avatar}
            alt="player 2 avatar"
            className="w-20 h-20 rounded-lg object-cover"
          />
          <h3 className="text-2xl font-semibold">{players.player2.nickName}</h3>
          <p className="text-xs text-[#858585]">↑ (up) / ↓ (down)</p>
        </div>
      </div>

      <div className="mx-4 w-full flex justify-center">
        <canvas
          ref={canvasRef}
          width={gameStateRef.current.board.width}
          height={gameStateRef.current.board.height}
          className="w-full max-w-240 rounded-2xl border border-white/20"
          style={{ backgroundColor: players.boardColor }}
        />
      </div>

      <div className="flex flex-row gap-6 mb-4">
        <button
          className="px-6 py-2 bg-[#8D8D8D]/25 rounded-lg hover:bg-white/25 transition"
          onClick={togglePause}
        >
          {isPause ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
