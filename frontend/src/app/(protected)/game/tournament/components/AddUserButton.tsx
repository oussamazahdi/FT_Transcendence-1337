import { AddUserButtonProps } from "../types";

export function AddUserButton({ disabled, onClick }: AddUserButtonProps) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={ disabled
				? "w-full rounded-2xl px-4 py-2.5 text-sm font-semibold ring-1 transition bg-white/5 text-white/35 ring-white/10"
        : "w-full rounded-2xl px-4 py-2.5 text-sm font-semibold ring-1 transition bg-white/15 text-white ring-white/15 hover:bg-white/20"}>
      Add player
    </button>
  );
}