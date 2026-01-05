"use client";

export default function GameInvitePopup() {
	return (
		<div
			className="
				fixed right-4 bottom-4
				bg-black p-4 rounded-lg
				flex flex-col items-center
				shadow-xl
				animate-invite
			"
		>
			<p className="mb-4 text-sm text-gray-200">
				<span className="font-semibold text-white">Oussama</span> invited you
			</p>

			<div className="flex gap-3">
				<button
					className="
						bg-green-600/30 text-green-400
						px-5 py-1 rounded-sm
						transition-all duration-150
						hover:bg-green-700/40 hover:scale-105
						active:scale-95
					"
				>
					Accept
				</button>

				<button
					className="
						bg-red-600/30 text-red-400
						px-5 py-1 rounded-sm
						transition-all duration-150
						hover:bg-red-700/40 hover:scale-105
						active:scale-95
					"
				>
					Reject
				</button>
			</div>
		</div>
	);
}

