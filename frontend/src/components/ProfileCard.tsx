import React from 'react'
import Image from 'next/image'

const ProfileCard = (props:any) => {
  return (
    <div className='relative w-48 h-48 rounded-xl overflow-hidden mt-6'>
        <Image 
          src={props.imageUrl.src}
          alt=""
          fill={true} 
          className="object-cover"
          />
        <div className=' text-center absolute bottom-0 w-full p-4 bg-black/70 backdrop-blur-sm'>
            <h3 className="text-white font-bold">{props.name}</h3>
        </div>
    </div>
  )
}

export default ProfileCard
