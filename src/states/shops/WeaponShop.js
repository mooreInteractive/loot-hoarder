import Phaser from 'phaser';
import ItemGrid from '../../components/ItemGrid';
import * as Utils from '../../utils';
import * as Forge from '../../items/Forge';
import ItemReadOut from '../../components/ItemReadOut';
import MainNavigation from '../../components/MainNavigation';
import Dialogue from '../../components/Dialogue';
import Avatar from '../../components/Avatar';

export default class extends Phaser.State {
    init(){
        this.selectItemToBuy = this.selectItemToBuy.bind(this);
        this.selectItemToSell = this.selectItemToSell.bind(this);
        this.selectedSprite;
        this.selectedItem;
        this.game.dialogueOpen = false;

        this.items = this.game.shopItems;
        let time = Math.floor((new Date).getTime()/1000);
        let refreshTime = parseInt(this.game.lastShopRefresh) + 14400;
        if(refreshTime <= time || this.items.length == 0){
            this.game.lastShopRefresh = time;
            if(localStorage){
                localStorage.setItem('loot-hoarder-shop-time', time);
            }

            this.items = [];
            this.backpack = this.createBackpack();
            this.generateShopItems();
        } else {
            this.backpack = this.createBackpack();
            this.addItemsToBackpack();
        }

        /* Restart Ads */
        let rand = Forge.rand(0,1000);
        document.querySelector('#lb').data = 'lb.html?rand='+rand;
    }

    create () {
        this.add.image(0,0,'field-blue');

        this.buyBg = this.add.image(2,-71,'buy_bg');
        this.sellBg = this.add.image(2,-71,'sell_bg');

        this.mainNav = new MainNavigation(this.game, this, this.game.player.currentDungeon);

        let avatarSettings = {x: 200, y: 150, scale: 2};
        let hpSettings = {x: 203, y: this.game.world.height - 160 };
        this.avatar = new Avatar(this.game, this, avatarSettings, hpSettings, true, true); //Need to call avatar.update()

        this.Pixel36Black = {font: 'Press Start 2P', fontSize: 36, fill: '#000000' };
        this.Pixel36White = {font: 'Press Start 2P', fontSize: 36, fill: '#8989FF', align: 'center' };
        this.Pixel18Black = {font: 'Press Start 2P', fontSize: 18, fill: '#000000', align: 'center' };
        this.Pixel21Black = {font: 'Press Start 2P', fontSize: 21, fill: '#000000', align: 'center' };

        //Item Readout
        let itemBmd = this.add.bitmapData(500, 120);
        itemBmd.ctx.beginPath();
        itemBmd.ctx.rect(0, 0, 500, 120);
        itemBmd.ctx.fillStyle = '#F6F6F7';
        itemBmd.ctx.fill();
        this.add.sprite(145, 325, itemBmd);

        this.itemReadOut = new ItemReadOut(this.game, this, null, {x: 155, y: 335});

        this.invGridPos = {x: 59, y: 510};

        //buy and sell tab Buttons
        let buyBmd = this.add.bitmapData(90, 49);
        // buyBmd.ctx.beginPath();
        // buyBmd.ctx.rect(0, 0, 90, 49);
        // buyBmd.ctx.fillStyle = '#131313';
        // buyBmd.ctx.fill();
        this.buyBtn = new Phaser.Button(this.game, 105, 480, buyBmd, this.showBuyGrid, this);
        this.buyBtn.anchor.setTo(0.5);
        this.add.existing(this.buyBtn);
        this.buyBtnText = this.add.text(105, 485, 'BUY', this.Pixel21Black);
        this.buyBtnText.anchor.setTo(0.5);

        let sellBmd = this.add.bitmapData(92, 50);
        this.sellBtn = new Phaser.Button(this.game, 207, 480, sellBmd, this.showSellGrid, this);
        this.sellBtn.anchor.setTo(0.5);
        this.add.existing(this.sellBtn);
        this.sellBtnText = this.add.text(207, 485, 'SELL', this.Pixel21Black);
        this.sellBtnText.anchor.setTo(0.5);

        //buy grid
        this.createBuyGrid();

        //sell Grid
        this.createSellGrid();

        //player gold
        this.playerGold = this.add.text(600, 485, '', this.Pixel21Black);
        this.playerGold.anchor.setTo(0.5);

        //shop refresh timer text
        this.shopTimer = this.add.text(384, 805, '', this.Pixel21Black);
        this.shopTimer.anchor.setTo(0.5);

        this.showBuyGrid();
    }

    createBuyGrid(){
        this.buyGrid = new ItemGrid(
            this,
            null,
            null,
            this.selectItemToBuy,
            this.items,
            this.backpack,
            this.invGridPos,
            false
        );

        //buy item Button
        this.buyItemBtn = new Phaser.Button(this.game, 540, 380, 'redButton', this.buySelectedItem, this);
        this.buyItemBtn.anchor.setTo(0.5);
        this.buyItemBtn.scale.setTo(1,2);
        this.add.existing(this.buyItemBtn);
        this.buyItemBtnText = this.add.text(540, 383, 'BUY ITEM', this.Pixel18Black);
        this.buyItemBtnText.anchor.setTo(0.5);
    }

    createSellGrid(){
        this.sellGrid = new ItemGrid(
            this,
            null,
            null,
            this.selectItemToSell,
            this.game.player.inventory,
            this.game.player.backpack,
            this.invGridPos,
            false
        );

        //sell item Button
        this.sellItemBtn = new Phaser.Button(this.game, 540, 380, 'yellowButton', this.sellSelectedItem, this);
        this.sellItemBtn.anchor.setTo(0.5);
        this.sellItemBtn.scale.setTo(1,2);
        this.add.existing(this.sellItemBtn);
        this.sellItemBtnText = this.add.text(540, 383, 'SELL ITEM', this.Pixel18Black);
        this.sellItemBtnText.anchor.setTo(0.5);
    }

    showBuyGrid(){
        this.buyGrid.show();
        this.sellGrid.hide();
        this.resetSelectedItem();
        this.buyBg.visible = true;
        this.sellBg.visible = false;
    }

    showSellGrid(){
        this.buyGrid.hide();
        this.sellGrid.show();
        this.resetSelectedItem();
        this.buyBg.visible = false;
        this.sellBg.visible = true;
    }

    resetSelectedItem(){
        this.itemReadOut.clearItem();
        this.selectedSprite = null;
        this.selectedItem = null;

        this.buyItemBtn.visible = false;
        this.buyItemBtnText.visible = false;

        this.sellItemBtn.visible = false;
        this.sellItemBtnText.visible = false;
    }

    generateShopItems(){
        let amount = 8;
        for(let i = 0; i < amount; i++){
            let item = Forge.getRandomWeapon(1, this.game.player.level+1);
            let placed = Utils.tryToPlaceItemInBackpack(item, this.items, this.backpack);
            if(!placed){
                break;
            }
        }
        this.game.shopItems = this.items;
        if(localStorage){
            localStorage.setItem('loot-hoarder-shop', JSON.stringify(this.items));
        }
    }

    addItemsToBackpack(){
        this.items.forEach((item) => {
            Utils.tryToPlaceItemInBackpack(item, this.items, this.backpack);
        });
    }

    buySelectedItem(){
        let sellValue = Math.ceil(this.selectedItem.value*1.15);
        console.log('Buying Item:', this.selsectedItem);
        if(this.game.player.gold >= sellValue){
            console.log('Player has enough gold...');
            let soldItem = JSON.parse(JSON.stringify(this.selectedItem));
            let placed = Utils.tryToPlaceItemInBackpack(soldItem, this.game.player.inventory, this.game.player.backpack);

            if(placed){
                //buyGrid
                Utils.removeItemFromBackpack(this.backpack, this.selectedItem);
                this.buyGrid.itemsGroup.remove(this.selectedSprite);
                this.selectedSprite.destroy();

                //sell grid
                this.sellGrid.addItemSprite(soldItem);

                //this
                this.items.splice(this.items.indexOf(this.selectedItem), 1);
                this.resetSelectedItem();

                //player
                this.game.player.gold -= sellValue;
                this.game.player.savePlayerData();//save game here since gold and inventory updated

                //game shop Data
                this.game.shopItems = this.items;
                if(localStorage){
                    localStorage.setItem('loot-hoarder-shop', JSON.stringify(this.items));
                }
            } else {
                new Dialogue(this.game, this, 'ok', 'shopkeeper', 'Uhh, You don\'t have space in your inventory to carry that!', ()=>{});
            }
        } else {
            new Dialogue(this.game, this, 'ok', 'shopkeeper', 'Hehe, You don\'t have enough coin for that purchase mate!', ()=>{});
        }
    }

    sellSelectedItem(){
        new Dialogue(this.game, this, 'bool', 'shopkeeper', `Are you sure you want to sell me '${this.selectedItem.name}' for ${this.selectedItem.value} gold?`, (reply)=>{
            if(reply == 'yes'){
                //ItemGrid
                //buyGrid
                Utils.removeItemFromBackpack(this.game.player.backpack, this.selectedItem);
                this.sellGrid.itemsGroup.remove(this.selectedSprite);
                this.selectedSprite.destroy();

                //player
                let inv = this.game.player.inventory;
                inv.splice(inv.indexOf(this.selectedItem), 1);
                this.game.player.gold += this.selectedItem.value;
                this.game.player.savePlayerData();

                //this
                this.resetSelectedItem();
            }
        });
    }

    selectItemToBuy(sprite, item){
        if(this.selectedSprite != null){
            this.selectedSprite.tint = 0xffffff;
        }
        this.selectedSprite = sprite;
        this.selectedSprite.tint = 0xe5e5FF;
        this.selectedItem = item;
        this.itemReadOut.updateItem(item);

        let cost = Math.ceil(item.value*1.15) > 0 ? Math.ceil(item.value*1.15) : 1;
        this.buyItemBtnText.text = `BUY ITEM\n${cost}g`;

        this.buyItemBtn.visible = true;
        this.buyItemBtnText.visible = true;
    }

    selectItemToSell(sprite, item){
        if(this.selectedSprite != null){
            this.selectedSprite.tint = 0xffffff;
        }
        this.selectedSprite = sprite;
        this.selectedSprite.tint = 0xe5e5FF;
        this.selectedItem = item;
        this.itemReadOut.updateItem(item);

        this.sellItemBtnText.text = `SELL ITEM\n${item.value}g`;

        this.sellItemBtn.visible = true;
        this.sellItemBtnText.visible = true;
    }

    createBackpack(){
        return (
            [[{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1}],
            [{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1}],
            [{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1}],
            [{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1}]]
        );
    }

    update(){
        this.playerGold.text = 'gold:' + this.game.player.gold;

        let time = Math.floor((new Date).getTime()/1000);
        let refreshTime = parseInt(this.game.lastShopRefresh) + 14400;
        this.timeLeft = refreshTime - time;
        this.shopTimer.text = `Shop inventory refresh: ${Utils.convertSecondsToTimeWithHours(this.timeLeft)}`;

        this.avatar.update();
    }

}
