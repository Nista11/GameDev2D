import { Scene, GameObjects, Physics, Types } from 'phaser';
import { Assets, Dimensions, GameObjectsEnum } from '../shared/constants';
import { AbstractPlayer, PlayerBuilder } from '../shared/types';

export class MainGame extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    platforms: Physics.Arcade.StaticGroup;
    firstPlayer: AbstractPlayer;
    secondPlayer: AbstractPlayer;
    ball: Types.Physics.Arcade.SpriteWithDynamicBody;
    cursors: Types.Input.Keyboard.CursorKeys;
    score: number;
    scoreText: GameObjects.Text;
    gameOver: boolean;
    keyW: Phaser.Input.Keyboard.Key | undefined;
    keyA: Phaser.Input.Keyboard.Key | undefined;
    keyS: Phaser.Input.Keyboard.Key | undefined;
    keyD: Phaser.Input.Keyboard.Key | undefined;

    constructor ()
    {
        super('MainGame');
    }

    create ()
    {
        this.background = this.add.image(Dimensions.WIDTH / 2, Dimensions.HEIGHT / 2, Assets.SKY);
        this.keyW = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, GameObjectsEnum.GROUND).setScale(2).refreshBody();
        this.platforms.create(400, 436, GameObjectsEnum.NET).setScale(.5).refreshBody();

        this.firstPlayer = new PlayerBuilder(false)
            .startX(100)
            .startY(450)
            .asset(Assets.PINK_PLAYER)
            .withPhysics(this.physics)
            .build();

        this.secondPlayer = new PlayerBuilder(true)
            .startX(700)
            .startY(450)
            .asset(Assets.BLUE_PLAYER)
            .withPhysics(this.physics)
            .build();

        this.physics.add.collider(this.firstPlayer.sprite, this.platforms);
        this.physics.add.collider(this.secondPlayer.sprite, this.platforms);

        this.ball = this.physics.add.sprite(100, 16, Assets.BALL);
        this.ball.setBounce(0.9);
        this.ball.setCollideWorldBounds(true);
        this.ball.setVelocity(0);

        this.physics.add.collider(this.ball, this.platforms);

        this.physics.add.collider(this.firstPlayer.sprite, this.ball, this.hitBall as any, undefined, this);
        this.physics.add.collider(this.secondPlayer.sprite, this.ball, this.hitBall as any, undefined, this);

        [Assets.PINK_PLAYER, Assets.BLUE_PLAYER].map(asset => {
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

        this.cursors = this.input.keyboard?.createCursorKeys() as any;

        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', color: '#000' });
        this.gameOver = false;
    }

    update(time: number, delta: number): void {
        this.firstPlayer.update(this);
        this.secondPlayer.update(this);
    }

    hitBall (player: typeof this.firstPlayer.sprite, ball: any)
    {
        const angle = Phaser.Math.Angle.Between(player.x, player.y, ball.x, ball.y);

        const speed = 500;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;
    
        // Set the velocities for the ball
        ball.setVelocity(velocityX, velocityY);
        // this.physics.pause();

        // player.setTint(0xff0000);

        // player.anims.play('turn');

        // this.gameOver = true;
    }
}
