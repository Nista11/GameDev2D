import { Scene, Types } from "phaser";
import { Assets, Dimensions } from "../shared/constants";

export class Start extends Scene {
    background: Phaser.GameObjects.Image;
    text: any;
    keyEnter: Phaser.Input.Keyboard.Key | undefined;

    constructor() {
        super('Start');
    }

    create() {
        this.background = this.add.image(Dimensions.WIDTH / 2, Dimensions.HEIGHT / 2, Assets.SKY);
        this.text = this.add.text(
            220, 
            195, 
            `Press enter to start the game`,
            { fontSize: '24px', color: '#000' });
        this.keyEnter = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }
    
    update() {
        if (this.keyEnter?.isDown) {
            this.scene.start('MainGame');
        }
    }
}