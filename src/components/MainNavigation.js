import Phaser from 'phaser';
import * as StoryFunctions from './StoryFunctions';
import Dialogue from '../components/Dialogue';

export default class MainNavigation{
    constructor(game, gameState){
        this.game = game;
        this.loot = game.loot;
        this.gameState = gameState;
        this.currentDungeon = this.game.dungeons[this.game.player.currentDungeon];

        let bigBtnStyle = {fontSize: 48, font: 'Press Start 2P', fill: '#000000', align: 'center'};
        //let littleBtnStyle = {fontSize: 36, font: 'Press Start 2P', fill: '#000000', align: 'center'};
        this.smallBtnStyle = {fontSize: 36, font: 'Press Start 2P', fill: '#000000', align: 'center'};

        this.lootBtn = new Phaser.Button(this.game, this.game.world.width - 200, this.game.world.height - 210, 'greenButton', this.viewLoot, this);
        this.lootBtn.scale.setTo(1.8,1.5);
        this.lootBtn.anchor.setTo(0.5);
        this.lootBtn.alpha = 0.5;

        //Inv Button
        this.inventoryBtn = new Phaser.Button(this.game, 200, this.game.world.height - 60, 'blueButton', this.openInventory, this);
        this.inventoryBtn.scale.x = 1.8;
        this.inventoryBtn.scale.y = 1.5;
        this.inventoryBtn.anchor.setTo(0.5);

        //Main Left
        this.overworldLeftBtn = new Phaser.Button(this.game, 200, this.game.world.height - 60, 'greyButton', this.openMain, this);
        this.overworldLeftBtn.scale.x = 1.8;
        this.overworldLeftBtn.scale.y = 1.5;
        this.overworldLeftBtn.anchor.setTo(0.5);

        //Main Right
        this.overworldRightBtn = new Phaser.Button(this.game, this.game.world.width - 200, this.game.world.height - 90, 'greyButton', this.openMain, this);
        this.overworldRightBtn.scale.x = 1.8;
        this.overworldRightBtn.scale.y = 3;
        this.overworldRightBtn.anchor.setTo(0.5);

        //Shop Button
        this.shopBtn = new Phaser.Button(this.game, this.game.world.width - 120, this.game.world.height - 90, 'yellowButton', this.openShop, this);
        this.shopBtn.scale.x = 1.8;
        this.shopBtn.scale.y = 3;
        this.shopBtn.anchor.setTo(0.5);

        //Shop Button
        this.townText = 'RAID';
        let townBtnColor = 'redButton';
        if(this.game.player.latestUnlockedDungeon > 1 && this.currentDungeon.level == 1){
            this.townText = 'SHOP';
            townBtnColor = 'yellowButton';
        } else if(this.game.player.latestUnlockedDungeon > 2 && this.currentDungeon.level == 2){
            this.townText = 'POTS';
            townBtnColor = 'yellowButton';
        } else if(this.game.player.latestUnlockedDungeon > 3 && this.currentDungeon.level == 3){
            this.townText = 'SCROLLS';
            townBtnColor = 'yellowButton';
        }
        this.raidBtn = new Phaser.Button(this.game, this.game.world.width - 200, this.game.world.height - 90, townBtnColor, this.raidCurrentDungeon, this);
        this.raidBtn.scale.x = 1.8;
        this.raidBtn.scale.y = 3;
        this.raidBtn.anchor.setTo(0.5);



        switch(this.gameState.key){
        case 'Inventory':
            this.game.add.existing(this.overworldLeftBtn);
            this.game.add.existing(this.raidBtn);

            this.overworldLeftText = this.gameState.add.text(200, this.game.world.height - 60, 'WORLD MAP', this.smallBtnStyle);
            this.overworldLeftText.anchor.setTo(0.5);

            this.raidText = this.gameState.add.text(this.game.world.width - 200, this.game.world.height - 90, this.townText, bigBtnStyle);
            this.raidText.anchor.setTo(0.5);


            this.gameState.add.existing(this.lootBtn);

            this.lootBtnText = this.gameState.add.text(this.game.world.width - 200, this.game.world.height - 210, 'LOOT', this.smallBtnStyle);
            this.lootBtnText.anchor.setTo(0.5);
            this.lootBtnText.alpha = 0.5;

            break;
        case 'MainMenu':
            this.game.add.existing(this.inventoryBtn);
            this.game.add.existing(this.raidBtn);

            this.inventoryText = this.gameState.add.text(200, this.game.world.height - 60, 'GEAR', this.smallBtnStyle);
            this.inventoryText.anchor.setTo(0.5);

            this.raidText = this.gameState.add.text(this.game.world.width - 200, this.game.world.height - 90, this.townText, bigBtnStyle);
            this.raidText.anchor.setTo(0.5);

            this.gameState.add.existing(this.lootBtn);

            this.lootBtnText = this.gameState.add.text(this.game.world.width - 200, this.game.world.height - 210, 'LOOT', this.smallBtnStyle);
            this.lootBtnText.anchor.setTo(0.5);
            this.lootBtnText.alpha = 0.5;
            break;
        case 'Options':
        case 'LootView':
            this.game.add.existing(this.inventoryBtn);
            this.game.add.existing(this.overworldRightBtn);

            this.inventoryText = this.gameState.add.text(200, this.game.world.height - 60, 'GEAR', this.smallBtnStyle);
            this.inventoryText.anchor.setTo(0.5);

            this.overworldRightText = this.gameState.add.text(this.game.world.width - 200, this.game.world.height - 90, 'WORLD\nMAP', bigBtnStyle);
            this.overworldRightText.anchor.setTo(0.5);
            break;
        }
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
        if(!this.game.player.story.chapter1.rescuedShopKeep){
            StoryFunctions.chapter1.shopNote(this.game, this.gameState);
        } else {
            console.log('Open The Shop ALREADY!');
        }
    }

    openScrollShop(){
        new Dialogue(this.game, this.gameState, 'bool', 'Drag scrolls here from your\n inventory to have them\nidentified. You know how\nscrolls work right?', (reply)=>{
            if(reply == 'yes'){
                new Dialogue(this.game, this.gameState, 'ok', 'Great!\nCome back when you have\nan unknwon scroll!', ()=>{});
            } else if(reply == 'no'){
                new Dialogue(this.game, this.gameState, 'ok', 'Once I\'ve identified them,\nyou can use them to gain\nmagical effects that will\naid you in battle.', ()=>{});
            }
        });
    }

    openPotionShop(){
        console.log('openning potion shop...');
        new Dialogue(this.game, this.gameState, 'bool', 'Buy a potion for 50 gold?', (reply)=>{
            if(reply == 'yes'){
                if(this.game.player.gold > 49){
                    this.game.player.gold -= 50;
                    this.game.player.potions += 1;
                    new Dialogue(this.game, this.gameState, 'ok', 'Here you go!\n(1 potion was added)', ()=>{});
                } else {
                    let short = 50 - this.game.player.gold;
                    new Dialogue(this.game, this.gameState, 'ok', `Looks like your short about\n${short} gold.`, ()=>{});
                }
            } else {
                new Dialogue(this.game, this.gameState, 'ok', 'Come back if you change your mind.', ()=>{});
            }
        });
    }

    raidCurrentDungeon(){
        if(this.townText == 'SHOP'){
            this.openShop();
        } else if(this.townText == 'POTS'){
            this.openPotionShop();
        } else if(this.townText == 'SCROLLS'){
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
                new Dialogue(this.game, this.gameState, 'ok', 'You should equip\nsomething before raiding...', ()=>{});
            } else {
                if(this.game.player.latestUnlockedDungeon >= dungeon.level){
                    if(this.game.player.battleStats.currentHealth > 1){
                        this.game.state.start('Raid', true, false, dungeon);
                    }
                } else {
                    new Dialogue(this.game, this.gameState, 'ok', 'Your shit\'s too weak son.', ()=>{});
                }
            }
        }


    }

    viewLoot(){
        if(this.game.loot.length > 0){
            this.game.state.start('LootView');
        }
    }

    startedDraggingItem(){
        this.draggingItem = true;
    }

    stoppedDraggingItem(){
        this.draggingItem = false;
    }

    update(currDungeon=null){
        if(currDungeon != null){
            this.currentDungeon = currDungeon;
        }
        let currHealth = this.game.player.battleStats.currentHealth;

        if(this.currentDungeon && this.raidBtn && this.raidText){
            this.townText = 'RAID';
            let townBtnColor = 'redButton';
            if(this.game.player.latestUnlockedDungeon > 1 && this.currentDungeon.level == 1){
                this.townText = 'SHOP';
                this.raidBtn.alpha = 1;
                this.raidText.alpha = 1;
                if(this.draggingItem){
                    townBtnColor = 'yellow_dotted';
                    this.raidText.text = 'SELL';
                    this.raidText.fill = '#ffd948';
                } else {
                    townBtnColor = 'yellowButton';
                    this.raidText.text = this.townText;
                    this.raidText.fill = '#000000';
                }
                this.raidBtn.loadTexture(townBtnColor);
            } else if(this.game.player.latestUnlockedDungeon > 2 && this.currentDungeon.level == 2){
                this.townText = 'POTS';
                this.raidBtn.alpha = 1;
                this.raidText.alpha = 1;
                townBtnColor = 'yellowButton';
                this.raidText.text = this.townText;
                this.raidText.fill = '#000000';
                this.raidBtn.loadTexture(townBtnColor);
            } else if(this.game.player.latestUnlockedDungeon > 3 && this.currentDungeon.level == 3){
                this.townText = 'SCROLLS';
                this.raidBtn.alpha = 1;
                this.raidText.alpha = 1;
                if(this.draggingItem){
                    townBtnColor = 'yellow_dotted';
                    this.raidText.text = 'ID';
                    this.raidText.fill = '#ffd948';
                } else {
                    townBtnColor = 'yellowButton';
                    this.raidText.text = this.townText;
                    this.raidText.fill = '#000000';
                }
                this.raidBtn.loadTexture(townBtnColor);
            } else{
                this.townText = 'RAID';
                townBtnColor = 'redButton';
                this.raidBtn.alpha = 1;
                this.raidText.alpha = 1;
                this.raidText.text = this.townText;
                this.raidBtn.loadTexture(townBtnColor);

                if(currHealth > 1 && this.currentDungeon.level <= this.game.player.latestUnlockedDungeon){
                    this.raidBtn.alpha = 1;
                    this.raidText.alpha = 1;
                } else {
                    this.raidBtn.alpha = 0.5;
                    this.raidText.alpha = 0.5;
                }
            }
        }

        if(this.lootBtn && this.lootBtnText){
            if(this.game.loot.length > 0){
                this.lootBtn.alpha = 1;
                this.lootBtnText.alpha = 1;
            } else {
                this.lootBtn.alpha = 0.5;
                this.lootBtnText.alpha = 0.5;
            }
        }
    }


}
