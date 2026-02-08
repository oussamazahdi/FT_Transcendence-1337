// class gameUtiles {

// 	drawLocalFrame = (context, state, players) => {
// 		context.beginPath();
// 		context.setLineDash([15, 8]);
// 		context.moveTo(state.board.width / 2, 0);
// 		context.lineTo(state.board.width / 2, state.board.height);
// 		context.strokeStyle = "#FFFFFF";
// 		context.stroke();
	
// 		context.fillStyle = players.player1.color;
// 		context.fillRect( state.player1.x, state.player1.y, state.player1.width, state.player1.height );
// 		context.fillRect( state.player2.x, state.player2.y, state.player2.width, state.player2.height );
	
// 		context.beginPath();
// 		context.arc( state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2 );
// 		context.fillStyle = players.ballColor;
// 		context.fill();
// 	}
	
// 	ballMovement = (state) => {
// 		state.ball.x += state.ball.velocityX * state.ball.speed;
// 		state.ball.y += state.ball.velocityY * state.ball.speed;
// 	}
	
// 	handleScoring = (state, setScore1, setScore2) => {
// 		if (state.ball.x <= 0 || state.ball.x >= state.board.width) {
// 			if (state.ball.x >= state.board.width) setScore1((s) => s + 1);
// 			if (state.ball.x <= 0) setScore2((s) => s + 1);
// 			state.ball.x = state.board.width / 2;
// 			state.ball.y = state.board.height / 2;
// 		}
// 	}
	
	
// 	ballCollisions = (state) => {
// 		if ( state.ball.y - state.ball.radius <= 0 || state.ball.y + state.ball.radius >= state.board.height)
// 			state.ball.velocityY *= -1;
	
// 		if (state.ball.x + state.ball.radius > state.player2.x && state.ball.y > state.player2.y &&
// 				state.ball.y < state.player2.y + state.player2.height) {
// 			state.ball.velocityX *= -1;
// 			state.ball.velocityY = (state.ball.y - state.player2.y) / state.player2.height - 0.5;
// 		}
		
// 		if(state.ball.x - state.ball.radius < state.player1.x + state.player1.width && state.ball.y - state.ball.radius > state.player1.y &&
// 			state.ball.y + state.ball.radius < state.player1.y + state.player1.height) {
// 				state.ball.velocityX *= -1;
// 				state.ball.velocityY = ((state.ball.y - state.player1.y) / state.player1.height - 0.5) * state.ball.speed * 2;
// 		}
// 	}
	
// 	paddleMovement = (state) => {
// 		const paddleSpeed = 4;
	
// 		if (state.keys.w && state.player1.y > 0) state.player1.y -= paddleSpeed;
		
// 		if ( state.keys.s && state.player1.y + state.player1.height < state.board.height)
// 			state.player1.y += paddleSpeed;
		
// 		if (state.keys.ArrowUp && state.player2.y > 0) state.player2.y -= paddleSpeed;
		
// 		if ( state.keys.ArrowDown && state.player2.y + state.player2.height < state.board.height )
// 			state.player2.y += paddleSpeed;
// 	}

// 	createKeyboardHandlers = ({ stateRef, togglePause }) => {
// 		const setKey = (key, value) => {
// 			const state = stateRef.current;
// 			if (!state?.keys) return;
	
// 			if (key === "w") state.keys.w = value;
// 			else if (key === "s") state.keys.s = value;
// 			else if (key === "ArrowUp") state.keys.ArrowUp = value;
// 			else if (key === "ArrowDown") state.keys.ArrowDown = value;
// 		};
	
// 		const onKeyDown = (e) => {
// 			if (e.key === " ") {
// 				e.preventDefault();
// 				togglePause();
// 				return;
// 			}
// 			setKey(e.key, true);
// 		};
	
// 		const onKeyUp = (e) => setKey(e.key, false);
	
// 		return { onKeyDown, onKeyUp };
// 	};
// }

// export const GameUtiles = new gameUtiles();




class gameUtiles {
  // draw the current frame.
  // bg: optional { image: HTMLImageElement|null, ready: boolean }
  drawLocalFrame = (context, state, players, bg) => {
    // Background (map image) if available
    if (bg?.ready && bg?.image) {
      context.drawImage(bg.image, 0, 0, state.board.width, state.board.height);
    } else {
      // fallback to solid background if no image
      context.fillStyle = players?.boardColor || "#262626";
      context.fillRect(0, 0, state.board.width, state.board.height);
    }

    context.beginPath();
    context.setLineDash([15, 8]);
    context.moveTo(state.board.width / 2, 0);
    context.lineTo(state.board.width / 2, state.board.height);
    context.strokeStyle = "#FFFFFF";
    context.stroke();
    context.setLineDash([]);

    // Paddles
    context.fillStyle = players?.player1?.color || "#D9D9D9";
    context.fillRect(state.player1.x, state.player1.y, state.player1.width, state.player1.height);

    context.fillStyle = players?.player2?.color || players?.player1?.color || "#D9D9D9";
    context.fillRect(state.player2.x, state.player2.y, state.player2.width, state.player2.height);

    // Ball
    context.beginPath();
    context.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
    context.fillStyle = players?.ballColor || "#D9D9D9";
    context.fill();
  };

  ballMovement = (state) => {
    state.ball.x += state.ball.velocityX * state.ball.speed;
    state.ball.y += state.ball.velocityY * state.ball.speed;
  };

  handleScoring = (state, setScore1, setScore2) => {
    if (state.ball.x <= 0 || state.ball.x >= state.board.width) {
      if (state.ball.x >= state.board.width) setScore1((s) => s + 1);
      if (state.ball.x <= 0) setScore2((s) => s + 1);
      state.ball.x = state.board.width / 2;
      state.ball.y = state.board.height / 2;
    }
  };

  ballCollisions = (state) => {
    if (state.ball.y - state.ball.radius <= 0 || state.ball.y + state.ball.radius >= state.board.height)
      state.ball.velocityY *= -1;

    if (
      state.ball.x + state.ball.radius > state.player2.x &&
      state.ball.y > state.player2.y &&
      state.ball.y < state.player2.y + state.player2.height
    ) {
      state.ball.velocityX *= -1;
      state.ball.velocityY = (state.ball.y - state.player2.y) / state.player2.height - 0.5;
    }

    if (
      state.ball.x - state.ball.radius < state.player1.x + state.player1.width &&
      state.ball.y - state.ball.radius > state.player1.y &&
      state.ball.y + state.ball.radius < state.player1.y + state.player1.height
    ) {
      state.ball.velocityX *= -1;
      state.ball.velocityY =
        ((state.ball.y - state.player1.y) / state.player1.height - 0.5) * state.ball.speed * 2;
    }
  };

  paddleMovement = (state) => {
    const paddleSpeed = 4;

    if (state.keys.w && state.player1.y > 0) state.player1.y -= paddleSpeed;
    if (state.keys.s && state.player1.y + state.player1.height < state.board.height) state.player1.y += paddleSpeed;

    if (state.keys.ArrowUp && state.player2.y > 0) state.player2.y -= paddleSpeed;
    if (state.keys.ArrowDown && state.player2.y + state.player2.height < state.board.height)
      state.player2.y += paddleSpeed;
  };

  createKeyboardHandlers = ({ stateRef, togglePause }) => {
    const setKey = (key, value) => {
      const state = stateRef.current;
      if (!state?.keys) return;

      if (key === "w") state.keys.w = value;
      else if (key === "s") state.keys.s = value;
      else if (key === "ArrowUp") state.keys.ArrowUp = value;
      else if (key === "ArrowDown") state.keys.ArrowDown = value;
    };

    const onKeyDown = (e) => {
      if (e.key === " ") {
        e.preventDefault();
        togglePause();
        return;
      }
      setKey(e.key, true);
    };

    const onKeyUp = (e) => setKey(e.key, false);

    return { onKeyDown, onKeyUp };
  };
}

export const GameUtiles = new gameUtiles();
