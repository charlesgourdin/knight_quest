import { gameContent } from '../index';
import { world } from './world';

export const player = {
  hero: null,
  isJumping: false,
  isAttack: false,
  isUpPressed: false,
  isSpacePressed: false,
  isAlive: true,
  isAHero: false,
  gameOver: false,

  initPlayer(scene) {
    this.hero = scene.physics.add.sprite(
      world.startposition.x, world.startposition.y - 30, 'player', 'HeroKnight_Idle_0'
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

    scene.anims.create({
      key: 'player_death',
      frames: scene.anims.generateFrameNames('player', { prefix: 'HeroKnight_Death_', start: 6, end: 9 }),
      frameRate: 10,
      repeat: 0,
    });
  },
  moveHero(cursor) {
    if(this.isAlive && !this.gameOver && !this.isAHero) {
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
  
      if (cursor.space.isDown && !this.isSpacePressed) {
        gameContent.scene.sound.play('sword1');
        this.isAttack = true;
        this.isSpacePressed = true;
      }
  
      if (cursor.space.isUp) {
        this.isSpacePressed = false;
      }
  
      if (this.isAttack) {
        this.hero.anims.play('player_attack', true);
        this.hero.setSize(70, 50, true);
        if (this.hero.anims.currentFrame.index === 5) {
          this.isAttack = false;
          this.hero.setSize(30, 50, true);
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
    } else {
      if(this.isAHero) {
        this.hero.setVelocityX(0);
        this.hero.anims.play('player_idle', true);
      } else if(!this.gameOver) {
        this.hero.setVelocityX(0);
        this.hero.anims.play('player_death', true);
        this.hero.on('animationcomplete', function (sprite)
        {
          this.gameOver = true;
        }, this);
      } else {
        this.hero.setTexture('player', 'HeroKnight_Death_9')
      }
    }
  },
  attackGoblin(idx) {
    if(this.isAttack || gameContent.enemy[idx].isHit) {
      gameContent.enemy[idx].killGoblin();
    } else {
      gameContent.world.killPlayer();
    }
  }
};
