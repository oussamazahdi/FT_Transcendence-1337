import React from "react";
import { assets } from "@/assets/data";
import Image from "next/image";

const Profile = ({ user, className }) => {
  const rawLevel = 15.99;
  const progressPercent = Math.round((rawLevel % 1) * 100);

  return (
    <div className={`relative bg-[#0F0F0F]/75 rounded-[20px] flex flex-col pb-4 overflow-hidden p-3 shrink-0 ${className} `}>
      <div className="relative w-full h-36 md:h-48 overflow-hidden rounded-lg shrink-0">
        <Image
          src={assets.coverPicture}
          alt="cover"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col items-center -mt-12 md:-mt-20 z-10 relative">
        <div className="relative rounded-[10px]"> 
            {user?.avatar && user?.avatar !== "null" ? (
            <Image
                src={user.avatar}
                alt="profile"
                width={100}
                height={100}
                className="rounded-[10px] w-20 h-20 md:w-32 md:h-32 object-cover"
            />
            ) : (
            <Image
                src={assets.defaultProfile}
                alt="avatar"
                width={100}
                height={100}
                className="rounded-[10px] w-20 h-20 md:w-32 md:h-32 object-cover"
            />
            )}
        </div>
        <p className="text-white font-bold mt-2 text-sm md:text-lg">
          {user.firstname} {user.lastname}{" "}
          <span className="text-[#727272] font-thin text-xs md:text-sm inline">
            [@{user.username}]
          </span>
        </p>
      </div>
      
      <div className="w-full mt-4 px-1">
        <div className="flex justify-between text-xs md:text-sm mb-1">
            <span className="font-bold ">Level: {rawLevel}</span>
            <span >1950/3000</span>
        </div>
        <div className="w-full bg-[#000000] rounded-full h-2.5">
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