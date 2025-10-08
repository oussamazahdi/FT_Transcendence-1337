// import React, { useState } from 'react';

// const GameSetup: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ isVisible, onClose }) => {

//   if(!isVisible) return null;
//   const avatarStyle = "w-11 h-11 rounded-lg shadow-md object-cover";

//   const [selectedAvatar, setSelectedAvatar] = useState(null);
//   const [nickName, setNickName] = useState(null);
  
//   const [selectedAvatar2, setSelectedAvatar2] = useState(null);
//   const [nickName2, setNickName2] = useState(null);

//   const player1 = { nickname: "@nickname", avatar: "/gameAvatars/Empty.jpeg" };
//   const player2 = { nickname: "@nickname", avatar: "/gameAvatars/Empty.jpeg" };

//   const coloredAvatar = [
//     { srcs: "/gameAvatars/profile1.jpeg", alt: "profile 1", black: "/gameAvatars/blackAvatar/avatar1.png" },
//     { srcs: "/gameAvatars/profile2.jpeg", alt: "profile 2", black: "/gameAvatars/blackAvatar/avatar2.png" },
//     { srcs: "/gameAvatars/profile3.jpeg", alt: "profile 3", black: "/gameAvatars/blackAvatar/avatar3.png" },
//     { srcs: "/gameAvatars/profile4.jpeg", alt: "profile 4", black: "/gameAvatars/blackAvatar/avatar4.png" },
//     { srcs: "/gameAvatars/profile6.jpeg", alt: "profile 6", black: "/gameAvatars/blackAvatar/avatar6.png" },
//     { srcs: "/gameAvatars/profile5.jpeg", alt: "profile 5", black: "/gameAvatars/blackAvatar/avatar5.png" },
//   ];

//   return (
//     <div className=" fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs">
//       <div className=" relative bg-[#3C3C3C]/80 backdrop-blur-md p-3 rounded-3xl shadow-md">
//         <div className="flex  items-start relative mb-5 ">
//           <h1 className="text-white text-3xl font-semibold">Game setup</h1>
//           <button className="md:absolute right-0 px-3 py-1 text-[#7A7A7A] hover:text-white hover:bg-[#848484]/40 hover:rounded-full cursor-pointer"
//           onClick={() => {
//             player1.avatar = "/gameAvatars/Empty.jpeg";
//             onClose();
//           }}
//           >Close</button>
//         </div>

//         <div className="flex justify-center items-start gap-5 grid md:grid-cols-2 ">
          
//           <div className="flex flex-col items-center py-4 px-4 lg:px-6 border border-dashed rounded-xl border-[#9B9B9B]/65">
//             <h1 className="text-2xl font-semibold mb-6">Player 1</h1>
//             <img src={selectedAvatar !== null && selectedAvatar !== "/gameAvatars/Empty.jpeg" ? selectedAvatar : player1.avatar}
//                 alt="default profile" className="w-20 h-20 mb-1 rounded-lg shadow-2xl object-cover" />
//             <h2 className="mb-6 text-[#9B9B9B] font-normal  ">{nickName != null ? "@" + nickName : player1.nickname}</h2>
//             <h2 className="self-start mb-1 text-white font-medium text-left">Choose your avatar :</h2>
//             <div className="flex gap-3 grid grid-cols-3 lg:grid-cols-6">
//               {coloredAvatar.map((item) => (
//               <button key={item.srcs} className="cursor-pointer" onClick={() => {
//                 player1.avatar = item.srcs;
// 				        setSelectedAvatar(item.srcs); }} >
//                 <img src={selectedAvatar === item.srcs ? item.srcs : item.black} alt={item.alt} className={avatarStyle}/>
//               </button>))}
//             </div>
//             <div className='mt-6 flex flex-col'>
//               <label htmlFor="nickname" className="mb-1 text-white font-medium">Nickname</label>
//               <input type="text" placeholder="Enter your @nickname"
//                 className="mb-3 p-3 rounded-sm bg-[#848484]/40 text-[#9B9B9B] w-full lg:w-xs text-xs"
//                 onKeyDown={(text)=> {setNickName(text.target.value);}} />
//             </div>
//           </div>
          
          
//           <div className="flex flex-col items-center py-4 px-4 lg:px-6 border border-dashed rounded-xl border-[#9B9B9B]/65">
//             <h1 className="text-2xl font-semibold mb-6">Player 2</h1>
//             <img src={selectedAvatar2 !== null && selectedAvatar2 !== "/gameAvatars/Empty.jpeg" ? selectedAvatar2 : player2.avatar}
//                 alt="default profile" className="w-20 h-20 mb-1 rounded-lg shadow-2xl object-cover" />
//             <h2 className="mb-6 text-[#9B9B9B] font-normal  ">{nickName2 != null ? "@" + nickName2 : player2.nickname}</h2>
//             <h2 className="self-start mb-1 text-white font-medium text-left">Choose your avatar :</h2>
//             <div className="flex gap-3 grid grid-cols-3 lg:grid-cols-6">
//               {coloredAvatar.map((item) => (
//               <button key={item.srcs} className="cursor-pointer" onClick={() => {
//                 player2.avatar = item.srcs;
// 				        setSelectedAvatar2(item.srcs); }} >
//                 <img src={selectedAvatar2 === item.srcs ? item.srcs : item.black} alt={item.alt} className={avatarStyle}/>
//               </button>))}
//             </div>
//             <div className='mt-6 flex flex-col'>
//               <label htmlFor="nickname" className="mb-1 text-white font-medium">Nickname2</label>
//               <input type="text" placeholder="Enter your @nickname"
//                 className="mb-3 p-3 rounded-sm bg-[#848484]/40 text-[#9B9B9B] w-full lg:w-xs text-xs"
//                 onKeyDown={(text)=> {setNickName2(text.target.value);}} />
//             </div>
//           </div>
//           {/* Buttons */}

//         </div>
//           <div className='mt-3 flex items-start relative '>
//             <button className='px-3 py-1 text-[#7A7A7A]'>Prev</button>
//             <button className='absolute right-0 px-4 py-1 hover:text-white hover:bg-[#848484]/40  hover:rounded-full cursor-pointer'>Next</button>
//           </div>
//       </div>
//     </div>
//   );
// };

// export default GameSetup;





import React, { useState } from 'react';

const GameSetup: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const avatarStyle = "w-11 h-11 rounded-lg object-cover cursor-pointer transition-all hover:scale-110";

  const [selectedAvatar1, setSelectedAvatar1] = useState<string | null>(null);
  const [nickname1, setNickname1] = useState<string>("");
  const [selectedAvatar2, setSelectedAvatar2] = useState<string | null>(null);
  const [nickname2, setNickname2] = useState<string>("");

  const player1 = { nickname: "@nickname", avatar: "/gameAvatars/Empty.jpeg" };
  const player2 = { nickname: "@nickname", avatar: "/gameAvatars/Empty.jpeg" };

  const avatars = [
    { color: "/gameAvatars/profile1.jpeg", black: "/gameAvatars/blackAvatar/avatar1.png", alt: "avatar 1" },
    { color: "/gameAvatars/profile2.jpeg", black: "/gameAvatars/blackAvatar/avatar2.png", alt: "avatar 2" },
    { color: "/gameAvatars/profile3.jpeg", black: "/gameAvatars/blackAvatar/avatar3.png", alt: "avatar 3" },
    { color: "/gameAvatars/profile4.jpeg", black: "/gameAvatars/blackAvatar/avatar4.png", alt: "avatar 4" },
    { color: "/gameAvatars/profile5.jpeg", black: "/gameAvatars/blackAvatar/avatar5.png", alt: "avatar 5" },
    { color: "/gameAvatars/profile6.jpeg", black: "/gameAvatars/blackAvatar/avatar6.png", alt: "avatar 6" },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-[#3C3C3C]/80 backdrop-blur-md p-6 rounded-3xl shadow-lg w-full max-w-4xl m-3">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-semibold">Game Setup</h1>
          <button onClick={onClose} className="text-gray-400 hover:text-red-400 transition">
            Close
          </button>
        </div>

        {/* Players */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Player 1 */}
          <div className="flex flex-col items-center border border-dashed border-gray-500/60 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Player 1</h2>
            <img
              src={selectedAvatar1 || player1.avatar}
              alt="Player 1 avatar"
              className="w-20 h-20 rounded-lg object-cover shadow mb-2"
            />
            <p className="text-gray-400 mb-4">@{nickname1 || "nickname"}</p>

            <label className="text-white mb-2 self-start">Choose your avatar:</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
              {avatars.map((a) => (
                <img
                  key={a.color}
                  src={selectedAvatar1 === a.color ? a.color : a.black}
                  alt={a.alt}
                  className={avatarStyle}
                  onClick={() => setSelectedAvatar1(a.color)}
                />
              ))}
            </div>

            <label htmlFor="nickname1" className="text-white mb-2 self-start">Nickname</label>
            <input
              id="nickname1"
              type="text"
              placeholder="Enter your @nickname"
              className="p-2 rounded-md bg-[#848484]/40 text-white placeholder-gray-400 text-sm w-full"
              value={nickname1}
              onChange={(e) => setNickname1(e.target.value)}
            />
          </div>

          {/* Player 2 */}
          <div className="flex flex-col items-center border border-dashed border-gray-500/60 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Player 2</h2>
            <img
              src={selectedAvatar2 || player2.avatar}
              alt="Player 2 avatar"
              className="w-20 h-20 rounded-lg object-cover shadow mb-2"
            />
            <p className="text-gray-400 mb-4">@{nickname2 || "nickname"}</p>

            <label className="text-white mb-2 self-start">Choose your avatar:</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
              {avatars.map((a) => (
                <img
                  key={a.color}
                  src={selectedAvatar2 === a.color ? a.color : a.black}
                  alt={a.alt}
                  className={avatarStyle}
                  onClick={() => setSelectedAvatar2(a.color)}
                />
              ))}
            </div>

            <label htmlFor="nickname2" className="text-white mb-2 self-start">Nickname</label>
            <input
              id="nickname2"
              type="text"
              placeholder="Enter your @nickname"
              className="p-2 rounded-md bg-[#848484]/40 text-white placeholder-gray-400 text-sm w-full"
              value={nickname2}
              onChange={(e) => setNickname2(e.target.value)}
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-between mt-6">
          <button className="text-gray-400 hover:text-white transition">Prev</button>
          <button className="text-gray-400 hover:text-white hover:bg-[#848484]/30 rounded-full px-4 py-1 transition">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
