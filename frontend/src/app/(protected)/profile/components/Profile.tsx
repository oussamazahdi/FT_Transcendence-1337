import { assets } from "@/assets/data";
import Image from "next/image";
import type { User } from "@/types";


interface ProfileProps {
  user: User | null;
  aspect:string;
}
const Profile = ({ user, aspect }: ProfileProps) => {
  const rawLevel = user?.player_level || 0;
  const progressPercent = Math.round((rawLevel % 1) * 100);
  const xp = user?.player_xp || 0

  return (
    <div className={`relative bg-[#0F0F0F]/75 rounded-[20px] flex flex-col pb-4 overflow-hidden p-3 shrink-0 h-full w-full `}>
      <div className={`relative w-full ${aspect} overflow-hidden rounded-lg`}>
        <Image
          src={assets.coverPicture}
          alt="cover"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col items-center -mt-12 md:-mt-16 z-5">
        <div className="relative rounded-[10px]">
          {user?.avatar && user?.avatar !== "null" ? (
            <Image
              src={user.avatar}
              alt="profile"
              width={80}
              height={80}
              className="rounded-[10px] w-20 h-20 md:w-24 md:h-24 object-cover"
            />
          ) : (
            <Image
              src={assets.defaultProfile}
              alt="avatar"
              width={80}
              height={80}
              className="rounded-[10px] w-20 h-20 md:w-24 md:h-24 object-cover"
            />
          )}
        </div>
        <p className="text-white font-bold mt-2 text-sm md:text-lg">
          {(user?.firstname ?? "") + " " + (user?.lastname ?? "")}{" "}
          <span className="text-[#909090] font-light text-xs md:text-sm inline">
            [@{user?.username ?? "unknown"}]
          </span>
        </p>
      </div>
      
      <div className="w-full mt-auto px-1 pt-2">
        <div className="flex justify-between text-xs md:text-sm mb-1">
            <span className="font-bold ">Level: {rawLevel.toFixed(2)}</span>
            <span >{xp}/{(Math.floor(rawLevel) + 1) * 3000}</span>
        </div>
        <div className="w-full bg-[#000000] rounded-full h-2.5 my-auto">
            <div 
                className="bg-linear-to-r from-blue-200 via-blue-400 to-blue-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
            ></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
