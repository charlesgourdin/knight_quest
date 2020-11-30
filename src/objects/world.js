import Phaser from 'phaser';
import { gameContent } from '../index';

export const world = {
  backgroundImg: {},
  tileMap: null,
  tileSet: null,
  itemSet: null,
  topLayer: null,
  downLayer: null,
  overlapLayer: null,
  worldLayer: null,
  backgroundLayer: null,
  startposition: null,
  endPosition: null,
  goblinStart: null,
  score: 0,
  scoreText: null,
  worldSound : null,
  gameOver: false,
  initMap(scene) {
    const fontStyle = {
      fontSize: '1.5rem',
      color: '#b3271d',
      fontFamily: 'MedievalSharp',
    };
    
    this.scoreText = scene.add.text(20, 20, `Score : ${this.score}`, fontStyle);
    this.scoreText.setScrollFactor(0);

    this.backgroundImg.back = gameContent
    .scene
    .add
    .sprite(0, 0, "mountains-back")
    .setOrigin(0, 0)
    .setScrollFactor(0, 1);

    this.backgroundImg.mid = gameContent
    .scene
    .add
    .sprite(0, 40, "mountains-mid1")
    .setOrigin(0, 0)
    .setScrollFactor(0.1, 1);

    this.backgroundImg.front = gameContent
    .scene
    .add
    .sprite(0, 300, "mountains-mid2")
    .setOrigin(0, 0)
    .setScrollFactor(0.3, 1);

    this.tileMap = scene.make.tilemap({ key: 'map' });
    this.tileSet = this.tileMap.addTilesetImage('tilesheet', 'tiles');
    this.topLayer = this.tileMap.createStaticLayer('top', this.tileSet, 0, 0);
    this.backgroundLayer = this.tileMap.createStaticLayer('background', this.tileSet, 0, 0);
    this.downLayer = this.tileMap.createStaticLayer('bottom', this.tileSet, 0, 0);
    this.worldLayer = this.tileMap.createStaticLayer('world', this.tileSet, 0, 0);
    this.overlapLayer = this.tileMap.createDynamicLayer('overlap', this.tileSet, 0, 0);

    this.startposition = this.tileMap.findObject('Objects', obj => obj.name === 'start');
    this.endPosition = this.tileMap.findObject('Objects', obj => obj.name === 'heroEnd');

    this.goblinStart = new Array(4).fill('').map((item, idx) => {
      return this.tileMap.findObject('Objects', obj => obj.name === `goblin${idx}Start`);
    })

    this.worldLayer.setCollisionByProperty({ Collides: true });

    scene.physics.world.setBounds(
      0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels,
    );
  },
  addCollider(scene, player, enemy) {
    this.overlapLayer.setTileIndexCallback(98, this.collectGem, this);
    this.overlapLayer.setTileIndexCallback(166, this.killPlayer, this);
    this.overlapLayer.setTileIndexCallback(100, this.endLevel, this);

    scene.physics.add.collider(player.hero, this.worldLayer);
    scene.physics.add.overlap(player.hero, this.overlapLayer);

    Object.values(enemy).forEach((item, idx) => {
      const {goblin} = item;
      scene.physics.add.overlap(player.hero, goblin, () => gameContent.player.attackGoblin(idx));
      scene.physics.add.collider(goblin, this.worldLayer);
    })


  },
  handleCamera(scene, player) {
    scene.cameras.main.startFollow(player.hero);
    scene.cameras.main.setBounds(
      0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels,
    );
  },
  collectGem(player, tile) {
    gameContent.scene.sound.play('gemSound', {volume: 0.2})
    this.overlapLayer.removeTileAt(tile.x, tile.y).destroy();
    this.score += 1;
    this.scoreText.setText(`Score : ${this.score}`);
  },
  killPlayer() {
    this.panel('dead');
  },
  endLevel(player, tile) {
    if(player.x > this.endPosition.x) {
      this.panel('end');
    }
  },
  panel(status) {
    const { midPoint } = gameContent.scene.cameras.main;

    if(!this.gameOver) {
      this.gameOver = true;
      status === 'dead'
        ? gameContent.player.isAlive = false
        : gameContent.player.isAHero = true;

      setTimeout(function() {
        gameContent.scene.add.sprite(midPoint.x, midPoint.y, "parchment");

        const fontStyle = {
          fontSize: '3rem',
          color: '#5d0000',
          fontFamily: 'MedievalSharp',
          align: 'center'
        };

        gameContent.scene.add.text(
          midPoint.x,
          midPoint.y - 50,
          `You are \n${status === 'dead' ? 'dead' : 'a hero!'}`,
          fontStyle).setOrigin(0.5, 0.5)

        let container = gameContent.scene.add.container(50, 50);;
        container.setPosition(midPoint.x + 45, midPoint.y + 100);
        const restartButton = gameContent.scene.add.image(0, 0, "restart").setScale(0.12, 0.12).setInteractive({ cursor: 'pointer' });
        var text = gameContent.scene.add.text(0, 0, 'Restart');
        text.setOrigin(0.5, 0.5);
        container.add(restartButton);
        container.add(text);

        restartButton.on("pointerup", function(){
          gameContent.scene.scene.restart();
        });
      }, 1000);
    }
  }
};
