import { cookies } from "next/headers";
import { fullUser } from "@/types/index"

export async function getCurrentUser(): Promise<fullUser | null> {
  const cookieStore = await cookies();
  const aToken = cookieStore.get("accessToken");
  const rToken = cookieStore.get("refreshToken");

  if (!rToken || !aToken) return null;

  try {
    const API = process.env.SERVER_SIDE_API_URL;
    const headers: HeadersInit = {Cookie: `accessToken=${aToken.value}; refreshToken=${rToken.value}`}

    const userPromise = fetch(`${API}/api/auth/me`,{headers});
    const friendsPromise = fetch(`${API}/api/friends/`,{headers})
    const blockedPromise = fetch(`${API}/api/friends/blocks`,{headers})
    const pendingReqPromise = fetch(`${API}/api/friends/requests/sent`,{headers})
    const incomingReqPromise = fetch(`${API}/api/friends/requests`,{headers})
		const playerSettingsPromise = fetch(`${API}/api/game/settings`,{headers});
		const notificationsPoromise = fetch(`${API}/api/notifications`,{headers});
    const blockersPromise = fetch(`${API}/api/friends/blockers`,{headers})

    const [userRes, friendsRes, blockedRes, pendingReqRes, incomingReqRes, playerSettingsRes, notificationsRes, blockersRes] = await Promise.all([userPromise, friendsPromise, blockedPromise, pendingReqPromise, incomingReqPromise, playerSettingsPromise, notificationsPoromise, blockersPromise])

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

		let notificationsList = [];
		if (notificationsRes.ok) {
			const notifications = await notificationsRes.json();
			notificationsList = notifications?.userData || [];
		}

		let blockersList = [];
		if (blockersRes.ok) {
			const Blockers = await blockersRes.json();
			blockersList = Blockers?.blockedUsers || [];
		}

    return {
      userData: user.userData,
      friends: friendsList,
      blocked: blockedList,
      pendingRequests: pendingReqList,
      incomingRequests: incomingReqList,
			gameSetting: playerSettingsList,
			notification: notificationsList,
      blockers: blockersList
    };
  } catch (error) {
    return null;
  }
}