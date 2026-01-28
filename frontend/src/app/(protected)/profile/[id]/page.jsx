import React from "react";
import FriendsProfile from "./components/FriendsProfile";
import MatchPlayed from "../components/MatchPlayed";
import WinRate from "../components/WinRate";
import MatchHistory from "../components/MatchHistory";
import UserNotFound from "./components/UserNotFound";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";

async function getFriendProfile(id) {
  const cookieStore = await cookies();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
      method: "GET",
      headers: {Cookie: cookieStore.toString()},
      cache: "no-store",
    });

    if (!response.ok) 
      return null;
    
    const data = await response.json();
    return data.userData;
  } catch (error) {
    console.error("Failed to fetch friend profile:", error);
    return null;
  }
}
//handle go back
const FriendProfilePage = async ({ params }) => {
  const { id } = await params;

  const [currentUserData, friendProfile] = await Promise.all([
    getCurrentUser(),
    getFriendProfile(id)
  ]);

  const currentUser = currentUserData?.userData;
  const blockedList = currentUserData?.blocked || [];

  if (currentUser && currentUser.id == id) {
    redirect("/profile");
  }

  const isBlocked = blockedList.some((item) => item.id == id);
  if (isBlocked) {
    return <UserNotFound />;
  }

  if (!friendProfile) {
    return <UserNotFound />;
  }

  return (
    <div className="flex w-full max-w-7xl mx-3 flex-col md:flex-row gap-4 h-[86vh]">
      <div className="flex flex-1 flex-col w-full basis-7/10 gap-4">
        <FriendsProfile userPage={friendProfile} />
        <div className="flex flex-1 flex-col md:flex-row justify-between gap-4">
          <MatchPlayed classname="max-h-90"/>
          <WinRate />
        </div>
      </div>
      <div className="basis-3/10  flex flex-col gap-4">
        <MatchHistory classname="md:max-h-none" />
      </div>
    </div>
  );
};

export default FriendProfilePage;
