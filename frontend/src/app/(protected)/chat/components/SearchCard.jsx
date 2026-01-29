import React, { useContext } from 'react'
import { assets } from '@/assets/data'
import Image from 'next/image'
import { SelectedFriendContext } from '@/contexts/userContexts'

const SearchCard = (props) => {
  const { setSelectedFriend } = useContext(SelectedFriendContext);

  const selectHandler = () => {
    props.setIsOpen(false); 
    props.setSearchQuery("");
    setSelectedFriend(props);
  }

  return (
    <div className='p-0.5 flex items-center rounded-xl bg-[#8D8D8D]/25 hover:bg-[#8D8D8D]/50 cursor-pointer mb-1'
      onClick={()=>selectHandler()}>
      <div className="m-0.5 size-12 flex items-center rounded-lg cursor-pointer overflow-hidden">
        <Image
          src={props.avatar || assets.defaultProfile}
          alt=""
          width={50}
          height={50}
          className="object-cover"
        />
      </div>      
      <div className="ml-2 flex flex-col items-start justify-between min-w-0">
        <h4 className="text-white text-xs font-semibold">{props.firstname} {props.lastname}</h4>
        <h2 className="text-gray-300 text-[12px] truncate">
          @{props.username}
        </h2>
      </div>
    </div>
  )
}

export default SearchCard
