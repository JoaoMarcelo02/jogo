import Grid from "./classes/Grid.js";
import Particle from "./classes/particle.js";
import Player from "./classes/Player.js";
import { GameState } from "./utils/constants.js";
import Obstacle from "./classes/Obstacle.js";
import SoundEffects from "./classes/SoundEffects.js";

const soundeffects = new SoundEffects();

const startScreen = document.querySelector(".start-screen");
const gameOverScreen = document.querySelector(".game-over");
const scoreUI = document.querySelector(".score-ui");
const scoreElement = document.querySelector(".score > span");
const levelElement = document.querySelector(".level > span");
const highElement = document.querySelector(".high > span");
const buttonPlay = document.querySelector(".button-play");
const buttonRestart = document.querySelector(".button-restart");

gameOverScreen.remove();

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;
ctx.imageSmoothingEnabled = false;

let currentState = GameState.START;
let invaderShootInterval;

const gameData = {
  score: 0,
  Level: 1,
  high: 0,
};

const showGameData = () => {
  scoreElement.textContent = gameData.score;
  levelElement.textContent = gameData.Level;
  highElement.textContent = gameData.high;
};

const player = new Player(canvas.width, canvas.height);
const PlayerProjectiles = [];
const invadersProjectiles = [];
const particle = [];
const obstacles = [];

const initObstacles = () => {
  const x = canvas.width / 2 - 55;
  const y = canvas.height - 350;
  const offset = canvas.width * 0.15;
  const color = "#941CFF";

  const obstacle1 = new Obstacle({ x: x - offset, y }, 179, 20, color);
  const obstacle2 = new Obstacle({ x: x + offset, y }, 179, 20, color);
  const obstacle3 = new Obstacle({ x: x + offset * 2, y }, 179, 20, color);
  const obstacle4 = new Obstacle({ x: x - offset * 2, y }, 179, 20, color);
  const obstacle5 = new Obstacle({ x: x - offset * 3, y }, 179, 20, color);
  const obstacle6 = new Obstacle({ x: x + offset * 3 - 50, y }, 179, 20, color);
  const obstacle7 = new Obstacle({ x: x - 39.5, y }, 179, 20, color);
  obstacles.push(obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstacle7);
};

initObstacles();
const grid = new Grid(3, 6);

const keys = {
  left: false,
  right: false,
  shoot: {
    pressed: false,
    released: true,
  },
};

const incrementScore = (valor) => {
  gameData.score += valor;
  if (gameData.score > gameData.high) {
    gameData.high = gameData.score;
  }
};

const drawObstacles = () => {
  obstacles.forEach((obstacle) => obstacle.draw(ctx));
};

const drawProjectile = () => {
  const projectiles = [...PlayerProjectiles, ...invadersProjectiles];
  projectiles.forEach((projectile) => {
    projectile.draw(ctx);
    projectile.update();
  });
};

const drawParticle = () => {
  particle.forEach((p) => {
    p.draw(ctx);
    p.update();
  });
};

const clearProjectiles = () => {
  for (let i = PlayerProjectiles.length - 1; i >= 0; i--) {
    if (PlayerProjectiles[i].position.y <= 0) {
      PlayerProjectiles.splice(i, 1);
    }
  }
};

const clearParticles = () => {
  for (let i = particle.length - 1; i >= 0; i--) {
    if (particle[i].opacity <= 0) {
      particle.splice(i, 1);
    }
  }
};

const createExplosion = (position, size, color) => {
  for (let i = 0; i < size; i++) {
    const p = new Particle(
      { x: position.x, y: position.y },
      { x: Math.random() - 0.5 * 1.5, y: Math.random() - 0.5 * 1.5 },
      3,
      color
    );
    particle.push(p);
  }
};

const checkshootinvaders = () => {
  grid.invaders.forEach((invader, invaderindex) => {
    PlayerProjectiles.some((projectile, projectileindex) => {
      if (invader.hit(projectile)) {
        soundeffects.playHitSound();
        createExplosion(
          {
            x: invader.position.x + invader.width / 2,
            y: invader.position.y + invader.height / 2,
          },
          10,
          "#941CFF"
        );
        incrementScore(1);
        grid.invaders.splice(invaderindex, 1);
        PlayerProjectiles.splice(projectileindex, 1);
      }
    });
  });
};

const checkshootPlayer = () => {
  invadersProjectiles.some((projectile, i) => {
    if (player.hit(projectile)) {
      soundeffects.playExplosionSound();
      invadersProjectiles.splice(i, 1);
      gameOver();
    }
  });
};

const checkshootObstacles = () => {
  obstacles.forEach((obstacle) => {
    PlayerProjectiles.some((projectile, i) => {
      if (obstacle.hit(projectile)) {
        PlayerProjectiles.splice(i, 1);
      }
    });
    invadersProjectiles.some((projectile, i) => {
      if (obstacle.hit(projectile)) {
        invadersProjectiles.splice(i, 1);
      }
    });
  });
};

const spawGrid = () => {
  if (grid.invaders.length === 0) {
    gameData.Level += 1;
    soundeffects.playNextLevelSound();
    grid.rows = Math.round(Math.random() * 9 + 1);
    grid.cols = Math.round(Math.random() * 9 + 1);
    grid.restart();
    
  }
};

const gameOver = () => {
  createExplosion(
    {
      x: player.position.x + player.width / 2,
      y: player.position.y + player.height / 2,
    },
    10,
    "white"
  );
  createExplosion(
    {
      x: player.position.x + player.width / 2,
      y: player.position.y + player.height / 2,
    },
    10,
    "#4D9BE6"
  );
  createExplosion(
    {
      x: player.position.x + player.width / 2,
      y: player.position.y + player.height / 2,
    },
    10,
    "crimson"
  );
  currentState = GameState.GAME_OVER;
  player.alive = false;
  document.body.append(gameOverScreen);
};

const gameloop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (currentState === GameState.PLAYING) {
    showGameData();
    spawGrid();
    drawParticle();
    drawProjectile();
    drawObstacles();
    clearProjectiles();
    clearParticles();
    checkshootPlayer();
    checkshootObstacles();
    checkshootinvaders();

    grid.draw(ctx);
    grid.update(player.alive);

    ctx.save();
    ctx.translate(player.position.x + player.width / 2, player.position.y + player.height / 2);

    if (keys.left && player.position.x >= 0) {
      player.moveleft();
      ctx.rotate(-0.15);
    }

    if (keys.shoot.pressed && keys.shoot.released) {
      soundeffects.playShootSound();
      player.shoot(PlayerProjectiles);
      keys.shoot.released = false;
    }

    if (keys.right && player.position.x <= canvas.width - player.width) {
      player.moveright();
      ctx.rotate(0.15);
    }

    ctx.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2);
    player.draw(ctx);
    ctx.restore();
  }

  if (currentState === GameState.GAME_OVER) {
    checkshootObstacles();
    drawParticle();
    drawProjectile();
    drawObstacles();
    clearProjectiles();
    clearParticles();
    grid.draw(ctx);
    grid.update(player.alive);
  }

  requestAnimationFrame(gameloop);
};

addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === "a") keys.left = true;
  if (key === "d") keys.right = true;
  if (key === " ") keys.shoot.pressed = true;
});

addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();
  if (key === "a") keys.left = false;
  if (key === "d") keys.right = false;
  if (key === " ") {
    keys.shoot.pressed = false;
    keys.shoot.released = true;
  }
});

buttonPlay.addEventListener("click", () => {
  player.resetPosition();
  startScreen.remove();
  scoreUI.style.display = "block";
  currentState = GameState.PLAYING;

  gameData.Level = 1; 
    grid.rows = 3;
    grid.cols = 6;
    grid.restart();

  if (invaderShootInterval) clearInterval(invaderShootInterval);

  invaderShootInterval = setInterval(() => {
    const invader = grid.getRandomInvader();
    if (invader) {
      invader.shoot(invadersProjectiles);
    }
  }, 1000);
});

buttonRestart.addEventListener("click", () => {
  currentState = GameState.PLAYING;
  player.resetPosition();

  grid.invaders.length = 0;
  grid.invadersVelocity = 1;
  invadersProjectiles.length = 0;
  gameData.score = 0;
  gameData.Level = 1;
  grid.restart();

  gameOverScreen.remove();
});

gameloop();
