import React from "react";

function Header({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Create Tournament
        </h2>
        <p className="mt-1 text-sm text-white/70">
          Add exactly 4 players, then start the tournament.
        </p>
      </div>

      <button
        onClick={onClose}
        className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white/80 ring-1 ring-white/10 hover:bg-white/15"
      >
        Close
      </button>
    </div>
  );
}

export function ModalShell({ overlayRef, onOverlayMouseDown, onClose, children }: {
  overlayRef: React.RefObject<HTMLDivElement | null>;
  onOverlayMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClose: () => void;
  children: React.ReactNode; }) {
  return (
    <div ref={overlayRef} onMouseDown={onOverlayMouseDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[3px] p-4"
      aria-modal="true" role="dialog">
      <div className="w-full max-w-5xl rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur-xl ring-1 ring-white/15">
        <Header onClose={onClose} />
        {children}
      </div>
    </div>
  );
}