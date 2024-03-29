import { DynamicObject, DynamicObjectBuilder } from "./dynamicObject";

export class Ball extends DynamicObject {
    
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