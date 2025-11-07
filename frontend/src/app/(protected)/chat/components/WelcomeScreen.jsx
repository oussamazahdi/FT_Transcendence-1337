import React from "react";
import {assets} from '@/assets/data'

export default function WelcomeScreen (){
    const icon = assets.communication;
    return (
        <div className='flex flex-col items-center justify-center text-center h-full opacity-80'>
            <img 
                src={icon.src} 
                alt=""
                className="size-25 opacity-40"></img>
            <div className='text-gray-300/60'>
                <h1 className=" text-2xl font-semibold">Welcome to chat!</h1>
                <h2 className="text-md">Feel free to select or start<br />new conversation</h2>
            </div>
        </div>
    )
}