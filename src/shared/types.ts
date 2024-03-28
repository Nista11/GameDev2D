import { Physics, Types } from "phaser";
import { Assets } from "./constants";

export class Player {
    public startX: number;
    public startY: number;
    public asset: Assets;
    public sprite: Types.Physics.Arcade.SpriteWithDynamicBody;
}

export class PlayerBuilder {
    private playerInstance: Player;

    public constructor() {
        this.playerInstance = new Player();
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
        return this;
    }

    public build(): Player {
        return this.playerInstance;
    }
}