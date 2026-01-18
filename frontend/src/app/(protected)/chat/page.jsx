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
      <div className="flex w-full max-w-7xl mx-3 h-[90vh] md:h-[86vh] rounded-lg overflow-hidden">
        <div className={`w-full md:max-w-1/4 mr-2 h-full flex flex-col ${selectedFriend ? "hidden md:block" : "block"}`}>
          <SideBar />
        </div>
        <div className={`flex-1 h-full rounded-[12px] ${selectedFriend ? "block" : "hidden md:block"}`}>
          <ChatPage />
        </div>
      </div>
    </SelectedFriendContext.Provider>
  );
}
