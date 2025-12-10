import React from 'react'
type locations = {
	firstPaddle : number;
	secondPaddle : number;
	ball:number;
}

type Player = {
  socketId?: string
  login?: string
  firstName?: string
  lastName?: string
  avatar?: string
}

type GameRoom = {
  player1: Player
  player2: Player
}

export default function startGame(gameRoom:any, locations:any) {
	return (
		<div>startGame</div>
	)
}