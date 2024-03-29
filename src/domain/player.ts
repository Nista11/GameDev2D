import { Physics } from "phaser";
import { Assets } from "../shared/constants";
import { MainGame } from "../scenes/MainGame";
import { DynamicObject, DynamicObjectBuilder } from "./dynamicObject";

export abstract class AbstractPlayer extends DynamicObject {
    public score = 0;
    public lastLaserPress = 0;
    public lastLaserEffect = 0;
    public lastJumpPress = 0;
    public speed = 300;
    public static laserEffectLimit = 2500;
    public static lastLaserLimit = 750;
    public static jumpLimit = 500;

    public abstract isUpPressed(context: MainGame): boolean;
    public abstract isRightPressed(context: MainGame): boolean;
    public abstract isDownPressed(context: MainGame): boolean;
    public abstract isLeftPressed(context: MainGame): boolean;
    public abstract isLaserKeyPressed(context: MainGame): boolean;

    public update(context: MainGame): void {
        if (this.isLeftPressed(context)) {
            this.sprite.setVelocityX(-this.speed);
            this.sprite.anims.play(`${this.asset}_left`, true);
        } else if (this.isRightPressed(context)) {
            this.sprite.setVelocityX(this.speed);
            this.sprite.play(`${this.asset}_right`, true);
        } else {
            this.sprite.setVelocityX(0);
            this.sprite.anims.play(`${this.asset}_turn`);
        }

        if (this.isUpPressed(context)) {
            if (this.sprite.body.touching.down) {
                this.sprite.setVelocityY(-this.speed);
                this.lastJumpPress = Date.now();
            } else if (this.sprite.body.velocity.y < 0 && Date.now() - this.lastJumpPress < AbstractPlayer.jumpLimit) {
                this.sprite.setVelocityY(this.sprite.body.velocity.y * 1.04);
            }
        }

        if (this.isLaserKeyPressed(context) && Date.now() - this.lastLaserPress > AbstractPlayer.lastLaserLimit) {
            const laser = this.asset == Assets.PINK_PLAYER ?
                context.pinkLasers.create(this.sprite.x - 150, this.sprite.y, Assets.PINK_LASER).setScale(.12).refreshBody() :
                context.blueLasers.create(this.sprite.x - 200, this.sprite.y, Assets.BLUE_LASER).setScale(.12).refreshBody();
            laser.setVelocityX(200 * (this.asset == Assets.PINK_PLAYER ? 1 : -1));
            laser.setVelocityY(0);
            laser.body.setAllowGravity(false);

            laser.setCollideWorldBounds(true);
            laser.body.onWorldBounds = true;

            laser.body.world.on('worldbounds', (body: any) => {
                if (body.gameObject === laser) {
                    body.gameObject.setActive(false);
                    body.gameObject.setVisible(false);
                    body.gameObject.body.checkCollision.none = true;
                }
              }, laser);

            this.lastLaserPress = Date.now();
        }
    }

    public onLaserCollide(player: typeof this.sprite, laser: any) {
        if (Date.now() - this.lastLaserEffect > AbstractPlayer.laserEffectLimit) {
            const scaleFactor = 1.5;
            this.speed /= scaleFactor;
            this.sprite.setVelocityX(this.sprite.body.velocity.x / scaleFactor);
            this.sprite.setVelocityY(this.sprite.body.velocity.y / scaleFactor);
            this.sprite.setTintFill(0xff0000);
            this.sprite.tintFill = false;

            setTimeout(() => {
                this.speed *= scaleFactor;
                this.sprite.setVelocityX(this.sprite.body.velocity.x * scaleFactor);
                this.sprite.setVelocityY(this.sprite.body.velocity.y * scaleFactor);
                this.sprite.clearTint();
            }, AbstractPlayer.laserEffectLimit / 1.2);

            this.lastLaserEffect = Date.now();
        }

        laser.setActive(false);
        laser.setVisible(false);
        laser.body.checkCollision.none = true;
    }
}

export class ArrowKeysPlayer extends AbstractPlayer {
    public isUpPressed(context: MainGame): boolean {
        return context.cursors.up.isDown;
    }

    public isRightPressed(context: MainGame): boolean {
        return context.cursors.right.isDown;
    }

    public isDownPressed(context: MainGame): boolean {
        return context.cursors.down.isDown;
    }

    public isLeftPressed(context: MainGame): boolean {
        return context.cursors.left.isDown;
    }

    public isLaserKeyPressed(context: MainGame): boolean {
        return context.cursors.shift? context.cursors.shift.isDown : false;
    }
}

export class WasdKeysPlayer extends AbstractPlayer {
    public isUpPressed(context: MainGame): boolean {
        return context.keyW ? context.keyW.isDown : false;
    }

    public isRightPressed(context: MainGame): boolean {
        return context.keyD ? context.keyD.isDown : false;
    }

    public isDownPressed(context: MainGame): boolean {
        return context.keyS ? context.keyS.isDown : false;
    }

    public isLeftPressed(context: MainGame): boolean {
        return context.keyA ? context.keyA.isDown : false;
    }

    public isLaserKeyPressed(context: MainGame): boolean {
        return context.keyC ? context.keyC.isDown : false;
    }
}

export class PlayerBuilder extends DynamicObjectBuilder {
    protected objectInstance: AbstractPlayer;

    public constructor(arrowKeys: boolean) {
        super();
        if (arrowKeys) {
            this.objectInstance = new ArrowKeysPlayer();
        } else {
            this.objectInstance = new WasdKeysPlayer();
        }

        return this;
    }

    public withPhysics(physics: Physics.Arcade.ArcadePhysics) {
        this.addToPhysics(physics);
        this.objectInstance.sprite.setBounce(0);
        this.objectInstance.sprite.setCollideWorldBounds(true);

        return this;
    }
}