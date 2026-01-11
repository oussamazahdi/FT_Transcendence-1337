import React from "react";
import { assets } from "@/assets/data";
import Image from "next/image";
import { CheckCircleIcon, NoSymbolIcon } from "@heroicons/react/24/outline";

const FriendData = [
  {
    id: "1",
    firstname: "soufiane",
    lastname: "arif",
    username: "soufiix",
    avatar: assets.soufiixPdp,
  },
  {
    id: "2",
    firstname: "kamal",
    lastname: "alamai",
    username: "kael-ala",
    avatar: assets.kamalPdp,
  },
  {
    id: "3",
    firstname: "oussama",
    lastname: "zahdi",
    username: "ouss",
    avatar: assets.mohcinePdp,
  },
  {
    id: "4",
    firstname: "soufiane",
    lastname: "arif",
    username: "soufiix",
    avatar: assets.soufiixPdp,
  },
  {
    id: "5",
    firstname: "kamal",
    lastname: "alamai",
    username: "kael-ala",
    avatar: assets.kamalPdp,
  },
  {
    id: "6",
    firstname: "oussama",
    lastname: "zahdi",
    username: "ouss",
    avatar: assets.mohcinePdp,
  },
  {
    id: "7",
    firstname: "soufiane",
    lastname: "arif",
    username: "soufiix",
    avatar: assets.soufiixPdp,
  },
  {
    id: "8",
    firstname: "kamal",
    lastname: "alamai",
    username: "kael-ala",
    avatar: assets.kamalPdp,
  },
  {
    id: "9",
    firstname: "oussama",
    lastname: "zahdi",
    username: "ouss",
    avatar: assets.mohcinePdp,
  },
  {
    id: "10",
    firstname: "soufiane",
    lastname: "arif",
    username: "soufiix",
    avatar: assets.soufiixPdp,
  },
  {
    id: "11",
    firstname: "kamal",
    lastname: "alamai",
    username: "kael-ala",
    avatar: assets.kamalPdp,
  },
  {
    id: "12",
    firstname: "oussama",
    lastname: "zahdi",
    username: "ouss",
    avatar: assets.mohcinePdp,
  },
];

const FriendComponent = FriendData.map((user) => (
  <div
    key={user.id}
    className="w-full mx-2 max-w-200 h-14 md:mx-4 rounded-sm bg-[#414141]/35 flex items-center gap-1 p-1 hover:bg-[#414141] cursor-pointer"
  >
    <Image
      src={user.avatar}
      width={48}
      height={48}
      alt="avatar"
      className="rounded-xs"
    />
    <div className="flex flex-col md:flex-row gap-1 md:gap-2 md:mx-2">
      <p className="text-xs md:text-sm font-bold">
        {user.firstname} {user.lastname}
      </p>
      <p className="text-xs/3 md:text-xs text-[#909090]">{`[@${user.username}]`}</p>
    </div>
    <button className="ml-auto mr-1 md:mr-4 hover:scale-105 cursor-pointer transition-all duration-150 flex gap-1 rounded-full border-1 p-2">
      <CheckCircleIcon className="w-4 h-4" />
      <p className="text-xs">deblock</p>
    </button>
  </div>
));

export default function BlockedUsers() {
  return (
    <div className="h-full flex flex-col justify-center items-center gap-4 mx-1 pt-4 md:pt-0">
      <div className="md:basis-2/10 flex flex-col md:justify-end-safe items-center">
        <NoSymbolIcon className="size-12" />
        <h1 className="text-white font-bold text-sm md:text-xsm">
          Deblock users
        </h1>
        <h3 className="text-[#ABABAB] text-xs md:text-sm text-center">
          Remove blocks to let players return to the table and continue playing.
        </h3>
      </div>
      <div className="md:basis-8/10 w-full flex flex-col justify-items-start items-center gap-1 overflow-y-auto custom-scrollbar mx-1">
        {FriendComponent}
      </div>
    </div>
  );
}
