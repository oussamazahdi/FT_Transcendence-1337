import React, { useState } from "react";

const maps = [
	{ id: "desert", label: "DESERT", image: "/maps/desert.png" },
	{ id: "hell", label: "HELL", image: "/maps/hell.png" },
	{ id: "water", label: "OCÉAN", image: "/maps/water.png" },
	{ id: "forest", label: "FOREST", image: "/maps/forest.jpeg" },
	{ id: "snow", label: "SNOW", image: "/maps/snow.jpeg" },
	{ id: "space", label: "SPACE", image: "/maps/space.png" },
];

export default function GameSettings() {
	const [selectedMap, setSelectedMap] = useState("hell");
	const [hoveredMap, setHoveredMap] = useState(null);

	return (
		<div className="min-h-screen w-full text-white px-4 sm:px-8 py-10">

			<div className="text-center max-w-2xl mx-auto mb-12">
				<h1 className="text-2xl font-bold mb-2">Game setting</h1>
				<p className="text-sm text-white/60">
					Customize your game settings to create a smoother, more enjoyable, and
					personalized gaming experience.
				</p>
			</div>


			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
				{[
					{ label: "Ball speed", range: "from 1 to 3", value: 2 },
					{ label: "Score limit", range: "from 5 to 20", value: 12 },
					{ label: "Paddle size", range: "from 1 to 3", value: 2 },
				].map((item) => (
					<div key={item.label} className="flex flex-col gap-2">
						<div className="flex justify-between text-sm">
							<span className="font-semibold">{item.label}</span>
							<span className="text-white/40 text-xs">{item.range}</span>
						</div>
						<input
							type="text"
							defaultValue={item.value}
							placeholder={item.label}
							className="h-12 px-4 rounded-xl bg-white/10 backdrop-blur-md text-white text-sm placeholder:text-white/25 focus:outline-none"
						/>
					</div>
				))}
			</div>


			<div className="mb-12">
				<h2 className="text-lg font-semibold mb-2">Game Maps</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{maps.map((map) => {
						const isActive = selectedMap === map.id;
						const isHovered = hoveredMap === map.id;

						return (
							<button
								key={map.id}
								type="button"
								onMouseEnter={() => setHoveredMap(map.id)}
								onMouseLeave={() => setHoveredMap(null)}
								onClick={() => setSelectedMap(map.id)}
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

								<div className={`absolute inset-0 flex items-center justify-center transition duration-300
									${isActive || isHovered ? "bg-black/25" : "bg-black/50"}`}>
									<span className="text-2xl font-extrabold tracking-wide italic">{map.label}</span>
								</div>

								{isActive && (
									<div className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full bg-white/15 backdrop-blur-md">Selected</div>
								)}
							</button>
						);
					})}
				</div>
			</div>

			<div className="flex justify-center">
				<button className="px-10 py-3 rounded-lg bg-black hover:bg-black/30 transition text-sm font-semibold">Save Changes</button>
			</div>

		</div>
	);
}