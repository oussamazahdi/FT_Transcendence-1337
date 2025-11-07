//kamal part but worked by soufiane
import ProfileCard from "@/components/ProfileCard";
import { assets } from "@/assets/data";
import Link from "next/link";

export default function Home() {

  const teamMembers = [
    {
      name: "Kamal [kael-ala]",
      imageUrl: assets.kamalPdp,
      links: {
        school42: "...",
        linkedin: "...",
        github: "..."
      },
      key:'1'
    },
    {
      name: "Oussama [ozahdi]",
      imageUrl: assets.mohcinePdp,
      links: {
        school42: "...",
        linkedin: "...",
        github: "..."
      },
      key:'2'
    },
    {
      name: "soufiane [sarif]",
      imageUrl: assets.soufiixPdp,
      links: {
        school42: "...",
        linkedin: "...",
        github: "..."
      },
      key:'3'
    }
  ];

  const friendsCards = teamMembers.map((friend)=>{
    return(
      <ProfileCard
        name={friend.name}
        imageUrl={friend.imageUrl}
        github={friend.links.github}
        linkedin={friend.links.linkedin}
        school42={friend.links.school42}
        key={friend.key}
      />
    )
  })

  return(
   <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <h1 className="mb-6 text-5xl text-center font-bold">Game on. Anytime. Anywhere.</h1>
      <h2 className="mb-6 text-xl text-center text-gray-400">Play ping pong or tic-tac-toe with friends, join tournaments, and chat <br/>
            all in one spot. Start your next match now.</h2>

      <div className="mb-4 space-x-4">
        <Link
        href="/sign-up"
          className={`inline-block w-40 text-center py-2 rounded border border-gray-600  hover:bg-gray-600`}
        >
          Get started
        </Link>
        <Link
          href="/sign-in"
          className={`inline-block w-40 text-center py-2 rounded border border-gray-600 hover:bg-gray-600`}
        >
          Log in
        </Link>
      </div>
      <div>
          <h1 className="text-3xl font-bold">Team members</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {friendsCards}
      </div>
    </div>
  )
}