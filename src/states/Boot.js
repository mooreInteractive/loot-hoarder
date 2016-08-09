import Phaser from 'phaser';
import WebFont from 'webfontloader';

export default class extends Phaser.State {
    init () {
        this.stage.backgroundColor = '#CDCDCD';
        this.fontsReady = false;
        this.fontsLoaded = this.fontsLoaded.bind(this);
    }

    preload () {
        //set up game scale, and resize function
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.OnResizeCalled();

        WebFont.load({
            google: {
                families: ['Oswald']
            },
            active: this.fontsLoaded
        });

        let text = this.add.text(this.world.centerX, this.world.centerY+25, 'loading fonts', { font: '28px Tahoma', fill: '#000000', align: 'center' });
        text.anchor.setTo(0.5, 0.5);

        text.text = 'loading images';

        this.load.image('loaderBg', './assets/images/loader-bg.png');
        this.load.image('loaderBar', './assets/images/loader-bar.png');

        //Button Backgrounds
        this.load.image('blueButton', './assets/images/blue_button00.png');
        this.load.image('greenButton', './assets/images/green_button00.png');
        this.load.image('greyButton', './assets/images/grey_button00.png');
        this.load.image('yellowButton', './assets/images/yellow_button00.png');
        this.load.image('redButton', './assets/images/red_button00.png');
        this.load.image('optionsBanner', './assets/images/options_banner.png');

        //weapons
        this.load.image('shank0', './assets/images/items/shank.png');
        this.load.image('spear0', './assets/images/items/spear.png');
        this.load.image('shield3', './assets/images/items/shield.png');
        this.load.image('sword2', './assets/images/items/sword.png');
        this.load.image('axe0', './assets/images/items/axe.png');
        this.load.image('bow0', './assets/images/items/bow.png');
        this.load.image('redRing', './assets/images/items/ring.png');

        //terrain
        this.load.spritesheet('water', './assets/images/terrain/water.png', 32, 32);
        this.load.spritesheet('chesslike', './assets/images/terrain/chesslike.png', 138, 156);
        this.load.image('island', './assets/images/terrain/island.png');

        this.game.load.spritesheet('mob1', './assets/images/mobs/goo.png', 96, 144);

        this.game.load.spritesheet('walkingMan', './assets/images/tanned.png', 64, 64);
    }

    render () {
        if (this.fontsReady) {
            this.state.start('Splash');
        }
    }

    fontsLoaded () {
        this.fontsReady = true;
    }

}
