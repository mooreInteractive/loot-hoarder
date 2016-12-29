import Phaser from 'phaser';
import Dialogue from '../components/Dialogue';

export default class MainNavigation{
    constructor(game, gameState){
        this.game = game;
        this.loot = game.loot;
        this.gameState = gameState;
        this.currentDungeon = this.game.dungeons[this.game.player.currentDungeon];

        //GFX Behind NAV BG(Masked)
        //Shop Button
        let shop1 = this.game.player.latestUnlockedDungeon > 1 && this.currentDungeon.level == 1;
        let shop2 = this.game.player.latestUnlockedDungeon > 2 && this.currentDungeon.level == 2;
        let shop3 = this.game.player.latestUnlockedDungeon > 3 && this.currentDungeon.level == 3;
        this.raidShopSetting = 'raid';
        let shopRaidInitialPos = this.game.world.height - 133; //raid
        if(shop1||shop2||shop3){
            shopRaidInitialPos = this.game.world.height - 211; //shop
            this.raidShopSetting = 'shop';
        }
        this.raidBtn = new Phaser.Button(this.game, this.game.world.width - 306, shopRaidInitialPos, 'raid_shop_slider', this.raidCurrentDungeon, this);

        let raidBtnBg = this.game.add.graphics(0,0);
        raidBtnBg.beginFill(0x000000);
        raidBtnBg.drawRect(this.game.world.width - 306, this.game.world.height - 133, 258, 78);

        this.gameState.add.existing(this.raidBtn);
        //raid button Masked
        let mask = this.game.add.graphics(0,0);
        mask.beginFill('#FFFFFF');
        mask.drawRect(this.game.world.width - 306, this.game.world.height - 133, 258, 78);
        this.raidBtn.mask = mask;

        //BG
        this.game.add.image(0,this.game.world.height - 245,'main_nav_bg');

        //city name space
        let cityNameStyle = {fontSize: 20, font: 'Press Start 2P', fill: '#000000', align: 'center'};
        this.cityNameText = this.gameState.add.text(this.game.world.width - 175, this.game.world.height - 190, this.currentDungeon.name, cityNameStyle);
        this.cityNameText.anchor.setTo(0.5);

        //Inv Button
        this.inventoryBtn = new Phaser.Button(this.game, 140, this.game.world.height - 70, 'inventory_btn', this.openInventory, this);
        this.inventoryBtn.anchor.setTo(0.5);
        this.game.add.existing(this.inventoryBtn);

        //World Button
        this.worldBtn = new Phaser.Button(this.game, 210, this.game.world.height - 70, 'world_btn', this.openMain, this);
        this.worldBtn.anchor.setTo(0.5);
        this.game.add.existing(this.worldBtn);

    }

    openInventory(){
        if(this.gameState.key != 'Inventory'){
            this.gameState.state.start('Inventory');
        }
    }

    openMain(){
        if(this.gameState.key != 'MainMenu'){
            this.gameState.state.start('MainMenu');
        }
    }

    openShop(){
        this.game.storyEvents.notify(this.gameState, 'CLICK_SHOP');
    }

    openScrollShop(){
        new Dialogue(this.game, this.gameState, 'bool', 'scrollkeeper', 'Drag scrolls here from your inventory to have them identified. You know how scrolls work right?', (reply)=>{
            if(reply == 'yes'){
                new Dialogue(this.game, this.gameState, 'ok', 'scrollkeeper', 'Great! Come back when you have an unknwon scroll!', ()=>{});
            } else if(reply == 'no'){
                new Dialogue(this.game, this.gameState, 'ok', 'scrollkeeper', 'Once I\'ve identified them, you can use them to gain magical effects that will aid you in battle.', ()=>{});
            }
        });
    }

    openPotionShop(){
        console.log('openning potion shop...');
        new Dialogue(this.game, this.gameState, 'bool', 'potionkeeper', 'Buy a potion for 50 gold?', (reply)=>{
            if(reply == 'yes'){
                if(this.game.player.gold > 49){
                    this.game.player.gold -= 50;
                    this.game.player.potions += 1;
                    new Dialogue(this.game, this.gameState, 'ok', 'potionkeeper', 'Here you go! (1 potion was added)', ()=>{});
                } else {
                    let short = 50 - this.game.player.gold;
                    new Dialogue(this.game, this.gameState, 'ok', 'potionkeeper', `Looks like your short about ${short} gold.`, ()=>{});
                }
            } else {
                new Dialogue(this.game, this.gameState, 'ok', 'potionkeeper', 'Come back if you change your mind.', ()=>{});
            }
        });
    }

    raidCurrentDungeon(){
        if(this.raidShopSetting == 'shop' && this.currentDungeon.level == 1){
            this.openShop();
        } else if(this.raidShopSetting == 'shop' && this.currentDungeon.level == 2){
            this.openPotionShop();
        } else if(this.raidShopSetting == 'shop' && this.currentDungeon.level == 3){
            this.openScrollShop();
        } else {
            let equippedGear = false;
            let equipment = this.game.player.equipped;
            let dungeon = this.currentDungeon;

            Object.keys(equipment).forEach((slot) => {
                if(equipment[slot] != null){
                    equippedGear = true;
                    return;
                }
            });

            if(!equippedGear){
                new Dialogue(this.game, this.gameState, 'ok', 'shopkeeper', 'You should equip something before raiding...', ()=>{});
            } else {
                if(this.game.player.latestUnlockedDungeon >= dungeon.level){
                    if(this.game.player.battleStats.currentHealth > 1){
                        this.game.state.start('Raid', true, false, dungeon);
                    }
                } else {
                    new Dialogue(this.game, this.gameState, 'ok', 'shopkeeper', 'Your shit\'s too weak son.', ()=>{});
                }
            }
        }
    }

    startedDraggingItem(){
        this.draggingItem = true;
    }

    stoppedDraggingItem(){
        this.draggingItem = false;
    }

    animateRaidShopButtonTo(yPos){
        this.gameState.add.tween(this.raidBtn).to( {y: yPos}, 600, Phaser.Easing.Bounce.Out, true);
    }

    moveToShop(){
        this.animateRaidShopButtonTo(this.game.world.height - 211);
        this.raidShopSetting = 'shop';
        console.log('move to shop');
    }

    moveToSell(){
        this.animateRaidShopButtonTo(this.game.world.height - 289);
        this.raidShopSetting = 'sell';
        console.log('move to sell');
    }

    moveToRaid(){
        this.animateRaidShopButtonTo(this.game.world.height - 133);
        this.raidShopSetting = 'raid';
        console.log('move to raid');
    }

    update(currDungeon=null){
        if(currDungeon != null){
            this.currentDungeon = currDungeon;
        }
        //set city name text
        this.cityNameText.text = this.currentDungeon.name;
        let currHealth = this.game.player.battleStats.currentHealth;

        if(this.currentDungeon){
            this.raidBtn.alpha = 1;
            let shop1 = this.game.player.latestUnlockedDungeon > 1 && this.currentDungeon.level == 1;
            let shop2 = this.game.player.latestUnlockedDungeon > 2 && this.currentDungeon.level == 2;
            let shop3 = this.game.player.latestUnlockedDungeon > 3 && this.currentDungeon.level == 3;
            if(shop1||shop2||shop3){
                if(this.draggingItem){
                    if(this.raidShopSetting !== 'sell'){this.moveToSell();}
                } else {
                    if(this.raidShopSetting !== 'shop'){this.moveToShop();}
                }
            } else {
                if(currHealth > 1 && this.currentDungeon.level <= this.game.player.latestUnlockedDungeon){
                    this.raidBtn.alpha = 1;
                } else {
                    this.raidBtn.alpha = 0.5;
                }
                if(this.raidShopSetting !== 'raid'){this.moveToRaid();}
            }
        }
    }
}
