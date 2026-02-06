
import {GAME_WIDTH, GAME_HEIGHT} from "@/components/ui/GameMode"

let bgImg = null;
let bgReady = false;

export function drawFrame(ctx, game, gameMode) {
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


export function drawPaddle(ctx, paddle, gameMode) {
  ctx.fillStyle = gameMode.paddle;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

export function preloadBackground(image) {
  if (bgImg) return;
  bgImg = new Image();
  bgImg.src = image;
  bgImg.onload = () => {
    bgReady = true;
  };
  bgImg.onerror = () => {
    bgReady = false;
  };
}