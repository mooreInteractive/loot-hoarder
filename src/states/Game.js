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
        let avatarSettings = {x: this.game.world.centerX, y: this.game.world.centerY + 50, scale: 3};
        this.avatar = new Avatar(this.game, this, avatarSettings, undefined, true, false); //Need to call avatar.update() and avatar.render()
        this.avatar.charBg.visible = false;
        this.avatar.healthBar.visible = false;
        this.avatar.magicFX.visible = false;
        this.avatar.magicFXText.visible = false;
        this.avatar.healthText.visible = false;
        this.avatar.expBar.visible = false;
        this.avatar.levelIconBg.visible = false;
        this.avatar.levelText.visible = false;

        //Play Button
        this.playBtn = new Phaser.Button(this.game, this.game.world.centerX, this.game.world.centerY+350, 'redButton', this.playClicked, this);
        this.playBtn.scale.setTo(2);
        this.playBtn.anchor.setTo(0.5);

        this.game.add.existing(this.playBtn);

        //Title Text
        let titleStyle = {font: '104px Musketeer', fill: '#FFFF00', align: 'center'};
        this.title = this.add.text(this.game.world.centerX, 250, 'MOORE\'S\nLEWT', titleStyle);
        this.title.anchor.setTo(0.5);
        this.title.stroke = '#000000';
        this.title.strokeThickness = 12;


        let playStyle = {font: '42px Press Start 2P', fill: '#111111'};
        let playType = this.game.player.exp > 0 ? 'Continue' : 'New Game';
        this.banner = this.add.text(this.game.world.centerX, this.game.world.centerY+350, playType, playStyle);
        this.banner.anchor.setTo(0.5);
        this.banner.inputEnabled = true;
        this.banner.events.onInputDown.add(this.playClicked, this);
        this.banner.input.useHandCursor = true;

    }

    createMap(){
        this.island = this.game.add.image(0,0,'island');
        this.island.scale.setTo(2,2);
    }

    update(){

        this.frameCount += 1;
        if(this.frameCount%5 == 0){
            this.title.fill = randomColor({luminosity: 'dark', hue: 'yellow'});
        }

        if(this.frameCount%36 == 0){
            if(this.game.player.exp > 0){
                this.avatar.update();
            } else {
                this.avatar.fakeUpdate();
            }
        }
    }

    playClicked(){
        console.log(Phaser.Easing);
        this.add.tween(this.playBtn).to( { x: this.game.world.width + 300 }, 500, Phaser.Easing.Back.In, true);
        this.add.tween(this.banner).to( { x: this.game.world.width + 300 }, 500, Phaser.Easing.Back.In, true);

        let avatarSettings = {x: this.game.world.centerX, y: this.game.world.centerY, scale: 0};
        this.avatar.moveToAtScale(avatarSettings, null, 500, () => {this.state.start('MainMenu');});

        this.game.music = this.game.add.audio('heathfield_music');
        this.game.music.loopFull();
        let savedMute = false;
        if(localStorage){
            let mute = localStorage.getItem('loot-hoarder-music');
            if(mute != null){
                if(mute == 'true'){
                    savedMute = true;
                }
            }
        }
        this.game.music.play();
        if(savedMute){
            this.game.music.mute = true;
        }
    }
}
