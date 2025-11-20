import React from 'react'
import { CountdownTimer } from '@/components/ui/CountdownTimer'

export default function Matchmaking(){
	
	return (
		<div className='flex flex-col items-center bg-[#0F0F0F]/65 p-10 rounded-3xl'>
			<h3 className='text-3xl font-extrabold mb-6' >Find Match</h3>
			
			<div className="flex items-center justify-between gap-x-25">
				
				<div className='flex flex-col items-center'>
					<img src="/gameAvatars/profile5.jpeg"
						alt="profile"
						className="h-35 w-35 rounded-xl"/>
					<h3 className='text-xl font-semibold'>Oussama.Z</h3>
					<h3 className='text-md font-medium text-[#6E6E6E]'>[ozahdi]</h3>
				</div>
				
				<span className="text-3xl font-extrabold">VS</span>
				
				<div className='flex flex-col items-center'>
					<img src="/gameAvatars/Empty.jpeg"
						alt="profile"
						className="h-35 w-35 rounded-xl"/>
					<h3 className='text-xl font-semibold'>Player 2</h3>
					<h3 className='text-md font-medium text-[#6E6E6E]'>[player2]</h3>
				</div>
			</div>
			<CountdownTimer
				totalMinutes={0}
				totalSeconds={90}
				startColor="#D9D9D9"
				endColor="#D9D9D9"
				size="md"/>
		</div>
)
}
