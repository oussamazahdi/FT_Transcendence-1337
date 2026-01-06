import React from 'react'
import Image from 'next/image'

const RemoveUserConf = ({ user, setShowconfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowconfirm(false)}></div>
      <div className="relative z-10 bg-[#0f0f0f] py-10 px-16 rounded-4xl shadow-2xl w-[80%] md:w-100 flex flex-col items-center ">
        <Image src={user.avatar} alt="icon" width={120} height={120} className='size-20 md:size-28 rounded-xl mb-2'/>
        <p className="font-bold text-xl md:text-2xl">Remove Friend</p>
        <p className="text-sm md:text-lg font-medium">
          {user.firstname} {user.lastname}
        </p>
        <p className='text-center text-gray-500 text-xs md:text-sm'>This person won’t be able to messageor invite you, They wont know you blocked theme</p>
        <div className="flex justify-center items-center gap-4">
          <button
            type="submit"
            onClick={()=> setShowconfirm(false)}
            className="w-30 h-8 text-xs font-medium rounded-sm mt-4 hover:bg-[#442222]/40 bg-[#442222] text-[#FF4848] cursor-pointer">
            Confirm
          </button>
          <button
            type="submit"
            onClick={()=> setShowconfirm(false)}
            className="w-30 h-8 text-xs font-medium rounded-sm mt-4 hover:bg-[#252525]/40 bg-[#252525] text-white hover:text-white cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default RemoveUserConf
