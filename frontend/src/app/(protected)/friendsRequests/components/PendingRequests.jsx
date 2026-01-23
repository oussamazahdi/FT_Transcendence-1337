import { useAuth } from '@/contexts/authContext'
import React from 'react'
import PendingReqCard from './PendingReqCard'

const PendingRequests = () => {
  const {pendingRequests} = useAuth()
  return (
    <div className='w-full h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-min gap-4 p-4 overflow-hidden overflow-y-auto custom-scrollbar'>
      {pendingRequests.map((user) => (
        <PendingReqCard key={user.id} user={user}/>
      ))}
    </div>
  )
}

export default PendingRequests
