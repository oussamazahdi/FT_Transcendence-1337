export type MapDefinition = {
  id: string;
  label: string;
  image: string;
};

export type FieldProps = {
  label: string;
  rangeText: string;
  value: number | "";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

export type MapCardProps = {
  map: MapDefinition;
  isActive: boolean;
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onSelect: () => void;
};

export const MAPS: MapDefinition[] = [
  { id: "desert", label: "DESERT", image: "/maps/desert.png" },
  { id: "hell", label: "HELL", image: "/maps/hell.png" },
  { id: "ocean", label: "OCÉAN", image: "/maps/water.png" },
  { id: "forest", label: "FOREST", image: "/maps/forest.jpeg" },
  { id: "snow", label: "SNOW", image: "/maps/snow.jpeg" },
  { id: "space", label: "SPACE", image: "/maps/space.png" },
];

export type SettingsKey = "ball_speed" | "score_limit" | "paddle_size";

type RangeSpec = {
	min: number;
	max: number;
};

export const RANGES: Record<SettingsKey, RangeSpec> = {
  ball_speed: { min: 1, max: 3 },
  score_limit: { min: 5, max: 20 },
  paddle_size: { min: 1, max: 3 },
};

export type SettingsState = Record<SettingsKey, number | "">;

type fullSettings = {
	ball_speed?: number;
	score_limit?: number;
	paddle_size?: number;
	game_mode?: string;
}

export type GameSetting = {
	settings: fullSettings;
};

export const SETTINGS_FIELDS: Array<{ key: SettingsKey; label: string }> = [
  { key: "ball_speed", label: "Ball speed" },
  { key: "score_limit", label: "Score limit" },
  { key: "paddle_size", label: "Paddle size" },
];
