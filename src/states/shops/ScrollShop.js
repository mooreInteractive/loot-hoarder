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
        this.selectItem = this.selectItem.bind(this);
        this.selectedSprite;
        this.selectedItem;
        this.game.dialogueOpen = false;

        /* Restart Ads */
        let rand = Forge.rand(0,1000);
        document.querySelector('#lb').data = 'lb.html?rand='+rand;
    }

    create () {
        let bg = this.add.image(-100,-10,'sunny-hills');
        bg.scale.setTo(3.2);

        // this.buyBg = this.add.image(2,-71,'buy_bg');
        this.sellBg = this.add.image(2,-71,'scroll_shop_bg');

        this.mainNav = new MainNavigation(this.game, this, this.game.player.currentDungeon);

        let avatarSettings = {x: 200, y: 150, scale: 2};
        let hpSettings = {x: 203, y: this.game.world.height - 160 };
        this.avatar = new Avatar(this.game, this, avatarSettings, hpSettings, true, true); //Need to call avatar.update()

        this.Pixel36Black = {font: 'Press Start 2P', fontSize: 36, fill: '#000000' };
        this.Pixel36White = {font: 'Press Start 2P', fontSize: 36, fill: '#8989FF', align: 'center' };
        this.Pixel18Black = {font: 'Press Start 2P', fontSize: 18, fill: '#000000', align: 'center' };
        this.Pixel21Black = {font: 'Press Start 2P', fontSize: 21, fill: '#000000', align: 'center' };
        this.Pixel16Black = {font: 'Press Start 2P', fontSize: 16, fill: '#000000', align: 'center' };

        //Item Readout
        let itemBmd = this.add.bitmapData(500, 120);
        itemBmd.ctx.beginPath();
        itemBmd.ctx.rect(0, 0, 500, 120);
        itemBmd.ctx.fillStyle = '#F6F6F7';
        itemBmd.ctx.fill();
        this.add.sprite(145, 325, itemBmd);

        this.itemReadOut = new ItemReadOut(this.game, this, null, {x: 155, y: 335});

        this.invGridPos = {x: 59, y: 510};

        //sell Grid
        this.createSellGrid();

        //player gold
        this.playerGold = this.add.text(600, 485, '', this.Pixel21Black);
        this.playerGold.anchor.setTo(0.5);

        //inv label
        this.add.text(65, 460, 'your\ninventory', this.Pixel16Black);

    }

    createSellGrid(){
        this.sellGrid = new ItemGrid(
            this,
            null,
            null,
            this.selectItem,
            this.game.player.inventory,
            this.game.player.backpack,
            this.invGridPos,
            false
        );

        //sell item Button
        this.sellItemBtn = new Phaser.Button(this.game, 600, 380, 'yellowButton', this.idSelectedItem, this);
        this.sellItemBtn.anchor.setTo(0.5);
        this.sellItemBtn.scale.setTo(1, 2);
        this.add.existing(this.sellItemBtn);
        this.sellItemBtnText = this.add.text(600, 380, 'Identify\n100g', this.Pixel18Black);
        this.sellItemBtnText.align = 'center';
        this.sellItemBtnText.anchor.setTo(0.5);

        this.sellItemBtn.visible = false;
        this.sellItemBtnText.visible = false;
    }

    resetSelectedItem(){
        this.itemReadOut.clearItem();
        this.selectedSprite = null;
        this.selectedItem = null;
    }

    idSelectedItem(){
        let cost = 100;
        new Dialogue(this.game, this, 'bool', 'scrollkeeper', `You wish to identify this\nscroll for ${cost} gold?`, (reply)=>{
            if(reply == 'yes'){
                if(this.game.player.gold >= cost){
                    this.game.player.gold -= cost;
                    Utils.identifyScroll(this.selectedItem);
                    this.game.player.savePlayerData();
                    this.selectItem(this.selectedSprite, this.selectedItem);
                } else {
                    let short = cost - this.game.player.gold;
                    new Dialogue(this.game, this, 'ok', 'scrollkeeper', `You're short about\n${short} gold.`, ()=>{});
                }
            }
        });
    }

    selectItem(sprite, item){
        if(this.selectedSprite != null){
            this.selectedSprite.tint = 0xffffff;
        }
        this.selectedSprite = sprite;
        this.selectedSprite.tint = 0xe5e5FF;
        this.selectedItem = item;
        this.itemReadOut.updateItem(item);

        let unknownScroll = item.name == 'Unknown Scroll';
        this.sellItemBtn.visible = unknownScroll;
        this.sellItemBtnText.visible = unknownScroll;
    }

    update(){
        this.playerGold.text = 'gold:' + this.game.player.gold;
        this.avatar.update();
    }

}
