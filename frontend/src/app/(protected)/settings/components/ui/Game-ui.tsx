import React from "react";
import { MapCardProps, FieldProps } from "../types/gameSettingTypes";

export function Field({ label, rangeText, value, onChange, error }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-sm">
        <span className="font-semibold">{label}</span>
        <span className="text-white/40 text-xs">{rangeText}</span>
      </div>

      <input type="number" value={value === "" ? "" : Number(value)} onChange={onChange} maxLength={2}
        className={`h-12 px-4 rounded-xl bg-white/10 backdrop-blur-md text-white text-sm placeholder:text-white/25 focus:outline-none ring-1 transition
          ${ error ? "ring-red-500/80 focus:ring-red-500/90" : "ring-white/10 focus:ring-white/30"}`}/>

      {error && <p className="text-[11px] text-red-400/90">{error}</p>}
    </div>
  );
}

export function MapCard({ map, isActive, isHovered, onEnter, onLeave, onSelect }: MapCardProps) {
  return (
    <button type="button" onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onSelect}
      className={`relative h-40 rounded-2xl overflow-hidden text-left transition-transform duration-200
        ${isActive ? "ring-2 ring-white/50" : "ring-1 ring-white/10"} hover:scale-[1.01] focus:outline-none`}>
      <div className={`absolute inset-0 bg-cover bg-center transition duration-300
          ${isActive || isHovered ? "grayscale-0" : "grayscale"}
          ${isActive || isHovered ? "opacity-100" : "opacity-70"}`}
        style={{ backgroundImage: `url(${map.image})` }}/>

      <div className={`absolute inset-0 flex items-center justify-center transition duration-300
          ${isActive || isHovered ? "bg-black/25" : "bg-black/50"}`}>
        <span className="text-2xl font-extrabold tracking-wide italic">{map.label}</span>
      </div>

      {isActive && (
        <div className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full bg-white/15 backdrop-blur-md">Selected</div>
      )}
    </button>
  );
}