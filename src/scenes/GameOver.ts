import { Scene } from "phaser";

export class GameOver extends Scene {
    text: any;
    firstPlayerWon: boolean;
    keyR: Phaser.Input.Keyboard.Key | undefined;

    constructor() {
        super('GameOver');
    }

    init(data: any) {
        this.firstPlayerWon = data.firstPlayerWon;
    }

    create() {
       this.text = this.add.text(200, 200, `Game over! ${this.firstPlayerWon ? 'First' : 'Second'} player won!\nPress R to restart`);
       this.keyR = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update() {
        if (this.keyR?.isDown) {
            this.scene.start('MainGame');
        }
    }
}