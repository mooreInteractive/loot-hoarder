import Phaser from 'phaser';

export default class extends Phaser.State {
    init () {}

    preload () {
        this.loaderBg = this.add.sprite(this.game.world.centerX - 150, this.game.world.centerY, 'loaderBg');
        this.loaderBar = this.add.sprite(this.game.world.centerX - 145, this.game.world.centerY+5, 'loaderBar');
        let text = this.add.text(this.world.centerX, this.world.centerY+45, 'loading graphics', { font: '28px Tahoma', fill: '#000000', align: 'center' });
        text.anchor.setTo(0.5, 0.5);

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
        this.load.image('blueRing', './assets/images/items/blue_ring.png');
        this.load.image('purpleRing', './assets/images/items/purple_ring.png');
        this.load.image('pinkRing', './assets/images/items/pink_ring.png');

        //terrain
        this.load.spritesheet('water', './assets/images/terrain/water.png', 32, 32);
        this.load.spritesheet('chesslike', './assets/images/terrain/chesslike.png', 138, 156);
        this.load.image('island', './assets/images/terrain/island.png');

        //Mobs
        this.game.load.spritesheet('goo', './assets/images/mobs/goo.png', 96, 144);
        this.game.load.spritesheet('whisper', './assets/images/mobs/whisper.png', 96, 144);
        this.game.load.spritesheet('goon', './assets/images/mobs/goon.png', 144, 192);
        this.game.load.spritesheet('antler', './assets/images/mobs/antler.png', 96, 192);
        this.game.load.spritesheet('artichoke', './assets/images/mobs/artichoke.png',96, 192);
        this.game.load.spritesheet('blood_skull', './assets/images/mobs/blood_skull.png', 144, 192);
        this.game.load.spritesheet('hand', './assets/images/mobs/hand.png', 192, 192);
        this.game.load.spritesheet('moss', './assets/images/mobs/moss.png', 192, 192);
        this.game.load.spritesheet('skelly', './assets/images/mobs/skelly.png', 96, 144);
        this.game.load.spritesheet('wraith', './assets/images/mobs/wraith.png', 192, 192);

        this.game.load.spritesheet('walkingMan', './assets/images/tanned.png', 64, 64);

        this.game.load.onFileComplete.add(this.fileComplete, this);
    }

    fileComplete(progress) {
        this.loaderBar.scale.x = progress/100;
        if(progress == 100){
            this.state.start('Game');
        }
    }


}
