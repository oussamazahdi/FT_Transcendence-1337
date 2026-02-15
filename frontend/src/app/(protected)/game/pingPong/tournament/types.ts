export type UserLite = {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string | null;
};

export type TournamentPlayer = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  isGuest?: boolean;
};

export type  PlayerSlotStatus = "filled" | "waiting" | "empty";

export type CreateTournamentModalProps = {
  open: boolean;
  onClose: () => void;
  users?: UserLite[];
  initialPlayers?: TournamentPlayer[];
  maxPlayers?: number;
  storageKey?: string;
  redirectTo?: string;
  onStart?: (payload: { name: string; players: TournamentPlayer[] }) => void;
};

export const DEFAULT_AVATARS = [
  "/gameAvatars/profile1.jpeg",
  "/gameAvatars/profile2.jpeg",
  "/gameAvatars/profile3.jpeg",
  "/gameAvatars/profile4.jpeg",
  "/gameAvatars/profile5.jpeg",
  "/gameAvatars/profile6.jpeg",
  "/gameAvatars/profile7.jpeg",
  "/gameAvatars/profile8.jpeg",
];

class tournamentUtiles {
	clamp(n: number, min: number, max: number) {
		return Math.max(min, Math.min(max, n));
	}

	makeGuestId() {
		return `guest_${Math.random().toString(16).slice(2)}_${Date.now()}`;
	}

	toPlayer(u: UserLite): TournamentPlayer {
		return {
			id: u.id,
			username: u.username,
			displayName: u.displayName ?? u.username,
			avatarUrl: u.avatarUrl ?? null,
			isGuest: false,
		};
	}

	normalizePlayersWithLockedFirst( locked: TournamentPlayer | null, list: TournamentPlayer[], maxPlayers: number) {
		const withoutLocked = list.filter((p) => (locked ? p.id !== locked.id : true));
		const dedup = withoutLocked.filter((p, idx, arr) => arr.findIndex((x) => x.id === p.id) === idx);
	
		const keep = dedup.slice(0, Math.max(0, maxPlayers - (locked ? 1 : 0)));
	
		if (!locked) return keep.slice(0, maxPlayers);
		return [locked, ...keep].slice(0, maxPlayers);
	}
}

export const TournamentUtiles = new tournamentUtiles();
