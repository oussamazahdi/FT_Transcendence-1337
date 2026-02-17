import React from "react";
import FriendsProfile from "./components/FriendsProfile.tsx";
import MatchPlayed from "../components/MatchPlayed";
import WinRate from "../components/WinRate";
import MatchHistory from "../components/MatchHistory";
import UserNotFound from "./components/UserNotFound.tsx";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";

async function getFriendProfile(id:string) {
  const cookieStore = await cookies();

  try {
    const response = await fetch(`${process.env.SERVER_SIDE_API_URL}/api/users/${id}`, {
      method: "GET",
      headers: {Cookie: cookieStore.toString()},
      cache: "no-store",
    });

    if (!response.ok) 
      return null;
    
    const data = await response.json();
    return data.userData;
  } catch (error) {
    return null;
  }
}
//handle go back
const FriendProfilePage = async ({ params }:any) => {
  const { id } = await params;

  const [currentUserData, friendProfile] = await Promise.all([
    getCurrentUser(),
    getFriendProfile(id)
  ]);

  const currentUser = currentUserData?.userData;
  const blockedList = currentUserData?.blocked || [];
  const blockers = currentUserData?.blockers || []

  if (currentUser && currentUser.id == id) {
    redirect("/profile");
  }

  const isBlocked = blockedList.some((item:any) => item.id == id);
  if (isBlocked) 
    return <UserNotFound />;
  
  const isBlocker = blockers.some((item:any) => item.id == id)
  if (isBlocker)
    return <UserNotFound />;

  if (!friendProfile) 
    return <UserNotFound />;

  return (
    <div className="grid w-[90vw] mx-3 grid-cols-1 gap-2 md:h-[86vh] md:grid-cols-12 md:grid-rows-2">
      <div className="min-w-0 md:col-span-8 md:row-start-1">
        <FriendsProfile userPage={friendProfile}  />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-2 md:col-span-8 md:row-start-2 md:grid-cols-2">
        <MatchPlayed id={id}/>
        <WinRate id={id}/>
      </div>

      <div className="min-w-0 h-full md:col-span-4 md:col-start-9 md:row-span-2">
        <MatchHistory classname="h-full min-h-0" id={id}/>
      </div>
    </div>
  );
};

export default FriendProfilePage;
