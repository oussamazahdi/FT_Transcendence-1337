import React from 'react'
import Image from 'next/image';
import { assets } from '@/assets/data';
import Link from 'next/link';

const SearchUserCard = (props) => {
  const selectHandler = () => {
    props.setIsOpen(false);//no need
    props.setSearchQuery("");
  }
  return (
    <Link href={`/profile/${props.id}`} className='p-0.5 flex items-center rounded-xl bg-[#8D8D8D]/25 hover:bg-[#8D8D8D]/50 cursor-pointer mb-1'
      onClick={()=>selectHandler()}>
      <div className="m-px size-12 flex items-center rounded-lg cursor-pointer overflow-hidden">
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
    </Link>
  )
}

export default SearchUserCard
