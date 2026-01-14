import { useAuth } from '@/contexts/authContext'
import React from 'react'
import IncomingReqCards from './IncomingReqCards'

const FriendsRequests = () => {
  const {incomingRequest , setFriends}  = useAuth()
  return (
    <div className='w-full h-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-min gap-4 p-4 overflow-y-auto custom-scrollbar'>
      {incomingRequest.map((user) => (
        <IncomingReqCards key={user.id} user={user}/>
      ))}
    </div>
  )
}

export default FriendsRequests
