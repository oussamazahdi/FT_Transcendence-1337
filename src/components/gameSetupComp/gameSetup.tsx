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
