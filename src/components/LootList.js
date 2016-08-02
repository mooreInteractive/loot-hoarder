import Phaser from 'phaser';
import { placeItemInSlot } from '../utils';

export default class LootList{
    constructor(game, loot, gameState){
        this.game = game;
        this.loot = loot;
        this.gameState = gameState;

        this.lootKeepBtns = [];
        this.lootSellBtns = [];

        this.lootText = this.gameState.add.text(this.game.world.centerX - 150, this.game.world.centerY + 100, '');
        this.lootText.font = 'Nunito';
        this.lootText.fontSize = 22;
        this.lootText.fill = '#000000';
    }

    cleanUpLootButtons(){
        let allBtns = this.lootKeepBtns.concat(this.lootSellBtns);
        allBtns.forEach((btn) => {
            btn.kill();
        });
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
            this.errorText.visible = true;
        }
        return itemPlaced;
    }

    updateLootTextAndButtons(loot){
        this.lootText.text = '';

        this.cleanUpLootButtons();

        this.lootKeepBtns = [];
        this.lootSellBtns = [];

        loot.forEach((item, index) => {

            if(item.ac != null){//Armor
                this.lootText.text += `[${item.level}] ${item.name} \n`;
                this.lootText.text += `AC: ${item.ac}, Type: ${item.type} \n`;
                if(item.magic.effect.attribute != null){
                    this.lootText.text += `${item.magic.effect.attribute} +${item.magic.effect.value}\n`;
                }
                this.lootText.text += `\n`;
            } else if(item.dmg != null){//Weapon
                this.lootText.text += `[${item.level}] ${item.name} \n`;
                this.lootText.text += `Dmg: ${item.dmg.min} - ${item.dmg.max} \n`;
                if(item.magic.effect.attribute != null){
                    this.lootText.text += `${item.magic.effect.attribute} +${item.magic.effect.value}\n`;
                }
                this.lootText.text += `\n`;
            } else {
                this.lootText.text += `${item.name} \n`;
                if(item.magic.effect.attribute != null){
                    this.lootText.text += `${item.magic.effect.attribute} +${item.magic.effect.value}\n`;
                }
                this.lootText.text += `\n`;
            }


            //add a couple buttons for this item
            let addBtn = new Phaser.Button(this.game, this.game.world.centerX - 250, this.game.world.centerY + 125*(index+1), 'blueButton', () => {
                console.log('--clicked keep, loot, item', loot, item);
                let placed = this.tryToPlaceItemInInventory(item);
                if(placed){
                    loot.splice(loot.indexOf(item), 1);
                    this.updateLootTextAndButtons(loot);
                }
            }, this);
            addBtn.scale.x = 0.2;
            addBtn.anchor.setTo(0.5);
            this.game.add.existing(addBtn);
            this.lootKeepBtns.push(addBtn);

            let addBtnText = this.gameState.add.text(this.game, this.game.world.centerX - 250, this.game.world.centerY + 125*(index+1), '+');
            addBtnText.font = 'Nunito';
            addBtnText.fontSize = 24;
            addBtnText.fill = '#111111';
            addBtnText.anchor.setTo(0.5);

            let sellBtn = new Phaser.Button(this.game, this.game.world.centerX - 200, this.game.world.centerY + 125*(index+1), 'yellowButton', () => {
                console.log('Sell Item!');
                this.game.player.gold += item.value;
                loot.splice(loot.indexOf(item), 1);
                this.updateLootTextAndButtons(loot);
            }, this);

            sellBtn.scale.x = 0.2;
            sellBtn.anchor.setTo(0.5);
            this.game.add.existing(sellBtn);
            this.lootSellBtns.push(sellBtn);

            let sellBtnText = this.gameState.add.text(this.game, this.game.world.centerX - 200, this.game.world.centerY + 125*(index+1), '$');
            sellBtnText.font = 'Nunito';
            sellBtnText.fontSize = 24;
            sellBtnText.fill = '#111111';
            sellBtnText.anchor.setTo(0.5);
            sellBtnText.visible = true;
        });
    }
}