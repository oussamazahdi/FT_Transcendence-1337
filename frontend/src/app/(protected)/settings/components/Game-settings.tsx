"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/contexts/authContext";

// ─────────────────────────────────────────────────────────────────────────────
// Types (adapt to your real domain)
// ─────────────────────────────────────────────────────────────────────────────

type SettingsKey = "ball_speed" | "score_limit" | "paddle_size";

type SettingsState = Record<SettingsKey, number | "">;

type GameSettingsModel = {
  ball_speed?: number | null;
  score_limit?: number | null;
  paddle_size?: number | null;
  game_mode?: string | null;
};

// These must exist in your file already; keeping as-is assumptions:
declare const SETTINGS_FIELDS: Array<{ key: SettingsKey; label: string }>;
declare const RANGES: Record<SettingsKey, { min: number; max: number }>;
declare const MAPS: Array<{ id: string; [k: string]: unknown }>;
declare function clampNum(v: unknown): number;
declare function Field(props: {
  label: string;
  rangeText: string;
  value: number | "";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}): React.JSX.Element;
declare function MapCard(props: {
  map: { id: string; [k: string]: unknown };
  isActive: boolean;
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onSelect: () => void;
}): React.JSX.Element;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function toGameSettingsModel(input: unknown): GameSettingsModel | null {
  if (!input) return null;

  // if backend returned array, take first element
  const candidate = Array.isArray(input) ? input[0] : input;

  if (!candidate || typeof candidate !== "object") return null;

  const obj = candidate as Record<string, unknown>;

  return {
    ball_speed: typeof obj.ball_speed === "number" ? obj.ball_speed : null,
    score_limit: typeof obj.score_limit === "number" ? obj.score_limit : null,
    paddle_size: typeof obj.paddle_size === "number" ? obj.paddle_size : null,
    game_mode: typeof obj.game_mode === "string" ? obj.game_mode : null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function GameSettings() {
  const { gameSetting, updateGameSettings } = useAuth();

  // ✅ normalize gameSetting (array/object/null) into a single typed object
  const gs = useMemo(() => toGameSettingsModel(gameSetting), [gameSetting]);

  const [hoveredMap, setHoveredMap] = useState<string | null>(null);

  const [selectedMap, setSelectedMap] = useState<string | null>(gs?.game_mode ?? null);

  const [userData, setUserData] = useState<SettingsState>({
    ball_speed: gs?.ball_speed ?? "",
    score_limit: gs?.score_limit ?? "",
    paddle_size: gs?.paddle_size ?? "",
  });

  // If game settings load async and you want the UI to update when they arrive:
  // (optional but usually desired)
  React.useEffect(() => {
    setSelectedMap(gs?.game_mode ?? null);
    setUserData({
      ball_speed: gs?.ball_speed ?? "",
      score_limit: gs?.score_limit ?? "",
      paddle_size: gs?.paddle_size ?? "",
    });
    // only when gs changes
  }, [gs]);

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
      ball_speed: gs?.ball_speed ?? "",
      score_limit: gs?.score_limit ?? "",
      paddle_size: gs?.paddle_size ?? "",
      selectedMap: gs?.game_mode ?? null,
    };
  }, [gs]);

  const hasChanges = useMemo(() => {
    return (
      userData.ball_speed !== baseline.ball_speed ||
      userData.score_limit !== baseline.score_limit ||
      userData.paddle_size !== baseline.paddle_size ||
      selectedMap !== baseline.selectedMap
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

    const payload: GameSettingsModel = {
      ball_speed: userData.ball_speed === "" ? null : Number(userData.ball_speed),
      score_limit: userData.score_limit === "" ? null : Number(userData.score_limit),
      paddle_size: userData.paddle_size === "" ? null : Number(userData.paddle_size),
      game_mode: selectedMap,
    };

    updateGameSettings(payload);
    console.log("Saving:", payload);
  }, [canSave, userData, selectedMap, updateGameSettings]);

  return (
    <div className="h-full w-full overflow-y-auto scroll-smooth text-white px-4 sm:px-8 py-10 custom-scrollbar">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-2xl font-bold mb-2">Game setting</h1>
        <p className="text-sm text-white/60">
          Customize your game settings to create a smoother, more enjoyable, and personalized gaming experience.
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
          className={`px-10 py-3 rounded-lg transition text-sm font-semibold ${
            canSave ? "bg-black hover:bg-black/30" : "bg-[#414141]/60 text-white/60 cursor-not-allowed"
          }`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
