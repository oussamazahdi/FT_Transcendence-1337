// import React, { useState } from "react";

// const maps = [
// 	{ id: "desert", label: "DESERT", image: "/maps/desert.png" },
// 	{ id: "hell", label: "HELL", image: "/maps/hell.png" },
// 	{ id: "water", label: "OCÉAN", image: "/maps/water.png" },
// 	{ id: "forest", label: "FOREST", image: "/maps/forest.jpeg" },
// 	{ id: "snow", label: "SNOW", image: "/maps/snow.jpeg" },
// 	{ id: "space", label: "SPACE", image: "/maps/space.png" },
// ];

// export default function GameSettings() {
// 	const [selectedMap, setSelectedMap] = useState("hell");
// 	const [hoveredMap, setHoveredMap] = useState(null);

// 	return (
// 		<div className="min-h-screen w-full text-white px-4 sm:px-8 py-10">

// 			<div className="text-center max-w-2xl mx-auto mb-12">
// 				<h1 className="text-2xl font-bold mb-2">Game setting</h1>
// 				<p className="text-sm text-white/60">
// 					Customize your game settings to create a smoother, more enjoyable, and
// 					personalized gaming experience.
// 				</p>
// 			</div>


// 			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
// 				{[
// 					{ label: "Ball speed", range: "from 1 to 3", value: 2 },
// 					{ label: "Score limit", range: "from 5 to 20", value: 12 },
// 					{ label: "Paddle size", range: "from 1 to 3", value: 2 },
// 				].map((item) => (
// 					<div key={item.label} className="flex flex-col gap-2">
// 						<div className="flex justify-between text-sm">
// 							<span className="font-semibold">{item.label}</span>
// 							<span className="text-white/40 text-xs">{item.range}</span>
// 						</div>
// 						<input
// 							type="text"
// 							defaultValue={item.value}
// 							placeholder={item.label}
// 							className="h-12 px-4 rounded-xl bg-white/10 backdrop-blur-md text-white text-sm placeholder:text-white/25 focus:outline-none"
// 						/>
// 					</div>
// 				))}
// 			</div>


// 			<div className="mb-12">
// 				<h2 className="text-lg font-semibold mb-2">Game Maps</h2>

// 				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// 					{maps.map((map) => {
// 						const isActive = selectedMap === map.id;
// 						const isHovered = hoveredMap === map.id;

// 						return (
// 							<button
// 								key={map.id}
// 								type="button"
// 								onMouseEnter={() => setHoveredMap(map.id)}
// 								onMouseLeave={() => setHoveredMap(null)}
// 								onClick={() => setSelectedMap(map.id)}
// 								className={`relative h-40 rounded-2xl overflow-hidden text-left transition-transform duration-200
// 									${isActive ? "ring-2 ring-white/50" : "ring-1 ring-white/10"}
// 									hover:scale-[1.01] focus:outline-none`}
// 							>
// 								<div
// 									className={`absolute inset-0 bg-cover bg-center transition duration-300
// 										${isActive || isHovered ? "grayscale-0" : "grayscale"}
// 										${isActive || isHovered ? "opacity-100" : "opacity-70"}`}
// 									style={{ backgroundImage: `url(${map.image})` }}
// 								/>

// 								<div className={`absolute inset-0 flex items-center justify-center transition duration-300
// 									${isActive || isHovered ? "bg-black/25" : "bg-black/50"}`}>
// 									<span className="text-2xl font-extrabold tracking-wide italic">{map.label}</span>
// 								</div>

// 								{isActive && (
// 									<div className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full bg-white/15 backdrop-blur-md">Selected</div>
// 								)}
// 							</button>
// 						);
// 					})}
// 				</div>
// 			</div>

// 			<div className="flex justify-center">
// 				<button className="px-10 py-3 rounded-lg bg-black hover:bg-black/30 transition text-sm font-semibold">Save Changes</button>
// 			</div>

// 		</div>
// 	);
// }



import { useAuth } from "@/contexts/authContext";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  { key: "ball_speed", label: "Ball speed", rangeText: "from 1 to 3" },
  { key: "score_limit", label: "Score limit", rangeText: "from 5 to 20" },
  { key: "paddle_size", label: "Paddle size", rangeText: "from 1 to 3" },
];

const clampNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

async function fetchGameSettings(signal) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/game/settings`, {
    credentials: "include",
    method: "GET",
    signal,
  });

  if (!res.ok) return null;

  const data = await res.json().catch(() => ({}));
  return data?.settings ?? null;
}

function Field({ label, value, onChange, error }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-semibold">{label}</span>
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
        <span className="text-2xl font-extrabold tracking-wide italic">{map.label}</span>
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
	player_xp: 0,
	player_level: 0.0,
	game_mode: 0,
	ball_speed: 2,
	score_limit: 10,
	paddle_size: 2,
}

export default function GameSettings() {
  const didFetchRef = useRef(false);
	
  const [hoveredMap, setHoveredMap] = useState(null);
	const [selectedMap, setSelectedMap] = useState("hell");
  const [playerSettings, setPlayerSettings] = useState(null);


  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

		
    async function getSettings() {
      const data = await fetchGameSettings();
      if (!data) return;

      setPlayerSettings(data);

      setUserData((prev) => ({
        ...prev,
        ball_speed: data?.ball_speed ?? prev.ball_speed,
        score_limit: data?.score_limit ?? prev.score_limit,
        paddle_size: data?.paddle_size ?? prev.paddle_size,
      }));

      setSelectedMap((prev) => data?.selected_map ?? prev);
    }

		


    // return () => controller.abort();
  }, []);

  // const errors = useMemo(() => {
  //   const e = {};

  //   const bs = clampNum(userData.ball_speed);
  //   if (!Number.isInteger(bs) || bs < RANGES.ball_speed.min || bs > RANGES.ball_speed.max) {
  //     e.ball_speed = `Ball speed must be between ${RANGES.ball_speed.min} and ${RANGES.ball_speed.max}`;
  //   }

  //   const sl = clampNum(userData.score_limit);
  //   if (!Number.isInteger(sl) || sl < RANGES.score_limit.min || sl > RANGES.score_limit.max) {
  //     e.score_limit = `Score limit must be between ${RANGES.score_limit.min} and ${RANGES.score_limit.max}`;
  //   }

  //   const ps = clampNum(userData.paddle_size);
  //   if (!Number.isInteger(ps) || ps < RANGES.paddle_size.min || ps > RANGES.paddle_size.max) {
  //     e.paddle_size = `Paddle size must be between ${RANGES.paddle_size.min} and ${RANGES.paddle_size.max}`;
  //   }

  //   return e;
  // }, [userData]);

  // const hasErrors = Object.keys(errors).length > 0;

  // const baseline = useMemo(() => {
  //   return {
  //     ball_speed: playerSettings?.ball_speed ?? defaults.ball_speed,
  //     score_limit: playerSettings?.score_limit ?? defaults.score_limit,
  //     paddle_size: playerSettings?.paddle_size ?? defaults.paddle_size,
  //     selectedMap: playerSettings?.selected_map ?? "hell",
  //   };
  // }, [playerSettings, defaults]);

  // const hasChanges = useMemo(() => {
  //   return (
  //     userData.ball_speed !== baseline.ball_speed ||
  //     userData.score_limit !== baseline.score_limit ||
  //     userData.paddle_size !== baseline.paddle_size ||
  //     selectedMap !== baseline.selectedMap
  //   );
  // }, [userData, selectedMap, baseline]);

  // const canSave = !hasErrors && hasChanges;

  // const onNumberChange = useCallback(
  //   (key) => (e) => {
  //     const raw = e.target.value;
  //     const n = raw === "" ? "" : clampNum(raw);
  //     setUserData((prev) => ({ ...prev, [key]: n }));
  //   },
  //   []
  // );

  // const onSave = useCallback(() => {
  //   if (!canSave) return;
  //   console.log("Saving:", { ...userData, selectedMap });
  // }, [canSave, userData, selectedMap]);

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
            ${canSave ? "bg-black hover:bg-black/30" : "bg-[#414141]/60 text-white/60 cursor-not-allowed"}`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
