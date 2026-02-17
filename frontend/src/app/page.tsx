import ProfileCard from "@/components/ProfileCard.tsx";
import { assets } from "@/assets/data";
import Link from "next/link";
import { StaticImageData } from "next/image";

interface teamMemberLinks{
  school42: string ,
  linkedin:string ,
  github:string,
}

interface teamMember{
  name: string,
  imageUrl: string | StaticImageData,
  links: teamMemberLinks
  key:string,
}

export default function Home() {
  const teamMembers: teamMember[] = [
    {
      name: "Kamal [kael-ala]",
      imageUrl: assets.kamalPdp,
      links: {
        school42: "https://profile.intra.42.fr/users/kael-ala",
        linkedin: "https://www.linkedin.com/in/KamalElAlami/",
        github: "https://github.com/KamalElAlami",
      },
      key: "1",
    },
    {
      name: "Oussama [ozahdi]",
      imageUrl: assets.OussamaPdp,
      links: {
        school42: "https://profile.intra.42.fr/users/ozahdi",
        linkedin: "https://www.linkedin.com/in/oussamazahdi/",
        github: "https://github.com/oussamazahdi",
      },
      key: "2",
    },
    {
      name: "soufiane [sarif]",
      imageUrl: assets.soufiixPdp,
      links: {
        school42: "https://profile.intra.42.fr/users/sarif",
        linkedin: "https://www.linkedin.com/in/soufiane-arif-16a97b136/",
        github: "https://github.com/soufiixarif",
      },
      key: "3",
    },
  ];

  const friendsCards = teamMembers.map((friend) => {
    return (
      <ProfileCard
        name={friend.name}
        imageUrl={friend.imageUrl}
        github={friend.links.github}
        linkedin={friend.links.linkedin}
        school42={friend.links.school42}
        key={friend.key}
      />
    );
  });

  return (
    <div className="md:h-screen flex flex-col items-center justify-center text-white gap-6 mt-6">
      <h1 className="text-3xl md:text-5xl text-center font-bold">
        Game on. Anytime. Anywhere.
      </h1>
      <h2 className="text-l md:text-xl  md:w-120 text-center text-gray-400">
        Play ping pong or tic-tac-toe with friends, join tournaments, and chat
        all in one spot. Start your next match now.
      </h2>

      <div className="flex md:flex-row flex-col justify-center items-center gap-2">
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
  );
}
