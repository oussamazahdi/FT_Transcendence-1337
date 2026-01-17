import React from 'react'

const UserNotFound = () => {
  return (
    <div className="h-[86vh] w-7xl flex flex-col items-center justify-center p-4 bg-[#000000]/60 rounded-2xl">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="512" 
        height="512" 
        viewBox="0 0 512 512" 
        style={{ enableBackground: "new 0 0 512 512" }} 
        xmlSpace="preserve"
        className="w-48 h-48 mb-4 fill-current text-gray-500"
      >
        <g>
          <path 
            d="M0 376h512V16H0zM303.578 99.789l21.211-21.211L346 99.789l21.211-21.211 21.211 21.211L367.211 121l21.211 21.211-21.211 21.211L346 142.211l-21.211 21.211-21.211-21.211L324.789 121zM361 301v15h-30v-15c0-41.353-33.647-75-75-75s-75 33.647-75 75v15h-30v-15c0-57.891 47.109-105 105-105s105 47.109 105 105zM123.578 99.789l21.211-21.211L166 99.789l21.211-21.211 21.211 21.211L187.211 121l21.211 21.211-21.211 21.211L166 142.211l-21.211 21.211-21.211-21.211L144.789 121zM391 496v-30h-63.281l-15-60H199.281l-15 60H121v30h270z" 
            fill="#FFFFFF" 
            opacity="0.5" 
            data-original="#000000"
          />
        </g>
      </svg>
      <p className="text-xl font-bold text-[#FFFFFF]/50">User Not found</p>
    </div>
  )
}

export default UserNotFound
