import React from "react";
import Image from "next/image";
import { assets } from "@/assets/data";

const ProfileCard = (props) => {
  return (
    <div className="relative w-48 h-48 rounded-3xl overflow-hidden mt-6">
      <Image
        src={props.imageUrl.src}
        alt=""
        fill={true}
        className="object-cover"
      />
      <div className="flex flex-col justify-end text-center absolute bottom-0 w-full h-full px-4 bg-gradient-to-t from-[#0A0A0A] to-[#000000]/0">
        <h3 className="text-white font-bold text-sm">{props.name}</h3>
        <div className="flex flex-row justify-between px-8 pb-2">
          <a
            href={props.school42}
            className="size-6 cursor-pointer"
            target="_blank"
          >
            <Image src={assets.icon42} alt="icon" />
          </a>
          <a
            href={props.linkedin}
            className="size-6 cursor-pointer"
            target="_blank"
          >
            <Image src={assets.iconIn} alt="icon" />
          </a>
          <a
            href={props.github}
            className="size-6 cursor-pointer"
            target="_blank"
          >
            <Image src={assets.iconGit} alt="icon" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
