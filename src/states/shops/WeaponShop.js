import Phaser from 'phaser';
import ItemGrid from '../../components/ItemGrid';
import * as Utils from '../../utils';
import * as Forge from '../../items/Forge';
import ItemReadOut from '../../components/ItemReadOut';

export default class extends Phaser.State {
    init(){
        this.selectItemToBuy = this.selectItemToBuy.bind(this);
        this.selectItemToSell = this.selectItemToSell.bind(this);
        this.selectedSprite;

        this.items = [];
        this.backpack = this.createBackpack();
        this.generateShopItems();
    }

    create () {
        this.add.image(0,0,'field-blue');
        let Pixel36Black = {font: 'Press Start 2P', fontSize: 36, fill: '#000000' };

        //Item Readout
        this.itemReadOut = new ItemReadOut(this.game, this, null, {x: 155, y: 435});

        this.invGridPos = {x: 59, y: 560};

        //buy and sell tab Buttons
        this.buyBtn = new Phaser.Button(this.game, 150, 525, 'greyButton', this.showBuyGrid, this);
        this.buyBtn.anchor.setTo(0.5);
        this.add.existing(this.buyBtn);
        this.buyBtnText = this.add.text(150, 528, 'BUY', Pixel36Black);
        this.buyBtnText.anchor.setTo(0.5);

        this.sellBtn = new Phaser.Button(this.game, 350, 525, 'greyButton', this.showSellGrid, this);
        this.sellBtn.anchor.setTo(0.5);
        this.add.existing(this.sellBtn);
        this.sellBtnText = this.add.text(350, 528, 'SELL', Pixel36Black);
        this.sellBtnText.anchor.setTo(0.5);

        //buy grid
        this.createBuyGrid();

        //sell Grid
        this.createSellGrid();

        //player gold

        let goldLabel = 'gold:' + this.game.player.gold;
        this.playerGold = this.add.text(500, 15, goldLabel, Pixel36Black);
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
        let Pixel36White = {font: 'Press Start 2P', fontSize: 36, fill: '#8989FF', align: 'center' };
        this.buyPrice = this.add.text(470, 310, '', Pixel36White);
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

        //buy grid is default, so hide this one on creation
        this.sellGrid.hide();

        //buy price
        let Pixel36White = {font: 'Press Start 2P', fontSize: 36, fill: '#8989FF', align: 'center' };
        this.sellPrice = this.add.text(470, 310, '', Pixel36White);
    }

    showBuyGrid(){
        this.buyGrid.show();
        this.sellGrid.hide();
        this.sellPrice.text = '';
        this.buyPrice.text = '';
    }

    showSellGrid(){
        this.buyGrid.hide();
        this.sellGrid.show();
        this.sellPrice.text = '';
        this.buyPrice.text = '';
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

    selectItemToBuy(sprite, item){
        if(this.selectedSprite != null){
            this.selectedSprite.tint = 0xffffff;
        }
        this.selectedSprite = sprite;
        this.selectedSprite.tint = 0xe5e5FF;
        this.selectedItem = item;
        this.itemReadOut.updateItem(item);

        this.buyPrice.text = 'cost\n' + item.value;
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
    }

    createBackpack(){
        return (
            [[{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1}],
            [{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1}],
            [{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1}],
            [{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1}]]
        );
    }

}
