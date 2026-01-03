import React from "react";
import { assets } from "@/assets/data.js";
import Image from "next/image";

const ConnectWith = () => {
	const buttonStyle =
		"flex items-center justify-center w-18 h-6 bg-[#4D4D4D]/40 rounded-sm cursor-pointer hover:bg-white/20";

	const handleGoogleAuth = () => {
		window.location.href = `http://localhost:3001/api/oauth/google`;
	};
	return (
		<div>
			<div className="flex flex-row pt-4 justify-center items-center">
				<div className="hidden md:block border-t border-[#FFFFFF]/23 h-1 w-24"></div>
				<p className="text-xs text-[#FFFFFF]/23 px-4 pb-1">Or connect with</p>
				<div className="hidden md:block border-t border-[#FFFFFF]/23 h-1 w-24"></div>
			</div>

			<div className="w-full flex flex-row items-center justify-center space-x-8 mt-2">
				<button className={buttonStyle} onClick={handleGoogleAuth}>
					<Image
						src={assets.iconGoogle}
						alt="icon"
						className="object-cover size-3"
					/>
				</button>
			</div>
		</div>
	);
};

export default ConnectWith;