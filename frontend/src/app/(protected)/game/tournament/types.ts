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

export type AddUserButtonProps = { disabled: boolean; onClick: () => void };

export type AuthUser = | {
      id?: string | number;
      username?: string;
      displayName?: string;
      avatar?: string | null;
      avatarUrl?: string | null;
      firstname?: string;
      lastname?: string;
    } | null | undefined;

export type UseAuthResult = { user?: AuthUser };

export type LockedUserId = string | null;

export type PlayersSlotsItem = { status: PlayerSlotStatus; player?: TournamentPlayer };
export type PlayersSlots = PlayersSlotsItem[];

export type BuildLockedPlayer = (
  lockedUserId: LockedUserId,
  users: UserLite[],
  user: AuthUser
) => TournamentPlayer | null;

export type FilterUsers = (users: UserLite[], search: string) => UserLite[];

export type FindSelectedUser = (users: UserLite[], selectedUserId: string | null) => UserLite | null;

export type BuildSlots = (players: TournamentPlayer[], maxPlayers: number) => PlayersSlots;


export type TournamentCreatePayload = {
  name: string;
  players: TournamentPlayer[];
};

export type MatchStatus = "locked" | "ready" | "in_progress" | "completed";

export type Match = {
  id: string;
  round: 1 | 2;
  a: TournamentPlayer;
  b: TournamentPlayer;
  status: MatchStatus;
  scoreA?: number;
  scoreB?: number;
  winnerId?: string;
};

export type TournamentState = {
  name: string;
  players: TournamentPlayer[];
  semis: Match[];
  final: Match;
  currentMatchId: string;
  createdAt: string;
  updatedAt: string;
};




class tournamentUtiles {
	clamp(n: number, min: number, max: number) {
		return Math.max(min, Math.min(max, n));
	}

	makeGuestId() {
		return `guest_${Math.random().toString(16).slice(2)}_${Date.now()}`;
	}

	toPlayer(user: UserLite): TournamentPlayer {
		return {
			id: user.id,
			username: user.username,
			displayName: user.displayName ?? user.username,
			avatarUrl: user.avatarUrl ?? null,
			isGuest: false,
		};
	}

	normalizePlayersWithLockedFirst( locked: TournamentPlayer | null, list: TournamentPlayer[], maxPlayers: number) {
		const withoutLocked = list.filter((ply) => (locked ? ply.id !== locked.id : true));
		const dedup = withoutLocked.filter((ply, idx, arr) => arr.findIndex((x) => x.id === ply.id) === idx);
	
		const keep = dedup.slice(0, Math.max(0, maxPlayers - (locked ? 1 : 0)));
	
		if (!locked) return keep.slice(0, maxPlayers);
		return [locked, ...keep].slice(0, maxPlayers);
	}

	buildLockedPlayer: BuildLockedPlayer = (lockedUserId, users, user) => {
		if (!lockedUserId) return null;
	
		const fromUsers = users.find((usr) => usr.id === lockedUserId);
		if (fromUsers) return this.toPlayer(fromUsers);
	
		const displayName = user?.displayName ?? [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim() ??
			user?.username ?? "You";
	
		return {
			id: lockedUserId,
			username: user?.username ?? "you",
			displayName: displayName || "You",
			avatarUrl: user?.avatarUrl ?? user?.avatar ?? DEFAULT_AVATARS[0] ?? null,
			isGuest: false,
		};
	};

	filterUsers: FilterUsers = (users, search) => {
		const q = search.trim().toLowerCase();
		if (!q) return users;
	
		return users.filter((u) => {
			const dn = (u.displayName ?? "").toLowerCase();
			const un = u.username.toLowerCase();
			return dn.includes(q) || un.includes(q);
		});
	};

	findSelectedUser: FindSelectedUser = (users, selectedUserId) => {
		if (!selectedUserId) return null;
		return users.find((u) => u.id === selectedUserId) ?? null;
	};

	buildSlots: BuildSlots = (players, maxPlayers) => {
		const out: PlayersSlots = [];
	
		for (let i = 0; i < maxPlayers; i++) {
			const p = players[i];
			if (p) out.push({ status: "filled", player: p });
			else {
				out.push({
					status:
						i < this.clamp(players.length + 1, 1, maxPlayers) ? "waiting" : "empty",
				});
			}
		}
	
		return out;
	};


}

export const TournamentUtiles = new tournamentUtiles();
