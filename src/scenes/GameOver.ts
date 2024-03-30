import { Scene } from "phaser";
import { Assets, Dimensions } from "../shared/constants";

export class GameOver extends Scene {
    text: any;
    winner: Assets.PINK_PLAYER | Assets.BLUE_PLAYER;
    keyR: Phaser.Input.Keyboard.Key | undefined;
    background: Phaser.GameObjects.Image;
    playerSprite: Phaser.GameObjects.Sprite;
    crown: Phaser.GameObjects.Image;
    victorySound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

    constructor() {
        super('GameOver');
    }

    init(data: any) {
        if (data.firstPlayerWon) {
            this.winner = Assets.PINK_PLAYER;
        } else {
            this.winner = Assets.BLUE_PLAYER;
        }
    }

    create() {
        this.victorySound = this.sound.add('victory');
        this.victorySound.play();
        this.background = this.add.image(Dimensions.WIDTH / 2, Dimensions.HEIGHT / 2, Assets.GAME_OVER_BACKGROUND)
            .setSize(Dimensions.WIDTH, Dimensions.HEIGHT);
        this.playerSprite = this.add.sprite(Dimensions.WIDTH / 2, Dimensions.HEIGHT / 2, this.winner);
        this.playerSprite.anims.play(`${this.winner}_turn`, true);
        this.crown = this.add.sprite(Dimensions.WIDTH / 2, Dimensions.HEIGHT / 2 - 16, Assets.CROWN).setScale(.055);
        this.text = this.add.text(325, 200, `${this.winner === Assets.PINK_PLAYER ? 'First' : 'Second'} player won!\nPress R to restart`);
        this.keyR = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update() {
        if (this.keyR?.isDown) {
            this.victorySound.stop();
            this.scene.start('MainGame');
        }
    }
}