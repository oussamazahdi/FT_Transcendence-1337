"use client";
import React, { useEffect } from "react";
import SideBar from "./components/SideBar";
import ChatPage from "./components/ChatPage";
import { useState } from "react";
import { SelectedFriendContext } from "@/contexts/userContexts";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

export default function chat() {
  const {friends} = useAuth();
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  console.log(id);

  useEffect(()=>{
    const index = friends.findIndex(user => user.id == id)
      if (index != -1)
          setSelectedFriend(friends[index]);
  },[id])

  
  useEffect(() => {
    const fetchconversation = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversations/all`,{
          method:"GET",
          credentials: "include",
        })

        const data = await response.json();
        if(!response.ok)
          throw new Error(data.error);

        const newConversation = data.conversations || []
        const formatedData = newConversation.map((conversation) => ({
          id: conversation.userid,
          convid: conversation.convid,
          avatar: conversation.avatar,
          firstname: conversation.firstname,
          lastname: conversation.lastname,
          lastMessage: conversation.last_message || "no message yet.",
          timeOfLastMsg: conversation.updatedate || "00:00",
          status: conversation.status || false,
        }));

        setDisplayData(formatedData);
      } catch (err) {
        console.log("Failed to fetch conversations", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchconversation();
  }, []);

  const updateLastMessage = (lastmessage, time, friend) => {
    setDisplayData((prev) => {
      const newList = [...prev];
      
      const index = newList.findIndex((conv) => conv.userid === friend.userid);
      
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
          firstname: friend.firstname,
          lastname: friend.lastname,
          lastMessage: lastmessage,
          timeOfLastMsg: time,
          status : false,
          id:friend.id,
          convid: displayData.length + 1,
        }
        newList.unshift(newConv);
      }
      return newList;
    });
  }

  return (
    <SelectedFriendContext.Provider value={{ selectedFriend, setSelectedFriend }}>
      <div className="flex w-full max-w-7xl h-[90vh] md:h-[86vh] rounded-lg overflow-hidden">
        <div className={`w-full md:max-w-1/4 md:mr-2 h-full flex flex-col ${selectedFriend ? "hidden md:block" : "block"}`}>
          <SideBar displayData={displayData} setDisplayData={setDisplayData} loading={loading} setLoading={setLoading} />
        </div>
        <div className={`flex-1 h-full rounded-xl ${selectedFriend ? "block" : "hidden md:block"}`}>
          <ChatPage updateLastMessage={updateLastMessage} />
        </div>
      </div>
    </SelectedFriendContext.Provider>
  );
}
