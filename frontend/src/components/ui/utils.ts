type Board = {
  width: number;
  height: number;
};

type Ball = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  speed: number;
  radius: number;
};

type Paddle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type KeysState = {
  w: boolean;
  s: boolean;
  ArrowUp: boolean;
  ArrowDown: boolean;
};

type GameState = {
  board: Board;
  ball: Ball;
  player1: Paddle;
  player2: Paddle;
  keys: KeysState;
};

type PlayersConfig = {
  player1?: { color?: string };
  player2?: { color?: string };
  boardColor?: string;
  ballColor?: string;
};

type BackgroundImage = {
  image: CanvasImageSource | null;
  ready: boolean;
};

type SetScore = (value: number | ((prev: number) => number)) => void;

class gameUtiles {
  drawLocalFrame = ( context: CanvasRenderingContext2D, state: GameState, players: PlayersConfig, bg: BackgroundImage ) => {
    if (bg?.ready && bg?.image) {
      context.drawImage(bg.image, 0, 0, state.board.width, state.board.height);
    } else {
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

    context.fillStyle = players?.player1?.color || "#D9D9D9";
    context.fillRect(state.player1.x, state.player1.y, state.player1.width, state.player1.height);

    context.fillStyle = players?.player2?.color || players?.player1?.color || "#D9D9D9";
    context.fillRect(state.player2.x, state.player2.y, state.player2.width, state.player2.height);

    context.beginPath();
    context.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
    context.fillStyle = players?.ballColor || "#D9D9D9";
    context.fill();
  };

  ballMovement = (state: GameState) => {
    state.ball.x += state.ball.velocityX * state.ball.speed;
    state.ball.y += state.ball.velocityY * state.ball.speed;
  };

  handleScoring = (state: GameState, setScore1: SetScore, setScore2: SetScore, baseBallSpeed: number) => {
    if (state.ball.x <= 0 || state.ball.x >= state.board.width) {
      if (state.ball.x >= state.board.width) setScore1((s) => s + 1);
      if (state.ball.x <= 0) setScore2((s) => s + 1);
      state.ball.x = state.board.width / 2;
      state.ball.y = state.board.height / 2;
			state.ball.speed = baseBallSpeed;
    }
  };

	ballCollisions = (state: GameState) => {
		const ball = state.ball;
		const p1 = state.player1;
		const p2 = state.player2;
	
		if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= state.board.height) {
			ball.velocityY *= -1;
		}
	
		const handlePaddleCollision = (paddle: Paddle, isLeft: boolean) => {
			const hitY =
				ball.y + ball.radius >= paddle.y &&
				ball.y - ball.radius <= paddle.y + paddle.height;
	
			const hitX = isLeft
				? ball.x - ball.radius <= paddle.x + paddle.width && ball.x > paddle.x
				: ball.x + ball.radius >= paddle.x && ball.x < paddle.x + paddle.width;
	
			const hit = hitY && hitX;
			if (!hit) return;
	
			ball.speed += 0.3;
	
			ball.velocityX = isLeft ? Math.abs(ball.velocityX) : -Math.abs(ball.velocityX);
	
			ball.velocityY = ((ball.y - paddle.y) / paddle.height - 0.5) * 2;
	
			if (isLeft) ball.x = paddle.x + paddle.width + ball.radius;
			else ball.x = paddle.x - ball.radius;
		};
	
		handlePaddleCollision(p1, true);
		handlePaddleCollision(p2, false);
	};
	

  paddleMovement = (state: GameState) => {
    const paddleSpeed = 4;

    if (state.keys.w && state.player1.y > 0) state.player1.y -= paddleSpeed;
    if (state.keys.s && state.player1.y + state.player1.height < state.board.height) state.player1.y += paddleSpeed;

    if (state.keys.ArrowUp && state.player2.y > 0) state.player2.y -= paddleSpeed;
    if (state.keys.ArrowDown && state.player2.y + state.player2.height < state.board.height)
      state.player2.y += paddleSpeed;
  };

  createKeyboardHandlers = ({
    stateRef,
    togglePause,
  }: {
    stateRef: { current: GameState };
    togglePause: () => void;
  }) => {
    const setKey = (key: string, value: boolean) => {
      const state = stateRef.current;
      if (!state?.keys) return;

      if (key === "w") state.keys.w = value;
      else if (key === "s") state.keys.s = value;
      else if (key === "ArrowUp") state.keys.ArrowUp = value;
      else if (key === "ArrowDown") state.keys.ArrowDown = value;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        togglePause();
        return;
      }
      setKey(e.key, true);
    };

    const onKeyUp = (e: KeyboardEvent) => setKey(e.key, false);

    return { onKeyDown, onKeyUp };
  };
}

export const GameUtiles = new gameUtiles();
