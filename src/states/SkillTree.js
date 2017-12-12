import Phaser from 'phaser';
// import * as utils from '../utils';
import Dialogue from '../components/Dialogue';
import MainNavigation from '../components/MainNavigation';
import Avatar from '../components/Avatar';
import skillSlices from '../data/skillTree';

export default class extends Phaser.State {
    constructor(){
        super();
        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        this.skills = skillSlices.slice(0);
        this.dropStoneCover = this.dropStoneCover.bind(this);

        this.debug = false;
    }

    init () {
        this.skillSprites = [];
        this.currentRotation = this.game.player.lastSkillWheelRotation;
        this.wheelRotationSettings = [0, 45, 90, 135, 180, 225, 270, 315];
        this.setSkillStates();
    }

    preload () {
        this.currentDungeon = this.game.dungeons[this.game.player.currentDungeon];

        this.Pixel36Black = {font: 'Press Start 2P', fontSize: 28, fill: '#000000' };
        this.Pixel24Black = {font: 'Press Start 2P', fontSize: 20, fill: '#000000' };
        // let Pixel24White = {font: 'Press Start 2P', fontSize: 36, fill: '#898989' };
        // let Pixel36Blue = {font: 'Press Start 2P', fontSize: 42, fill: '#527ee5' };
        this.Pixel16White = {font: 'Press Start 2P', fontSize: 42, fill: '#FFFFFF' };
        this.Pixel36Grey = {font: 'Press Start 2P', fontSize: 18, fill: '#CDCDCD' };
    }

    create () {
        this.skillWheel = this.game.add.group();
        this.skillWheel.position.setTo(this.game.world.centerX, this.game.world.centerY+100);
        if(!this.debug){
            this.coverPos = {x: this.game.world.centerX, y: this.game.world.centerY+100};
            this.stoneCover = this.game.add.sprite(this.game.world.centerX, -600, 'stone_cover');
            this.stoneCover.anchor.setTo(0.5);
        }
        let wheelSprite = this.debug ? 'skill_wheel_debug' : 'skill_wheel';
        let wheelBg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY+100, wheelSprite);
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

        this.setWheelRotation(this.wheelRotationSettings[this.currentRotation]);

        if(!this.game.player.story.chapter1.firstSkillTree){
            this.firstTimeAnimation();
        } else {
            if(this.stoneCover){
                this.stoneCover.position.y = this.coverPos.y;
                this.addPlayerStatLabels();
                if(this.game.player.skills.length === 0){
                    this.addFirstTimeSkillDetails();
                }
            }
        }

    }

    firstTimeAnimation(){
        this.game.player.story.chapter1.firstSkillTree = true;
        this.game.player.savePlayerData();
        let sliceNumber = this.rand(24,40);
        let randomStart = 45*sliceNumber;
        let startTween = this.add.tween(this.skillWheel).to( { angle: randomStart }, 3000, Phaser.Easing.Cubic.Out, true);
        setTimeout(this.dropStoneCover, 1000);
        startTween.onComplete.addOnce(()=>{
            this.skillWheel.angle = this.wheelRotationSettings[sliceNumber%8];
            this.currentRotation = sliceNumber%8;
            this.game.player.lastSkillWheelRotation = sliceNumber%8;
            this.game.player.savePlayerData();
            this.addPlayerStatLabels();
            this.addFirstTimeSkillDetails();
        });
    }

    dropStoneCover(){
        this.add.tween(this.stoneCover).to( { y: this.coverPos.y }, 1500, Phaser.Easing.Linear.Out, true);
    }

    addPlayerStatLabels(){
        if(!this.debug){
            this.hdLabel = this.add.text(434, 665, 'Hit die', this.Pixel36Grey);
            this.hdValue = this.add.text(600, 665, `1d${this.game.player.hitDie}`, this.Pixel36Grey);

            this.strLabel = this.add.text(135, 710, 'STR', this.Pixel16White);
            this.dexLabel = this.add.text(434, 710, 'DEX', this.Pixel16White);
            this.vitLabel = this.add.text(135, 770, 'VIT', this.Pixel16White);
            this.wisLabel = this.add.text(434, 770, 'WIS', this.Pixel16White);

            this.strValue = this.add.text(310, 710, this.game.player.battleStats.strength, this.Pixel16White);
            this.dexValue = this.add.text(609, 710, this.game.player.battleStats.dexterity, this.Pixel16White);
            this.vitValue = this.add.text(310, 770, this.game.player.battleStats.vitality, this.Pixel16White);
            this.wisValue = this.add.text(609, 770, this.game.player.battleStats.wisdom, this.Pixel16White);
        }
    }

    addFirstTimeSkillDetails(){
        let bgbmd = this.add.bitmapData(450, 330);
        bgbmd.ctx.beginPath();
        bgbmd.ctx.rect(0, 0, 450, 330);
        bgbmd.ctx.fillStyle = '#232323';
        bgbmd.ctx.fill();
        bgbmd.ctx.beginPath();
        bgbmd.ctx.rect(10, 10, 430, 310);
        bgbmd.ctx.fillStyle = '#CDCDCD';
        bgbmd.ctx.fill();

        this.initialSkillDetail = {};

        this.initialSkillDetail.bg = this.add.sprite(this.game.world.centerX, this.game.world.centerY-70, bgbmd);
        this.initialSkillDetail.bg.anchor.setTo(0.5);

        let skillDescStyle = Object.assign(this.Pixel24Black, {wordWrap: true, wordWrapWidth: 430, align: 'center'});
        let skillTitleStyle = Object.assign(this.Pixel36Black, {wordWrap: true, wordWrapWidth: 430, align: 'center'});
        let rot = this.currentRotation === 0 ? this.currentRotation : 8 - this.currentRotation;
        let skill = this.skills[(rot*19)+9];

        console.log('skill deats:', skill.title, skill.desc, skill);
        this.initialSkillDetail.title = this.add.text(this.game.world.centerX, this.game.world.centerY-205, skill.title, skillTitleStyle);
        this.initialSkillDetail.desc = this.add.text(this.game.world.centerX, this.game.world.centerY-135, skill.desc, skillDescStyle);
        this.initialSkillDetail.title.anchor.x = 0.5;
        this.initialSkillDetail.desc.anchor.x = 0.5;

        //button
        this.playBtn = new Phaser.Button(this.game, this.game.world.centerX, this.game.world.centerY+100, 'redButton', this.playClicked, this);
        this.playBtn.scale.setTo(2);
        this.playBtn.anchor.setTo(0.5);

        this.game.add.existing(this.playBtn);
        //button text
        let playStyle = {font: '32px Press Start 2P', fill: '#111111'};
        let playType = 'Start Here';
        this.getButton = this.add.text(this.game.world.centerX, this.game.world.centerY+100, playType, playStyle);
        this.getButton.anchor.setTo(0.5);
        this.getButton.inputEnabled = true;
        console.log('skill:', skill.title);
        this.getButton.events.onInputDown.add(() => {
            new Dialogue(this.game, this, 'bool', null, `Are you sure you want\n${skill.title}?`, (reply)=>{
                if(reply === 'yes'){
                    this.game.player.addSkill(skill.name);
                    this.game.player.skillPoints -= 1;
                    this.updateNeighborStates(skill);
                    this.updateSkillAvailability();
                    this.hideFirstTimeSkillDetails();
                    this.game.player.savePlayerData();
                }
            });
        }, this);
        this.getButton.input.useHandCursor = true;
    }

    updateFirstTimeSkillDetails(){
        if(this.initialSkillDetail){
            let rot = this.currentRotation === 0 ? this.currentRotation : 8 - this.currentRotation;
            let skill = this.skills[(rot*19)+9];
            this.initialSkillDetail.title.text = skill.title;
            this.initialSkillDetail.desc.text = skill.desc;
        }
    }

    hideFirstTimeSkillDetails(){
        this.initialSkillDetail.bg.destroy();
        this.initialSkillDetail.title.destroy();
        this.initialSkillDetail.desc.destroy();
        this.getButton.destroy();
        this.playBtn.destroy();

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
        this.currentRotation += 1;
        if(this.currentRotation == 8){ this.skillWheel.angle = -45; this.currentRotation = 0; }
        this.rotateWheel(this.wheelRotationSettings[this.currentRotation]);
        this.updateFirstTimeSkillDetails();
        this.game.player.lastSkillWheelRotation = this.currentRotation;
        this.game.player.savePlayerData();
    }
    rotateRight(){
        this.currentRotation -= 1;
        if(this.currentRotation == -1){ this.skillWheel.angle = 360; this.currentRotation = 7; }
        this.rotateWheel(this.wheelRotationSettings[this.currentRotation]);
        this.updateFirstTimeSkillDetails();
        this.game.player.lastSkillWheelRotation = this.currentRotation;
        this.game.player.savePlayerData();
    }

    setWheelRotation(rotateTo){
        this.skillWheel.angle = rotateTo;
        // this.skills.forEach(skill => {
        //     skill.sprite.rotation = (rotateTo*-1)+45;
        // });
    }

    rotateWheel(rotateTo){
        this.add.tween(this.skillWheel).to( { angle: rotateTo }, 500, Phaser.Easing.Bounce.Out, true);
        // this.skills.forEach(skill => {
        //     skill.sprite.rotation = (rotateTo*-1)+45;
        // });
    }

    addStrengthButtons(){
        // console.log('srength skills:', this.skills);
        // console.log('player skills:', this.game.player.skills.length);

        this.skills.forEach((skillItem, index) => {
            let btnAttrSprite = `attr_${skillItem.attr}`;
            let btnSprite = skillItem.type === 'attr' ? btnAttrSprite : 'skill_button';
            let skillBtn;
            if(this.debug){
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
            let firstSkillSet = this.game.player.skills.length === 0 && !skillItem.introSkill;
            if(firstSkillSet || skillItem.state === 0){
                skillBtn.tint = 0.1 * 0x010101;
            }
            skillBtn.anchor.setTo(0.5);
            this.skillWheel.add(skillBtn);
            skillItem.sprite = skillBtn;
        });
    }

    setSkillStates(){
        this.skills.forEach((skillItem, skillIndex) => {
            let sliceIndex = Math.floor(skillIndex/19);
            skillItem.state = 0;//locked
            if(skillItem.type === 'attr'){
                if(this.game.player.skillUps.includes(skillItem.index)){
                    skillItem.state = 2;
                } else {
                    skillItem.neighbors.forEach((neighbor) => {
                        if(typeof neighbor === 'number'){
                            let neighborSkill = this.skills[sliceIndex*19+neighbor];
                            if(neighborSkill.type === 'attr'){
                                if(this.game.player.skillUps.includes(neighborSkill.index)){
                                    skillItem.state = 1;
                                }
                            } else {
                                if(this.game.player.skills.includes(neighborSkill.name)){
                                    skillItem.state = 1;
                                }
                            }
                        } else {
                            let neighborSplit = neighbor.split('-');
                            let neighborType = neighborSplit[0];
                            let neighborIndex = parseInt(neighborSplit[1]);
                            let nextSlice;
                            if(neighborType === 'n'){
                                nextSlice = sliceIndex === 7 ? 0 : sliceIndex + 1;
                            } else {
                                nextSlice = sliceIndex === 0 ? 7 : sliceIndex - 1;
                            }
                            if(this.game.player.skillUps.includes(this.skills[nextSlice*19+neighborIndex].index)){
                                skillItem.state = 1;
                            }
                        }
                    });
                }
            } else {//skill
                if(this.game.player.skills.includes(skillItem.name)){
                    skillItem.state = 2;
                } else {
                    let learnedNeighbor = false;
                    skillItem.neighbors.forEach((neighbor) => {
                        if(this.game.player.skillUps.includes(this.skills[sliceIndex*19+neighbor].index)){
                            learnedNeighbor = true;
                        }
                    });
                    if(skillItem.introSkill || learnedNeighbor){
                        skillItem.state = 1;
                    }
                }
            }
        });
    }

    updateNeighborStates(skill){
        skill.state = 2;
        let skillIndex = this.skills.indexOf(skill);
        let sliceIndex = Math.floor(skillIndex/19);
        skill.neighbors.forEach(neighbor => {
            if(typeof neighbor === 'number'){
                // console.log('neighbors:', sliceIndex*19+neighbor, this.skills[sliceIndex*19+neighbor]);
                this.skills[sliceIndex*19+neighbor].state = 1;
            } else {
                let neighborSplit = neighbor.split('-');
                let neighborType = neighborSplit[0];
                let neighborIndex = parseInt(neighborSplit[1]);
                let nextSlice;
                if(neighborType === 'n'){
                    nextSlice = sliceIndex === 7 ? 0 : sliceIndex + 1;
                } else {
                    nextSlice = sliceIndex === 0 ? 7 : sliceIndex - 1;
                }
                this.skills[nextSlice*19+neighborIndex].state = 1;
            }

        });
    }

    updateSkillAvailability(){
        this.skills.forEach((skillItem) => {
            if(skillItem.sprite){
                //update first time use
                if(skillItem.state === 0){
                    skillItem.sprite.tint = 0.1 * 0x010101;
                } else {
                    skillItem.sprite.tint = 0xFFFFFF;
                }
            }
        });

        this.strValue.text = this.game.player.battleStats.strength;
        this.dexValue.text = this.game.player.battleStats.dexterity;
        this.vitValue.text = this.game.player.battleStats.vitality;
        this.wisValue.text = this.game.player.battleStats.wisdom;
    }

    showSkillDetail(skill){
        let isSkill = skill.type === 'skill';
        let text = isSkill ? `Get skill: ${skill.name}?\n${skill.desc}` : `Get +1 ${skill.attr}?`;
        let attrIndex = isSkill ? 0 : (['str','dex','vit','wis']).indexOf(skill.attr);
        new Dialogue(this.game, this, 'bool', null, text, (reply)=>{
            if(reply === 'yes'){
                let cost = isSkill && this.game.player.skills.length > 0 ? 3 : 1;
                let costCheck = this.game.player.skillPoints >= cost;
                let availCheck = skill.state === 1;
                if(costCheck && availCheck){
                    if(isSkill){
                        this.game.player.addSkill(skill.name);
                    } else {
                        this.game.player.skillUps.push(skill.index);
                        this.game.player.skillUp(attrIndex);
                    }
                    this.game.player.skillPoints -= cost;
                    this.updateNeighborStates(skill);
                    this.updateSkillAvailability();
                    this.game.player.savePlayerData();
                } else {
                    console.log('You can\'t afford it, or it\'s unavailable.');
                }
            }
        });
    }

    startDrag(sprite){
        this.currentSprint = sprite;
    }
    stopDrag(sprite, index){
        console.log('stopped dragging this sprite to:', sprite.position, index);
    }

    rand(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    update(){
        this.avatar.update();
        this.mainNav.update(this.currentDungeon);
    }

}
