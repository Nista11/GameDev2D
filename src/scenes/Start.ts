import { Scene } from "phaser";
import { Assets, Dimensions } from "../shared/constants";

export class Start extends Scene {
    background: Phaser.GameObjects.Image;
    text: any;
    firstControlsText: any;
    secondControlsText: any;
    keyEnter: Phaser.Input.Keyboard.Key | undefined;
    firstPlayerSprite: Phaser.GameObjects.Sprite;
    secondPlayerSprite: Phaser.GameObjects.Sprite;


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
        this.firstPlayerSprite = this.add.sprite(300, 383, Assets.PINK_PLAYER);
        this.secondPlayerSprite = this.add.sprite(405, 383, Assets.BLUE_PLAYER);


        [Assets.PINK_PLAYER, Assets.BLUE_PLAYER].forEach(asset => 
            this.anims.create({
                key: `${asset}_turn`,
                frames: [ { key: asset, frame: 4 } ],
                frameRate: 20
            }));

        this.firstPlayerSprite.anims.play(`${Assets.PINK_PLAYER}_turn`, true);
        this.secondPlayerSprite.anims.play(`${Assets.BLUE_PLAYER}_turn`, true);

        this.firstControlsText = this.add.text(
            250, 
            340, 
            `WAD+C`,
            { fontSize: '24px', color: '#000' });

        this.secondControlsText = this.add.text(
            390, 
            340, 
            `Arrow keys+shift`,
            { fontSize: '24px', color: '#000' });

        this.keyEnter = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }
    
    update() {
        if (this.keyEnter?.isDown) {
            this.scene.start('MainGame');
        }
    }
}