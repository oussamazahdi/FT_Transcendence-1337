import React, { useEffect } from "react";
import Friends from "./Friends";
import { assets } from "@/assets/data";
import { useState } from "react";

const friendsData = [
  {
    playerPdp: assets.mohcinePdp,
    firstname: "Mohcine",
    lastname: "Ghanami",
    lastMessage: "Lorem ipsum is simply bla bla hhhhhhhhhhhhhhh",
    timeOfLastMsg: "11:08",
    status: true,
    key: "id1",
  },
  {
    playerPdp: assets.soufiixPdp,
    firstname: "Soufiane",
    lastname: "arif",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    key: "id2",
  },
  {
    playerPdp: assets.kamalPdp,
    firstname: "Kamal",
    lastname: "El Alami",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    key: "id3",
  },
  {
    playerPdp: assets.mohcinePdp,
    firstname: "Mohcine",
    lastname: "Ghanami",
    lastMessage: "Lorem ipsum is simply bla bla hhhhhhhhhhhhhhh",
    timeOfLastMsg: "11:08",
    status: true,
    key: "id4",
  },
  {
    playerPdp: assets.soufiixPdp,
    firstname: "Soufiane",
    lastname: "arif",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    key: "id5",
  },
  {
    playerPdp: assets.kamalPdp,
    firstname: "Kamal",
    lastname: "El Alami",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    key: "id6",
  },
  {
    playerPdp: assets.mohcinePdp,
    firstname: "Mohcine",
    lastname: "Ghanami",
    lastMessage: "Lorem ipsum is simply bla bla hhhhhhhhhhhhhhh",
    timeOfLastMsg: "11:08",
    status: true,
    key: "id7",
  },
  {
    playerPdp: assets.soufiixPdp,
    firstname: "Soufiane",
    lastname: "arif",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    key: "id8",
  },
  {
    playerPdp: assets.kamalPdp,
    firstname: "Kamal",
    lastname: "El Alami",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    key: "id9",
  },
  {
    playerPdp: assets.mohcinePdp,
    firstname: "Mohcine",
    lastname: "Ghanami",
    lastMessage: "Lorem ipsum is simply bla bla hhhhhhhhhhhhhhh",
    timeOfLastMsg: "11:08",
    status: true,
    key: "id10",
  },
  {
    playerPdp: assets.soufiixPdp,
    firstname: "Soufiane",
    lastname: "arif",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    key: "id11",
  },
  {
    playerPdp: assets.kamalPdp,
    firstname: "Kamal",
    lastname: "El Alami",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    key: "id12",
  },
  {
    playerPdp: assets.mohcinePdp,
    firstname: "Mohcine",
    lastname: "Ghanami",
    lastMessage: "Lorem ipsum is simply bla bla hhhhhhhhhhhhhhh",
    timeOfLastMsg: "11:08",
    status: true,
    key: "id13",
  },
  {
    playerPdp: assets.soufiixPdp,
    firstname: "Soufiane",
    lastname: "arif",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    key: "id14",
  },
  {
    playerPdp: assets.kamalPdp,
    firstname: "Kamal",
    lastname: "El Alami",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    key: "id15",
  },
];

export default function SideBar() {

  const [conversations, setConversation] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetchconversation = async () => {
      setLoading(true);
      try{
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversations`,{
          //   method:"GET",
          //   credentials: "include",
          // })
          
          // if(!response.ok)
          //   throw new Error("Network response was not ok");
          
          // const data = await response.json();
          // const formatedData = data.map((user) => ({
        await new Promise((resolve) => setTimeout(resolve,900))
  
        setConversation(friendsData);
  
        // console.log(conversations);
        
        const formatedData = conversations.map((user) => ({
          playerPdp: user.playerPdp,
          firstname: user.firstname,
          lastname: user.lastname,
          lastMessage: user.lastMessage,
          timeOfLastMsg: user.timeOfLastMsg,
          key:user.id,
        }))
  
        if(!formatedData[0])
          throw new Error ("No conversation found");
  
        setDisplayData(formatedData);
      }catch(err){
        console.log("Failed to fetch conversations", err);
        setDisplayData([{
          playerPdp: assets.noChatFound,
          firstname: "No char Found",
          lastname: "",
          lastMessage: `${err}`,
          timeOfLastMsg: "now",
          key:"no-id"
        }])
      }finally{
        setLoading(false);
      }
    }

  fetchconversation();
  }, [conversations]);

  useEffect(() => {
    if (!searchQuery.trim()){
      setDisplayData(conversations);
      setLoading(false);
      return;
    }
    
    const delayDebounceFn = setTimeout( async () => {
      console.log(searchQuery);
      setLoading(true);
      try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/search?query=${searchQuery}`,{
          method: 'GET',
          credentials: "include",
        })
        if (!response.ok)
            throw new Error("Network response was not ok");
        const data = await response.json();
        const formatedData = data.map( (user) => ({
          playerPdp: assets.kamalPdp,
          firstname: user.firstname,
          lastname: user.lastname,
          lastMessage: "user found via search",
          timeOfLastMsg: "",
          key:user.key,
        }))
        if(!formatedData[0])
          throw new Error ("no user found");
        setDisplayData(formatedData);
      }catch(err){
        console.log("Failed to fetch users", err);

        setDisplayData([{
          playerPdp: assets.noUserFound,
          firstname: "No user Found",
          lastname: "",
          lastMessage: `${err}`,
          timeOfLastMsg: "now",
          key:"no-id"
        }])
      }finally{
        setLoading(false);
      }
    }, 500)
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery])

  const renderList = () => {
    if(loading){
      return(
        <svg className="w-full h-13 flex justify-center" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#DEDEDE" stroke="#DEDEDE" stroke-width="15" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#DEDEDE" stroke="#DEDEDE" stroke-width="15" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#DEDEDE" stroke="#DEDEDE" stroke-width="15" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
      )
    }
      return displayData.map((friend) => (
          <Friends
            pdp={friend.playerPdp}
            name={friend.firstname + " " + friend.lastname}
            lastmsg={friend.lastMessage}
            time={friend.timeOfLastMsg}
            key={friend.key}
          />
      ))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between bg-[#1A1A1A]/75 mb-2 rounded-lg hover:bg-[#8D8D8D]/25">
        <input
          className="h-10 w-full px-2 placeholder:text-sm placeholder:text-gray-400 hover:rounded-lg focus:outline-none "
          placeholder="Search"
          value = {searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></input>
      </div>
      <div className="flex flex-col bg-[#1A1A1A]/75 rounded-lg px-2 flex-1 min-h-0 overflow-hidden">
        <h1 className="font-bold px-2 py-4 shrink-0">{searchQuery ? "searching..." : "Messages"}</h1>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {renderList()}
        </div>
      </div>
    </div>
  );
}
