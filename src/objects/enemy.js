import { gameContent } from '../index';
import { world } from './world';

export const enemy = {
  goblin: null,

  initGoblin(scene) {
    this.goblin = scene.physics.add.sprite(
      400, world.startposition.y - 30, 'goblin', 'goblin_idle_0'
      ).setFlip(true, false);
    this.goblin.setSize(30, 60, true);
    this.goblin.setOrigin(0.5, 1);
  },
  generateGoblinAnimations(scene) {
    scene.anims.create({
      key: 'goblin_idle',
      frames: scene.anims.generateFrameNames('goblin', { prefix: 'goblin_idle_', start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: 'goblin_run',
      frames: scene.anims.generateFrameNames('goblin', { prefix: 'goblin_run_', start: 0, end: 7 }),
      frameRate: 10,
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
  },
  moveGoblin() {
    this.goblin.anims.play('goblin_idle', true);
  }, 
  killGoblin() {
    if(!this.isHit) {
      gameContent.scene.sound.play('hit');
      this.isHit = true;
    }
    
    this.goblin.anims.play('goblin_death', true);

    this.goblin.on('animationcomplete', function (sprite) {
      this.goblin.destroy();
    }, this)
  }
}