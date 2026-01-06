import React, { useEffect } from "react";
import Friends from "./Friends";
import { assets } from "@/assets/data";
import { useState } from "react";
import { friendsData } from "@/assets/mocData";

export default function SideBar() {
  const [conversations, setConversation] = useState(friendsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchconversation = async () => {
      setLoading(true);
      try {
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversations`,{
        //   method:"GET",
        //   credentials: "include",
        // })

        // if(!response.ok)
        //   throw new Error("Network response was not ok");

        // const data = await response.json();
        // const formatedData = data.map((user) => ({
        // await new Promise((resolve) => setTimeout(resolve, 900));

        // console.log(conversations);

        const formatedData = conversations.map((user) => ({
          avatar: user.playerPdp,
          firstname: user.firstname,
          lastname: user.lastname,
          lastMessage: user.lastMessage,
          timeOfLastMsg: user.timeOfLastMsg,
          status:user.status,
          id: user.id,
        }));

        if (!formatedData[0]) throw new Error("No conversation found");

        setDisplayData(formatedData);
      } catch (err) {
        console.log("Failed to fetch conversations", err);
        setDisplayData([
          {
            avatar: assets.noUserFound,
            firstname: "No chat Found",
            lastname: "",
            lastMessage: `${err}`,
            timeOfLastMsg: "now",
            id: "no-id",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchconversation();
  }, [conversations]);

  const renderList = () => {
    if (loading) {
      return (
        <div>Loading...</div>
      );
    }
    return displayData.map((friend) => (
      <Friends
        id={friend.id}
        key={friend.id}
        avatar={friend.avatar}
        name={friend.firstname + " " + friend.lastname}
        lastmsg={friend.lastMessage}
        status={friend.status}
        time={friend.timeOfLastMsg}
      />
    ));
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