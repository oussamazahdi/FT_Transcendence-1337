"use client"

import React from 'react'
import { useEffect, useState } from "react";


const page = () => {

	const [gameData, setGameData] = useState(null);

	useEffect(() => {
	  const dataString = localStorage.getItem("GameData");
	  if (dataString) {
	    setGameData(JSON.parse(dataString));
	  }
	}, []);
// console.log(gameData);

  return (
    <div className='self-start'>
	<h1>hola</h1>
	<h1>hola</h1>
	<h1>hola</h1>
	<h1>hola</h1>
	<h1>hola</h1>
    </div>
  )
}

export default page