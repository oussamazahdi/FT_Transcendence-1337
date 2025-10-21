import React from 'react'

const Friends = (props) => {
  return (
    <div className="flex items-center rounded-sm rounded-lg hover:bg-[#8D8D8D]/25 cursor-pointer">
      <img src={props.pdp.src} alt="" className='p-2 w-12 h-12 rounded-lg'/>
      <div className="flex-1 flex items-start justify-between min-w-0">
        <div className="flex-1 min-w-0 pr-4">
            <h4 className="text-white text-sm/2 font-semibold mb-2">{props.name}</h4>
            <h2 className="text-gray-300 text-sm/3 truncate">{props.lastmsg}</h2>
        </div>
        <div className="flex-shrink-0">
            <span className="text-gray-400 text-sm mr-2">{props.time}</span>
        </div>
      </div>
    </div>
  )
}

export default Friends
