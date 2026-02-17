import { StaticImageData } from "next/image";
import { z } from "zod";

export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  avatar?: string | null;
  isverified?: boolean;
  status2fa?: boolean;
  player_level: number;
  player_xp: number
}

export interface otherUserData{
  firstname:string;
  lastname:string;
  username:string;
  id:string;
  avatar:StaticImageData | null | string;
  player_level: number;
  player_xp: number
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

export type ChatMessage = {
  id: number | string;
  senderId: number | string;
  receiverId: number | string;
  avatar?: string | null;
  type: string;
  status: string;
  text: string;
  timestamp: string;
  isMe: boolean;
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

export const SignUpSchema = z
  .object({
    username: z.string()
      .min(3, "Nickname must be at least 3 characters")
      .max(15, "Nickname must be at most 20 characters")
      .regex(/^[a-zA-Z0-9_-]+$/, "Nickname can only contain letters, numbers, _ or -"),
    firstname: z.string()
      .min(3, "First name must be at least 3 characters")
      .max(15, "First name must be at most 50 characters")
      .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "First name contains invalid characters"),
    lastname: z.string()
      .min(3, "Last name must be at least 3 characters")
      .max(15, "Last name must be at most 50 characters")
      .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Last name contains invalid characters"),
    email: z.string().email("Email address is invalid"),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must not exceed 64 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpForm = z.infer<typeof SignUpSchema>;


export interface Friend {
  id: string;
  username: string;
  avatar?: string;
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
  type: 'info' | 'invite' | 'message';
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
  notification: any,
  blockers:any,
}
