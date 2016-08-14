import Phaser from 'phaser';
import * as utils from '../utils';
import {playerLevels} from '../data/levels';
import MainNavigation from '../components/MainNavigation';
import Avatar from '../components/Avatar';

export default class extends Phaser.State {
    init () {
        this.inventorySprites = [];
        this.inventoryGridSprite;
    }

    preload () {

        let avatarSettings = {x: 50, y: 115, scale: 2};
        let hpSettings = {x: this.game.world.centerX, y: this.game.world.height - 220 };
        this.avatar = new Avatar(this.game, this, avatarSettings, hpSettings, true); //Need to call avatar.update()

        this.inventoryGridBackground();
        this.equippedGridBackground();
        this.drawInventoryItems();

        //ItemHoverBG
        let itemHoverBG = this.add.bitmapData(200, 350);
        itemHoverBG.ctx.beginPath();
        itemHoverBG.ctx.rect(0, 0, 200, 150);
        itemHoverBG.ctx.fillStyle = '#000000';
        itemHoverBG.ctx.fill();
        this.hoverItemBG = this.add.sprite(0, 0, itemHoverBG);
        this.hoverItemBG.alpha = 0.8;
        this.hoverItemBG.visible = false;

        let Oswald14White = {font: 'Oswald', fontSize: 14, fill: '#FFFFFF' };
        let Oswald24Black = {font: 'Oswald', fontSize: 24, fill: '#000000' };
        let Oswald24BlackCenter = {font: 'Oswald', fontSize: 24, fill: '#000000', align: 'center' };
        //item hover text
        this.inventoryItem = this.add.text(this.hoverItemBG.position.x+5, this.hoverItemBG.position.y+5, '', Oswald14White);

        //Player Stats
        this.playerInfo = this.add.text(100, 75, '', Oswald24Black);
        this.playerInfo2 = this.add.text(450, 320, '', Oswald24Black);

        //skillPoint + Buttons
        let Oswald36Blue = {font: 'Oswald', fontSize: 36, fill: '#1313DE'};

        this.plusBtns = [
            this.add.text(75, 248, '+', Oswald36Blue),
            this.add.text(75, 285, '+', Oswald36Blue),
            this.add.text(75, 322, '+', Oswald36Blue),
            this.add.text(75, 359, '+', Oswald36Blue)
        ];

        this.add.text(this.game.world.width - 230, this.game.world.height - 160, 'drop items in shop\nto sell them', Oswald24BlackCenter);



        this.plusBtns.forEach((btn, index) => {
            console.log('player:', this.game.player);
            btn.visible = this.game.player.skillPoints > 0;
            btn.inputEnabled = true;
            btn.events.onInputDown.add(this.plusClicked.bind(this, index), this);
            btn.input.useHandCursor = true;
        });

    }

    create () {
        new MainNavigation(this.game, this);
    }

    plusClicked(index){
        this.game.player.skillUp(index);
        if(this.game.player.skillPoints < 1){
            this.plusBtns.forEach((btn) => {
                btn.visible = false;
            });
        }
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
        this.playerInfo2.text += `Armor: ${this.game.player.battleStats.armor} \n`;
        this.playerInfo2.text += `Gold: ${this.game.player.gold} \n`;
        this.playerInfo2.text += `Carried Weight: ${this.game.player.battleStats.totalWeight}`;
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
                      || (item.inventoryType == 'accessory' && (['accessory1','accessory2','accessory3','accessory4']).indexOf(slots[i].type) > -1)
                    ){
                        console.log('-mouseOverEquipmentSlot:', slots[i], slots[i].type, this.game.player.equipped);
                        if(this.game.player.equipped[slots[i].type] == null){
                            hitSlot = slots[i];
                        }
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
        //console.log('-startDrag(sprite, item, equipped)', sprite, item, equipped);
        if(equipped){
            utils.unequipItem(this.game.player, item);
        } else {
            utils.removeItemFromBackpack(this.game.player.backpack, item);
        }
        this.stopHoverItem();
    }

    mouseOverBackPackGrid(currentSprite, item, gridPos, mouse){
        let slot = null;
        if(
            mouse.x >= gridPos.x &&
            mouse.x <= (gridPos.x + this.inventoryGridSprite.width) &&
            mouse.y >= gridPos.y &&
            mouse.y <= (gridPos.y + this.inventoryGridSprite.height)
        ){
            // let insideX = mouse.x - gridPos.x;
            // let insideY = mouse.y - gridPos.y;
            let weaponOnGridPos = this.game.player.inventory.filter((item) => {
                return item.inventorySlot.x == gridPos.x && item.inventorySlot.y == gridPos.y;
            });

            if(weaponOnGridPos.length > 0){
                console.log('_-__Occupado__-__');
            } else {

                let spriteX = currentSprite.position.x - gridPos.x;
                let spriteY = currentSprite.position.y - gridPos.y;

                //let mouseTile = {x: Math.floor(insideX/65), y: Math.floor(insideY/65)};
                let spriteTile = {x: Math.floor(spriteX/65), y: Math.floor(spriteY/65)};

                //console.log('--inv dropped on mouseTile, spriteTile:', mouseTile, spriteTile);

                currentSprite.position.x = gridPos.x + (65*spriteTile.x)+((65*item.shapeWidth - 54*item.shapeWidth)/2);
                currentSprite.position.y = gridPos.y + (65*spriteTile.y)+((65*item.shapeHeight - 54*item.shapeHeight)/2);

                slot = spriteTile;
            }
        }

        return slot;
    }

    mouseOverShop(mouse){
        let shop = {x:this.game.world.width - 150, y:this.game.world.height - 50, width: 228, height: 73.5};

        if( //Dropping on the Shop
            mouse.x >= (shop.x - shop.width * 0.5) &&
            mouse.x <= ((shop.x - shop.width * 0.5) + shop.width) &&
            mouse.y >= (shop.y - shop.height * 0.5) &&
            mouse.y <= ((shop.y - shop.height * 0.5) + shop.height)
        ){
            return true;
        }

        return false;
    }

    stopDrag(currentSprite, item, gridPos, mouse){
        //console.log('-stopDrag(sprite, item, gridPos)', currentSprite, item, gridPos);

        //Getting Drop Zone
        let slot = this.mouseOverBackPackGrid(currentSprite, item, gridPos, mouse);
        let equipSlot = this.mouseOverEquipmentSlot(mouse, item);
        let shopSlot = this.mouseOverShop(mouse);

        if(currentSprite.parent == this.equippedItemsGroup){
            console.log('--dropping equipped Item...');
            if(slot){
                console.log('----on inventory slot...');
                let fits = utils.placeItemInSlot(this.game.player, item, slot);
                if(fits){
                    console.log('------fits.');
                    //utils.unequipItem(this.game.player, item);
                    this.addBackPackSprite(item, gridPos);
                    currentSprite.destroy();
                } else {
                    console.log('------doesnt fit, return to origin');
                    currentSprite.position.copyFrom(currentSprite.originalPosition);
                    utils.equipItem(this.game.player, item, {type: item.inventorySlot});
                }
            } else if(equipSlot != undefined && equipSlot != false && this.game.player.equipped[equipSlot.type] == null){
                console.log('----on equip slot...');
                utils.equipItem(this.game.player, item, equipSlot);
                this.addEquippedSprite(item, gridPos, equipSlot.type);
            } else if(shopSlot){
                console.log('----on shop Slot...');
                this.game.player.gold += item.value;
                let itemIndex = this.game.player.inventory.indexOf(item);
                this.game.player.inventory.splice(itemIndex, 1);
                currentSprite.destroy();
                this.game.player.savePlayerData();
            } else {
                console.log('----on nothing, return to origin...');
                currentSprite.position.copyFrom(currentSprite.originalPosition);
                utils.equipItem(this.game.player, item, {type: item.inventorySlot});
            }
        } else {
            console.log('--dropping backPack Item...');
            if(slot){
                console.log('----on inventory slot...');
                let fits = utils.placeItemInSlot(this.game.player, item, slot);
                if(fits){
                    console.log('------fits.');
                    currentSprite.originalPosition = currentSprite.position.clone();
                } else {
                    console.log('------doesnt fit, return to origin');
                    this.returnItemToOrigin(currentSprite, item);
                }
            } else if(equipSlot != undefined && equipSlot != false){
                console.log('----on equip slot...');
                utils.equipItem(this.game.player, item, equipSlot);
                this.addEquippedSprite(item, gridPos, equipSlot.type);
                currentSprite.destroy();
            } else if(shopSlot){
                console.log('----on shop Slot...');
                this.game.player.gold += item.value;
                let itemIndex = this.game.player.inventory.indexOf(item);
                this.game.player.inventory.splice(itemIndex, 1);
                currentSprite.destroy();
                this.game.player.savePlayerData();
            } else {
                console.log('----on nothing, return to origin...');
                this.returnItemToOrigin(currentSprite, item);
            }
        }
        console.log('--after stopDrag player.inv, backpack, equipped:', this.game.player.inventory, this.game.player.backpack, this.game.player.equipped);
    }

    returnItemToOrigin(sprite, item){
        sprite.position.copyFrom(sprite.originalPosition);
        utils.placeItemInSlot(this.game.player, item, item.inventorySlot);
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
        this.avatar.update();
    }

}
