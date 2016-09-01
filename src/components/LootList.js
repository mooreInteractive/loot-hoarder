import Phaser from 'phaser';
import { placeItemInSlot } from '../utils';
import ItemReadOut from './ItemReadOut';
import * as StoryFunctions from './StoryFunctions';

export default class LootList{
    constructor(game, gameState){
        this.game = game;
        this.loot = game.loot;
        this.gameState = gameState;
        this.keptLoot = false;

        this.lootKeepBtns = [];
        this.lootSellBtns = [];
        this.lootReadOuts = [];
    }

    cleanUpLootButtons(){
        let allBtns = this.lootKeepBtns.concat(this.lootSellBtns);
        allBtns.forEach((btn) => {
            btn.destroy();
        });

        this.lootReadOuts.forEach((readOut)=>{
            readOut.lootText.destroy();
            readOut = null;
        });

        this.lootKeepBtns = [];
        this.lootSellBtns = [];
        this.lootReadOuts = [];
    }

    tryToPlaceItemInInventory(item){
        let invSlots = this.game.player.backpack;
        let itemPlaced = false;
        for(let y = 0; y < invSlots.length; y++){
            let row = invSlots[y];
            for(let x = 0; x < row.length; x++){
                itemPlaced = placeItemInSlot(this.game.player, item, {x,y});
                if(itemPlaced){break;}
            }
            if(itemPlaced){break;}
        }
        if(itemPlaced === false){
            if(this.gameState.errorText){
                this.gameState.errorText.text = 'Inventory is Full.';
                this.gameState.errorText.visible = true;
            }
        }
        return itemPlaced;
    }

    updateLootTextAndButtons(){
        this.game.saveLootData(this.game);
        this.game.player.savePlayerData();

        let loot = this.game.loot;

        this.cleanUpLootButtons();

        if(loot.length == 0 && this.keptLoot){
            this.game.state.start('Inventory');
        } else if(loot.length == 0){
            this.game.state.start('MainMenu');
        }

        loot.forEach((item, index) => {
            let itemOffsetHeight = (110*index);
            let buttonsY = 230 + itemOffsetHeight;

            this.lootReadOuts.push(new ItemReadOut(this.game, this.gameState, item, {x:this.game.world.centerX - 150, y:200 + itemOffsetHeight}));

            if(item.type != 'special'){
                //add a couple buttons for this item

                let addBtn = new Phaser.Button(this.game, this.game.world.centerX - 310, buttonsY, 'blueButton', () => {
                    console.log('--clicked keep, loot, item', loot, item);
                    if(item.name == 'Health Potion'){
                        this.game.player.potions += 1;
                        loot.splice(loot.indexOf(item), 1);
                        this.keptLoot = true;
                        this.updateLootTextAndButtons(loot);
                    } else {
                        let placed = this.tryToPlaceItemInInventory(item);
                        if(placed){
                            loot.splice(loot.indexOf(item), 1);
                            this.keptLoot = true;
                            this.updateLootTextAndButtons(loot);
                        }
                    }
                }, this);
                addBtn.scale.x = 0.4;
                addBtn.anchor.setTo(0.5);
                this.gameState.add.existing(addBtn);
                this.lootKeepBtns.push(addBtn);

                let sellBtn = new Phaser.Button(this.game, this.game.world.centerX - 210, buttonsY, 'yellowButton', () => {
                    console.log('Sell Item!');
                    this.game.player.gold += item.value;
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

                let sellBtnText = this.gameState.add.text(this.game.world.centerX - 210, buttonsY, '$ELL');
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
        this.updateLootTextAndButtons(loot);
    }
}
