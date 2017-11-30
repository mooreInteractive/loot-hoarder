import Phaser from 'phaser';
// import * as utils from '../utils';
import MainNavigation from '../components/MainNavigation';
import Avatar from '../components/Avatar';
import strSlice from '../data/skillTree';

export default class extends Phaser.State {
    constructor(){
        super();
        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
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
        this.addRotationButtons();
    }

    addRotationButtons(){
        let leftButton = new Phaser.Button(this.game, 100, this.game.world.centerY, 'rot_left', this.rotateLeft, this);
        let rightButton = new Phaser.Button(this.game, this.game.world.width - 100, this.game.world.centerY, 'rot_right', this.rotateRight, this);

        leftButton.anchor.setTo(0.5);
        this.add.existing(leftButton);
        rightButton.anchor.setTo(0.5);
        this.add.existing(rightButton);
    }

    rotateLeft(){
        console.log('rotate left');
    }
    rotateRight(){
        console.log('rotate right');
    }

    addStrengthButtons(){
        console.log('srength skills:', strSlice);

        strSlice.forEach((skillItem) => {
            let btnSprite = skillItem.type === 'attr' ? 'attr_button' : 'skill_button';
            let debug = true;
            let skillBtn;
            if(debug){
                //sprite for dragging/debugging
                skillBtn = this.game.add.sprite(skillItem.x, skillItem.y*2, btnSprite);
                skillBtn.inputEnabled = true;
                skillBtn.input.enableDrag();
                skillBtn.events.onDragStop.add((sprite) => {
                    this.stopDrag(sprite);
                }, this);
                skillBtn.events.onDragStart.add(function(sprite){
                    this.startDrag(sprite);
                }, this);
            } else {
                //button for real
                skillBtn = new Phaser.Button(this.game, skillItem.x, skillItem.y*2, btnSprite, this.showSkillDetail.bind(this, skillItem), this);
            }
            if(this.game.player.skills.length === 0 && !skillItem.introSkill){
                skillBtn.tint = 0.1 * 0x010101;
            }
            skillBtn.anchor.setTo(0.5);
            this.add.existing(skillBtn);
        });
    }
    showSkillDetail(skill){
        console.log('clicked skill:', skill);
    }

    startDrag(sprite){
        this.currentSprint = sprite;
    }
    stopDrag(sprite){
        console.log('stopped dragging this sprite to:', sprite.position);
    }

    update(){
        this.avatar.update();
        this.mainNav.update(this.currentDungeon);
    }

}
