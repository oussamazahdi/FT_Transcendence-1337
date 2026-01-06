import { assets } from "@/assets/data";

export const messages = [
  {
    id: 1,
    senderId: "1", // This matches YOUR profile ID
    type: "text",
    text: "Hello! How are you?",
    timestamp: "10:00 AM",
    isMe: true, // Helper for frontend logic (later you calculate this)
  },
  {
    id: 2,
    senderId: "1",
    type: "text",
    text: "I am good, thanks! Did you finish the design?",
    timestamp: "10:02 AM",
    isMe: false,
  },
  {
    id: 3,
    senderId: "1",
    type: "text",
    text: "Yes, I am working on the frontend noddflkdshfkd;lkjsl;kdhlksadjglkjadshflkdshjalkafjahslkdjfhdsalkfjhbasdlkjfhasdlkjfhasldkjhflkjasdhlkfjdshAKJAGSDKJHGFADSKJHGDWSAKJGHADSKJGHDSKHGFDSKJGHDSKJHGFKJDSHGDSKJHGDFSKmnbdmsvfmdsnvfmndsbvmnfbdsmnfbdsmn.",
    timestamp: "10:05 AM",
    isMe: true,
  },
  {
    id: 4,
    senderId: "2",
    type: "text",                // Standard text message
    text: "Hey! Do you want to play a match?",
    timestamp: "10:00 AM",
    isMe: false,
  },
  {
    id: 5,
    senderId: "1",
    type: "text",
    text: "Sure, send me an invite!",
    timestamp: "10:01 AM",
    isMe: true,
  },
  {
    id: 6,
    senderId: "2",
    type: "game_invite",         // SPECIAL MESSAGE TYPE
    gameType: "ping_pong",
    text: "invited you to play Ping Pong", // Fallback text
    status: "pending",           // pending | accepted | rejected
    timestamp: "10:02 AM",
    isMe: false,
  },
  {
    id: 7,
    senderId: "2",
    type: "game_invite",
    gameType: "tic_tac_toe",
    text: "invited you to play Tic Tac Toe",
    status: "rejected",
    timestamp: "10:05 AM",
    isMe: false,
  },
  {
    id: 8,
    senderId: "1",
    type: "text",
    text: "3ayeeeeee9ti",
    status: "rejected",
    timestamp: "10:05 AM",
    isMe: false,
  }
]









export const friendsData = [
  {
    playerPdp: assets.mohcinePdp,
    firstname: "Mohcine",
    lastname: "Ghanami",
    lastMessage: "Lorem ipsum is simply bla bla hhhhhhhhhhhhhhh",
    timeOfLastMsg: "11:08",
    status: true,
    id: "1",
  },
  {
    playerPdp: assets.soufiixPdp,
    firstname: "Soufiane",
    lastname: "arif",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: false,
    id: "2",
  },
  {
    playerPdp: assets.kamalPdp,
    firstname: "Kamal",
    lastname: "El Alami",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    id: "3",
  },
  {
    playerPdp: assets.mohcinePdp,
    firstname: "Mohcine",
    lastname: "Ghanami",
    lastMessage: "Lorem ipsum is simply bla bla hhhhhhhhhhhhhhh",
    timeOfLastMsg: "11:08",
    status: false,
    id: "4",
  },
  {
    playerPdp: assets.soufiixPdp,
    firstname: "Soufiane",
    lastname: "arif",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    id: "5",
  },
  {
    playerPdp: assets.kamalPdp,
    firstname: "Kamal",
    lastname: "El Alami",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    id: "6",
  },
  {
    playerPdp: assets.mohcinePdp,
    firstname: "Mohcine",
    lastname: "Ghanami",
    lastMessage: "Lorem ipsum is simply bla bla hhhhhhhhhhhhhhh",
    timeOfLastMsg: "11:08",
    status: true,
    id: "7",
  },
  {
    playerPdp: assets.soufiixPdp,
    firstname: "Soufiane",
    lastname: "arif",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    id: "8",
  },
  {
    playerPdp: assets.kamalPdp,
    firstname: "Kamal",
    lastname: "El Alami",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    id: "9",
  },
  {
    playerPdp: assets.mohcinePdp,
    firstname: "Mohcine",
    lastname: "Ghanami",
    lastMessage: "Lorem ipsum is simply bla bla hhhhhhhhhhhhhhh",
    timeOfLastMsg: "11:08",
    status: true,
    id: "10",
  },
  {
    playerPdp: assets.soufiixPdp,
    firstname: "Soufiane",
    lastname: "arif",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    id: "11",
  },
  {
    playerPdp: assets.kamalPdp,
    firstname: "Kamal",
    lastname: "El Alami",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    id: "12",
  },
  {
    playerPdp: assets.mohcinePdp,
    firstname: "Mohcine",
    lastname: "Ghanami",
    lastMessage: "Lorem ipsum is simply bla bla hhhhhhhhhhhhhhh",
    timeOfLastMsg: "11:08",
    status: true,
    id: "13",
  },
  {
    playerPdp: assets.soufiixPdp,
    firstname: "Soufiane",
    lastname: "arif",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    id: "14",
  },
  {
    playerPdp: assets.kamalPdp,
    firstname: "Kamal",
    lastname: "El Alami",
    lastMessage: "Lorem ipsum is simply bla bla",
    timeOfLastMsg: "20/09/2025",
    status: true,
    id: "15",
  },
];