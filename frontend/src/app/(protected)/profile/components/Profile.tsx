import { assets } from "@/assets/data";
import Image from "next/image";
import type { User } from "@/types";

interface ProfileProps {
  user: User | null;
  className?: string;
  aspect:string;
}
const Profile = ({ user, className, aspect }: ProfileProps) => {
  const rawLevel = 15.99;
  const progressPercent = Math.round((rawLevel % 1) * 100);

  return (
    <div className={`relative bg-[#0F0F0F]/75 rounded-[20px] flex flex-col pb-4 overflow-hidden p-3 shrink-0 ${className} `}>
      <div className={`relative w-full ${aspect} overflow-hidden rounded-lg`}>
        <Image
          src={assets.coverPicture}
          alt="cover"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col items-center -mt-[10%] z-10 relative">
        <div className="relative rounded-[10px] w-[28%] max-w-30 min-w-16 aspect-square">
          {user?.avatar && user?.avatar !== "null" ? (
            <Image
              src={user.avatar}
              alt="profile"
              fill
              sizes="(max-width: 768px) 25vw, 120px"
              className="rounded-[10px] object-cover"
            />
          ) : (
            <Image
              src={assets.defaultProfile}
              alt="avatar"
              fill
              sizes="(max-width: 768px) 25vw, 120px"
              className="rounded-[10px] object-cover"
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
            <span className="font-bold ">Level: {rawLevel}</span>
            <span >1950/3000</span>
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
