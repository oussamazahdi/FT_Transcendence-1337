import { StaticImageData } from "next/image";

export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  avatar?: string | null;
  isverified?: boolean;
  status2fa?: boolean;
}

export interface otherUserData{
  firstname:string;
  lastname:string;
  username:string;
  id:string;
  avatar:StaticImageData | null | string;
}

export type Conversation = {
  id: number | string;
  convid?: number | string;
  avatar?: string | null | StaticImageData;
  firstname: string;
  lastname: string;
  lastMessage: string;
  timeOfLastMsg: string;
  status: boolean;
};

export interface Leaders{
    id:number,
    username:string,
    avatar:StaticImageData | string | null,
    firstname: string,
    lastname: string,
    player_xp: number,
    player_level: number,
    wins:number,
    forfaits:number,
    loses:number,
    rank:number,
}

export interface Friend {
  id: string;
  username: string;
  avatar?: string;
  status: 'online' | 'offline';
}

export interface GameSetting {
  [key: string]: any;
}

export interface AuthResponse {
  userData: User;
  friends: Friend[];
  blocked: User[];
  pendingRequests: any[];
  incomingRequests: any[];
  gameSetting: GameSetting[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'invite' | 'message';// to check later
  read: boolean;
  createdAt: string;
  [key: string]: any;
}

export interface fullUser{
  userData: User,
  friends: any,
  blocked: any,
  pendingRequests: any,
  incomingRequests: any,
  gameSetting: any,
}
