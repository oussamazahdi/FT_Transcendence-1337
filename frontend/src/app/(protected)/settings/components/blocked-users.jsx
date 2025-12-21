import React from "react";
import { assets } from "@/assets/data";
import Image from "next/image";
const FriendData = [
  { id: "1", firstname: "soufiane", lastname: "arif", username: "soufiix", avatar: assets.soufiixPdp },
  { id: "2", firstname: "kamal", lastname: "alamai", username: "kael-ala", avatar: assets.kamalPdp },
  { id: "3", firstname: "oussama", lastname: "zahdi", username: "ouss", avatar: assets.mohcinePdp },
  { id: "4", firstname: "soufiane", lastname: "arif", username: "soufiix", avatar: assets.soufiixPdp },
  { id: "5", firstname: "kamal", lastname: "alamai", username: "kael-ala", avatar: assets.kamalPdp },
  { id: "6", firstname: "oussama", lastname: "zahdi", username: "ouss", avatar: assets.mohcinePdp },
  { id: "7", firstname: "soufiane", lastname: "arif", username: "soufiix", avatar: assets.soufiixPdp },
  { id: "8", firstname: "kamal", lastname: "alamai", username: "kael-ala", avatar: assets.kamalPdp },
  { id: "9", firstname: "oussama", lastname: "zahdi", username: "ouss", avatar: assets.mohcinePdp },
  { id: "10", firstname: "soufiane", lastname: "arif", username: "soufiix", avatar: assets.soufiixPdp },
  { id: "11", firstname: "kamal", lastname: "alamai", username: "kael-ala", avatar: assets.kamalPdp },
  { id: "12", firstname: "oussama", lastname: "zahdi", username: "ouss", avatar: assets.mohcinePdp },
];

const FriendComponent = FriendData.map((user) => (
  <div key={user.id} className="w-200 h-14 mx-4 rounded-[12px] bg-[#414141]/35 flex items-center gap-1 p-1 hover:bg-[#414141] cursor-pointer">
    <Image
      src={user.avatar}
      width={48}
      height={48}
      alt="avatar"
      className="rounded-[10px]"
    />
    <p className="font-bold ml-2">
      {user.firstname} {user.lastname}
    </p>
    <p className="text-xs text-[#909090]">{`[@${user.username}]`}</p>
    <button className="ml-auto mr-4 hover:scale-105 cursor-pointer transition-all duration-150">
      <Image src={assets.deblock} width={72} height={72} alt="icon" />
    </button>
  </div>
));

export default function BlockedUsers() {
  return (
    <div className="h-full flex flex-col justify-center items-center gap-4">
      <div className="basis-1/4 flex flex-col justify-end-safe items-center">
        <Image src={assets.blockUser} alt="icon" height={48} width={48} />
        <h1 className="font-bold">Deblock users</h1>
        <h3 className="text-xs text-gray-500">
          Remove blocks to let players return to the table and continue playing.
        </h3>
      </div>
      <div className="basis-3/4 flex flex-col justify-items-start items-center gap-1 overflow-y-auto custom-scrollbar">
        {FriendComponent}
      </div>
    </div>
  );
}
