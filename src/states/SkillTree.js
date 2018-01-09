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

        this.classes = [
            {
                name: 'Barbarian',
                attr: ['str'],
                hitDie: 12
            },
            {
                name: 'Monk',
                attr: ['str', 'dex'],
                hitDie: 8
            },
            {
                name: 'Rogue',
                attr: ['dex'],
                hitDie: 6
            },
            {
                name: 'Paladin',
                attr: ['dex', 'vit'],
                hitDie: 10
            },
            {
                name: 'Cleric',
                attr: ['vit'],
                hitDie: 4
            },
            {
                name: 'White Mage',
                attr: ['vit', 'wis'],
                hitDie: 4
            },
            {
                name: 'Wizard',
                attr: ['wis'],
                hitDie: 6
            },
            {
                name: 'Black Mage',
                attr: ['wis', 'str'],
                hitDie: 6
            }
        ];
    }

    init () {
        this.skillSprites = [];
        this.currentRotation = this.game.player.lastSkillWheelRotation;
        this.currentButtonRotation = this.calcButtonRotation(this.currentRotation);
        this.wheelRotationSettings = [0, 45, 90, 135, 180, 225, 270, 315];
        this.buttonRotationSettings = [0, 45, 90, 135, 180, -135, -90, -45];
        this.setSkillStates();
    }

    calcButtonRotation(wheelRotation){
        let buttonRotCalc = 8-(wheelRotation%8);
        return buttonRotCalc == 8 ? 0 : buttonRotCalc;
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
            this.stoneCover.inputEnabled = true;
            this.stoneCover.input.pixelPerfectClick = true;
            this.stoneCover.input.priorityId = 1;
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
        this.setButtonsRotation(this.buttonRotationSettings[this.currentButtonRotation]);

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
        let sliceNumber = this.rand(16,32);
        let randomStart = 45*sliceNumber;
        this.currentRotation = sliceNumber%8;
        this.currentButtonRotation = this.calcButtonRotation(this.currentRotation);
        this.setButtonsRotation(this.buttonRotationSettings[this.currentButtonRotation] - 90);
        let startTween = this.add.tween(this.skillWheel).to( { angle: randomStart }, 2500, Phaser.Easing.Cubic.Out, true);
        setTimeout(this.dropStoneCover, 800);
        setTimeout(() => {
            this.skills.forEach(skill => {
                this.add.tween(skill.sprite).to( { angle: this.buttonRotationSettings[this.currentButtonRotation] }, 800, Phaser.Easing.Bounce.Out, true);
            });
        }, 1800);
        startTween.onComplete.addOnce(()=>{

            this.skillWheel.angle = this.wheelRotationSettings[this.currentRotation];
            this.game.player.lastSkillWheelRotation = this.currentRotation;
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
        let currentClass = this.classes[rot];

        console.log('skill deats:', skill.title, skill.desc, skill);
        this.initialSkillDetail.title = this.add.text(this.game.world.centerX, this.game.world.centerY-205, currentClass.name, skillTitleStyle);
        this.initialSkillDetail.desc = this.add.text(this.game.world.centerX, this.game.world.centerY-135, skill.desc, skillDescStyle);
        this.initialSkillDetail.title.anchor.x = 0.5;
        this.initialSkillDetail.desc.anchor.x = 0.5;

        //button
        this.playBtn = new Phaser.Button(this.game, this.game.world.centerX, this.game.world.centerY+100, 'redButton', this.playClicked, this);
        this.playBtn.scale.setTo(2);
        this.playBtn.anchor.setTo(0.5);

        this.game.add.existing(this.playBtn);
        //button text
        let playStyle = {font: '24px Press Start 2P', fill: '#111111'};
        let playType = skill.title;
        this.getButton = this.add.text(this.game.world.centerX, this.game.world.centerY+100, playType, playStyle);
        this.getButton.anchor.setTo(0.5);
        this.getButton.inputEnabled = true;

        this.currentSkill = skill;
        this.getButton.events.onInputDown.add(this.confirmFirstSkillChoice, this);
        this.getButton.input.useHandCursor = true;
    }

    updateFirstTimeSkillDetails(){
        if(this.initialSkillDetail){
            let rot = this.currentRotation === 0 ? this.currentRotation : 8 - this.currentRotation;
            let skill = this.skills[(rot*19)+9];
            let currentClass = this.classes[rot];

            this.currentSkill = skill;
            this.initialSkillDetail.title.text = currentClass.name;
            this.initialSkillDetail.desc.text = skill.desc;
            this.getButton.text = skill.title;
            this.hdValue.text = `1d${currentClass.hitDie}`;

            console.log('class:', currentClass);

        }
    }

    hideFirstTimeSkillDetails(){
        this.initialSkillDetail.bg.destroy();
        this.initialSkillDetail.title.destroy();
        this.initialSkillDetail.desc.destroy();
        this.getButton.destroy();
        this.playBtn.destroy();
    }

    confirmFirstSkillChoice(){
        let skill = this.currentSkill;
        let rot = this.currentRotation === 0 ? this.currentRotation : 8 - this.currentRotation;
        let currentClass = this.classes[rot];
        if(this.game.player.skillPoints > 0){
            new Dialogue(this.game, this, 'bool', null, `Are you sure you want to be a ${currentClass.name}?\n Hit Die: 1d${currentClass.hitDie}\n Skill: ${skill.title}`, (reply)=>{
                if(reply === 'yes'){
                    this.game.player.addSkill(skill.name);
                    this.game.player.skillPoints -= 1;
                    this.game.player.hitDie = currentClass.hitDie;
                    this.hdValue.text = `1d${currentClass.hitDie}`;
                    this.updateNeighborStates(skill);
                    this.updateSkillAvailability();
                    this.hideFirstTimeSkillDetails();
                    this.game.player.savePlayerData();
                }
            });
        } else {
            new Dialogue(this.game, this, 'ok', null, `You need more skill points.`, ()=>{});
        }
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
        //phaser's angle limits -180 -> 180(179.9) - 3d later - fuuuu
        let buttonRotationTo;
        this.currentButtonRotation -= 1;
        // console.log("left buttons:", this.currentButtonRotation+1, "to", this.currentButtonRotation);
        if(this.currentButtonRotation == -1){ this.setButtonsRotation(0); this.currentButtonRotation = 7; }
        if(this.currentButtonRotation == 3){ this.setButtonsRotation(179.9); }

        if(this.currentButtonRotation == 4){
            buttonRotationTo = -180;
        } else {
            buttonRotationTo = this.buttonRotationSettings[this.currentButtonRotation];
        }
        this.currentRotation += 1;

        if(this.currentRotation == 8){ this.setWheelRotation(-45); this.currentRotation = 0; }
        this.rotateWheel(this.wheelRotationSettings[this.currentRotation], buttonRotationTo);
        this.updateFirstTimeSkillDetails();
        this.game.player.lastSkillWheelRotation = this.currentRotation;
        this.game.player.savePlayerData();
    }
    rotateRight(){
        this.currentButtonRotation += 1;
        if(this.currentButtonRotation == 8){ this.setButtonsRotation(-45); this.currentButtonRotation = 0; }
        this.currentRotation -= 1;
        if(this.currentRotation == -1){ this.setWheelRotation(360); this.currentRotation = 7; }
        this.rotateWheel(this.wheelRotationSettings[this.currentRotation], this.buttonRotationSettings[this.currentButtonRotation]);
        this.updateFirstTimeSkillDetails();
        this.game.player.lastSkillWheelRotation = this.currentRotation;
        this.game.player.savePlayerData();
    }

    setWheelRotation(rotateTo){
        this.skillWheel.angle = rotateTo;
    }

    setButtonsRotation(buttonTo){
        this.skills.forEach(skill => {
            skill.sprite.angle = buttonTo;
        });
    }

    rotateWheel(rotateTo, buttonRotateTo){
        this.add.tween(this.skillWheel).to( { angle: rotateTo }, 500, Phaser.Easing.Back.InOut, true);

        this.skills.forEach(skill => {
            this.add.tween(skill.sprite).to( { angle: buttonRotateTo }, 500, Phaser.Easing.Linear.InOut, true);
        });
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
                skillBtn = new Phaser.Button(this.game, skillItem.x, skillItem.y, btnSprite, this.showSkillDetail.bind(this, skillItem), this, 0, 0, 0);
                skillBtn.input.priorityId = 2;
            }
            skillBtn.inputEnabled = false;
            let firstSkillSet = this.game.player.skills.length === 0 && skillItem.introSkill;
            if(skillItem.state === 0){
                skillBtn.setFrames(0, 0, 0);
            } else if(firstSkillSet || skillItem.state === 1){
                skillBtn.setFrames(1, 1, 1);
                skillBtn.inputEnabled = true;
            } else if(skillItem.state === 2){
                skillBtn.setFrames(2, 2, 2);
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
        skill.sprite.inputEnabled = false;
        let skillIndex = this.skills.indexOf(skill);
        let sliceIndex = Math.floor(skillIndex/19);
        skill.neighbors.forEach(neighbor => {
            let neighborSkill;
            if(typeof neighbor === 'number'){
                // console.log('neighbors:', sliceIndex*19+neighbor, this.skills[sliceIndex*19+neighbor]);
                neighborSkill = this.skills[sliceIndex*19+neighbor];
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
                neighborSkill = this.skills[nextSlice*19+neighborIndex];
            }
            if(neighborSkill.state === 0){
                neighborSkill.state = 1;
                neighborSkill.sprite.inputEnabled = true;
            }
        });
    }

    updateSkillAvailability(){
        this.skills.forEach((skillItem) => {
            if(skillItem.sprite){
                //update first time use
                skillItem.sprite.setFrames(skillItem.state, skillItem.state, skillItem.state);
                if(skillItem.state === 1){
                    skillItem.sprite.inputEnabled = true;
                } else {
                    skillItem.sprite.inputEnabled = false;
                }
            }
        });

        this.strValue.text = this.game.player.battleStats.strength;
        this.dexValue.text = this.game.player.battleStats.dexterity;
        this.vitValue.text = this.game.player.battleStats.vitality;
        this.wisValue.text = this.game.player.battleStats.wisdom;
    }

    showSkillDetail(skill){
        if(skill.state != 2){
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
