import Phaser from 'phaser';
import * as utils from '../utils';
import {playerLevels} from '../data/levels';

export default class extends Phaser.State {
    init () {
        this.inventorySprites = [];
        this.inventoryGridSprite;
    }

    preload () {

        //Inv Button
        this.inventoryBtn = new Phaser.Button(this.game, 150, 50, 'blueButton', this.backToMain, this);
        this.inventoryBtn.anchor.setTo(0.5);

        //weapons??
        this.weaponGfx = [];

        // let shank0 = this.game.add.sprite(this.game.world.width - 70, this.game.world.centerY - 90, 'shank0');
        // shank0.visible = false;
        //
        // this.weaponGfx.push(shank0);
    }

    create () {

        this.backToMainButton();

        this.inventoryGridBackground();

        this.equippedGridBackground();

        this.drawInventoryItems();

        //ItemHoverBG
        let itemHoverBG = this.game.add.bitmapData(200, 350);
        itemHoverBG.ctx.beginPath();
        itemHoverBG.ctx.rect(0, 0, 200, 150);
        itemHoverBG.ctx.fillStyle = '#000000';
        itemHoverBG.ctx.fill();
        this.hoverItemBG = this.game.add.sprite(0, 0, itemHoverBG);
        this.hoverItemBG.alpha = 0.5;
        this.hoverItemBG.visible = false;

        //item hover text
        this.inventoryItem = this.add.text(this.hoverItemBG.position.x+5, this.hoverItemBG.position.y+5, '');
        this.inventoryItem.font = 'Nunito';
        this.inventoryItem.fontSize = 11;
        this.inventoryItem.fill = '#FFFFFF';

        //Player Stats
        this.playerInfo = this.add.text(50, 120, '');
        this.playerInfo.font = 'Nunito';
        this.playerInfo.fontSize = 12;
        this.playerInfo.fill = '#000000';
        this.playerInfo2 = this.add.text(200, 120, '');
        this.playerInfo2.font = 'Nunito';
        this.playerInfo2.fontSize = 12;
        this.playerInfo2.fill = '#000000';

        this.playerInfoTitle = this.add.text(50, 100, 'Character');
        this.playerInfoTitle.font = 'Nunito';
        this.playerInfoTitle.fontSize = 15;
        this.playerInfoTitle.fill = '#000000';
    }

    updateCharacterText(){

        this.playerInfo.text = `Level: ${this.game.player.level} \n`;
        this.playerInfo.text += `Health: ${this.game.player.battleStats.currentHealth}/${this.game.player.battleStats.health} \n`;
        this.playerInfo.text += `Exp: ${this.game.player.exp}, Next Level: ${playerLevels[this.game.player.level].maxExp - this.game.player.exp} \n\n`;
        this.playerInfo.text += `Main Attributes: \n`;
        this.playerInfo.text += `Strength: ${this.game.player.battleStats.strength} \n`;
        this.playerInfo.text += `Dexterity: ${this.game.player.battleStats.dexterity} \n`;
        this.playerInfo.text += `Vitality: ${this.game.player.battleStats.vitality} \n`;
        this.playerInfo.text += `Wisdom: ${this.game.player.battleStats.wisdom} \n`;

        this.playerInfo2.text = `Dmg: ${this.game.player.battleStats.dmg.min} - ${this.game.player.battleStats.dmg.max} \n`;
        this.playerInfo2.text += `Armor: ${this.game.player.battleStats.armor} \n\n\n`;
        this.playerInfo2.text += `Gold: ${this.game.player.gold} \n`;
        this.playerInfo2.text += `Carried Weight: ${this.game.player.battleStats.totalWeight}`;
    }

    backToMainButton(){
        this.game.add.existing(this.inventoryBtn);

        this.inventoryText = this.add.text(150, 50, '<- Go Back  ');
        this.inventoryText.font = 'Nunito';
        this.inventoryText.fontSize = 28;
        this.inventoryText.fill = '#111111';
        this.inventoryText.anchor.setTo(0.5);
    }

    backToMain () {
        this.state.start('MainMenu');
    }

    equippedGridBackground(){

        this.equippedSlots = this.game.add.group();

        let equipmentSlotSprites = [
            {w: 252, h: 264, x: -20, y: -10},
            {w:64, h:96, x:0, y:74},//left hand
            {w:64, h:96, x:74, y:74},//torso
            {w:64, h:96, x:148, y:74},//right hand
            {w:64, h:64, x:74, y:0},//head
            {w:64, h:64, x:74, y:180},//feet
            {w:32, h:32, x:-10, y:180},//access1
            {w:32, h:32, x:32, y:180},//access2
            {w:32, h:32, x:148, y:180},//access3
            {w:32, h:32, x:190, y:180}//access4
        ];

        equipmentSlotSprites.forEach((seed, index) => {
            let bgbmd = this.game.add.bitmapData(seed.w, seed.h);
            bgbmd.ctx.beginPath();
            bgbmd.ctx.rect(0, 0, seed.w, seed.h);
            if(index == 0){
                bgbmd.ctx.fillStyle = '#676767';
            } else {
                bgbmd.ctx.fillStyle = '#CDCDCD';
            }

            bgbmd.ctx.fill();
            let equipSlotSprite = this.game.add.sprite(seed.x, seed.y, bgbmd);
            switch(index){
            case 1: equipSlotSprite.type = 'leftHand';
                break;
            case 3: equipSlotSprite.type = 'rightHand';
                break;
            case 2: equipSlotSprite.type = 'body';
                break;
            case 4: equipSlotSprite.type = 'head';
                break;
            case 5: equipSlotSprite.type = 'feet';
                break;
            case 6: equipSlotSprite.type = 'accessory1';
                break;
            case 7: equipSlotSprite.type = 'accessory2';
                break;
            case 8: equipSlotSprite.type = 'accessory3';
                break;
            case 9: equipSlotSprite.type = 'accessory4';
                break;
            case 0:
            default: equipSlotSprite.type = null;
                break;

            }
            this.equippedSlots.add(equipSlotSprite);
        });

        this.equippedSlots.position.x = this.game.world.centerX + 90;
        this.equippedSlots.position.y = 50;

    }

    mouseOverEquipmentSlot(mouse, item){
        let hitSlot = false;
        let slots = this.equippedSlots.children;
        if(
            mouse.x >= this.equippedSlots.position.x &&
            mouse.x <= (this.equippedSlots.position.x + this.equippedSlots.width) &&
            mouse.y >= this.equippedSlots.position.y &&
            mouse.y <= (this.equippedSlots.position.y + this.equippedSlots.height)
        ){
            for(let i = 1; i < slots.length; i++){
                if(
                    mouse.x >= slots[i].position.x + this.equippedSlots.position.x &&
                    mouse.x <= (slots[i].position.x + this.equippedSlots.position.x + slots[i].width) &&
                    mouse.y >= slots[i].position.y + this.equippedSlots.position.y &&
                    mouse.y <= (slots[i].position.y + this.equippedSlots.position.y + slots[i].height)
                ){
                    if(  (item.inventoryType == 'hand' && (['leftHand', 'rightHand']).indexOf(slots[i].type) > -1)
                      || (item.inventoryType == 'head' && slots[i].type == 'head')
                      || (item.inventoryType == 'body' && slots[i].type == 'body')
                      || (item.inventoryType == 'feet' && slots[i].type == 'feet')
                      || (item.inventoryType == 'accessory' && slots[i].type == 'accessory')
                    ){
                        hitSlot = slots[i];
                    }
                }
            }
        }

        return hitSlot;
    }

    inventoryGridBackground(){

        let width = 65*10; // example;
        let height = 65*4; // example;
        let bgbmd = this.game.add.bitmapData(width+10, height+10);
        bgbmd.ctx.beginPath();
        bgbmd.ctx.rect(0, 0, width+10, height+10);
        bgbmd.ctx.fillStyle = '#131313';
        bgbmd.ctx.fill();
        this.inventoryGridSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY+150, bgbmd);
        this.inventoryGridSprite.anchor.setTo(0.5, 0.5);

        let backpack = this.game.player.backpack;

        for(let i=0; i< backpack.length; i++){
            for(let j=0; j< backpack[i].length; j++){
                let slot = backpack[i][j];
                slot.bmd = this.game.add.bitmapData(64, 64);
                slot.bmd.ctx.beginPath();
                slot.bmd.ctx.rect(0, 0, 64, 64);
                slot.bmd.ctx.fillStyle = '#ffffff';



                slot.bmd.ctx.fill();

                let offset = {x: ((65*j)+1), y:((65*i)+1)};
                let x = (this.inventoryGridSprite.position.x - this.inventoryGridSprite.width/2) + offset.x + 5;
                let y = (this.inventoryGridSprite.position.y - this.inventoryGridSprite.height/2) + offset.y + 5;
                slot.sprite = this.game.add.sprite(x, y, slot.bmd);
                if(backpack[i][j].invItem != -1){
                    slot.sprite.tint = 0xCDCDCD;
                }
            }
        }

    }

    addBackPackSprite(item, gridPos){
        let drawnObject;
        let width = item.shapeWidth*54;
        let height = item.shapeHeight*54;
        let bmd = this.game.add.bitmapData(width, height);

        let invSlot = item.inventorySlot;
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, item.shapeWidth*54, item.shapeHeight*54);
        bmd.ctx.fillStyle = '#ababab';
        bmd.ctx.fill();
        //console.log('--placing piece at x,y:', gridPos.x + (65*invSlot.x)+((65*item.shapeWidth - 54*item.shapeWidth)/2), gridPos.y + (65*invSlot.y)+((65*item.shapeHeight - 54*item.shapeHeight)/2));
        if(item.sprite){
            drawnObject = this.game.add.sprite(gridPos.x + (65*invSlot.x)+((65*item.shapeWidth - (item.shapeWidth*54))/2), gridPos.y + (65*invSlot.y)+((65*item.shapeHeight - (item.shapeHeight*54))/2), item.sprite);
        } else {
            drawnObject = this.game.add.sprite(gridPos.x + (65*invSlot.x)+((65*item.shapeWidth - 54*item.shapeWidth)/2), gridPos.y + (65*invSlot.y)+((65*item.shapeHeight - 54*item.shapeHeight)/2), bmd);
        }
        drawnObject.inputEnabled = true;
        drawnObject.input.enableDrag();
        drawnObject.originalPosition = drawnObject.position.clone();
        //console.log('-- invSprite events:', drawnObject.events);
        drawnObject.events.onInputOut.add(() => {
            this.stopHoverItem();
        }, this);
        drawnObject.events.onInputOver.add((drawnObject, mousePos) => {
            this.hoverInvItem(drawnObject, mousePos, item);
        }, this);
        drawnObject.events.onDragStop.add((drawnObject, mousePos) => {
            this.stopDrag(drawnObject, item, gridPos, mousePos);
        }, this);
        drawnObject.events.onDragStart.add(function(sprite){
            this.startDrag(sprite, item);
        }, this);

        this.inventoryItemsGroup.add(drawnObject);

        // if(item.sprite){
        //     let shank = this.game.add.sprite(gridPos.x + (65*invSlot.x)+((65*item.shapeWidth - (item.shapeWidth*54))/2), gridPos.y + (65*invSlot.y)+((65*item.shapeHeight - (item.shapeHeight*54))/2), item.sprite);
        //
        //     shank.inputEnabled = true;
        //     shank.input.enableDrag();
        //     shank.originalPosition = shank.position.clone();
        //
        //     this.inventoryItemsGroup.add(shank);
        //     drawnObject.itemSprite = shank;
        // }
    }

    addEquippedSprite(item, gridPos, key){
        let slotSprite = this.equippedSlots.children.filter((sprite) => {
            return sprite.type == key;
        })[0];

        let drawnObject;
        let width = item.shapeWidth*27;
        let height = item.shapeHeight*27;
        let bmd = this.game.add.bitmapData(width, height);

        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, item.shapeWidth*27, item.shapeHeight*27);
        bmd.ctx.fillStyle = '#ababab';
        bmd.ctx.fill();
        //console.log('--placing piece at x,y:', gridPos.x + (65*invSlot.x)+((65*item.shapeWidth - 54*item.shapeWidth)/2), gridPos.y + (65*invSlot.y)+((65*item.shapeHeight - 54*item.shapeHeight)/2));
        if(item.sprite){
            drawnObject = this.game.add.sprite(this.equippedSlots.position.x + slotSprite.position.x + ((slotSprite.width - item.shapeWidth*27)/2), this.equippedSlots.position.y + slotSprite.position.y + ((slotSprite.height - (item.shapeHeight*27))/2), item.sprite);
            drawnObject.scale.x = 0.5;
            drawnObject.scale.y = 0.5;
        } else {
            drawnObject = this.game.add.sprite(this.equippedSlots.position.x + slotSprite.position.x + ((slotSprite.width - 27*item.shapeWidth)/2), this.equippedSlots.position.y + slotSprite.position.y + ((slotSprite.height - 27*item.shapeHeight)/2), bmd);
        }


        drawnObject.inputEnabled = true;
        drawnObject.input.enableDrag();
        drawnObject.originalPosition = drawnObject.position.clone();
        //console.log('-- invSprite events:', drawnObject.events);
        drawnObject.events.onInputOut.add(() => {
            this.stopHoverItem();
        }, this);
        drawnObject.events.onInputOver.add((drawnObject, mousePos) => {
            this.hoverInvItem(drawnObject, mousePos, item);
        }, this);
        drawnObject.events.onDragStop.add((drawnObject, mousePos) => {
            this.stopDrag(drawnObject, item, gridPos, mousePos);
        }, this);
        drawnObject.events.onDragStart.add(function(sprite){
            this.startDrag(sprite, item, true);
        }, this);

        this.equippedItemsGroup.add(drawnObject);

        // if(item.sprite){
        //     let shank = this.game.add.sprite(this.equippedSlots.position.x + slotSprite.position.x + ((slotSprite.width - item.shapeWidth*27)/2), this.equippedSlots.position.y + slotSprite.position.y + ((slotSprite.height - (item.shapeHeight*27))/2), item.sprite);
        //     shank.scale.x = 0.5;
        //     shank.scale.y = 0.5;
        //     shank.inputEnabled = true;
        //     shank.input.enableDrag();
        //     shank.originalPosition = shank.position.clone();
        //
        //     this.equippedItemsGroup.add(shank);
        //     drawnObject.itemSprite = shank;
        // }
    }

    drawInventoryItems(){

        let gridPos = {x: this.inventoryGridSprite.position.x - this.inventoryGridSprite.width/2 + 5, y: this.inventoryGridSprite.position.y - this.inventoryGridSprite.height/2 + 5};
        this.inventoryItemsGroup = this.game.add.group();
        this.equippedItemsGroup = this.game.add.group();

        this.game.player.inventory.forEach((item) => {
            this.addBackPackSprite(item, gridPos);
        });

        Object.keys(this.game.player.equipped).forEach((key) => {
            let item = this.game.player.equipped[key];
            if(item){
                this.addEquippedSprite(item, gridPos, key);
            }
        });
    }

    startDrag(sprite, item, equipped=false){
        if(equipped){
            utils.unequipItem(this.game.player, item);
        } else {
            utils.removeItemFromBackpack(this.game.player.backpack, item);
        }
        this.stopHoverItem();
    }

    stopDrag(currentSprite, item, gridPos, mouse){
        let mouseCollidesInvSlot = false;
        let slot = {x:0,y:0};

        //Dropping Item inside Inventory Grid
        if(
            mouse.x >= gridPos.x &&
            mouse.x <= (gridPos.x + this.inventoryGridSprite.width) &&
            mouse.y >= gridPos.y &&
            mouse.y <= (gridPos.y + this.inventoryGridSprite.height)
        ){
            // let insideX = mouse.x - gridPos.x;
            // let insideY = mouse.y - gridPos.y;

            let spriteX = currentSprite.position.x - gridPos.x;
            let spriteY = currentSprite.position.y - gridPos.y;

            //let mouseTile = {x: Math.floor(insideX/65), y: Math.floor(insideY/65)};
            let spriteTile = {x: Math.floor(spriteX/65), y: Math.floor(spriteY/65)};

            //console.log('--inv dropped on mouseTile, spriteTile:', mouseTile, spriteTile);

            currentSprite.position.x = gridPos.x + (65*spriteTile.x)+((65*item.shapeWidth - 54*item.shapeWidth)/2);
            currentSprite.position.y = gridPos.y + (65*spriteTile.y)+((65*item.shapeHeight - 54*item.shapeHeight)/2);
            mouseCollidesInvSlot = true;
            slot = spriteTile;
        }

        let equipSlot = this.mouseOverEquipmentSlot(mouse, item);
        if(currentSprite.parent == this.equippedItemsGroup){
            if(mouseCollidesInvSlot){
                let fits = utils.placeItemInSlot(this.game.player, item, slot);
                if(fits){
                    //utils.unequipItem(this.game.player, item);
                    currentSprite.kill();
                    this.addBackPackSprite(item, gridPos);
                } else {
                    currentSprite.position.copyFrom(currentSprite.originalPosition);
                    utils.equipItem(this.game.player, item, {type: item.inventorySlot});
                }
            } else if(equipSlot != undefined && equipSlot != false && this.game.player.equipped[equipSlot.type] == null){
                utils.equipItem(this.game.player, item, equipSlot);
                this.addEquippedSprite(item, gridPos, equipSlot.type);
            } else {
                currentSprite.position.copyFrom(currentSprite.originalPosition);
                utils.equipItem(this.game.player, item, {type: item.inventorySlot});
            }
        } else {
            if(mouseCollidesInvSlot){
                utils.placeItemInSlot(this.game.player, item, slot);
            } else if(equipSlot != undefined && equipSlot != false){
                utils.equipItem(this.game.player, item, equipSlot);
                this.addEquippedSprite(item, gridPos, equipSlot.type);
                currentSprite.kill();
            } else {
                currentSprite.position.copyFrom(currentSprite.originalPosition);
                utils.placeItemInSlot(this.game.player, item, item.inventorySlot);
            }
        }
        //console.log('--after stopDrag player.inv, backpack, equipped:', this.game.player.inventory, this.game.player.backpack, this.game.player.equipped);
    }

    hoverInvItem(sprite, mouse, item){
        this.hoverItemBG.position.x = mouse.x;
        this.hoverItemBG.position.y = mouse.y - 75;
        this.inventoryItem.position.x = mouse.x + 5;
        this.inventoryItem.position.y = mouse.y - 75 + 5;

        this.inventoryItem.text = `[${item.level}] ${item.name} \n`;
        if(item.ac != null){//armor
            this.inventoryItem.text += `AC: ${item.ac} \n`;
        } else if(item.dmg != null){//weapon
            this.inventoryItem.text += `Dmg: ${item.dmg.min} - ${item.dmg.max} \n`;
        }
        this.inventoryItem.text += `Durability: ${item.durability} \n`;
        this.inventoryItem.text += `Weight: ${item.weight} \n`;
        this.inventoryItem.text += `\n`;
        if(item.magic.effect.attribute != null){
            this.inventoryItem.text += `Magical Properties: \n`;
            this.inventoryItem.text += `${item.magic.effect.attribute} +${item.magic.effect.value}\n`;
        }

        this.hoverItemBG.visible = true;
        this.inventoryItem.visible = true;
    }

    stopHoverItem(){
        this.inventoryItem.text = '';
        this.hoverItemBG.visible = false;
        this.inventoryItem.visible = false;
    }

    render (){
        this.updateCharacterText();
        let time = Math.floor(this.time.totalElapsedSeconds());
        if(this.game.lastGameTime != time){
            this.game.lastGameTime = time;
            if(this.game.player.battleStats.currentHealth < this.game.player.battleStats.health){
                this.game.player.heal();
            }
        }
    }

}
