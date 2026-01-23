import React from "react";
import Image from "next/image";
import { assets } from "@/assets/data";

const ProfileCard = (props) => {
  return (
    <div className="group relative w-36 h-36 md:w-48 md:h-48 rounded-3xl overflow-hidden mt-3 md:mt-6 cursor-pointer hover:outline-2 hover:outline-emerald-500">
      <Image
        src={props.imageUrl.src}
        alt=""
        fill={true}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div
        className="absolute bottom-0 w-full h-full flex flex-col justify-end text-center px-4 pb-2 
                      bg-gradient-to-t from-black via-black/50 to-transparent 
                      md:translate-y-full md:group-hover:translate-y-0 md:transition-transform md:duration-300 md:ease-in-out"
      >
        <h3 className="text-white font-bold text-[9px] md:text-sm">{props.name}</h3>
        <div className="flex flex-row justify-center gap-2 pb-2">
          <a
            href={props.school42}
            className="size-6 cursor-pointer"
            target="_blank"
          >
            <Image src={assets.icon42} alt="icon" className="hover:scale-110" />
          </a>
          <a
            href={props.linkedin}
            className="size-6 cursor-pointer"
            target="_blank"
          >
            <Image src={assets.iconIn} alt="icon" className="hover:scale-110" />
          </a>
          <a
            href={props.github}
            className="size-6 cursor-pointer"
            target="_blank"
          >
            <Image
              src={assets.iconGit}
              alt="icon"
              className="hover:scale-110"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
