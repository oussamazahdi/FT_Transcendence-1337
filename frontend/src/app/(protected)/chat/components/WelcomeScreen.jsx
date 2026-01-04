import React from "react";
import Image from "next/image";
import { assets } from "@/assets/data";

export default function WelcomeScreen() {
  const icon = assets.communication;
  return (
    <div className="flex flex-col items-center justify-center text-center h-full opacity-80">
      {/* <Image
        src={icon.src}
        alt=""
        width={100}
        height={100}
        className="opacity-40"
      /> */}
      <div className="text-gray-300/60">
        <h1 className=" text-2xl font-semibold">Welcome to chat!</h1>
        <h2 className="text-md">
          Feel free to select or start
          <br />
          new conversation
        </h2>
      </div>
    </div>
  );
}
