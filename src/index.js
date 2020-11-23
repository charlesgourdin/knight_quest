import Phaser from 'phaser';

import { player } from './objects/player';
import { world } from './objects/world';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#f8e9cb',
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

const game = new Phaser.Game(config);

export const gameContent = {
  scene: null,
  world,
  player,
  cursor: null, 
};

function preload() {
  gameContent.scene = this;
  const { scene, cursor } = gameContent;
  scene.load.image('tiles', '../assets/images/tilesheet.png');
  scene.load.image('items', '../assets/images/items.png');
  scene.load.tilemapTiledJSON('map', '../assets/json/map.json');

  scene.load.atlas('player', '../assets/images/player.png', '../assets/json/playerAtlas.json');

  scene.load.audio('gemSound', '../assets/sounds/gem.ogg');
  scene.load.audio('sword1', '../assets/sounds/sword1.ogg');
}

function create() {
  const { scene, player, world } = gameContent;

  world.initMap(scene);

  player.initPlayer(scene);
  player.generatePlayerAnimations(scene);
  player.hero.anims.play('player_idle');

  world.addCollider(scene, player);

  gameContent.cursor = scene.input.keyboard.createCursorKeys();

  world.handleCamera(scene, player);
}

function update(time, delta) {
  const { player, cursor } = gameContent;

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
