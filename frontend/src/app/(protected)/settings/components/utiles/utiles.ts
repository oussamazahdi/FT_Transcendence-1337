import { GameSetting } from '../types/gameSettingTypes'

export const clampNum = (value: unknown): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : NaN;
};

export async function fetchGameSetting(): Promise<GameSetting> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/game/settings`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch game settings");
  const setting = await res.json();

  return setting;
}