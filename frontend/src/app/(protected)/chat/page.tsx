"use client";
import { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import ChatPage from "./components/ChatPage";
import { SelectedFriendContext, type SelectedFriend } from "@/contexts/userContexts";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { Conversation } from "@/types";



export default function Chat() {
  const { friends } = useAuth();
  const [selectedFriend, setSelectedFriend] = useState<SelectedFriend | null>(null);
  const [displayData, setDisplayData] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;
    const index = friends.findIndex(
      (user: SelectedFriend) => String(user.id) === id
    );
    if (index !== -1) setSelectedFriend(friends[index]);
  }, [id, friends]);

  
  useEffect(() => {
    const fetchConversation = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversations/all`,
          {
            method: "GET",
          credentials: "include",
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        const newConversation: Array<any> = data.conversations || [];
        const formatedData: Conversation[] = newConversation.map(
          (conversation: any) => ({
          id: conversation.userid,
          convid: conversation.convid,
          avatar: conversation.avatar,
          firstname: conversation.firstname,
          lastname: conversation.lastname,
          lastMessage: conversation.last_message || "no message yet.",
          timeOfLastMsg: conversation.updatedate || "00:00",
          status: conversation.status || false,
          })
        );

        setDisplayData(formatedData);
      } catch (err) {
        console.log("Failed to fetch conversations", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchConversation();
  }, []);

  const updateLastMessage = (lastmessage: string, time: string, friend: SelectedFriend) => {
    setDisplayData((prev) => {
      const newList = [...prev];
      
      const index = newList.findIndex(
        (conv) => String(conv.id) === String(friend.id)
      );
      
      if (index !== -1) {
        const updatedConv = {
          ...newList[index],
          lastMessage: lastmessage,
          timeOfLastMsg: time,
        }
        newList.splice(index, 1);
        newList.unshift(updatedConv);
      }else{
        const newConv = {
          avatar: friend.avatar,
          firstname: friend.firstname || "",
          lastname: friend.lastname || "",
          lastMessage: lastmessage,
          timeOfLastMsg: time,
          status : false,
          id: friend.id,
          convid: newList.length + 1,
        }
        newList.unshift(newConv);
      }
      return newList;
    });
  };

  return (
    <SelectedFriendContext.Provider value={{ selectedFriend, setSelectedFriend }}>
      <div className="flex w-full max-w-7xl h-[90vh] md:h-[86vh] rounded-lg overflow-hidden">
        <div className={`w-full md:max-w-1/4 md:mr-2 h-full flex flex-col ${selectedFriend ? "hidden md:block" : "block"}`}>
          <SideBar
            displayData={displayData}
            loading={loading}
          />
        </div>
        <div className={`flex-1 h-full rounded-xl ${selectedFriend ? "block" : "hidden md:block"}`}>
          <ChatPage updateLastMessage={updateLastMessage} />
        </div>
      </div>
    </SelectedFriendContext.Provider>
  );
}
