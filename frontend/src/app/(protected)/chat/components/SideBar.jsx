import React, { useEffect } from "react";
import Friends from "./Friends";
import { useState } from "react";

export default function SideBar({displayData, loading}) {
  const [searchQuery, setSearchQuery] = useState("");

  const renderList = () => {
    if (!displayData || displayData.length == 0){
      if (loading)
        return <div>Loading...</div>;
      return(<div className="text-sm text-center text-white/60 mt-4">No conversations </div>)
    }
    return displayData.map((conversation) => (
      <div key={conversation.id}> 
        <Friends
          id={conversation.id}
          avatar={conversation.avatar}
          firstname={conversation.firstname}
          lastname={conversation.lastname}
          lastmsg={conversation.lastMessage}
          status={conversation.status}
          time={conversation.timeOfLastMsg}
          userid={conversation.userid}
        />
      </div>))
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between bg-[#1A1A1A]/75 mb-2 rounded-lg hover:bg-[#8D8D8D]/25">
        <input
          className="h-10 w-full px-2 placeholder:text-sm placeholder:text-gray-400 hover:rounded-lg focus:outline-none "
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></input>
      </div>
      <div className="flex flex-col bg-[#1A1A1A]/75 rounded-lg px-2 flex-1 min-h-0 overflow-hidden">
        <h1 className="font-bold px-2 py-4 shrink-0">
          {searchQuery ? "searching..." : "Messages"}
        </h1>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {renderList()}
        </div>
      </div>
    </div>
  );
}

//---------------------Search Chat------------------------------------------
// useEffect(() => {
//   if (!searchQuery.trim())
//     return;

//   const delayDebounceFn = setTimeout(async () => {
//     console.log(searchQuery);
//     setLoading(true);
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversations?q=${searchQuery}&page=${1}`,{
//           method: "GET",
//           credentials: "include",
//         },
//       );
//       const data = await response.json();
//       if (!response.ok) 
//          throw new Error("data.error");
      
//       const search = data.conversations || []
//       console.log(search) 
//       const formatedData = search.map((user) => ({
//         id: user.conversation_id,
//         avatar: user.avatar,
//         firstname: user.firstname,
//         lastname: user.lastname,
//         lastmsg: user.lastmessage || "no message yet",
//         status: user.status || false, // to delete later
//         time: user.updatedate,
//         userid: user.friend_id,
//       }));
//       setDisplayData(formatedData);
//     } catch (err) {
//       console.log("Failed to fetch users", err);
//     } finally {
//       setLoading(false);
//     }
//   }, 500);
//   return () => clearTimeout(delayDebounceFn);
// }, [searchQuery]);
