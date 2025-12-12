"use client";

import { useAuth } from "@/contexts/authContext";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  transports: ["websocket"],
  autoConnect: false,
});

// Pure object (no class -> safer in React state)
const emptyPlayer = () => ({
  socketId: "",
  firstName: "",
  lastName: "",
  login: "",
  avatar: "",
  score: 0,
  roomId: "",
});

export default function Matchmaking() {
  const { user } = useAuth();
  console.log("======> user:", user);

  const [status, setStatus] = useState("Searching for opponent...");
  // const [playerToSend, setplayerToSend] = useState("Searching for opponent...");
  const [gameSession, setGameSession] = useState({
    player1: emptyPlayer(),
    player2: emptyPlayer(),
  });

  /** Add user data to Player1 */
  useEffect(() => {
    if (!user) return;

    setGameSession((prev) => ({
      ...prev,
      player1: {
        ...prev.player1,
        avatar: user.avatar,
        firstName: user.firstName,
        lastName: user.lastName,
        login: user.login,
      },
    }));
  }, [user]);

  /** Setup socket only once */
  useEffect(() => {
    if (!user) return; // wait for user data

    if (!socket.connected) socket.connect();

    const handleConnect = () => {
      const playerToSend = {
        firstName: user.firstName,
        lastName: user.lastName,
        login: user.login,
        avatar: user.avatar,
        socketId: socket.id,
      };

      // update socketId locally
      setGameSession((prev) => ({
        ...prev,
        player1: { ...prev.player1, socketId: socket.id },
      }));

      console.log("EMITTING join-game:", gameSession.player1);
      socket.emit("join-game", user);

      setStatus("Waiting for opponent...");
    };

    const handleMatchFound = (playerData) => {
      console.log("RECEIVED match-found:", playerData);

      setGameSession((prev) => ({
        ...prev,
        player2: { ...prev.player2, ...playerData },
      }));

      setStatus("Match Found!");
    };

    socket.on("connect", handleConnect);
    socket.on("match-found", handleMatchFound);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("match-found", handleMatchFound);
    };
  }, [user]);

  return (
    <div className="flex flex-col items-center bg-[#0F0F0F]/65 p-10 rounded-3xl">
      <h3 className="text-3xl font-extrabold">Find Match</h3>
      <h3 className="mb-6 text-white/50">{status}</h3>

      <div className="flex items-center justify-between gap-x-25">
        {/* Player 1 */}
        <div className="flex flex-col items-center">
          <img
            src={gameSession.player1.avatar || "/gameAvatars/Empty.jpeg"}
            alt="profile"
            className="h-35 w-35 rounded-xl"
          />

          <h3 className="text-xl font-semibold">
            {gameSession.player1.firstName || "Player 1"}
            {gameSession.player1.lastName
              ? "." + gameSession.player1.lastName[0]
              : ""}
          </h3>

          <h3 className="text-md font-medium text-[#6E6E6E]">
            [{gameSession.player1.login || "loading"}]
          </h3>
        </div>

        <span className="text-3xl font-extrabold">VS</span>

        {/* Player 2 */}
        <div className="flex flex-col items-center">
          <img
            src={
              gameSession.player2.socketId
                ? gameSession.player2.avatar
                : "/gameAvatars/Empty.jpeg"
            }
            alt="profile"
            className="h-35 w-35 rounded-xl"
          />

          <h3 className="text-xl font-semibold">
            {gameSession.player2.socketId
              ? gameSession.player2.firstName +
                "." +
                gameSession.player2.lastName?.[0]
              : "Player 2"}
          </h3>

          <h3 className="text-md font-medium text-[#6E6E6E]">
            [
            {gameSession.player2.socketId
              ? gameSession.player2.login
              : "waiting"}
            ]
          </h3>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useAuth } from "@/contexts/authContext";
// import { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3001", {
//   transports: ["websocket"],
//   autoConnect: false,
// });

// class Player {
//   constructor() {
//     this.socketId = "";
//     this.firstName = "";
//     this.lastName = "";
//     this.login = "";
//     this.avatar = "";
//     this.score = 0;
//     this.roomId = "";
//   }
// }

// const GameSessionTemplate = {
//   player1: new Player(),
//   player2: new Player(),
// };

// export default function Matchmaking() {
//   const { user } = useAuth();
//   const [status, setStatus] = useState("Searching for opponent...");
//   const [gameSession, setGameSession] = useState(GameSessionTemplate);

//   /* Fill Player1 with user data */
//   useEffect(() => {
//     if (!user) return;
//     setGameSession(prev => ({
//       ...prev,
//       player1: {
//         ...prev.player1,
//         avatar: user.avatar,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         login: user.login,
//       }
//     }));
//   }, [user]);

//   /* Socket setup */
//   useEffect(() => {
//     if (socket.connected) return;
// 		socket.connect();

// /*----------------------------------------------------------*/
//     socket.on("connect", () => {
//       if (!user) return;

//       setGameSession(prev => ({
//         ...prev,
//         player1: { ...prev.player1, socketId: socket.id },
//       }));
// 			const playerToSend = {
// 				firstName: user.firstName,
// 				lastName: user.lastName,
// 				login: user.login,
// 				avatar: user.avatar,
// 				socketId: socket.id
// 			};
// 			// console.log(playerToSend)
// 			console.log("player:", gameSession.player1)

// 			socket.emit("join-game", playerToSend);
//       setStatus("Waiting for opponent...");
//     });
// /*----------------------------------------------------------*/
// 	socket.on("match-found", (playerData) => {
// 		setGameSession(prev => ({...prev, player2: { ...prev.player2,
// 				avatar: playerData.avatar,
// 				firstName: playerData.firstName,
// 				lastName: playerData.lastName,
// 				login: playerData.login,
// 				socketId: playerData.socketId,
// 			},
// 		}));

// 		setStatus("Match Found!");
// 	});
// /*----------------------------------------------------------*/

//     return () => {
//       socket.off("connect");
//       socket.off("match-found");
//     };
//   }, [user]);

// 	return (
//     <div className='flex flex-col items-center bg-[#0F0F0F]/65 p-10 rounded-3xl'>

//       <h3 className='text-3xl font-extrabold'>Find Match</h3>
//       <h3 className='mb-6 text-white/50'>{status}</h3>

//       <div className="flex items-center justify-between gap-x-25">

//         <div className='flex flex-col items-center'>
//           <img
//             src={gameSession.player1.avatar || "/gameAvatars/Empty.jpeg"}
//             alt="profile"
//             className="h-35 w-35 rounded-xl"
//           />

//           <h3 className='text-xl font-semibold'>
//             {gameSession.player1.firstName || "Player 1"}
//             {gameSession.player1.lastName ? "." + gameSession.player1.lastName[0] : ""}
//           </h3>

//           <h3 className='text-md font-medium text-[#6E6E6E]'>
//             [{gameSession.player1.login || "loading"}]
//           </h3>
//         </div>

//         <span className="text-3xl font-extrabold">VS</span>

//         <div className='flex flex-col items-center'>
//           <img
//             src={gameSession.player2.socketId
//               ? gameSession.player2.avatar
//               : "/gameAvatars/Empty.jpeg"}
//             alt="profile"
//             className="h-35 w-35 rounded-xl"
//           />

//           <h3 className='text-xl font-semibold'>
//             {gameSession.player2.socketId
//               ? gameSession.player2.firstName + "." + gameSession.player2.lastName?.[0]
//               : "Player 2"}
//           </h3>

//           <h3 className='text-md font-medium text-[#6E6E6E]'>
//             [{gameSession.player2.socketId ? gameSession.player2.login : "waiting"}]
//           </h3>
//         </div>
//       </div>

//       {/* {timer && (
//         <CountdownTimer
//           totalMinutes={0}
//           totalSeconds={3}
//           onFinish={() => console.log("Timer finished")}
//           startColor="#D9D9D9"
//           endColor="#D9D9D9"
//           size="md"
//         />
//       )} */}

//     </div>
//   )
// }
