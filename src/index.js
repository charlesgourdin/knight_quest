import Phaser from 'phaser';
import Enemy from './objects/enemyClass';

import { player } from './objects/player';
import { world } from './objects/world';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#f8e9cb',
  // backgroundColor: '#afd0e3',
  width: 800,
  height: 600,
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
    },
  },
};

export const game = new Phaser.Game(config);

export const gameContent = {
  scene: null,
  world,
  player,
  enemy: {},
  cursor: null, 
};

let ost;
let gameOverSound;
let isGameOverSound = false;

function preload() {
  gameContent.scene = this;
  const { scene, cursor } = gameContent;

  scene.load.image('mountains-back', 'assets/images/mountains-back.png');
	scene.load.image('mountains-mid1', 'assets/images/mountains-mid1.png');
  scene.load.image('mountains-mid2', 'assets/images/mountains-mid2.png');
    
  scene.load.image('tiles', '../assets/images/tilesheet.png');
  scene.load.image('items', '../assets/images/items.png');
  scene.load.image('parchment', '../assets/images/parchment.png');
  scene.load.image('restart', '../assets/images/restart.png');

  scene.load.tilemapTiledJSON('map', '../assets/json/map.json');

  scene.load.atlas('player', '../assets/images/player.png', '../assets/json/playerAtlas.json');
  scene.load.atlas('goblin', '../assets/images/goblin.png', '../assets/json/goblinAtlas.json');

  scene.load.audio('OST', '../assets/sounds/OST.mp3');
  scene.load.audio('gemSound', '../assets/sounds/coin.mp3');
  scene.load.audio('sword1', '../assets/sounds/sword1.ogg');
  scene.load.audio('hit', '../assets/sounds/hit.ogg');
  scene.load.audio('win', '../assets/sounds/win.mp3');
  scene.load.audio('death', '../assets/sounds/death.mp3');

  player.isAlive = true;
  player.gameOver = false;
  player.isAHero = false;
  world.gameOver = false;
  world.score = 0;
  isGameOverSound = false;
  gameOverSound = null;
}

function create() {
  const { scene, player, enemy, world } = gameContent;

  world.initMap(scene);

  ost = this.sound.add('OST');
  ost.play({
    loop: true,
    volume: 0.4  
  });

  function randomIntFromInterval(min, max) {  
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  world.goblinStart.forEach((item, idx) => {
    enemy[idx] = new Enemy(gameContent, world.goblinStart[idx].x, world.goblinStart[idx].y);
    enemy[idx].init();
    enemy[idx].moveGoblin(
      enemy[idx],
      randomIntFromInterval(60, 100),
      randomIntFromInterval(900, 1600),
    );
  });

  player.initPlayer(scene);
  player.generatePlayerAnimations(scene);
  player.hero.anims.play('player_idle');


  world.addCollider(scene, player, enemy);

  gameContent.cursor = scene.input.keyboard.createCursorKeys();

  world.handleCamera(scene, player);
}

function update(time, delta) {
  const { player, cursor } = gameContent;

  if(world.gameOver) {
    ost.stop();

    if(player.isAHero && !isGameOverSound) {
      gameOverSound = this.sound.add('win');
      gameOverSound.play({
        volume: 0.4  
      });
      isGameOverSound = true;
    }

    if(!player.isAlive && !isGameOverSound) {
      gameOverSound = this.sound.add('death');
      gameOverSound.play({
        volume: 0.4  
      });
      isGameOverSound = true;
    }
  }

  player.moveHero(cursor);
  handleScreenSize();
}

function handleScreenSize() {
  const canvas = document.querySelector('canvas');

  const winWidth = window.innerWidth;
  const winHeight = window.innerHeight;
  const winRatio = winWidth / winHeight;

  const gameRatio = config.width / config.height;

  if (winRatio < gameRatio) {
    canvas.style.width = `${winWidth}px`;
    canvas.style.height = `${winWidth / gameRatio}px`;
  } else {
    canvas.style.width = `${winHeight * gameRatio}px`;
    canvas.style.height = `${winHeight}px`;
  }
}
