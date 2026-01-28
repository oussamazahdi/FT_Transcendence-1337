import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react'
import SearchUserCard from './SearchUserCard';
import { autofetch } from '@/lib/api';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const mockdata = [
    {
      id: 1,
      avatar: "http://localhost:3001/uploads/default/profile1.jpeg",
      firstname: "Soufiane",
      lastname: "Arif",
      username: "soufiiiix",
    },
    {
      id: 2,
      avatar: "http://localhost:3001/uploads/default/profile2.jpeg",
      firstname: "Chaymaa",
      lastname: "Nour",
      username: "chay_art",
    },
    {
      id: 3,
      avatar: "http://localhost:3001/uploads/default/profile3.jpeg",
      firstname: "Jalal",
      lastname: "Malyana",
      username: "j_malyana",
    },
    {
      id: 4,
      avatar: "http://localhost:3001/uploads/default/profile4.jpeg",
      firstname: "Amine",
      lastname: "Sanhaji",
      username: "amine_dev",
    },
    {
      id: 5,
      avatar: "http://localhost:3001/uploads/default/profile5.jpeg",
      firstname: "Yassine",
      lastname: "Benali",
      username: "yassine_b",
    },
    {
      id: 6,
      avatar: "http://localhost:3001/uploads/default/profile6.jpeg",
      firstname: "Salma",
      lastname: "Rachid",
      username: "salma_r",
    },
  ];

  useEffect(() => {
    if(!searchQuery.trim() || searchQuery.trim().length < 2){
      setIsOpen(false)
      setSearchData([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true)
      setIsOpen(true);
      try{
        const response = await autofetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/search?q=${searchQuery}&page=${page}`,{
            method: "GET",
            credentials: "include",
          },
        );
        const data = await response.json();
        if(!response.ok)
          throw new Error(data.error);

        console.log(data);
        const searchResult = data.users;


        setSearchData(prev => {
          if (page === 1) 
            return searchResult;
          return [...prev, ...searchResult];
        });
        setHasMore(searchResult.length === 10);
      }catch(err){
        console.log(err.message);
      }finally{
        setLoading(false);
      }
    },500)

    return () => clearTimeout(delayDebounceFn);
  },[searchQuery, page])

  const renderlist = () => {
    if (!searchData || searchData.length == 0){
      if (loading)
        return <div className='text-sm text-center text-white/60'>Loading...</div>;
      return(<div className="text-sm text-center text-white/60">No users found</div>)
    }
    return(
      <div className='flex flex-col h-full'>
        {searchData.map((user) => (
          <SearchUserCard key={user.id}            
            id={user.id}
            avatar={user.avatar}
            firstname={user.firstname}
            lastname={user.lastname}
            username={user.username}
            setIsOpen={setIsOpen}
            setSearchQuery={setSearchQuery}
          />))}
        {loading && <div className='text-xs text-center text-white/60 py-2'>Loading...</div>}
        {!loading && hasMore && searchData.length > 0 && (
          <div className='w-full flex justify-center py-2 shrink-0'>
            <button onClick={() => setPage(p => p + 1)} className='text-xs border border-gray-400 rounded-sm px-3 py-1 text-gray-300 hover:bg-gray-700 hover:text-white transition'>
              Load more users
            </button>
          </div>)}
      </div>
      )
  }

  return (
    <div className="relative hidden md:flex items-center border border-[#9D9D9D]/60 rounded-full px-4 py-2">
      <div className='flex items-center'>
        <input
          value={searchQuery}
          onChange={(e) => {setSearchQuery(e.target.value); setPage(1)}}
          placeholder="Search"
          className="bg-transparent outline-none text-white placeholder-white/40"
          />
        <MagnifyingGlassIcon className="w-5 h-5 ml-2 text-white/60" />
      </div>
      {isOpen && 
        <div className='absolute right-0 top-full mt-2 max-h-64 bg-[#000000] rounded-[10px] flex flex-col gap-1 p-2 overflow-y-auto z-50 custom-scrollbar min-w-65'>
          {renderlist()}
        </div>
      }
    </div>
  )
}

export default Search
