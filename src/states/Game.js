import Phaser from 'phaser';
import randomColor from 'randomcolor';
import Avatar from '../components/Avatar';

export default class extends Phaser.State {
    init () {
        this.frameCount = 0;
    }
    preload () {}

    create () {
        this.createMap();

        //Avatar
        let avatarSettings = {x: this.game.world.centerX, y: this.game.world.centerY + 50, scale: 6};
        this.avatar = new Avatar(this.game, this, avatarSettings); //Need to call avatar.update() and avatar.render()
        this.avatar.healthBarBg.visible = false;
        this.avatar.healthBar.visible = false;
        this.avatar.healthText.visible = false;

        //Play Button
        this.playBtn = new Phaser.Button(this.game, this.game.world.centerX, this.game.world.centerY+300, 'blueButton', this.playClicked, this);
        this.playBtn.scale.setTo(2);
        this.playBtn.anchor.setTo(0.5);

        this.game.add.existing(this.playBtn);

        //Title Text
        let titleStyle = {font: 'Press Start 2P', fontSize: 48, fill: '#1313CD'};
        this.title = this.add.text(this.game.world.centerX - 110, 170, 'LOOT\nHOARDER', titleStyle);
        this.title.anchor.setTo(0.5);


        let playStyle = {font: 'Press Start 2P', fontSize: 40, fill: '#111111'};
        this.banner = this.add.text(this.game.world.centerX, this.game.world.centerY+300, 'Play', playStyle);
        this.banner.anchor.setTo(0.5);
        this.banner.inputEnabled = true;
        this.banner.events.onInputDown.add(this.playClicked, this);
        this.banner.input.useHandCursor = true;

    }

    createMap(){
        //MAP
        //this.waterBg = this.game.add.sprite(0, 0, 'water');
        this.water = this.add.tileSprite(0, 0, 32 * 6, 32 * 9, 'water');
        this.water.scale.setTo(4,4);
        this.water.animations.add('flow', null, 4, true);
        this.water.animations.play('flow');

        this.island = this.game.add.image(0,0,'island');

    }

    update(){
        this.avatar.update();

        this.frameCount += 1;
        if(this.frameCount%5 == 0){
            this.title.fill = randomColor({luminosity: 'dark', hue: 'yellow'});
        }
    }

    render () {

    }

    playClicked(){
        console.log(Phaser.Easing);
        this.add.tween(this.playBtn).to( { x: this.game.world.width + 300 }, 500, Phaser.Easing.Back.In, true);
        this.add.tween(this.banner).to( { x: this.game.world.width + 300 }, 500, Phaser.Easing.Back.In, true);

        let avatarSettings = {x: this.game.world.centerX, y: this.game.world.centerY, scale: 0};
        this.avatar.moveToAtScale(avatarSettings, null, 500, () => {this.state.start('MainMenu');});

    }
}
