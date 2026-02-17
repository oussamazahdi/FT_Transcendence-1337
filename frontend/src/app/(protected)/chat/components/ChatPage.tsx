"use client";

import WelcomeScreen from "./WelcomeScreen";
import ChatWindow from "./ChatWindow";
import { useSelectedFriend, type SelectedFriend } from "@/contexts/userContexts";
import { ChatMessage, Conversation } from "@/types";

interface ChatPageProps {
  updateLastMessage: (lastmessage: string, time: string, friend: SelectedFriend) => void;
  messagesByFriendId: Record<string, ChatMessage[]>;
  setMessagesByFriendId: React.Dispatch<React.SetStateAction<Record<string, ChatMessage[]>>>;
}

export default function ChatPage({updateLastMessage, messagesByFriendId, setMessagesByFriendId}: ChatPageProps) {
  const { selectedFriend } = useSelectedFriend();

  if (!selectedFriend) {
    return (
      <div className="h-full">
        <WelcomeScreen />
      </div>
    );
  }

  const friendKey = String(selectedFriend.id);
  const liveMessages = messagesByFriendId[friendKey] || [];

  const clearLiveMessages = () => {
    setMessagesByFriendId((prev) => ({
      ...prev,
      [friendKey]: [],
    }));
  };

  return (
    <div className="h-full">
      <ChatWindow
        selectedFriend={selectedFriend}
        updateLastMessage={updateLastMessage}
        liveMessages={liveMessages}
        clearLiveMessages={clearLiveMessages}
      />
    </div>
  );
}
