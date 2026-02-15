"use client";

import { useEffect, useState } from "react";

export function Timer() {

	const [timer, setTimer] = useState(4);
	useEffect(()=>{
		if(timer === 0) return;
		setTimeout(()=> setTimer( timer - 1), 1000)
	}, [timer])

	return(
		<div className="bg-black text-white">
			<p>Game Start in:</p>
			<span>{timer}</span>
		</div>
	)
}
