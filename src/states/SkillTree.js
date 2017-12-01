import Phaser from 'phaser';
// import * as utils from '../utils';
import Dialogue from '../components/Dialogue';
import MainNavigation from '../components/MainNavigation';
import Avatar from '../components/Avatar';
import strSlice from '../data/skillTree';

export default class extends Phaser.State {
    constructor(){
        super();
        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        this.skills = strSlice.slice(0);
    }

    init () {
        this.skillSprites = [];
        this.currentRotation = 0;
        this.wheelRotationSettings = [0, 45, 90, 135, 180, 225, 270, 315];
    }

    preload () {
        this.currentDungeon = this.game.dungeons[this.game.player.currentDungeon];

        // let Pixel24Black = {font: 'Press Start 2P', fontSize: 36, fill: '#000000' };
        // let Pixel24White = {font: 'Press Start 2P', fontSize: 36, fill: '#898989' };
        // let Pixel36Blue = {font: 'Press Start 2P', fontSize: 42, fill: '#527ee5' };
        // let Pixel16White = {font: 'Press Start 2P', fontSize: 16, fill: '#FFFFFF' };
    }

    create () {
        this.skillWheel = this.game.add.group();
        this.skillWheel.position.setTo(this.game.world.centerX, this.game.world.centerY+100);
        let wheelBg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY+100, 'skill_wheel');
        wheelBg.anchor.setTo(0.5);
        this.skillWheel.add(wheelBg);

        this.mainNav = new MainNavigation(this.game, this, this.currentDungeon);

        //Avatar
        let avatarSettings = {x: -200, y: -200, scale: 0.1};
        let hpSettings = {x: 203, y: this.game.world.height - 160};
        this.avatar = new Avatar(this.game, this, avatarSettings, hpSettings, true, true); //Need to call avatar.update()

        this.addStrengthButtons();
        this.addRotationButtons();

        this.skillWheel.pivot.x = this.game.world.centerX;
        this.skillWheel.pivot.y = this.game.world.centerY+100;
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
        this.currentRotation -= 1;
        if(this.currentRotation == -1){ this.skillWheel.angle = 360; this.currentRotation = 7; }
        this.rotateWheel(this.wheelRotationSettings[this.currentRotation]);
    }
    rotateRight(){
        this.currentRotation += 1;
        if(this.currentRotation == 8){ this.skillWheel.angle = -45; this.currentRotation = 0; }
        this.rotateWheel(this.wheelRotationSettings[this.currentRotation]);
    }

    rotateWheel(rotateTo){
        this.add.tween(this.skillWheel).to( { angle: rotateTo }, 500, Phaser.Easing.Bounce.Out, true);
    }

    addStrengthButtons(){
        console.log('srength skills:', this.skills);
        console.log('player skills:', this.game.player.skills.length);

        this.skills.forEach((skillItem, index) => {
            let btnSprite = skillItem.type === 'attr' ? 'attr_button' : 'skill_button';
            let debug = false;
            let skillBtn;
            if(debug){
                //sprite for dragging/debugging
                skillBtn = this.game.add.sprite(skillItem.x, skillItem.y, btnSprite);
                let scale = skillItem.type === 'attr' ? 1 : 0.75;
                skillBtn.scale.setTo(scale);
                skillBtn.inputEnabled = true;
                skillBtn.input.enableDrag();
                skillBtn.events.onDragStop.add((sprite) => {
                    this.updateSkillAvailability();
                    this.stopDrag(sprite, index);
                }, this);
                skillBtn.events.onDragStart.add(function(sprite){
                    this.startDrag(sprite);
                }, this);
            } else {
                //button for real
                skillBtn = new Phaser.Button(this.game, skillItem.x, skillItem.y, btnSprite, this.showSkillDetail.bind(this, skillItem), this);
            }
            if(this.game.player.skills.length === 0 && !skillItem.introSkill){
                skillBtn.tint = 0.1 * 0x010101;
            }
            skillBtn.anchor.setTo(0.5);
            this.skillWheel.add(skillBtn);
            skillItem.sprite = skillBtn;
        });
    }

    updateSkillAvailability(){
        this.skills.forEach((skillItem) => {
            if(skillItem.sprite){
                //update first time use
                if(this.game.player.skills.length === 0 && !skillItem.introSkill){
                    skillItem.sprite.tint = 0.1 * 0x010101;
                } else {
                    skillItem.sprite.tint = 0xFFFFFF;
                }
            }
        });
    }

    showSkillDetail(skill){
        console.log('clicked skill:', skill);
        let isSkill = skill.type === 'skill';
        let text = isSkill ? `Get skill: ${skill.name}?\n${skill.desc}` : `Get +1 ${skill.attr}?`;
        let attrIndex = isSkill ? 0 : (['str','dex','vit','wis']).indexOf(skill.attr);
        new Dialogue(this.game, this, 'bool', null, text, (reply)=>{
            if(reply === 'yes'){
                if(isSkill && this.game.player.skillPoints > 2){
                    this.game.player.addSkill(skill.name);
                } else if(!isSkill && this.game.player.skillPoints > 0){
                    this.game.player.skillUp(attrIndex);
                }
                this.updateSkillAvailability();
            }
        });
    }

    startDrag(sprite){
        this.currentSprint = sprite;
    }
    stopDrag(sprite, index){
        console.log('stopped dragging this sprite to:', sprite.position, index);
    }

    update(){
        this.avatar.update();
        this.mainNav.update(this.currentDungeon);
        // this.skillWheel.rotation += 0.01;
    }

}
