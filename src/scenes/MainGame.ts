import { Scene, GameObjects, Physics, Types } from 'phaser';
import { Assets, Dimensions, GameObjectsEnum } from '../shared/constants';
import { Player, PlayerBuilder } from '../shared/types';

export class MainGame extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    platforms: Physics.Arcade.StaticGroup;
    firstPlayer: Player;
    secondPlayer: Player;
   // player: Types.Physics.Arcade.SpriteWithDynamicBody;
    ball: Types.Physics.Arcade.SpriteWithDynamicBody;
    cursors: Types.Input.Keyboard.CursorKeys;
    score: number;
    scoreText: GameObjects.Text;
    gameOver: boolean;

    constructor ()
    {
        super('MainGame');
    }

    create ()
    {
        this.background = this.add.image(Dimensions.WIDTH / 2, Dimensions.HEIGHT / 2, Assets.SKY);

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, GameObjectsEnum.GROUND).setScale(2).refreshBody();

        this.firstPlayer = new PlayerBuilder()
            .startX(100)
            .startY(450)
            .asset(Assets.PLAYER)
            .withPhysics(this.physics)
            .build();

        this.firstPlayer.sprite.setBounce(0);
        this.firstPlayer.sprite.setCollideWorldBounds(true);

        this.physics.add.collider(this.firstPlayer.sprite, this.platforms);

        this.ball = this.physics.add.sprite(100, 16, Assets.BALL);
        this.ball.setBounce(0.9);
        this.ball.setCollideWorldBounds(true);
        this.ball.setVelocity(0);

        this.physics.add.collider(this.ball, this.platforms);

        this.physics.add.collider(this.firstPlayer.sprite, this.ball, this.hitBall as any, undefined, this);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(Assets.PLAYER, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: Assets.PLAYER, frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(Assets.PLAYER, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.cursors = this.input.keyboard?.createCursorKeys() as any;

        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', color: '#000' });
        this.gameOver = false;
    }

    update(time: number, delta: number): void {
        const speed = 200;

        if (this.cursors.left.isDown)
        {
            this.firstPlayer.sprite.setVelocityX(-speed);

            this.firstPlayer.sprite.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.firstPlayer.sprite.setVelocityX(speed);

            this.firstPlayer.sprite.play('right', true);
        }
        else
        {
            this.firstPlayer.sprite.setVelocityX(0);

            this.firstPlayer.sprite.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.firstPlayer.sprite.body.touching.down)
        {
            this.firstPlayer.sprite.setVelocityY(-speed * 2);
        }
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
