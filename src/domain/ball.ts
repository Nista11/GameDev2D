import { MainGame } from "../scenes/MainGame";
import { Assets, Dimensions } from "../shared/constants";
import { DynamicObject, DynamicObjectBuilder } from "./dynamicObject";

export class Ball extends DynamicObject {
    public currentLocation: Assets.PINK_PLAYER | Assets.BLUE_PLAYER;
    public timeSinceInCurrentLocation: number;
    public timeSinceLastTintChange = 0;
    public currentAnimation = 0;
    public static timeSinceLastTintChangeLimit = 1000;

    constructor() {
        super();
    }

    public update(context: MainGame) {
        this.checkUpdateCurrentLocation(context);
        this.checkUpdateAnimation(context);
        this.updateAnimation();
    }

    public checkUpdateCurrentLocation(context: MainGame) {
        const current = this.getCurrentLocation();
        if (current !== this.currentLocation) {
            if (this.currentLocation) {
                context.backwardsSound.play();
            }
            this.currentLocation = current;
            this.currentAnimation = 0;
            this.timeSinceInCurrentLocation = Date.now();
        }
    }

    public checkUpdateAnimation(context: MainGame) {
        if (Date.now() - this.timeSinceLastTintChange > Ball.timeSinceLastTintChangeLimit) {
            if (this.currentAnimation == 9) {
                context.explosionSound.play();
                context.showExplosion();
                context.addScore();
                context.resetAfterScore();
            } else {
                this.currentAnimation++;
                this.timeSinceLastTintChange = Date.now();
            }
        }
    }

    public updateAnimation() {
        this.sprite.anims.play(`ball_${this.currentAnimation}`);
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
        this.currentAnimation = 0;
        this.currentLocation = this.getCurrentLocation();
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