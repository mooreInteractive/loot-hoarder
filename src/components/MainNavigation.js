import Phaser from 'phaser';

export default class MainNavigation{
    constructor(game, gameState){
        this.game = game;
        this.loot = game.loot;
        this.gameState = gameState;

        //Inv Button
        this.inventoryBtn = new Phaser.Button(this.game, 150, this.game.world.height - 50, 'blueButton', this.openInventory, this);
        this.inventoryBtn.scale.x = 1.2;
        this.inventoryBtn.scale.y = 1.5;
        this.inventoryBtn.anchor.setTo(0.5);
        this.game.add.existing(this.inventoryBtn);

        this.inventoryText = this.gameState.add.text(150, this.game.world.height - 50, 'Inventory');
        this.inventoryText.font = 'Oswald';
        this.inventoryText.fontSize = 28;
        this.inventoryText.fill = '#111111';
        this.inventoryText.anchor.setTo(0.5);

        //Shop Button
        this.shopBtn = new Phaser.Button(this.game, this.game.world.width - 150, this.game.world.height - 50, 'yellowButton', ()=>{console.log('shop');}, this);
        this.shopBtn.scale.x = 1.2;
        this.shopBtn.scale.y = 1.5;
        this.shopBtn.anchor.setTo(0.5);
        this.game.add.existing(this.shopBtn);

        this.shopText = this.gameState.add.text(this.game.world.width - 150, this.game.world.height - 50, 'Town Shop');
        this.shopText.font = 'Oswald';
        this.shopText.fontSize = 28;
        this.shopText.fill = '#111111';
        this.shopText.anchor.setTo(0.5);

        //Main Button
        this.mainBtn = new Phaser.Button(this.game, this.game.world.centerX, this.game.world.height - 87, 'redButton', this.openMain, this);
        this.mainBtn.scale.x = 1;
        this.mainBtn.scale.y = 3;
        this.mainBtn.anchor.setTo(0.5);
        this.game.add.existing(this.mainBtn);

        let mainTextStyle = {font: 'bold 28px Oswald', fill: '#111111'};
        this.mainText = this.gameState.add.text(this.game.world.centerX, this.game.world.height - 90, 'Main\nMenu', mainTextStyle);
        this.mainText.anchor.setTo(0.5);
    }

    openInventory(){
        if(this.gameState.key != 'Inventory'){
            this.gameState.state.start('Inventory');
        }
    }

    openMain(){
        if(this.gameState.key != 'MainMenu'){
            this.gameState.state.start('MainMenu');
        }
    }


}
