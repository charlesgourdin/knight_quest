import { world } from './world';

export const player = {
  hero: null,
  isJumping: false,
  isAttack: false,
  isUpPressed: false,

  initPlayer(scene) {
    this.hero = scene.physics.add.sprite(
      world.startposition.x, world.startposition.y, 'player', 'HeroKnight_Idle_0'
      );
    this.hero.setCollideWorldBounds(true);
    this.hero.setSize(30, 50, true);
    this.hero.setOrigin(0.5, 1);
  },
  generatePlayerAnimations(scene) {
    scene.anims.create({
      key: 'player_idle',
      frames: scene.anims.generateFrameNames('player', { prefix: 'HeroKnight_Idle_', start: 0, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: 'player_run',
      frames: scene.anims.generateFrameNames('player', { prefix: 'HeroKnight_Run_', start: 0, end: 9 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: 'player_jump',
      frames: scene.anims.generateFrameNames('player', { prefix: 'HeroKnight_Jump_', start: 0, end: 2 }),
      frameRate: 4,
      repeat: -1,
    });

    scene.anims.create({
      key: 'player_attack',
      frames: scene.anims.generateFrameNames('player', { prefix: 'HeroKnight_Attack2_', start: 1, end: 5 }),
      frameRate: 10,
      repeat: 0,
    });
  },
  moveHero(cursor) {
    if (cursor.left.isDown) {
      this.hero.setVelocityX(-175);
      this.hero.setFlip(true, false);
    } else if (cursor.right.isDown) {
      this.hero.setVelocityX(175);
      this.hero.setFlip(false, false);
    } else {
      this.hero.setVelocityX(0);
    }

    if (cursor.up.isDown && this.hero.body.onFloor() && !this.isUpPressed) {
      this.isUpPressed = true;
      this.hero.setVelocityY(-300);
    }

    if (cursor.up.isUp) {
      this.isUpPressed = false;
    }

    if (this.hero.body.onFloor()) {
      this.isJumping = false;
    } else {
      this.isJumping = true;
    }

    if (cursor.space.isDown || this.isAttack) {
      this.isAttack = true;
      this.hero.anims.play('player_attack', true);
      if (this.hero.anims.currentFrame.index === 5) {
        this.isAttack = false;
      }
    } else if (this.isJumping) {
      this.hero.anims.play('player_jump', true);
    } else if (cursor.left.isDown) {
      this.hero.anims.play('player_run', true);
    } else if (cursor.right.isDown) {
      this.hero.anims.play('player_run', true);
    } else {
      this.hero.anims.play('player_idle', true);
    }
  },
};
