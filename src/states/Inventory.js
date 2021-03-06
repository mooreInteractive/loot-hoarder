import Phaser from 'phaser';
import * as utils from '../utils';
import MainNavigation from '../components/MainNavigation';
import Avatar from '../components/Avatar';
import ItemReadOut from '../components/ItemReadOut';
import ItemGrid from '../components/ItemGrid';

let newSpriteSets = ['swords', 'axes', 'misc_weap'];

export default class extends Phaser.State {
    constructor(){
        super();
        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        this.selectItem = this.selectItem.bind(this);
        this.openSkills = this.openSkills.bind(this);
    }

    init () {
        this.inventorySprites = [];
        this.selectedSprite = null;
        this.ghostedWeapon = null;
        this.currentDungeon = this.game.dungeons[this.game.player.currentDungeon];
    }

    preload () {
        this.add.image(0,0,'inv_bg');

        //Inventory Grid
        this.invGridPos = {x: 59, y: 560};
        this.invGrid = new ItemGrid(
            this,
            this.startDrag,
            this.stopDrag,
            this.selectItem,
            this.game.player.inventory,
            this.game.player.backpack,
            this.invGridPos
        );

        this.equippedGridBackground();
        this.drawInventoryItems();

        //let Pixel24Black = {font: 'Press Start 2P', fontSize: 36, fill: '#000000' };
        let Pixel24White = {font: 'Press Start 2P', fontSize: 36, fill: '#898989' };
        // let Pixel36Blue = {font: 'Press Start 2P', fontSize: 42, fill: '#527ee5' };
        let Pixel16White = {font: 'Press Start 2P', fontSize: 16, fill: '#FFFFFF' };

        //Player Stats
        this.playerInfo = this.add.text(180, 200, '', Pixel24White);
        this.playerInfo2 = this.add.text(470, 310, '', Pixel16White);

        //Item Read Out Text
        this.itemReadOut = new ItemReadOut(this.game, this, null, {x: 160, y: 440}, '#FFFFFF');

        this.itemActionButton = new Phaser.Button(this.game, 665, 485, 'greyButton', this.useItem, this);
        this.itemActionButton.scale.setTo(0.5, 1.5);
        this.itemActionButton.anchor.setTo(0.5);
        this.itemActionButton.visible = false;
        this.add.existing(this.itemActionButton);

        this.itemActionText = this.add.text(665, 485, 'use', Pixel16White);
        this.itemActionText.anchor.setTo(0.5);
        this.itemActionText.visible = false;
    }

    openSkills(){
        this.state.start('SkillTree');
    }

    create () {
        this.mainNav = new MainNavigation(this.game, this, this.currentDungeon);
        //Avatar
        let avatarSettings = {x: 220, y: 170, scale: 3};
        let hpSettings = {x: 203, y: this.game.world.height - 160};
        this.avatar = new Avatar(this.game, this, avatarSettings, hpSettings, true, true); //Need to call avatar.update()
    }

    useItem(){
        let player = this.game.player;
        let item = this.selectedItem;
        player.magicFX = this.selectedItem.magicFX;
        //clean up
        this.selectedItem = null;
        this.selectedSprite.destroy();
        this.selectedSprite = null;
        this.itemActionButton.visible = false;
        this.itemActionText.visible = false;
        let itemIndex = player.inventory.indexOf(item);
        if(itemIndex > -1){
            player.inventory.splice(itemIndex, 1);
        }

        player.backpack[item.inventorySlot.y][item.inventorySlot.x].invItem = -1;
        player.backpack[item.inventorySlot.y][item.inventorySlot.x].sprite.tint = 0xFFFFFF;
    }

    // plusClicked(index){
    //     this.game.player.skillUp(index);
    //     if(this.game.player.skillPoints < 1){
    //         this.plusBtns.forEach((btn) => {
    //             btn.visible = false;
    //         });
    //     }
    // }

    updateCharacterText(){

        // this.playerInfo.text = `Str: ${this.game.player.battleStats.strength} \n`;
        // this.playerInfo.text += `Dex: ${this.game.player.battleStats.dexterity} \n`;
        // this.playerInfo.text += `Vit: ${this.game.player.battleStats.vitality} \n`;
        // this.playerInfo.text += `Wis: ${this.game.player.battleStats.wisdom} \n`;

        this.playerInfo2.text = `Dmg: ${this.game.player.battleStats.dmg.min} - ${this.game.player.battleStats.dmg.max} \n`;
        this.playerInfo2.text += `Armor: ${this.game.player.battleStats.armor} \n`;
        this.playerInfo2.text += `Gold: ${this.game.player.gold} \n`;
        this.playerInfo2.text += `Weight: ${this.game.player.battleStats.totalWeight}`;
    }

    equippedGridBackground(){

        this.equippedSlots = this.game.add.group();

        let equipmentSlotSprites = [
            {w: 1, h: 1, x: -20, y: -10},
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
        if(
            mouse.x >= this.equippedSlots.position.x &&
            mouse.x <= (this.equippedSlots.position.x + this.equippedSlots.width) &&
            mouse.y >= this.equippedSlots.position.y &&
            mouse.y <= (this.equippedSlots.position.y + this.equippedSlots.height)
        ){
            let dropSlots = this.equippedSlots.filter((slot)=>{
                if(item.inventoryType == 'hand' && (['leftHand', 'rightHand']).indexOf(slot.type) > -1){
                    return true;
                } else if((item.inventoryType == 'accessory' && (['accessory1','accessory2','accessory3','accessory4']).indexOf(slot.type) > -1)){
                    return true;
                } else {
                    return slot.type == item.inventoryType;
                }
            }).list;//foreach is returning an arrayList object thingy.

            if(dropSlots.length == 1){
                //console.log('-mouseOverEquipmentSlot:', slots[i], slots[i].type, this.game.player.equipped);
                hitSlot = dropSlots[0];
            } else if(dropSlots.length == 2){//hands
                if(dropSlots.length == 2){
                    let player = this.game.player;
                    let leftSlot = dropSlots[0];
                    let rightSlot = dropSlots[1];
                    let leftHandEmpty = player.equipped[leftSlot.type] == null;
                    let rightHandEmpty = player.equipped[rightSlot.type] == null;
                    let leftTwoHanded = player.equipped[leftSlot.type] ? (player.equipped[leftSlot.type].hands > 1 && !player.skills.includes('two-handed1hand')) : false;
                    let rightTwoHanded = player.equipped[rightSlot.type] ? (player.equipped[rightSlot.type].hands > 1 && !player.skills.includes('two-handed1hand')) : false;
                    let itemTwoHanded = item.hands > 1 && !player.skills.includes('two-handed1hand');
                    //left empty
                    if(leftHandEmpty && !rightHandEmpty){
                        hitSlot = leftSlot;
                        if(itemTwoHanded || rightTwoHanded || (!player.skills.includes('two-one-handed'))){
                            hitSlot = rightSlot;
                        }
                    }
                    //right Empty
                    if(!leftHandEmpty && rightHandEmpty){
                        hitSlot = rightSlot;
                        if(itemTwoHanded || leftTwoHanded || (!player.skills.includes('two-one-handed'))){
                            hitSlot = leftSlot;
                        }
                    }
                    //both Empty
                    if(leftHandEmpty && rightHandEmpty){
                        hitSlot = leftSlot;
                    }
                    //both full
                    if(!leftHandEmpty && !rightHandEmpty){
                        if(!itemTwoHanded){
                            hitSlot = leftSlot;
                        }
                    }
                }
            } else if(dropSlots.length == 4){//accessories
                let emptySlot;
                dropSlots.forEach(slot => {
                    if(!emptySlot){
                        if(this.game.player.equipped[slot.type] == null){
                            emptySlot = slot;
                        }
                    }
                });
                if(!emptySlot){
                    hitSlot = dropSlots[3];//replace the last one?
                } else {
                    hitSlot = emptySlot;
                }
            }
        }

        return hitSlot;
    }

    addEquippedSprite(item, key, ghost=false){
        let slotSprite = this.equippedSlots.children.filter((sprite) => {
            return sprite.type == key;
        })[0];

        let drawnObject;
        let drawnBackground;
        let width = item.shapeWidth*27;
        let height = item.shapeHeight*27;

        let bmd = this.game.add.bitmapData(width, height);
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, item.shapeWidth*27, item.shapeHeight*27);
        bmd.ctx.fillStyle = '#ababab';
        bmd.ctx.fill();

        let spritePos = {
            x: this.equippedSlots.position.x + slotSprite.position.x + ((slotSprite.width - item.shapeWidth*27)/2),
            y: this.equippedSlots.position.y + slotSprite.position.y + ((slotSprite.height - (item.shapeHeight*27))/2)
        };

        drawnBackground = this.game.add.sprite(spritePos.x, spritePos.y, bmd);

        let useNewSprite = (newSpriteSets).indexOf(item.sprite) > -1;
        //console.log('--placing piece at x,y:', gridPos.x + (65*invSlot.x)+((65*item.shapeWidth - 54*item.shapeWidth)/2), gridPos.y + (65*invSlot.y)+((65*item.shapeHeight - 54*item.shapeHeight)/2));
        if(item.sprite){
            let heightOffset = [0, 0, 0, 16.5];
            let newSpriteOffset = {
                y: useNewSprite ? heightOffset[item.shapeHeight] : 0,
                x: useNewSprite ? 3 : 0
            }; //TODO
            drawnObject = drawnBackground.addChild(this.game.make.sprite(newSpriteOffset.x, newSpriteOffset.y, item.sprite));
            drawnObject.scale.x = 0.5;
            drawnObject.scale.y = 0.5;
            if(useNewSprite){
                drawnObject.frame = item.frame;
            }
        } else {
            drawnObject = drawnBackground.addChild(this.game.make.sprite(spritePos.x, spritePos.y, bmd));
        }

        ([drawnBackground]).forEach((sprite) => {
            if(!ghost){
                sprite.inputEnabled = true;
                sprite.input.enableDrag();
                sprite.originalPosition = drawnBackground.position.clone();

                sprite.events.onInputDown.add((sprite) => {
                    //this.hoverInvItem(drawnObject, mousePos, item);
                    this.selectItem(sprite, item);
                }, this);
                sprite.events.onInputOver.add((sprite) => {
                    //this.hoverInvItem(drawnObject, mousePos, item);
                    this.selectItem(sprite, item);
                }, this);
                sprite.events.onDragStop.add((sprite, mousePos) => {
                    this.stopDrag(sprite, item, mousePos);
                }, this);
                sprite.events.onDragStart.add(function(sprite){
                    this.startDrag(sprite, item, this.equippedItemsGroup, true);
                }, this);
            } else {
                sprite.alpha = 0.5;
            }
        });

        drawnBackground.inventoryType = key;

        if(item.hands > 1 && !ghost && !this.game.player.skills.includes('two-handed1hand')){
            this.addSecondHandGhostImage(item, key);
        } else if(ghost){
            this.ghostedWeapon = drawnBackground;
        }
        this.equippedItemsGroup.add(drawnBackground);
    }

    addSecondHandGhostImage(item, key){
        let otherKey = (['leftHand', 'rightHand']).filter(slotType => { return slotType != key; });
        this.addEquippedSprite(item, otherKey[0], true);
    }

    selectItem(sprite, item){
        //item sprite
        if(this.selectedSprite != null){
            this.selectedSprite.tint = '0xffffff';
        }
        this.selectedSprite = sprite;
        this.selectedSprite.tint = '0xe5e5FF';
        //item object
        this.selectedItem = item;
        this.itemReadOut.updateItem(item);
        if(item.type === 'misc' && item.identified === true){
            this.itemActionButton.visible = true;
            this.itemActionText.visible = true;
            this.itemActionText.text = item.buttonText;
        } else {
            this.itemActionButton.visible = false;
            this.itemActionText.visible = false;
        }
    }

    drawInventoryItems(){
        this.equippedItemsGroup = this.game.add.group();

        Object.keys(this.game.player.equipped).forEach((key) => {
            let item = this.game.player.equipped[key];
            if(item){
                this.addEquippedSprite(item, key);
            }
        });
    }

    startDrag(sprite, item, itemGroup=null, equipped=false){
        // console.log('draggin item:', item, sprite);
        this.game.world.bringToTop(itemGroup);
        if(equipped){
            if(item.hands > 1 && this.ghostedWeapon){
                this.ghostedWeapon.destroy();
            }
            utils.unequipItem(this.game.player, item);
        } else {
            utils.removeItemFromBackpack(this.game.player.backpack, item);
        }
    }

    mouseOverBackPackGrid(currentSprite, item, gridPos, mouse){
        let slot = null;
        if(
            mouse.x >= gridPos.x &&
            mouse.x <= (gridPos.x + 650) &&
            mouse.y >= gridPos.y &&
            mouse.y <= (gridPos.y + 260)
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

    stopDrag(currentSprite, item, mouse){
        let gridPos = this.invGridPos;
        //Getting Drop Zone
        let slot = this.mouseOverBackPackGrid(currentSprite, item, gridPos, mouse);
        let equipSlot = this.mouseOverEquipmentSlot(mouse, item);

        if(currentSprite.parent == this.equippedItemsGroup){
            this.dropEquippedItem(slot, equipSlot, item, currentSprite);
        } else {
            this.dropBackpackItem(slot, equipSlot, item, currentSprite);
        }

        // console.log('--after stopDrag player.inv, backpack, equipped:', this.game.player.inventory, this.game.player.backpack, this.game.player.equipped);
    }

    dropEquippedItem(slot, equipSlot, item, currentSprite){
        if(slot){
            //into backpack grid...
            let fits = utils.placeItemInSlot(this.game.player.backpack, this.game.player.inventory, item, slot);
            if(fits){
                //console.log('------fits.');
                //utils.unequipItem(this.game.player, item);
                this.invGrid.addItemSprite(item);
                //this.addBackPackSprite(item);
                currentSprite.destroy();
            } else {
                //doesn't fit, send back to origin
                currentSprite.position.copyFrom(currentSprite.originalPosition);
                utils.equipItem(this.game.player, item, {type: item.inventorySlot});
                if(item.hands > 1){
                    this.addSecondHandGhostImage(item, item.inventorySlot);
                }
            }
        } else if( equipSlot != undefined && equipSlot != false
                && this.game.player.equipped[equipSlot.type] == null){
            utils.equipItem(this.game.player, item, equipSlot);
            this.addEquippedSprite(item, equipSlot.type);
            currentSprite.destroy();
        } else {
            currentSprite.position.copyFrom(currentSprite.originalPosition);
            utils.equipItem(this.game.player, item, {type: item.inventorySlot});
            if(item.hands > 1){
                this.addSecondHandGhostImage(item, item.inventorySlot);
            }
        }
    }

    dropBackpackItem(slot, equipSlot, item, currentSprite){
        // console.log('--dropping backPack Item...');
        if(slot){
            // console.log('----on inventory slot...');
            let fits = utils.placeItemInSlot(this.game.player.backpack, this.game.player.inventory, item, slot);
            if(fits){
                currentSprite.originalPosition = currentSprite.position.clone();
            } else {
                // console.log('------doesnt fit, return to origin');
                this.returnItemToOrigin(currentSprite, item);
            }
        } else if(equipSlot != undefined && equipSlot != false){
            //replacing an already equipped item
            let replacingItem = this.game.player.equipped[equipSlot.type];
            if(replacingItem != null){
                // console.log('replacing item:', replacingItem);
                if(replacingItem.hands > 1 && this.ghostedWeapon){
                    this.ghostedWeapon.destroy();
                }

                let fits = utils.placeItemInSlot(this.game.player.backpack, this.game.player.inventory, replacingItem, item.inventorySlot);
                if(!fits){ console.log('it doesnt fit in backpack?'); return;}

                utils.unequipItem(this.game.player, replacingItem);
                this.invGrid.addItemSprite(replacingItem);
                this.equippedItemsGroup.children.filter(child => {
                    return child.inventoryType == equipSlot.type;
                })[0].destroy();
            }
            //equipping item
            utils.equipItem(this.game.player, item, equipSlot);
            this.addEquippedSprite(item, equipSlot.type);
            currentSprite.destroy();

        } else {
            // console.log('----on nothing, return to origin...');
            this.returnItemToOrigin(currentSprite, item);
        }
    }

    returnItemToOrigin(sprite, item){
        //sprite.parent.setAll('position', sprite.originalPosition.clone());
        sprite.position.copyFrom(sprite.originalPosition);
        utils.placeItemInSlot(this.game.player.backpack, this.game.player.inventory, item, item.inventorySlot);
    }

    update(){
        this.updateCharacterText();
        this.avatar.update();
        this.mainNav.update(this.currentDungeon);
    }

}
