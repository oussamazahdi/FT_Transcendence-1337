import React from "react";
import WelcomeScreen from "./WelcomeScreen";
import ChatWindow from "./ChatWindow";
import { useContext } from "react";
import { SelectedFriendContext } from "@/contexts/userContexts";

export default function ChatPage({updateLastMessage}) {
  const { selectedFriend } = useContext(SelectedFriendContext);
  return (
    <div className="h-full">
      {selectedFriend ? (
        <ChatWindow selectedFriend={selectedFriend} updateLastMessage={updateLastMessage} />
      ) : (
        <WelcomeScreen />
      )}
    </div>
  );
}
