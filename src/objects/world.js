import { gameContent } from '../index';

export const world = {
  tileMap: null,
  tileSet: null,
  itemSet: null,
  topLayer: null,
  downLayer: null,
  overlapLayer: null,
  worldLayer: null,
  backgroundLayer: null,
  startposition: null,
  score: 0,
  scoreText: null,
  worldSound : null,
  initMap(scene) {
    const fontStyle = {
      fontSize: '1.5rem',
      color: '#b3271d',
      fontFamily: 'MedievalSharp',
    };
    
    this.scoreText = scene.add.text(20, 20, `Score : ${this.score}`, fontStyle);
    this.scoreText.setScrollFactor(0);

    this.tileMap = scene.make.tilemap({ key: 'map' });
    this.tileSet = this.tileMap.addTilesetImage('tilesheet', 'tiles');
    this.topLayer = this.tileMap.createStaticLayer('top', this.tileSet, 0, 0);
    this.backgroundLayer = this.tileMap.createStaticLayer('background', this.tileSet, 0, 0);
    this.downLayer = this.tileMap.createStaticLayer('bottom', this.tileSet, 0, 0);
    this.worldLayer = this.tileMap.createStaticLayer('world', this.tileSet, 0, 0);
    this.overlapLayer = this.tileMap.createDynamicLayer('overlap', this.tileSet, 0, 0);

    this.startposition = this.tileMap.findObject('Objects', obj => obj.name === 'start');


    this.worldLayer.setCollisionByProperty({ Collides: true });

    scene.physics.world.setBounds(
      0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels,
    );
  },
  addCollider(scene, player) {
    this.overlapLayer.setTileIndexCallback(98, this.collectGem, this);
    scene.physics.add.collider(player.hero, this.worldLayer);
    scene.physics.add.overlap(player.hero, this.overlapLayer);
  },
  handleCamera(scene, player) {
    scene.cameras.main.startFollow(player.hero);
    scene.cameras.main.setBounds(
      0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels,
    );
  },
  collectGem(player, tile) {
    gameContent.scene.sound.play('gemSound')
    this.overlapLayer.removeTileAt(tile.x, tile.y).destroy();
    this.score += 1;
    this.scoreText.setText(`Score : ${this.score}`);
  },
};
