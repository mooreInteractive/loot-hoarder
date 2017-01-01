import Phaser from 'phaser';
import ItemGrid from '../../components/ItemGrid';
import * as Utils from '../../utils';
import * as Forge from '../../items/Forge';
import ItemReadOut from '../../components/ItemReadOut';
import MainNavigation from '../../components/MainNavigation';
import Dialogue from '../../components/Dialogue';

export default class extends Phaser.State {
    init(){
        this.selectItemToBuy = this.selectItemToBuy.bind(this);
        this.selectItemToSell = this.selectItemToSell.bind(this);
        this.selectedSprite;
        this.selectedItem;

        this.items = [];
        this.backpack = this.createBackpack();
        this.generateShopItems();

        /* Restart Ads */
        let rand = Forge.rand(0,1000);
        document.querySelector('#lb').data = 'lb.html?rand='+rand;
    }

    create () {
        this.add.image(0,0,'field-blue');

        this.buyBg = this.add.image(2,-21,'buy_bg');
        this.sellBg = this.add.image(2,-21,'sell_bg');

        this.mainNav = new MainNavigation(this.game, this, this.game.player.currentDungeon);

        this.Pixel36Black = {font: 'Press Start 2P', fontSize: 36, fill: '#000000' };
        this.Pixel36White = {font: 'Press Start 2P', fontSize: 36, fill: '#8989FF', align: 'center' };
        this.Pixel18Black = {font: 'Press Start 2P', fontSize: 18, fill: '#000000', align: 'center' };
        this.Pixel21Black = {font: 'Press Start 2P', fontSize: 21, fill: '#000000', align: 'center' };

        //Item Readout
        this.itemReadOut = new ItemReadOut(this.game, this, null, {x: 155, y: 385});

        this.invGridPos = {x: 59, y: 560};

        //buy and sell tab Buttons
        let buyBmd = this.add.bitmapData(90, 49);
        // buyBmd.ctx.beginPath();
        // buyBmd.ctx.rect(0, 0, 90, 49);
        // buyBmd.ctx.fillStyle = '#131313';
        // buyBmd.ctx.fill();
        this.buyBtn = new Phaser.Button(this.game, 105, 530, buyBmd, this.showBuyGrid, this);
        this.buyBtn.anchor.setTo(0.5);
        this.add.existing(this.buyBtn);
        this.buyBtnText = this.add.text(105, 535, 'BUY', this.Pixel21Black);
        this.buyBtnText.anchor.setTo(0.5);

        let sellBmd = this.add.bitmapData(92, 50);
        this.sellBtn = new Phaser.Button(this.game, 207, 530, sellBmd, this.showSellGrid, this);
        this.sellBtn.anchor.setTo(0.5);
        this.add.existing(this.sellBtn);
        this.sellBtnText = this.add.text(207, 535, 'SELL', this.Pixel21Black);
        this.sellBtnText.anchor.setTo(0.5);

        //buy grid
        this.createBuyGrid();

        //sell Grid
        this.createSellGrid();

        //player gold
        this.playerGold = this.add.text(600, 535, '', this.Pixel21Black);
        this.playerGold.anchor.setTo(0.5);

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

        //buy price

        this.buyPrice = this.add.text(470, 310, '', this.Pixel36White);

        //buy item Button
        this.buyItemBtn = new Phaser.Button(this.game, 540, 425, 'redButton', this.buySelectedItem, this);
        this.buyItemBtn.anchor.setTo(0.5);
        this.add.existing(this.buyItemBtn);
        this.buyItemBtnText = this.add.text(540, 428, 'BUY ITEM', this.Pixel18Black);
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

        //sell price
        this.sellPrice = this.add.text(470, 310, '', this.Pixel36White);

        //sell item Button
        this.sellItemBtn = new Phaser.Button(this.game, 540, 425, 'yellowButton', this.sellSelectedItem, this);
        this.sellItemBtn.anchor.setTo(0.5);
        this.add.existing(this.sellItemBtn);
        this.sellItemBtnText = this.add.text(540, 428, 'SELL ITEM', this.Pixel18Black);
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
        this.sellPrice.text = '';
        this.buyPrice.text = '';
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
            //Utils.placeItemInSlot(this.backpack, this.items, item, null);
        }
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

        this.buyPrice.text = 'cost\n' + Math.ceil(item.value*1.15);

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

        this.sellPrice.text = 'worth\n' + item.value;

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
    }

}
