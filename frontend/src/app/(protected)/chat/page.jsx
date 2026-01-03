"use client";
import React from "react";
import SideBar from "./components/SideBar";
import ChatPage from "./components/ChatPage";
import { useState } from "react";
import { SelectedFriendContext } from "@/contexts/userContexts";

export default function chat() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  return (
    <SelectedFriendContext.Provider
      value={{ selectedFriend, setSelectedFriend }}
    >
      <div className="flex w-full mx-3 lg:w-4/5 h-[80vh] rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm">
        <div className="min-w-[250px] w-[40vh] max-w-[350px] mr-2 h-full flex flex-col">
          <SideBar />
        </div>
        <div className="flex-1 bg-[#8D8D8D]/25 h-full rounded-[12px]">
          <ChatPage />
        </div>
      </div>
    </SelectedFriendContext.Provider>
  );
}
