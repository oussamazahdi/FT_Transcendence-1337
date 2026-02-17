"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GameSetup from "@/components/gameSetupComp/gameSetup";
import CreateTournamentModal from "./tournament/CreateTournamentModal";
import { useAuth } from "@/contexts/authContext";

type LocalGameItem = {
	title: string;
	cover: string;
	alt: string;
	description: string;
	button: string;
	onClick: () => void;
};

type UserLite = {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string | null;
};

type TournamentPlayer = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  isGuest?: boolean;
};

type Friends = {
  avatar: string;
  firstname: string;
  id: number;
  lastname: string;
  username: string;
};

function normalizeFriends(friends: Friends[] | undefined | null): UserLite[] {
  if (!Array.isArray(friends)) return [];
  return friends.map((user) => ({
    id: String(user.id),
    username: user.username,
    displayName: `${user.firstname} ${user.lastname}`.trim(),
    avatarUrl: user.avatar,
  }));
}

function Card({ title, cover, alt, description, button, onClick }: { title: string; cover: string; alt: string; description: string; button: string; onClick: () => void; }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-[#0F0F0F]/65 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="relative h-120 w-full overflow-hidden">
        <Image
          fill
          src={cover}
          alt={alt}
          className="object-cover transition duration-300 grayscale group-hover:grayscale-0 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-black/20" />
      </div>

      <div className="p-5 text-left">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/70">{description}</p>

        <button type="button" onClick={onClick}
          className="mt-4 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/15 active:scale-[0.99]">
          {button}
        </button>
      </div>
    </div>
  );
}

export default function LocalGame() {
  const router = useRouter();
  const { friends } = useAuth();

  const [isLocalSetupOpen, setIsLocalSetupOpen] = useState(false);
  const [isTournamentOpen, setIsTournamentOpen] = useState(false);

  const users: UserLite[] = useMemo(() => normalizeFriends(friends as unknown as Friends[]), [friends]);

  const handleTournamentStart = (payload: { name: string; players: TournamentPlayer[] }) => {
    setIsTournamentOpen(false);
    localStorage.setItem("tournament:create", JSON.stringify(payload));
    router.push("/game/tournament");
  };

  const items: LocalGameItem[] = useMemo(
    () => [
      {
        title: "Local Game",
        cover: "/Local_bg.png",
        alt: "Local 1vs1 cover",
        description: "Play a single game against a friend on the same device.",
        button: "Start Game",
        onClick: () => setIsLocalSetupOpen(true),
      },
      {
        title: "Tournament",
        cover: "/Tournament_bg.png",
        alt: "Tournament cover",
        description: "Create a 4-player bracket and play match-by-match to crown a champion.",
        button: "Create Tournament",
        onClick: () => setIsTournamentOpen(true),
      },
      {
        title: "Remote Game",
        cover: "/Remote_bg.png",
        alt: "Remote game cover",
        description: "Queue up for an online match and compete against another player.",
        button: "Start Game",
        onClick: () => router.push("/game/matchmaking"),
      },
    ],
    [router]
  );

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Ping Pong</h1>
          <p className="mt-1 text-sm text-white/60">Choose a mode to start playing.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Card key={it.title} title={it.title} cover={it.cover} alt={it.alt} description={it.description} button={it.button} onClick={it.onClick}/>
          ))}
        </div>

        <GameSetup isVisible={isLocalSetupOpen} onClose={() => setIsLocalSetupOpen(false)} />
        <CreateTournamentModal open={isTournamentOpen} onClose={() => setIsTournamentOpen(false)} users={users} onStart={handleTournamentStart}/>
      </div>
    </div>
  );
}
