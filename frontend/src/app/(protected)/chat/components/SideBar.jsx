import React, { useCallback, useEffect, useRef } from "react";
import Friends from "./Friends";
import { useState } from "react";
import { useAuth } from "@/contexts/authContext";

export default function SideBar() {
  
  const [displayData, setDisplayData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  const lastElementObs = useCallback((node) => {
    if (loading)
      return
    if (observer.current)
      observer.current.disconnect()

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && hasMore)
        setPage((prev) => prev + 1)
    })

    if(node)
      observer.current.observe(node);

  }, [loading, hasMore])

  useEffect(() => {
    const fetchconversation = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversations/all?page=${page}`,{
          method:"GET",
          credentials: "include",
        })

        const data = await response.json();
        if(!response.ok)
          throw new Error(data.error);

        const newConversation = data.conversations || []

        const formatedData = newConversation.map((conversation) => ({
          avatar: conversation.avatar,
          firstname: conversation.firstname,
          lastname: conversation.lastname,
          lastMessage: conversation.last_message || "no message yet.",
          timeOfLastMsg: conversation.updatedate || "00:00",
          status: conversation.status || false,
          userid: conversation.userid,
          id: conversation.convid,
          userid: conversation.userid
        }));
        if (formatedData.length < 10)
          setHasMore(false);
        setDisplayData((prev) => [...prev, ...formatedData]);
      } catch (err) {
        console.log("Failed to fetch conversations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchconversation();
  }, [page]);

  const renderList = () => {
    if (!displayData || displayData.length == 0){
      if (loading)
        return <div>Loading...</div>;
      return(<div className="text-sm text-center text-white/60 mt-4">No conversations </div>)
    }
    return displayData.map((conversation, index) => {
      if (displayData.length === index + 1){
        return (
          <div ref={lastElementObs} key={conversation.id}> 
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
          </div>
          );
          } else {
            return (
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
              </div>
          );
      }})
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
          {loading && <div className="text-center text-xs text-gray-500 py-2">Loading more...</div>}
        </div>
      </div>
    </div>
  );
}

//---------------------Search Chat------------------------------------------
// useEffect(() => {
//   if (!searchQuery.trim()) {
//     setDisplayData(conversations);
//     setLoading(false);
//     return;
//   }

//   const delayDebounceFn = setTimeout(async () => {
//     console.log(searchQuery);
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/users/search?query=${searchQuery}`,
//         {
//           method: "GET",
//           credentials: "include",
//         },
//       );
//       if (!response.ok) throw new Error("Network response was not ok");
//       const data = await response.json();
//       const formatedData = data.map((user) => ({
//         playerPdp: assets.kamalPdp,
//         firstname: user.firstname,
//         lastname: user.lastname,
//         lastMessage: "user found via search",
//         timeOfLastMsg: "",
//         id: user.id,
//       }));
//       if (!formatedData[0]) throw new Error("no user found");
//       setDisplayData(formatedData);
//     } catch (err) {
//       console.log("Failed to fetch users", err);

//       setDisplayData([
//         {
//           playerPdp: assets.noUserFound,
//           firstname: "No user Found",
//           lastname: "",
//           lastMessage: `${err}`,
//           timeOfLastMsg: "now",
//           id: "no-id",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   }, 500);
//   return () => clearTimeout(delayDebounceFn);
// }, [searchQuery]);
