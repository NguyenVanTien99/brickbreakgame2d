
import Paddle from "/src/paddle.js";
import InputHandler from "/src/input.js";
import Ball from "/src/ball.js";
import { buildLevel, level1, level2, level3, level4 } from "/src/levels.js";

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4,
  RESTART: 5
};

export default class Game {
  constructor(gameWidth, gameHeight,) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gamestate = GAMESTATE.MENU;
    this.ball = new Ball(this);
    this.paddle = new Paddle(this);
    this.gameObjects = [];
    this.bricks = [];
    this.lives = 3;

    this.levels = [level1, level2, level3, level4];
    this.currentLevel = 0;
    this.Level = 1;

    new InputHandler(this.paddle, this);
  }

  start() {
    if (
      this.gamestate !== GAMESTATE.MENU &&
      this.gamestate !== GAMESTATE.NEWLEVEL
    )
      return;

    this.bricks = buildLevel(this, this.levels[this.currentLevel]);
    // console.log(this.bricks);
    
    this.ball.reset();
    this.gameObjects = [this.ball, this.paddle];
    console.log(this.paddle)

    this.gamestate = GAMESTATE.RUNNING;

    
  }

  update(deltaTime) {
    
    if (this.lives === 0) this.gamestate = GAMESTATE.GAMEOVER;
    // console.log(this.lives)
    // document.querySelector("live") = lives;
    if (
      this.gamestate === GAMESTATE.PAUSED ||
      this.gamestate === GAMESTATE.MENU ||
      this.gamestate === GAMESTATE.GAMEOVER
    )
      return;

    if (this.bricks.length === 0) {
      this.currentLevel++;
      console.log(this.currentLevel);
      
      this.gamestate = GAMESTATE.NEWLEVEL;
      this.start();
    }
    console.log(this.currentLevel);
    [...this.gameObjects, ...this.bricks].forEach(object =>
      object.update(deltaTime)
    );

    this.bricks = this.bricks.filter(brick => !brick.markedForDeletion);
    // console.log(this.lives)
    // console.log(this.currentLevel + 1);
  }

  showGameStats(){
    // draw text
    ctx.fillStyle = "black";
    ctx.font = "25px Germania One";
    ctx.fillText("LIFES : ", 65, 25);
    ctx.fillText(this.lives, 115, 25);
    ctx.fillText("SCORE :", 360, 25)
    ctx.fillText(this.currentLevel * 10, 420, 25)
    ctx.fillText("LEVEL :", 700, 25)
    ctx.fillText(this.currentLevel + 1, 760, 25)
    // draw image
    // ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}



  draw(ctx) {
    [...  this.gameObjects, ...this.bricks].forEach(object => object.draw(ctx));

    if (this.gamestate === GAMESTATE.PAUSED) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("PAUSE    ", this.gameWidth / 2, this.gameHeight / 2);
    }

    if (this.gamestate === GAMESTATE.MENU) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(
        "Press SPACEBAR to play",
        this.gameWidth / 2,
        this.gameHeight / 2
      );
    }
    if (this.gamestate === GAMESTATE.GAMEOVER) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER! Press ENTER to go to home", this.gameWidth / 2, this.gameHeight / 2);

    }
  }

  togglePause() {
    if (this.gamestate == GAMESTATE.PAUSED) {
      this.gamestate = GAMESTATE.RUNNING;
    } else {
      this.gamestate = GAMESTATE.PAUSED;
    }

    
  }
  
  restart() {
    location.reload();
  }

  
}

let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");



const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;



let game = new Game(GAME_WIDTH, GAME_HEIGHT);

let lastTime = 0;
function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  game.update(deltaTime);
  game.draw(ctx);
  game.showGameStats();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
