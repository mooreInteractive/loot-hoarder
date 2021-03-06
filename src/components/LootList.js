import Phaser from 'phaser';
import * as Utils from '../utils';
import ItemReadOut from './ItemReadOut';
import * as StoryFunctions from './StoryFunctions';

export default class LootList{
    constructor(game, gameState, color='#000000', gold=0, endCB){
        this.game = game;
        this.loot = game.loot;
        this.gameState = gameState;
        this.keptLoot = false;
        this.textColor = color;
        this.gold = gold;
        this.endCB = endCB;

        this.lootKeepBtns = [];
        this.lootSellBtns = [];
        this.lootReadOuts = [];

        this.pullOutPotions();
        this.addGoldToPlayerInventory(this.gold);

        this.addPotionLabel();

        this.updateLootTextAndButtons();

        //continue Button
        let endBtn = new Phaser.Button(this.game, this.game.world.width - 100, this.game.world.centerY - 50, 'greyButton', () => {
            this.endCB();
            this.game.loot = [];
        }, this);
        endBtn.scale.x = 0.6;
        endBtn.anchor.setTo(0.5);
        this.gameState.add.existing(endBtn);

        let endBtnText = this.gameState.add.text(this.game.world.width - 100, this.game.world.centerY - 50, 'DONE');
        endBtnText.font = 'Press Start 2P';
        endBtnText.fontSize = 24;
        endBtnText.fill = '#111111';
        endBtnText.anchor.setTo(0.5);
        endBtnText.visible = true;
    }

    pullOutPotions(){
        this.potions = 0;
        for(let i = 0; i < this.loot.length; i++){
            if(this.loot[i].name == 'Health Potion'){
                this.addPotionToPlayerInvetory(this.loot[i], i);
                this.potions += 1;
                i--;
            }
        }
    }

    addPotionLabel(){
        let potionSprite = this.gameState.add.sprite(600, 125, 'misc_items', 0);
        potionSprite.scale.setTo(0.65);
        let potionTextStyle = {font: 'Press Start 2P', fontSize: '22px', fill: '#FFFFFF'};
        this.potionText = this.gameState.add.text(665, 155, ('x'+this.potions), potionTextStyle);

        this.goldText = this.gameState.add.text(600, 195, `gold:${this.gold}`, potionTextStyle);
    }

    cleanUpLootButtons(){
        let allBtns = this.lootKeepBtns.concat(this.lootSellBtns);
        allBtns.forEach((btn) => {
            btn.destroy();
        });

        this.lootReadOuts.forEach((readOut)=>{
            readOut.clearItem();
            readOut = null;
        });

        this.lootKeepBtns = [];
        this.lootSellBtns = [];
        this.lootReadOuts = [];
    }

    addGoldToPlayerInventory(amount){
        this.game.player.gold += amount;
    }

    addPotionToPlayerInvetory(item, index){
        this.game.player.potions += 1;
        this.loot.splice(index, 1);
        this.keptLoot = true;
        this.updateLootTextAndButtons(this.loot);
    }

    updateLootTextAndButtons(){
        this.game.saveLootData(this.game);
        this.game.player.savePlayerData();

        let loot = this.game.loot;

        this.cleanUpLootButtons();

        loot.forEach((item, index) => {
            let itemOffsetHeight = (110*index);
            let buttonsY = 130 + itemOffsetHeight;

            this.lootReadOuts.push(new ItemReadOut(this.game, this.gameState, item, {x:this.game.world.centerX - 150, y:100 + itemOffsetHeight}, this.textColor));

            if(item.type != 'special'){
                //add a couple buttons for this item

                let addBtn = new Phaser.Button(this.game, this.game.world.centerX - 310, buttonsY, 'blueButton', () => {
                    console.log('--clicked keep, loot, item', loot, item);
                    let placed = Utils.tryToPlaceItemInBackpack(item, this.game.player.inventory, this.game.player.backpack);
                    if(placed){
                        loot.splice(loot.indexOf(item), 1);
                        this.keptLoot = true;
                        this.updateLootTextAndButtons(loot);
                    } else {
                        if(this.gameState.errorText){
                            this.gameState.errorText.text = 'Inventory is Full.';
                            this.gameState.errorText.visible = true;
                        }
                    }
                }, this);
                addBtn.scale.x = 0.4;
                addBtn.anchor.setTo(0.5);
                this.gameState.add.existing(addBtn);
                this.lootKeepBtns.push(addBtn);

                let sellBtn = new Phaser.Button(this.game, this.game.world.centerX - 210, buttonsY, 'greyButton', () => {
                    console.log('Drop Item!');
                    loot.splice(loot.indexOf(item), 1);
                    this.updateLootTextAndButtons(loot);
                }, this);

                sellBtn.scale.x = 0.4;
                sellBtn.anchor.setTo(0.5);
                this.gameState.add.existing(sellBtn);
                this.lootSellBtns.push(sellBtn);

                let addBtnText = this.gameState.add.text(this.game.world.centerX - 310, buttonsY, 'KEEP');
                addBtnText.font = 'Oswald';
                addBtnText.fontSize = 24;
                addBtnText.fill = '#111111';
                addBtnText.anchor.setTo(0.5);
                addBtnText.visible = true;
                this.lootKeepBtns.push(addBtnText);

                let sellBtnText = this.gameState.add.text(this.game.world.centerX - 210, buttonsY, 'DROP');
                sellBtnText.font = 'Oswald';
                sellBtnText.fontSize = 24;
                sellBtnText.fill = '#111111';
                sellBtnText.anchor.setTo(0.5);
                addBtnText.visible = true;
                this.lootSellBtns.push(sellBtnText);
            } else {
                let game = this.game;
                let gameState = this.gameState;
                let checkBtn = new Phaser.Button(game, game.world.centerX - 260, buttonsY, 'greenButton',
                    StoryFunctions.chapter1[item.task].bind(this, game, gameState, this.resolveStoryFunction.bind(this, loot, item)),
                    this);

                checkBtn.scale.x = 0.7;
                checkBtn.anchor.setTo(0.5);
                this.gameState.add.existing(checkBtn);
                this.lootSellBtns.push(checkBtn);

                let checkBtnText = this.gameState.add.text(this.game.world.centerX - 260, buttonsY, 'CHECK');
                checkBtnText.font = 'Oswald';
                checkBtnText.fontSize = 24;
                checkBtnText.fill = '#111111';
                checkBtnText.anchor.setTo(0.5);
                checkBtnText.visible = true;
                this.lootKeepBtns.push(checkBtnText);
            }

        });
    }

    resolveStoryFunction(loot, item){
        loot.splice(loot.indexOf(item), 1);
        this.updateLootTextAndButtons();
    }
}
