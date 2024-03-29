import { Scene } from 'phaser';
import { Assets } from '../shared/constants';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, Assets.SKY);

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image(Assets.GROUND, 'platform.png');
        
        this.load.image(Assets.NET, 'net.png');

        this.load.image(Assets.PINK_LASER, 'pink_laser.png');
        
        this.load.image(Assets.BLUE_LASER, 'blue_laser.png');

        this.load.image(Assets.HEART, 'heart.png');

        this.load.spritesheet(Assets.BALL, 'bomb_sprite_combined.png', {
            frameWidth: 42,
            frameHeight: 42
        });

        this.load.spritesheet(Assets.PINK_PLAYER, 'pink_player.png', {
            frameWidth: 31.33,
            frameHeight: 42
        });

        this.load.spritesheet(Assets.BLUE_PLAYER, 'blue_player.png', {
            frameWidth: 31.33,
            frameHeight: 42
        });

        this.load.audio('laser', ['laser-gun.mp3']);
        this.load.audio('hurt', ['hurt_c_08.mp3']);
        this.load.audio('explosion', ['explosion.mp3']);
        this.load.audio('backwards', ['backwards_trimmed.mp3']);
        this.load.audio('space_invaders', ['space_invaders_song.ogg']);
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainGame');
    }
}
