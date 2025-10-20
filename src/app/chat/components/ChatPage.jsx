import React from "react";
import WelcomeScreen from "./WelcomeScreen";

export default function ChatPage({friend}){
    return(
        <div className="h-full">
            {friend ? <ChatWindow friend={friend}/> : <WelcomeScreen/>}
        </div>
    )
}