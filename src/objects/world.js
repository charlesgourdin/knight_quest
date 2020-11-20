export const world = {
  tileMap: null,
  tileSet: null,
  itemSet: null,
  topLayer: null,
  downLayer: null,
  overlapLayer: null,
  worldLayer: null,
  backgroundLayer: null,
  initMap(scene) {
    this.tileMap = scene.make.tilemap({ key: 'map' });
    this.tileSet = this.tileMap.addTilesetImage('tilesheet', 'tiles');
    this.topLayer = this.tileMap.createStaticLayer('top', this.tileSet, 0, 0);
    this.backgroundLayer = this.tileMap.createStaticLayer('background', this.tileSet, 0, 0);
    this.downLayer = this.tileMap.createStaticLayer('bottom', this.tileSet, 0, 0);
    this.worldLayer = this.tileMap.createStaticLayer('world', this.tileSet, 0, 0);
    this.overlapLayer = this.tileMap.createDynamicLayer('overlap', this.tileSet, 0, 0);


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
    this.overlapLayer.removeTileAt(tile.x, tile.y).destroy();
  },
};
