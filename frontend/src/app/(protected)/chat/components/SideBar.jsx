import React, { useEffect } from "react";
import Friends from "./Friends";
import { useState } from "react";
import SearchCard from "./SearchCard";
import { autofetch } from "@/lib/api";

export default function SideBar({ displayData, loading }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
  if (!searchQuery.trim()){
    setIsOpen(false);
    setSearchData([]);
    // setSearchQuery("")
    return;
  }

  const delayDebounceFn = setTimeout(async () => {
    console.log("Query", searchQuery);
    setSearchLoading(true);
    setIsOpen(true);
    try {
      const response = await autofetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/search?q=${searchQuery}&page=${page}`,{
          method: "GET",
          credentials: "include",
        },
      );
      const data = await response.json();
      if (!response.ok) 
         throw new Error("data.error");
      
        console.log("response array",data) 
      const search = data.friends || []
      if (page !== 1 && search.length < 10)
        setHasMore(true)
      const formatedData = search.map((user) => ({
        id: user.id,
        avatar: user.avatar,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
      }));
      setSearchData(formatedData);
    } catch (err) {
      console.log("Failed to fetch users", err);
    } finally {
      setSearchLoading(false);
    }
  }, 500);
  return () => clearTimeout(delayDebounceFn);
}, [searchQuery, page]);


  const renderList = () => {

    if(isOpen){
      return (
        <div className="flex flex-col h-full">
        {searchData.map((user) => (
          <SearchCard key={user.id}
            id={user.id}
            avatar={user.avatar}
            firstname={user.firstname}
            lastname={user.lastname}
            username={user.username}
            setIsOpen={setIsOpen}
            setSearchQuery={setSearchQuery}
            displayData={displayData}
          />))}
        {hasMore && (
          <div className='w-full flex justify-center py-2 shrink-0'>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={searchLoading}
              className='text-xs border border-gray-400 rounded-sm px-3 py-1 text-gray-300 hover:bg-gray-700 hover:text-white transition disabled:opacity-50'
            >
              {searchLoading ? "Loading history..." : "Load more users"}
            </button>
          </div>)}
        </div>
    )}
    
    if (!displayData || displayData.length == 0){
      if (loading)
        return <div>Loading...</div>;
      return(<div className="text-sm text-center text-white/60 mt-4">No conversations </div>)
    }
    displayData.sort((a, b) => new Date(b.timeOfLastMsg) - new Date(a.timeOfLastMsg));
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

