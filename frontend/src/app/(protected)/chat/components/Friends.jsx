import React from 'react'

const Friends = (props) => {
  return (
    <div className="p-[2px] flex items-center rounded-xl hover:bg-[#8D8D8D]/25 cursor-pointer mb-1" onClick={props.onClick}>
      <div className='m-[1px] flex items-center rounded-lg cursor-pointer overflow-hidden'>
        <img src={props.pdp.src} alt="" className='w-12 h-12 object-cover'/>
      </div>
      <div className="ml-2 flex-1 flex items-start justify-between min-w-0">
        <div className="flex-1 min-w-0 pr-4">
            <h4 className="text-white text-sm font-semibold">{props.name}</h4>
            <h2 className="text-gray-300 text-xs truncate">{props.lastmsg}</h2>
        </div>
        <div className="flex-shrink-0">
            <span className="text-gray-400 text-xs mr-2">{props.time}</span>
        </div>
      </div>
    </div>
  )
}

export default Friends
