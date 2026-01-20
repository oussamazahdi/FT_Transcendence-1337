"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/authContext";

const MAPS = [
  { id: "desert", label: "DESERT", image: "/maps/desert.png" },
  { id: "hell", label: "HELL", image: "/maps/hell.png" },
  { id: "ocean", label: "OCÉAN", image: "/maps/water.png" },
  { id: "forest", label: "FOREST", image: "/maps/forest.jpeg" },
  { id: "snow", label: "SNOW", image: "/maps/snow.jpeg" },
  { id: "space", label: "SPACE", image: "/maps/space.png" },
];

const RANGES = {
  ball_speed: { min: 1, max: 3 },
  score_limit: { min: 5, max: 20 },
  paddle_size: { min: 1, max: 3 },
};

const SETTINGS_FIELDS = [
  { key: "ball_speed", label: "Ball speed" },
  { key: "score_limit", label: "Score limit" },
  { key: "paddle_size", label: "Paddle size" },
];

const clampNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

function Field({ label, rangeText, value, onChange, error }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-sm">
        <span className="font-semibold">{label}</span>
        <span className="text-white/40 text-xs">{rangeText}</span>
      </div>

      <input
        type="number"
        value={value === "" ? "" : Number(value ?? "")}
        onChange={onChange}
        className={`h-12 px-4 rounded-xl bg-white/10 backdrop-blur-md text-white text-sm placeholder:text-white/25 focus:outline-none ring-1 transition
          ${error ? "ring-red-500/80 focus:ring-red-500/90" : "ring-white/10 focus:ring-white/30"}`}
      />

      {error && <p className="text-[11px] text-red-400/90">{error}</p>}
    </div>
  );
}

function MapCard({ map, isActive, isHovered, onEnter, onLeave, onSelect }) {
  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onSelect}
      className={`relative h-40 rounded-2xl overflow-hidden text-left transition-transform duration-200
        ${isActive ? "ring-2 ring-white/50" : "ring-1 ring-white/10"}
        hover:scale-[1.01] focus:outline-none`}
    >
      <div
        className={`absolute inset-0 bg-cover bg-center transition duration-300
          ${isActive || isHovered ? "grayscale-0" : "grayscale"}
          ${isActive || isHovered ? "opacity-100" : "opacity-70"}`}
        style={{ backgroundImage: `url(${map.image})` }}
      />

      <div
        className={`absolute inset-0 flex items-center justify-center transition duration-300
          ${isActive || isHovered ? "bg-black/25" : "bg-black/50"}`}
      >
        <span className="text-2xl font-extrabold tracking-wide italic">
          {map.label}
        </span>
      </div>

      {isActive && (
        <div className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full bg-white/15 backdrop-blur-md">
          Selected
        </div>
      )}
    </button>
  );
}

const defaults = {
  ball_speed: 2,
  score_limit: 10,
  paddle_size: 2,
  selectedMap: "hell",
};

export default function GameSettings() {
  const { gameSetting, updateGameSettings } = useAuth();
	// console.log("-------> Game Settings: ", gameSetting);

  const [hoveredMap, setHoveredMap] = useState(null);
	const [selectedMap, setSelectedMap] = useState(gameSetting.game_mode);

  const [userData, setUserData] = useState({
    ball_speed: gameSetting.ball_speed,
    score_limit: gameSetting.score_limit,
    paddle_size: gameSetting.paddle_size,
  });

  const errors = useMemo(() => {
    const error = {};

    const ballSpeed = clampNum(userData.ball_speed);
    if (!Number.isInteger(ballSpeed) || ballSpeed < RANGES.ball_speed.min || ballSpeed > RANGES.ball_speed.max)
      error.ball_speed = `Ball speed must be between ${RANGES.ball_speed.min} and ${RANGES.ball_speed.max}`;

    const scoreLimit = clampNum(userData.score_limit);
    if (!Number.isInteger(scoreLimit) || scoreLimit < RANGES.score_limit.min || scoreLimit > RANGES.score_limit.max)
      error.score_limit = `Score limit must be between ${RANGES.score_limit.min} and ${RANGES.score_limit.max}`;

    const paddleSize = clampNum(userData.paddle_size);
    if (!Number.isInteger(paddleSize) || paddleSize < RANGES.paddle_size.min || paddleSize > RANGES.paddle_size.max)
      error.paddle_size = `Paddle size must be between ${RANGES.paddle_size.min} and ${RANGES.paddle_size.max}`;

    return (error);
  }, [userData]);

  const hasErrors = Object.keys(errors).length > 0;

  const baseline = useMemo(() => {
    return {
      ball_speed: gameSetting?.ball_speed,
      score_limit: gameSetting?.score_limit,
      paddle_size: gameSetting?.paddle_size,
      selectedMap: gameSetting?.game_mode,
    };
  }, [gameSetting]);

  const hasChanges = useMemo(() => {
    return (userData.ball_speed !== baseline.ball_speed || userData.score_limit !== baseline.score_limit ||
      userData.paddle_size !== baseline.paddle_size || selectedMap !== baseline.selectedMap
    );
  }, [userData, selectedMap, baseline]);

  const canSave = !hasErrors && hasChanges;

  const onNumberChange = useCallback(
    (key) => (e) => {
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

    // Replace this with your fetch PATCH/PUT
		
    const payload = {
      ...userData,
      game_mode: selectedMap,
    };

		updateGameSettings(payload)
		canSave = false;
    console.log("Saving:", payload);
  }, [canSave, userData, selectedMap]);

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