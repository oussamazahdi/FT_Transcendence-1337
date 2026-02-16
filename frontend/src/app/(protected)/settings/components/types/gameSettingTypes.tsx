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
