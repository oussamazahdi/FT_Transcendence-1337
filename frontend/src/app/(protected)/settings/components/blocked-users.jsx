import React, { useEffect, useState } from "react";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import BlockedCard from "./BlockedCard";
import { useAuth } from "@/contexts/authContext";

export default function BlockedUsers() {
  const { blocked } = useAuth();
  console.log("check blocked in blocked", blocked);

  const FriendComponent = blocked.map((user) => (
    <BlockedCard user={user} key={user.id}/>
  ));
  return (
    <div className="h-full flex flex-col justify-center items-center gap-4 mx-1 pt-4 md:pt-0">
      <div className="md:basis-2/10 flex flex-col md:justify-end-safe items-center">
        <NoSymbolIcon className="size-12" />
        <h1 className="text-white font-bold text-sm md:text-xsm">
          Deblock users
        </h1>
        <h3 className="text-[#ABABAB] text-xs md:text-sm text-center">
          Remove blocks to let players return to the table and continue playing.
        </h3>
      </div>
      <div className="md:basis-8/10 w-full flex flex-col justify-items-start items-center gap-1 overflow-y-auto custom-scrollbar mx-1">
        {FriendComponent}
      </div>
    </div>
  );
}