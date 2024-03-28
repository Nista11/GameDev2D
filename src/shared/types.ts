import { Physics, Scene, Types } from "phaser";
import { Assets } from "./constants";
import { MainGame } from "../scenes/MainGame";

export abstract class AbstractPlayer {
    public startX: number;
    public startY: number;
    public asset: Assets;
    public sprite: Types.Physics.Arcade.SpriteWithDynamicBody;

    public abstract isUpPressed(context: MainGame): boolean;
    public abstract isRightPressed(context: MainGame): boolean;
    public abstract isDownPressed(context: MainGame): boolean;
    public abstract isLeftPressed(context: MainGame): boolean;

    public update(context: MainGame): void {
        const speed = 200;

        if (this.isLeftPressed(context))
        {
            this.sprite.setVelocityX(-speed);
            this.sprite.anims.play(`${this.asset}_left`, true);
        }
        else if (this.isRightPressed(context))
        {
            this.sprite.setVelocityX(speed);
            this.sprite.play(`${this.asset}_right`, true);
        }
        else
        {
            this.sprite.setVelocityX(0);
            this.sprite.anims.play(`${this.asset}_turn`);
        }

        if (this.isUpPressed(context) && this.sprite.body.touching.down)
        {
            this.sprite.setVelocityY(-speed * 2);
        }
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
}

export class PlayerBuilder {
    private playerInstance: AbstractPlayer;

    public constructor(arrowKeys: boolean) {
        if (arrowKeys) {
            this.playerInstance = new ArrowKeysPlayer();
        }
        else {
            this.playerInstance = new WasdKeysPlayer();
        }
        return this;
    }

    public startX(startX: number) {
        this.playerInstance.startX = startX;
        return this;
    }

    public startY(startY: number) {
        this.playerInstance.startY = startY;
        return this;
    }

    public asset(asset: Assets) {
        this.playerInstance.asset = asset;
        return this;
    }

    public withPhysics(physics: Physics.Arcade.ArcadePhysics) {
        this.playerInstance.sprite = physics.add.sprite(
            this.playerInstance.startX, 
            this.playerInstance.startY, 
            this.playerInstance.asset.toString());
        this.playerInstance.sprite.setBounce(0);
        this.playerInstance.sprite.setCollideWorldBounds(true);
        return this;
    }

    public build(): AbstractPlayer {
        return this.playerInstance;
    }
}