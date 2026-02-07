import { cookies } from "next/headers";
import { fullUser } from "@/types/index"

export async function getCurrentUser(): Promise<fullUser | null> {
  const cookieStore = await cookies();
  const aToken = cookieStore.get("accessToken");
  const rToken = cookieStore.get("refreshToken");

  if (!rToken || !aToken) return null;

  try {

    const headers: HeadersInit = {Cookie: `accessToken=${aToken.value}`}

    const userPromise = fetch(`${process.env.SERVER_SIDE_API_URL}/api/auth/me`,{headers});
    const friendsPromise = fetch(`${process.env.SERVER_SIDE_API_URL}/api/friends/`,{headers})
    const blockedPromise = fetch(`${process.env.SERVER_SIDE_API_URL}/api/friends/blocks`,{headers})
    const pendingReqPromise = fetch(`${process.env.SERVER_SIDE_API_URL}/api/friends/requests/sent`,{headers})
    const incomingReqPromise = fetch(`${process.env.SERVER_SIDE_API_URL}/api/friends/requests`,{headers})
		const playerSettingsPromise = fetch(`${process.env.SERVER_SIDE_API_URL}/api/game/settings`,{headers});

    const [userRes, friendsRes, blockedRes, pendingReqRes, incomingReqRes, playerSettingsRes] = await Promise.all([userPromise, friendsPromise, blockedPromise, pendingReqPromise, incomingReqPromise, playerSettingsPromise])

    if (!userRes.ok) 
      return null;

    const user = await userRes.json();

    let friendsList:any = [];
    if (friendsRes.ok){
      const friendsData = await friendsRes.json();
      friendsList = friendsData.friendList || [];
    }

    let blockedList:any = []
    if (blockedRes.ok){
      const blockedData = await blockedRes.json();
      blockedList = blockedData.blockedUsers || [];
    }

    let pendingReqList:any = []
    if (pendingReqRes.ok){
      const pendingReqData = await pendingReqRes.json();
      pendingReqList = pendingReqData.Requests || [];
    }

    let incomingReqList:any = []
    if(incomingReqRes.ok){
      const incomingReqData = await incomingReqRes.json()
      incomingReqList = incomingReqData.requestsList || []
    }

		let playerSettingsList:any = []

		if(playerSettingsRes.ok){
			const gameSettings = await playerSettingsRes.json();
			playerSettingsList = gameSettings?.settings || [];
		}

    console.log("user", user.userData);
    // console.log("Friends", friendsList);
    // console.log("Blocked" ,blockedList);
    // console.log("pendingRequest", pendingReqList);
    // console.log("incomingRequest", incomingReqList);
		// console.log("-------------> gameSettings:", playerSettingsList);
    return {
      userData: user.userData,
      friends: friendsList,
      blocked: blockedList,
      pendingRequests: pendingReqList,
      incomingRequests: incomingReqList,
			gameSetting: playerSettingsList,
    };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}