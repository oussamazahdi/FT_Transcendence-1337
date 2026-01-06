import React from "react";
import Image from "next/image";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full opacity-80 bg-[#8D8D8D]/25 rounded-lg">
      <ChatBubbleLeftRightIcon className="size-20 text-gray-300/60"/>
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
