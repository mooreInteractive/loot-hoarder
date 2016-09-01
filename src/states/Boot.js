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
                families: ['Oswald', 'Press Start 2P', 'Musketeer']
            },
            active: this.fontsLoaded
        });

        let text = this.add.text(this.world.centerX, this.world.centerY+25, 'loading fonts', { font: '28px Tahoma', fill: '#000000', align: 'center' });
        text.anchor.setTo(0.5, 0.5);

        this.load.image('loaderBg', './assets/images/loader-bg.png');
        this.load.image('loaderBar', './assets/images/loader-bar.png');
    }


    render () {
        if (this.fontsReady) {
            this.state.start('Loading');
        }
    }

    fontsLoaded () {
        this.fontsReady = true;
    }

}
