import Phaser from 'phaser';
// import * as utils from '../utils';
import MainNavigation from '../components/MainNavigation';
import Avatar from '../components/Avatar';
import strSlice from '../data/skillTree';

export default class extends Phaser.State {
    constructor(){
        super();
    }

    init () {
        this.skillSprites = [];
    }

    preload () {
        this.add.image(0,0,'inv_bg');
        this.currentDungeon = this.game.dungeons[this.game.player.currentDungeon];

        //let Pixel24Black = {font: 'Press Start 2P', fontSize: 36, fill: '#000000' };
        // let Pixel24White = {font: 'Press Start 2P', fontSize: 36, fill: '#898989' };
        // let Pixel36Blue = {font: 'Press Start 2P', fontSize: 42, fill: '#527ee5' };
        // let Pixel16White = {font: 'Press Start 2P', fontSize: 16, fill: '#FFFFFF' };
    }

    create () {
        this.mainNav = new MainNavigation(this.game, this, this.currentDungeon);

        //Avatar
        let avatarSettings = {x: -200, y: -200, scale: 0.1};
        let hpSettings = {x: 203, y: this.game.world.height - 160};
        this.avatar = new Avatar(this.game, this, avatarSettings, hpSettings, true, true); //Need to call avatar.update()

        this.addStrengthButtons();
    }

    addStrengthButtons(){
        console.log('srength skills:', strSlice);

        strSlice.forEach((skillItem) => {
            let btnWidth = skillItem.type === 'attr' ? 35 : 50;
            let bmd = this.game.add.bitmapData(btnWidth, btnWidth);
            bmd.ctx.beginPath();
            bmd.circle(btnWidth/2, btnWidth/2, btnWidth/2);
            bmd.ctx.fillStyle = '#000000';

            bmd.ctx.fill();
            let skillBtn = this.game.add.sprite(skillItem.x, skillItem.y*2, bmd);
            skillBtn.inputEnabled = true;

            skillBtn.events.onInputDown.add((sprite) => {
                console.log('skillBtn pressed:', sprite, skillItem);
            }, this);
        });
    }

    update(){
        this.avatar.update();
        this.mainNav.update(this.currentDungeon);
    }

}
