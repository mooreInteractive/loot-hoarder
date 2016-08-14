import Phaser from 'phaser';

export default class Dialogue{
    constructor(game, gameState, diaType, diaText, endCB){
        this.game = game;
        this.loot = game.loot;
        this.gameState = gameState;
        this.endCB = endCB;
        this.diaType = diaType;

        this.textLines = ((diaText.match(/\n/g) || []).length);

        this.diaWidth = 568; //(full width - 100 on each side)
        this.diaHeight = 200 + this.textLines*30;

        this.diaOrigin = {x: this.game.world.centerX, y: this.game.world.centerY - (this.diaHeight-100)};

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

        switch(this.diaType){
        case 'ok': this.createOKButton();
            break;
        case 'bool': this.createBoolButtons();
            break;
        }
        //OK Button Text
        let okTextStyle = {font: 'Oswald', fontSize: 28, fill: '#111111', align: 'center'};
        this.dialogueText = this.gameState.add.text(this.diaOrigin.x, this.diaOrigin.y - this.diaHeight/2 + 50 + ((this.textLines)*20), diaText, okTextStyle);
        this.dialogueText.anchor.setTo(0.5);
    }

    //OK Dialogue creation and Button Press
    createOKButton(){
        //Dialogue OK Button
        this.okBtn = new Phaser.Button(this.game, this.diaOrigin.x, this.diaOrigin.y + this.diaHeight/2 - 50, 'blueButton', this.okBtnPressed, this);
        this.okBtn.anchor.setTo(0.5);
        this.gameState.add.existing(this.okBtn);
        //OK Button Text
        let okTextStyle = {font: 'Oswald', fontSize: 28, fill: '#111111', align: 'center'};
        this.okText = this.gameState.add.text(this.diaOrigin.x, this.diaOrigin.y + this.diaHeight/2 - 50, 'OK', okTextStyle);
        this.okText.anchor.setTo(0.5);
    }

    okBtnPressed(){
        //kill everything
        this.dialogueBG.destroy();
        this.okBtn.destroy();
        this.okText.destroy();
        this.dialogueText.destroy();

        //Callback to opener
        this.endCB();
    }

    //YES/NO Dialogue creation and Button Press
    createBoolButtons(){
        //NO Button
        this.noBtn = new Phaser.Button(this.game, this.diaOrigin.x-150, this.diaOrigin.y + this.diaHeight/2 - 50, 'redButton', this.boolBtnPressed.bind(this, 'no'), this);
        this.noBtn.anchor.setTo(0.5);
        this.gameState.add.existing(this.noBtn);
        //NO Button Text
        let noTextStyle = {font: 'Oswald', fontSize: 28, fill: '#111111', align: 'center'};
        this.noText = this.gameState.add.text(this.diaOrigin.x-150, this.diaOrigin.y + this.diaHeight/2 - 50, 'NO', noTextStyle);
        this.noText.anchor.setTo(0.5);

        //YES Button
        this.yesBtn = new Phaser.Button(this.game, this.diaOrigin.x+150, this.diaOrigin.y + this.diaHeight/2 - 50, 'blueButton', this.boolBtnPressed.bind(this, 'yes'), this);
        this.yesBtn.anchor.setTo(0.5);
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

        //Callback to opener
        this.endCB(response);
    }


}
