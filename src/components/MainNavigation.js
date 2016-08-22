import Phaser from 'phaser';
import * as StoryFunctions from './StoryFunctions';
import Dialogue from '../components/Dialogue';

export default class MainNavigation{
    constructor(game, gameState){
        this.game = game;
        this.loot = game.loot;
        this.gameState = gameState;
        this.currentDungeon = this.game.dungeons[this.game.player.currentDungeon];

        let bigBtnStyle = {fontSize: 48, font: 'Press Start 2P', fill: '#000000', align: 'center'};
        let invBtnStyle = {fontSize: 48, font: 'Press Start 2P', fill: '#000000', align: 'center'};
        this.smallBtnStyle = {fontSize: 36, font: 'Press Start 2P', fill: '#000000', align: 'center'};

        this.lootBtn = new Phaser.Button(this.game, this.game.world.width - 200, this.game.world.height - 210, 'greenButton', this.viewLoot, this);
        this.lootBtn.scale.setTo(1.8,1.5);
        this.lootBtn.anchor.setTo(0.5);
        this.lootBtn.alpha = 0.5;

        //Inv Button
        this.inventoryBtn = new Phaser.Button(this.game, 200, this.game.world.height - 90, 'blueButton', this.openInventory, this);
        this.inventoryBtn.scale.x = 1.8;
        this.inventoryBtn.scale.y = 3;
        this.inventoryBtn.anchor.setTo(0.5);

        //Main Left
        this.overworldLeftBtn = new Phaser.Button(this.game, 200, this.game.world.height - 90, 'greyButton', this.openMain, this);
        this.overworldLeftBtn.scale.x = 1.8;
        this.overworldLeftBtn.scale.y = 3;
        this.overworldLeftBtn.anchor.setTo(0.5);

        //Main Right
        this.overworldRightBtn = new Phaser.Button(this.game, this.game.world.width - 200, this.game.world.height - 90, 'greyButton', this.openMain, this);
        this.overworldRightBtn.scale.x = 1.8;
        this.overworldRightBtn.scale.y = 3;
        this.overworldRightBtn.anchor.setTo(0.5);

        //Shop Button
        this.shopBtn = new Phaser.Button(this.game, this.game.world.width - 120, this.game.world.height - 90, 'yellowButton', this.openShop, this);
        this.shopBtn.scale.x = 1.8;
        this.shopBtn.scale.y = 3;
        this.shopBtn.anchor.setTo(0.5);

        //Shop Button
        let townFunc = this.raidCurrentDungeon;
        this.townText = 'RAID';
        let townBtnColor = 'redButton';
        if(this.game.player.latestUnlockedDungeon > 1 && this.currentDungeon.level == 1){
            townFunc = this.openShop;
            this.townText = 'SHOP';
            townBtnColor = 'yellowButton';
        }
        this.raidBtn = new Phaser.Button(this.game, this.game.world.width - 200, this.game.world.height - 90, townBtnColor, townFunc, this);
        this.raidBtn.scale.x = 1.8;
        this.raidBtn.scale.y = 3;
        this.raidBtn.anchor.setTo(0.5);



        switch(this.gameState.key){
        case 'Inventory':
            this.game.add.existing(this.overworldLeftBtn);
            this.game.add.existing(this.raidBtn);

            this.overworldLeftText = this.gameState.add.text(200, this.game.world.height - 90, 'WORLD\nMAP', bigBtnStyle);
            this.overworldLeftText.anchor.setTo(0.5);

            this.raidText = this.gameState.add.text(this.game.world.width - 200, this.game.world.height - 90, this.townText, bigBtnStyle);
            this.raidText.anchor.setTo(0.5);


            this.gameState.add.existing(this.lootBtn);

            this.lootBtnText = this.gameState.add.text(this.game.world.width - 200, this.game.world.height - 210, 'LOOT', this.smallBtnStyle);
            this.lootBtnText.anchor.setTo(0.5);
            this.lootBtnText.alpha = 0.5;

            break;
        case 'MainMenu':
            this.game.add.existing(this.inventoryBtn);
            this.game.add.existing(this.raidBtn);

            this.inventoryText = this.gameState.add.text(200, this.game.world.height - 90, 'GEAR', invBtnStyle);
            this.inventoryText.anchor.setTo(0.5);

            this.raidText = this.gameState.add.text(this.game.world.width - 200, this.game.world.height - 90, this.townText, bigBtnStyle);
            this.raidText.anchor.setTo(0.5);

            this.gameState.add.existing(this.lootBtn);

            this.lootBtnText = this.gameState.add.text(this.game.world.width - 200, this.game.world.height - 210, 'LOOT', this.smallBtnStyle);
            this.lootBtnText.anchor.setTo(0.5);
            this.lootBtnText.alpha = 0.5;
            break;
        case 'Options':
        case 'LootView':
            this.game.add.existing(this.inventoryBtn);
            this.game.add.existing(this.overworldRightBtn);

            this.inventoryText = this.gameState.add.text(200, this.game.world.height - 90, 'GEAR', invBtnStyle);
            this.inventoryText.anchor.setTo(0.5);

            this.overworldRightText = this.gameState.add.text(this.game.world.width - 200, this.game.world.height - 90, 'WORLD\nMAP', bigBtnStyle);
            this.overworldRightText.anchor.setTo(0.5);
            break;
        }
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

    openShop(){
        if(!this.game.player.story.chapter1.rescuedShopKeep){
            StoryFunctions.chapter1.shopNote(this.game, this.gameState);
        } else {
            console.log('Open The Shop ALREADY!');
        }
    }

    raidCurrentDungeon(){
        if(this.townText == 'SHOP'){
            this.openShop();
        } else {
            let equippedGear = false;
            let equipment = this.game.player.equipped;
            let dungeon = this.currentDungeon;

            Object.keys(equipment).forEach((slot) => {
                if(equipment[slot] != null){
                    equippedGear = true;
                    return;
                }
            });

            if(!equippedGear){
                new Dialogue(this.game, this.gameState, 'ok', 'You should equip\nsomething before raiding...', ()=>{});
            } else {
                if(this.game.player.latestUnlockedDungeon >= dungeon.level){
                    if(this.game.player.battleStats.currentHealth > 1){
                        this.game.state.start('Raid', true, false, dungeon);
                    }
                } else {
                    new Dialogue(this.game, this.gameState, 'ok', 'Your shit\'s too weak son.', ()=>{});
                }
            }
        }


    }

    viewLoot(){
        if(this.game.loot.length > 0){
            this.game.state.start('LootView');
        }
    }

    update(currDungeon=null){
        if(currDungeon != null){
            this.currentDungeon = currDungeon;
        }
        let currHealth = this.game.player.battleStats.currentHealth;

        if(this.currentDungeon && this.raidBtn && this.raidText){
            this.townText = 'RAID';
            let townBtnColor = 'redButton';
            if(this.game.player.latestUnlockedDungeon > 1 && this.currentDungeon.level == 1){
                this.townText = 'SHOP';
                townBtnColor = 'yellowButton';
                this.raidBtn.alpha = 1;
                this.raidText.alpha = 1;
                this.raidText.text = this.townText;
                this.raidBtn.loadTexture(townBtnColor);
            } else{
                this.townText = 'RAID';
                townBtnColor = 'redButton';
                this.raidBtn.alpha = 1;
                this.raidText.alpha = 1;
                this.raidText.text = this.townText;
                this.raidBtn.loadTexture(townBtnColor);

                if(currHealth > 1 && this.currentDungeon.level <= this.game.player.latestUnlockedDungeon){
                    this.raidBtn.alpha = 1;
                    this.raidText.alpha = 1;
                } else {
                    this.raidBtn.alpha = 0.5;
                    this.raidText.alpha = 0.5;
                }
            }
        }

        if(this.lootBtn && this.lootBtnText){
            if(this.game.loot.length > 0){
                this.lootBtn.alpha = 1;
                this.lootBtnText.alpha = 1;
            } else {
                this.lootBtn.alpha = 0.5;
                this.lootBtnText.alpha = 0.5;
            }
        }
    }


}
