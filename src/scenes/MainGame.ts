import { Scene, GameObjects, Physics, Types } from 'phaser';
import { Assets, Dimensions, GameObjectsEnum } from '../shared/constants';
import { AbstractPlayer, PlayerBuilder } from '../domain/player';
import { Ball, BallBuilder } from '../domain/ball';
import { PhaserSound } from '../shared/types';

export class MainGame extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    platforms: Physics.Arcade.StaticGroup;
    firstPlayer: AbstractPlayer;
    secondPlayer: AbstractPlayer;
    ball: Ball;
    pinkLasers: Physics.Arcade.Group;
    blueLasers: Physics.Arcade.Group;
    middleWall: Types.Physics.Arcade.SpriteWithStaticBody;
    explosionOverlay: GameObjects.Rectangle;
    cursors: Types.Input.Keyboard.CursorKeys;
    keyW: Phaser.Input.Keyboard.Key | undefined;
    keyA: Phaser.Input.Keyboard.Key | undefined;
    keyS: Phaser.Input.Keyboard.Key | undefined;
    keyD: Phaser.Input.Keyboard.Key | undefined;
    keyC: Phaser.Input.Keyboard.Key | undefined;
    laserSound: PhaserSound;
    hurtSound: PhaserSound
    explosionSound: PhaserSound
    backwardsSound: PhaserSound
    pianoNotes: PhaserSound[];
    hearts: Types.Physics.Arcade.SpriteWithStaticBody[];

    constructor ()
    {
        super('MainGame');
    }

    create ()
    {
        this.background = this.add.image(Dimensions.WIDTH / 2, Dimensions.HEIGHT / 2, Assets.SKY);
        this.createSounds();
        this.createInputs();
        this.createPlatforms();
        this.createPlayers();
        this.createBall();
        this.createLasers();
        this.createMiddleWall();
        this.createExplosionOverlay();
        this.createHearts();
        this.createPlayerAnimations();
        this.createBallAnimations();
    }

    createSounds() {
        this.laserSound = this.sound.add('laser');
        this.hurtSound = this.sound.add('hurt');
        this.hurtSound.setVolume(3.5);
        this.explosionSound = this.sound.add('explosion');
        this.backwardsSound = this.sound.add('backwards');
        this.pianoNotes = 'abcdefg'.split('').map(note => {
            const newSound = this.sound.add(`${note}6`);
            return newSound.setRate(.25).setVolume(2);
        });
    }

    createInputs() {
        this.keyW = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyC = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        
        this.cursors = this.input.keyboard?.createCursorKeys() as any;
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, GameObjectsEnum.GROUND);
        this.platforms.create(400, 436, GameObjectsEnum.NET).setScale(.5).refreshBody();
    }

    createPlayers() {
        this.firstPlayer = new PlayerBuilder(false)
            .startX(100)
            .startY(510)
            .asset(Assets.PINK_PLAYER)
            .withPhysics(this.physics)
            .build() as AbstractPlayer;

        this.secondPlayer = new PlayerBuilder(true)
            .startX(700)
            .startY(510)
            .asset(Assets.BLUE_PLAYER)
            .withPhysics(this.physics)
            .build() as AbstractPlayer;

        this.physics.add.collider(this.firstPlayer.sprite, this.platforms);
        this.physics.add.collider(this.secondPlayer.sprite, this.platforms);
    }

    createBall() {
        this.ball = new BallBuilder()
            .startX(Math.floor(Math.random() * Dimensions.WIDTH))
            .startY(16)
            .asset(Assets.BALL)
            .withPhysics(this.physics)
            .build() as Ball;

        this.ball.lastSpawnLocation = this.ball.getCurrentLocation();

        this.ball.sprite.setScale(1.2);
            
        this.physics.add.collider(this.ball.sprite, this.platforms);
        this.physics.add.collider(this.firstPlayer.sprite, this.ball.sprite, this.hitBall as any, undefined, this);
        this.physics.add.collider(this.secondPlayer.sprite, this.ball.sprite, this.hitBall as any, undefined, this);
    }

    createLasers() {
        this.pinkLasers = this.physics.add.group();
        this.blueLasers = this.physics.add.group();

        this.physics.add.collider(
            this.firstPlayer.sprite, 
            this.blueLasers, 
            this.firstPlayer.onLaserCollide as any, 
            () => {
                if (Date.now() - this.firstPlayer.lastLaserEffect > AbstractPlayer.laserEffectLimit) {
                    this.hurtSound.play();
                }
            }, 
            this.firstPlayer);

        this.physics.add.collider(
            this.secondPlayer.sprite, 
            this.pinkLasers, 
            this.secondPlayer.onLaserCollide as any, 
            () => {
                if (Date.now() - this.secondPlayer.lastLaserEffect > AbstractPlayer.laserEffectLimit) {
                    this.hurtSound.play();
                }
            }, 
            this.secondPlayer);
    }

    createMiddleWall() {
        this.middleWall = this.physics.add.staticSprite(400, 170, Assets.NET).setScale(.5).refreshBody();
        this.middleWall.scaleY = .85;
        this.middleWall.setVisible(false);
        this.middleWall.setImmovable(true);
        this.middleWall.refreshBody();
        this.physics.add.collider(this.firstPlayer.sprite, this.middleWall);
        this.physics.add.collider(this.secondPlayer.sprite, this.middleWall);
    }

    createPlayerAnimations() {
        [Assets.PINK_PLAYER, Assets.BLUE_PLAYER].forEach(asset => {
            this.anims.create({
                key: `${asset}_left`,
                frames: this.anims.generateFrameNumbers(asset, { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
    
            this.anims.create({
                key: `${asset}_turn`,
                frames: [ { key: asset, frame: 4 } ],
                frameRate: 20
            });
    
            this.anims.create({
                key: `${asset}_right`,
                frames: this.anims.generateFrameNumbers(asset, { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        });
    }

    createBallAnimations() {
        for (let i = 0; i < 10; i++) {
            this.anims.create({
                key: `ball_${i}`,
                frames: [{ key: Assets.BALL, frame: i }],
                frameRate: 10
            });
        }
    }

    createExplosionOverlay() {
        this.explosionOverlay = this.add.rectangle(
            0, 
            Dimensions.HEIGHT / 2, 
            Dimensions.WIDTH / 2, 
            Dimensions.HEIGHT, 
            0xffa906);
        this.explosionOverlay.setAlpha(0);
    }

    createHearts() {
        this.hearts = [];
        for (let i = 0; i < 11; i++) {
            const heart = this.physics.add.staticSprite(50 * i + 170, 60, Assets.HEART).setScale(.03).refreshBody();
            this.hearts.push(heart);
            if (i == 4) {
                i++;
            }
        }
    }

    updateHearts() {
        for (let i = 4; i >= this.firstPlayer.lives; i--) {
            this.hearts[i].setTintFill(0x0);
            this.hearts[i].tintFill = false;
        }

        for (let i = 5; i < 10 - this.secondPlayer.lives; i++) {
            this.hearts[i].setTintFill(0x0);
            this.hearts[i].tintFill = false;
        }
    }

    update() {
        this.firstPlayer.update(this);
        this.secondPlayer.update(this);
        this.ball.update(this);
    }

    hitBall (player: typeof this.firstPlayer.sprite, ball: any) {
        const angle = Phaser.Math.Angle.Between(player.x, player.y, ball.x, ball.y);
        const speed = 500;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;

        ball.setVelocity(velocityX, velocityY);
        this.playBounce();
        this.ball.sprite.setRotation(Math.random() * 2 * Math.PI);
    }

    playBounce() {
        this.pianoNotes[Math.floor(Math.random() * this.pianoNotes.length)].play();
    }

    showExplosion() {
        if (this.ball.getCurrentLocation() == Assets.PINK_PLAYER) {
            this.explosionOverlay.setX(Dimensions.WIDTH / 4 - 8);
        } else {
            this.explosionOverlay.setX(Dimensions.WIDTH / 1.32);
        }

        this.explosionOverlay.setAlpha(1);
        setTimeout(() => {
            this.explosionOverlay.setAlpha(0);
        }, 500);
    }

    addScore() {
        if (this.ball.getCurrentLocation() == Assets.PINK_PLAYER) {
            this.firstPlayer.lives--;
        } else {
            this.secondPlayer.lives--;
        }

        if (this.firstPlayer.lives == 0 || this.secondPlayer.lives == 0) {
            this.gameOver();
        }

        this.updateHearts();
    }

    gameOver() {
        this.scene.start('GameOver', { firstPlayerWon: this.firstPlayer.lives != 0 });
    }

    resetAfterScore() {
        this.ball.reset();
        this.pianoNotes.forEach(note => note.setRate(.25));
    }
}
