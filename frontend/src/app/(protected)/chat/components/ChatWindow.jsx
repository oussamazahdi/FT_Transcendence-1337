import { useContext } from "react";
import { SelectedFriendContext } from "@/contexts/userContexts";

export default function ChatWindow() {
  const { selectedFriend } = useContext(SelectedFriendContext);
  return <div>{selectedFriend.name}</div>;
}
