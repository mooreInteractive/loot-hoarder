import Phaser from 'phaser';

export default class Dialogue{
    constructor(game, gameState, diaType, portrait, diaText, endCB){
        this.game = game;
        this.loot = game.loot;
        this.gameState = gameState;
        this.endCB = endCB;
        this.diaType = diaType;
        this.portrait = portrait; //"oldMan"

        this.textLines = ((diaText.match(/\n/g) || []).length);

        this.diaWidth = 568; //(full width - 100 on each side)
        this.diaHeight = 200 + this.textLines*20;

        this.diaOrigin = {x: this.game.world.centerX, y: this.game.world.centerY - (this.diaHeight)};

        if(this.game.dialogueOpen == false){
            this.game.dialogueOpen = true;
            //Dialogue Background
            let diaBG = this.gameState.add.bitmapData(this.diaWidth, this.diaHeight);
            diaBG.ctx.beginPath();
            diaBG.ctx.rect(0, 0, this.diaWidth, this.diaHeight);
            diaBG.ctx.fillStyle = '#000000';
            diaBG.ctx.fill();
            diaBG.ctx.beginPath();
            diaBG.ctx.rect(20, 20, this.diaWidth-40, this.diaHeight-40);
            diaBG.ctx.fillStyle = '#FFFFFF';
            diaBG.ctx.fill();

            this.dialogueBG = this.gameState.add.sprite(this.diaOrigin.x, this.diaOrigin.y, diaBG);
            this.dialogueBG.anchor.setTo(0.5);

            this.dialogueBG.inputEnabled = true;
            this.dialogueBG.input.priorityId = 1;

            //portrait
            let portraitOffset = 25;
            if(this.portrait){
                let spriteFrame = this.getCurrentPortrait(this.portrait);

                this.portraitImage = this.gameState.add.image(this.diaOrigin.x - this.diaWidth/2 + 20, this.diaOrigin.y - this.diaHeight/2, 'portraits', spriteFrame);
                this.portraitImage.scale.setTo(2);
                portraitOffset = 95;
            }

            switch(this.diaType){
            case 'ok': this.createOKButton();
                break;
            case 'bool': this.createBoolButtons();
                break;
            }
            //OK Button Text
            let okTextStyle = {font: 'Press Start 2P', fontSize: 18, fill: '#111111', align: 'left', wordWrap: true, wordWrapWidth: (548 - portraitOffset)};
            this.dialogueText = this.gameState.add.text(this.diaOrigin.x - (this.diaWidth/2) + portraitOffset, this.diaOrigin.y - this.diaHeight/2 + 25, diaText, okTextStyle);
        }
    }

    //These portraits line up to the spritesheet 'portraits'
    getCurrentPortrait(name){
        let portraitIndex = 0;

        switch(name){
        case 'gunther': portraitIndex = 9;
            break;
        case 't3man': portraitIndex = 8;
            break;
        case 'doc': portraitIndex = 7;
            break;
        case 'seymour': portraitIndex = 6;
            break;
        case 'gary': portraitIndex = 5;
            break;
        case 'toby': portraitIndex = 4;
            break;
        case 'alice': portraitIndex = 3;
            break;
        case 'potionkeeper': portraitIndex = 2;
            break;
        case 'scrollkeeper': portraitIndex = 1;
            break;
        case 'shopkeeper':
        default: portraitIndex = 0;
            break;
        }

        return portraitIndex;
    }

    //OK Dialogue creation and Button Press
    createOKButton(){
        //Dialogue OK Button
        this.okBtn = new Phaser.Button(this.game, this.diaOrigin.x + this.diaWidth/2 - 120, this.diaOrigin.y + this.diaHeight/2 - 50, 'blueButton', this.okBtnPressed, this);
        this.okBtn.anchor.setTo(0.5);
        this.okBtn.input.priorityId = 2;
        this.gameState.add.existing(this.okBtn);
        //OK Button Text
        let okTextStyle = {font: 'Press Start 2P', fontSize: 28, fill: '#111111', align: 'center'};
        this.okText = this.gameState.add.text(this.diaOrigin.x + this.diaWidth/2 - 120, this.diaOrigin.y + this.diaHeight/2 - 50, 'OK', okTextStyle);
        this.okText.anchor.setTo(0.5);
    }

    okBtnPressed(){
        //kill everything
        this.dialogueBG.destroy();
        this.okBtn.destroy();
        this.okText.destroy();
        this.dialogueText.destroy();
        if(this.portraitImage){
            this.portraitImage.destroy();
        }

        this.game.dialogueOpen = false;

        //Callback to opener
        this.endCB();
    }

    //YES/NO Dialogue creation and Button Press
    createBoolButtons(){
        //NO Button
        this.noBtn = new Phaser.Button(this.game, this.diaOrigin.x-150, this.diaOrigin.y + this.diaHeight/2 - 50, 'redButton', this.boolBtnPressed.bind(this, 'no'), this);
        this.noBtn.anchor.setTo(0.5);
        this.noBtn.input.priorityId = 2;
        this.gameState.add.existing(this.noBtn);
        //NO Button Text
        let noTextStyle = {font: 'Oswald', fontSize: 28, fill: '#111111', align: 'center'};
        this.noText = this.gameState.add.text(this.diaOrigin.x-150, this.diaOrigin.y + this.diaHeight/2 - 50, 'NO', noTextStyle);
        this.noText.anchor.setTo(0.5);

        //YES Button
        this.yesBtn = new Phaser.Button(this.game, this.diaOrigin.x+150, this.diaOrigin.y + this.diaHeight/2 - 50, 'blueButton', this.boolBtnPressed.bind(this, 'yes'), this);
        this.yesBtn.anchor.setTo(0.5);
        this.yesBtn.input.priorityId = 2;
        this.gameState.add.existing(this.yesBtn);
        //YES Button Text
        this.yesText = this.gameState.add.text(this.diaOrigin.x+150, this.diaOrigin.y + this.diaHeight/2 - 50, 'YES', noTextStyle);
        this.yesText.anchor.setTo(0.5);
    }

    boolBtnPressed(response){
        //kill everything
        this.dialogueBG.destroy();
        this.noBtn.destroy();
        this.noText.destroy();
        this.yesBtn.destroy();
        this.yesText.destroy();
        this.dialogueText.destroy();
        if(this.portraitImage){
            this.portraitImage.destroy();
        }

        this.game.dialogueOpen = false;

        //Callback to opener
        this.endCB(response);
    }


}
