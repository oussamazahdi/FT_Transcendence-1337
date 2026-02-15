"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import { Field, MapCard } from "./ui/Game-ui";

type MapDefinition = {
  id: string;
  label: string;
  image: string;
};

type SettingsKey = "ball_speed" | "score_limit" | "paddle_size";

type RangeSpec = {
  min: number;
  max: number;
};

type SettingsState = Record<SettingsKey, number | "">;

type fullSettings = {
	ball_speed?: number;
	score_limit?: number;
	paddle_size?: number;
	game_mode?: string;
}

type GameSetting = {
	settings: fullSettings;
};

const MAPS: MapDefinition[] = [
  { id: "desert", label: "DESERT", image: "/maps/desert.png" },
  { id: "hell", label: "HELL", image: "/maps/hell.png" },
  { id: "ocean", label: "OCÉAN", image: "/maps/water.png" },
  { id: "forest", label: "FOREST", image: "/maps/forest.jpeg" },
  { id: "snow", label: "SNOW", image: "/maps/snow.jpeg" },
  { id: "space", label: "SPACE", image: "/maps/space.png" },
];

const RANGES: Record<SettingsKey, RangeSpec> = {
  ball_speed: { min: 1, max: 3 },
  score_limit: { min: 5, max: 20 },
  paddle_size: { min: 1, max: 3 },
};

const SETTINGS_FIELDS: Array<{ key: SettingsKey; label: string }> = [
  { key: "ball_speed", label: "Ball speed" },
  { key: "score_limit", label: "Score limit" },
  { key: "paddle_size", label: "Paddle size" },
];

const clampNum = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

async function fetchGameSetting(): Promise<GameSetting> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/game/settings`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch game settings");

  return res.json();
}

export default function GameSettings() {
  const { updateGameSettings } = useAuth();

  const [gameSetting, setGameSetting] = useState<GameSetting | null>(null);

  const [selectedMap, setSelectedMap] = useState<string>("");
  const [userData, setUserData] = useState<SettingsState>({
    ball_speed: 2,
    score_limit: 10,
    paddle_size: 1,
  });

  const [hoveredMap, setHoveredMap] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
try {
	const gameset = await fetchGameSetting();
	if (cancelled) return;

	setGameSetting(gameset.settings as GameSetting);
	setSelectedMap(gameset?.settings?.game_mode ?? "");
	setUserData({
		ball_speed: gameset?.settings?.ball_speed ?? 2,
		score_limit: gameset?.settings?.score_limit ?? 10,
		paddle_size: gameset?.settings?.paddle_size ?? 1,
	});
} catch (error) {
	console.error(error);
}
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const errors = useMemo<Partial<Record<SettingsKey, string>>>(() => {
    const error: Partial<Record<SettingsKey, string>> = {};

    const ballSpeed = clampNum(userData.ball_speed);
    if (
      !Number.isInteger(ballSpeed) ||
      ballSpeed < RANGES.ball_speed.min ||
      ballSpeed > RANGES.ball_speed.max
    ) {
      error.ball_speed = `Ball speed must be between ${RANGES.ball_speed.min} and ${RANGES.ball_speed.max}`;
    }

    const scoreLimit = clampNum(userData.score_limit);
    if (
      !Number.isInteger(scoreLimit) ||
      scoreLimit < RANGES.score_limit.min ||
      scoreLimit > RANGES.score_limit.max
    ) {
      error.score_limit = `Score limit must be between ${RANGES.score_limit.min} and ${RANGES.score_limit.max}`;
    }

    const paddleSize = clampNum(userData.paddle_size);
    if (
      !Number.isInteger(paddleSize) ||
      paddleSize < RANGES.paddle_size.min ||
      paddleSize > RANGES.paddle_size.max
    ) {
      error.paddle_size = `Paddle size must be between ${RANGES.paddle_size.min} and ${RANGES.paddle_size.max}`;
    }

    return error;
  }, [userData]);

  const hasErrors = Object.keys(errors).length > 0;

  const baseline = useMemo(() => {
    return {
      ball_speed: gameSetting?.settings?.ball_speed,
      score_limit: gameSetting?.settings?.score_limit,
      paddle_size: gameSetting?.settings?.paddle_size,
      selectedMap: gameSetting?.settings?.game_mode ?? "",
    };
  }, [gameSetting]);

  const hasChanges = useMemo(() => {
    const normalizedUser = {
      ball_speed: userData.ball_speed === "" ? undefined : Number(userData.ball_speed),
      score_limit: userData.score_limit === "" ? undefined : Number(userData.score_limit),
      paddle_size: userData.paddle_size === "" ? undefined : Number(userData.paddle_size),
      game_mode: selectedMap || undefined,
    };

    return (
      normalizedUser.ball_speed !== baseline.ball_speed ||
      normalizedUser.score_limit !== baseline.score_limit ||
      normalizedUser.paddle_size !== baseline.paddle_size ||
      (normalizedUser.game_mode ?? "") !== baseline.selectedMap
    );
  }, [userData, selectedMap, baseline]);

  const canSave = !hasErrors && hasChanges;

  const onNumberChange = useCallback(
    (key: SettingsKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;

      if (raw === "") {
        setUserData((prev) => ({ ...prev, [key]: "" }));
        return;
      }

      const n = clampNum(raw);
      setUserData((prev) => ({ ...prev, [key]: n }));
    },
    []
  );

const onSave = useCallback(() => {
	if (!canSave) return;

	const payload = {
		...userData,
		game_mode: selectedMap,
	};

	updateGameSettings(payload);

	setGameSetting(() => ({
		settings: {
			ball_speed: userData.ball_speed === "" ? undefined : Number(userData.ball_speed),
			score_limit: userData.score_limit === "" ? undefined : Number(userData.score_limit),
			paddle_size: userData.paddle_size === "" ? undefined : Number(userData.paddle_size),
			game_mode: selectedMap,
		},
	}));
}, [canSave, userData, selectedMap, updateGameSettings]);

  return (
    <div className="h-full w-full overflow-y-auto scroll-smooth text-white px-4 sm:px-8 py-10 custom-scrollbar">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-2xl font-bold mb-2">Game setting</h1>
        <p className="text-sm text-white/60">
          Customize your game settings to create a smoother, more enjoyable, and
          personalized gaming experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        {SETTINGS_FIELDS.map((item) => (
          <Field
            key={item.key}
            label={item.label}
            rangeText={`from ${RANGES[item.key].min} to ${RANGES[item.key].max}`}
            value={userData[item.key]}
            onChange={onNumberChange(item.key)}
            error={errors[item.key]}
          />
        ))}
      </div>

      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-2">Game Maps</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MAPS.map((map) => {
            const isActive = selectedMap === map.id;
            const isHovered = hoveredMap === map.id;

            return (
              <MapCard
                key={map.id}
                map={map}
                isActive={isActive}
                isHovered={isHovered}
                onEnter={() => setHoveredMap(map.id)}
                onLeave={() => setHoveredMap(null)}
                onSelect={() => setSelectedMap(map.id)}
              />
            );
          })}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onSave}
          disabled={!canSave}
          className={`px-10 py-3 rounded-lg transition text-sm font-semibold
            ${
              canSave
                ? "bg-black hover:bg-black/30"
                : "bg-[#414141]/60 text-white/60 cursor-not-allowed"
            }`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
