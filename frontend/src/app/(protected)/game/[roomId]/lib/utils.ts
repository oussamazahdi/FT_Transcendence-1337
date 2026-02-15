
import { GAME_WIDTH, GAME_HEIGHT } from "@/components/ui/GameMode";

type GameMode = {
  ball: string;
  paddle: string;
};

type Ball = {
  x: number;
  y: number;
  radius: number;
};

type Paddle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type GamePlayer = {
  player: Paddle;
};

type GameState = {
  ball: Ball;
  player1: GamePlayer;
  player2: GamePlayer;
};

let bgImg: HTMLImageElement | null = null;
let bgReady = false;

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  game: GameState,
  gameMode: GameMode
) {
  ctx.clearRect(0, 0, 1024, 700);

  if (bgReady && bgImg) {
    ctx.drawImage(bgImg, 0, 0, 1024, 700);
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, 1024, 700);
  } else {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 1024, 700);
  }

  ctx.setLineDash([15, 8]);
  ctx.beginPath();
  ctx.moveTo(GAME_WIDTH / 2, 0);
  ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
  ctx.strokeStyle = "#fff";
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.fillStyle = gameMode.ball;
  ctx.beginPath();
  ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2);
  ctx.fill();

  drawPaddle(ctx, game.player1.player, gameMode);
  drawPaddle(ctx, game.player2.player, gameMode);
}

export function drawPaddle(
  ctx: CanvasRenderingContext2D,
  paddle: Paddle,
  gameMode: GameMode
) {
  ctx.fillStyle = gameMode.paddle;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

export function preloadBackground(image?: string) {
  if (bgImg) return;
  bgImg = new Image();
  bgImg.src = image || "";
  bgImg.onload = () => {
    bgReady = true;
  };
  bgImg.onerror = () => {
    bgReady = false;
  };
}
