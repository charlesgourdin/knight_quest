class Enemy {
  constructor(game, xPos, yPos, xStance) {
    this.game = game;
    this.goblin = null;
    this.isHit = false;
    this.xPos = xPos;
    this.yPos = yPos;
  };

  init() {
    this.goblin = this.game.scene.physics.add.sprite(
      this.xPos,
      this.yPos - 30,
      'goblin',
      'goblin_idle_0'
      ).setFlip(true, false);

    this.goblin.setSize(30, 60, true);

    this.goblin.setOrigin(0.5, 1);

    this.generateGoblinAnimations();
  };

  generateGoblinAnimations() {
    const { scene } = this.game;

    scene.anims.create({
      key: 'goblin_idle',
      frames: scene.anims.generateFrameNames('goblin', { prefix: 'goblin_idle_', start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: 'goblin_run',
      frames: scene.anims.generateFrameNames('goblin', { prefix: 'goblin_run_', start: 0, end: 7 }),
      frameRate: 7,
      repeat: -1,
    });

    scene.anims.create({
      key: 'goblin_attack',
      frames: scene.anims.generateFrameNames('goblin', { prefix: 'goblin_attack_', start: 0, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: 'goblin_takeHit',
      frames: scene.anims.generateFrameNames('goblin', { prefix: 'goblin_takeHit_', start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: 'goblin_death',
      frames: scene.anims.generateFrameNames('goblin', { prefix: 'goblin_death_', start: 0, end: 3 }),
      frameRate: 8,
      repeat: 0,
    });
  };

  moveGoblin(enemy, stance, duration) {
    const { scene } = this.game;

    this.goblin.anims.play('goblin_run', true);

    var tween = scene.tweens.add({
      targets : this.goblin,
      x : enemy.goblin.x - stance,
      ease : "Linear",
      duration : duration,
      yoyo : true,
      repeat : -1,
      onStart : function (){},
      onComplete : function (){},
      onYoyo : function (){ enemy.goblin.flipX = !enemy.goblin.flipX},
      onRepeat : function (){enemy.goblin.flipX = !enemy.goblin.flipX}
    });
  };

  killGoblin() {
    const { scene } = this.game;

    if(!this.isHit) {
      scene.sound.play('hit');
      this.isHit = true;
    }
    
    this.goblin.anims.play('goblin_death', true);

    this.goblin.on('animationcomplete', function (sprite) {
      this.goblin.destroy();
    }, this)
  };
}

export default Enemy;