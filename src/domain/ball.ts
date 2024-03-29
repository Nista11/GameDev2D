import { MainGame } from "../scenes/MainGame";
import { Assets, Dimensions } from "../shared/constants";
import { DynamicObject, DynamicObjectBuilder } from "./dynamicObject";

export class Ball extends DynamicObject {
    public currentLocation: Assets.PINK_PLAYER | Assets.BLUE_PLAYER;
    public timeSinceInCurrentLocation: number;
    public timeSinceLastTintChange = 0;
    public currentTint = 0xffffff;
    public static timeSinceLastTintChangeLimit = 1000;

    constructor() {
        super();
    }

    public update(context: MainGame) {
        this.checkUpdateCurrentLocation();
        this.checkUpdateTint(context);
        this.updateColor();
    }

    public checkUpdateCurrentLocation() {
        const current = this.getCurrentLocation();
        if (current !== this.currentLocation) {
            this.currentLocation = current;
            this.currentTint = 0xffffff;
            this.timeSinceInCurrentLocation = Date.now();
        }
    }

    public checkUpdateTint(context: MainGame) {
        if (Date.now() - this.timeSinceLastTintChange > Ball.timeSinceLastTintChangeLimit) {
            if (this.currentTint - 0x001111 < 0xff0000) {
                context.addScore();
                context.resetAfterScore();
            } else {
                this.currentTint -= 0x001111;
                this.timeSinceLastTintChange = Date.now();
            }
        }
    }

    public updateColor() {
        this.sprite.setTint(this.currentTint);
        this.sprite.tintFill = false;
    }

    public getCurrentLocation(): Assets.PINK_PLAYER | Assets.BLUE_PLAYER {
        if (this.sprite.x < Dimensions.WIDTH / 2) {
            return Assets.PINK_PLAYER;
        } 

        return Assets.BLUE_PLAYER;
    }

    public reset() {
        super.reset();
        this.sprite.x = Math.floor(Math.random() * Dimensions.WIDTH);
        this.timeSinceInCurrentLocation = 0;
        this.timeSinceLastTintChange = 0;
        this.currentTint = 0xffffff;
    }
}

export class BallBuilder extends DynamicObjectBuilder {
    protected objectInstance: Ball;

    constructor() {
        super();
        this.objectInstance = new Ball();
    }

    public withPhysics(physics: Phaser.Physics.Arcade.ArcadePhysics): this {
        this.addToPhysics(physics);
        this.objectInstance.sprite.setBounce(0.9);
        this.objectInstance.sprite.setCollideWorldBounds(true);
        this.objectInstance.sprite.setVelocity(0);

        return this;
    }
}