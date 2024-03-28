import { Boot } from './scenes/Boot';
import { MainGame } from './scenes/MainGame';
import { Preloader } from './scenes/Preloader';

import { Game, Types } from "phaser";
import { Dimensions } from './shared/constants';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

class GameObject extends Game {
    private static isInitialised: boolean = false;

    private constructor(config: Types.Core.GameConfig) {
        super(config);
    }

    public static create = (config: Types.Core.GameConfig): GameObject => {
        if (!this.isInitialised) {
            return new GameObject(config);
        }
        else {
            throw new Error("Element can only be initialised once");
        }
    }
}

const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: Dimensions.WIDTH,
    height: Dimensions.HEIGHT,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x: 0, y: Dimensions.HEIGHT * 1.25},
            debug: false
        }
    },
    scene: [
        Boot,
        Preloader,
        MainGame
    ]
};

export default GameObject.create(config);
