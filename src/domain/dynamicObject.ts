import { Physics, Types } from "phaser";
import { Assets } from "../shared/constants";

export abstract class DynamicObject {
    public startX: number;
    public startY: number;
    public asset: Assets;
    public sprite: Types.Physics.Arcade.SpriteWithDynamicBody;
}

export abstract class DynamicObjectBuilder {
    protected abstract objectInstance: DynamicObject;

    public startX(startX: number) {
        this.objectInstance.startX = startX;
        return this;
    }

    public startY(startY: number) {
        this.objectInstance.startY = startY;
        return this;
    }

    public asset(asset: Assets) {
        this.objectInstance.asset = asset;
        return this;
    }

    public abstract withPhysics(physics: Physics.Arcade.ArcadePhysics): this;

    protected addToPhysics(physics: Physics.Arcade.ArcadePhysics): void {
        this.objectInstance.sprite = physics.add.sprite(
            this.objectInstance.startX, 
            this.objectInstance.startY, 
            this.objectInstance.asset.toString());
    }

    public build(): DynamicObject {
        return this.objectInstance;
    }
}