import WelcomeScreen from "./WelcomeScreen";
import ChatWindow from "./ChatWindow.tsx";
import { useSelectedFriend, type SelectedFriend } from "@/contexts/userContexts";

interface ChatPageProps {
  updateLastMessage: (lastmessage: string, time: string, friend: SelectedFriend) => void;
}

export default function ChatPage({ updateLastMessage }: ChatPageProps) {
  const { selectedFriend } = useSelectedFriend();
  return (
    <div className="h-full">
      {selectedFriend ? ( <ChatWindow selectedFriend={selectedFriend} updateLastMessage={updateLastMessage} />
      ) : (
        <WelcomeScreen />
      )}
    </div>
  );
}
