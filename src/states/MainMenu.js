import Phaser from 'phaser';
import * as Forge from '../weapons/Forge';
import {playerLevels} from '../data/levels';
import { placeItemInSlot } from '../utils';

export default class extends Phaser.State {
    init () {
        this.inventoryOpen = false;
        this.game.player.savePlayerData();
        this.lootKeepBtns = [];
        this.lootSellBtns = [];
    }

    create () {
        //clear data button
        this.clearDataBtn = new Phaser.Button(this.game, this.game.world.width - 50, 0, 'redButton', this.clearPlayerData, this);
        this.clearDataBtn.scale.x = 0.2;
        this.game.add.existing(this.clearDataBtn);

        //Inv Button
        this.inventoryBtn = new Phaser.Button(this.game, 150, 50, 'blueButton', this.openInventory, this);
        this.inventoryBtn.anchor.setTo(0.5);
        this.game.add.existing(this.inventoryBtn);

        this.inventoryText = this.add.text(150, 50, 'Inventory');
        this.inventoryText.font = 'Nunito';
        this.inventoryText.fontSize = 28;
        this.inventoryText.fill = '#111111';
        this.inventoryText.anchor.setTo(0.5);

        //Raid Button
        this.raidBtn = new Phaser.Button(this.game, 150, 110, 'redButton', this.viewMap, this);
        this.raidBtn.anchor.setTo(0.5);
        this.game.add.existing(this.raidBtn);

        this.raidText = this.add.text(150, 110, 'Raid / Map');
        this.raidText.font = 'Nunito';
        this.raidText.fontSize = 28;
        this.raidText.fill = '#111111';
        this.raidText.anchor.setTo(0.5);

        this.errorText = this.add.text(this.game.world.centerX, this.game.world.centerY + 50, 'You\'re over-encumbered');
        this.errorText.font = 'Nunito';
        this.errorText.fontSize = 22;
        this.errorText.fill = '#DE1313';
        this.errorText.anchor.setTo(0.5);
        this.errorText.visible = false;

        this.healthText = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Health:');
        this.healthText.font = 'Nunito';
        this.healthText.fontSize = 22;
        this.healthText.fill = '#000000';
        this.healthText.anchor.setTo(0.5);

        this.dungeonText = this.add.text(250, 95, `Dungeon ${this.game.player.latestUnlockedDungeon}, Enemies Left: ${this.game.dungeons[this.game.player.latestUnlockedDungeon].enemiesLeft}`);
        this.dungeonText.font = 'Nunito';
        this.dungeonText.fontSize = 22;
        this.dungeonText.fill = '#000000';

        this.lootText = this.add.text(this.game.world.centerX - 150, this.game.world.centerY + 100, '');
        this.lootText.font = 'Nunito';
        this.lootText.fontSize = 22;
        this.lootText.fill = '#000000';

        //walkign man
        this.dude = this.game.add.sprite(this.game.world.centerX - 50, this.game.world.centerY - 220, 'walkingMan');
        this.dude.scale.setTo(1.5, 1.5);
        this.dude.animations.add('walk', [30,31,32,33,34,35,36,37,38], 30);
        this.dude.animations.play('walk', 18, true);

    }

    clearPlayerData(){
        if(localStorage){
            localStorage.removeItem('loot-hoarder-dungeons');
            localStorage.removeItem('loot-hoarder-player');
            window.location.reload();
        }
    }

    openInventory(){
        this.state.start('Inventory');
    }

    viewMap(){
        this.errorText.visible = false;

        this.raidDungeon(this.game.dungeons[this.game.player.latestUnlockedDungeon]);
        //this.game.player.inventory.push(newRandWeapon);
    }

    raidDungeon(dungeon){
        let player = this.game.player;
        if(player.battleStats.currentHealth > 1){
            let loot = [];
            for(let i = 0; i < dungeon.enemies.length; i++){
                let enemy = dungeon.enemies[i];
                dungeon.enemies[i].originalHp = dungeon.enemies[i].hp;
                while(enemy.hp > 0){
                    let strike = Forge.rand(player.battleStats.dmg.min, player.battleStats.dmg.max);
                    enemy.hp -= strike;
                    player.battleStats.currentHealth -= enemy.dps;
                    if(player.battleStats.currentHealth < 1){ break; }
                }
                if(player.battleStats.currentHealth < 1){ break; }
                if(enemy.hp < 1){//killed an enemey
                    //get loot
                    let lootChance = Forge.rand(enemy.dps,4);
                    if( lootChance == 3 ){
                        loot.push(Forge.build(enemy.dps,4));
                    }
                    //get exp
                    player.exp += enemy.dps + enemy.originalHp;
                    //remove enemy from dungeon
                    dungeon.enemies.splice(i, 1);
                    i -= 1;
                    dungeon.enemiesLeft -= 1;
                }
            }
            if(player.battleStats.currentHealth < 1){
                this.errorText.text = 'You\'re tired. ';
                if(loot.length > 0){
                    this.errorText.text += 'loot: ' + loot.length;
                }
                this.errorText.visible = true;
            }

            this.dungeonText.text = `Dungeon ${this.game.player.latestUnlockedDungeon}, Enemies Left: ${this.game.dungeons[this.game.player.latestUnlockedDungeon].enemiesLeft}`;

            //Dungeon Done
            if(this.game.dungeons[this.game.player.latestUnlockedDungeon].enemiesLeft < 1){
                this.game.player.latestUnlockedDungeon += 1;
                if(this.game.player.latestUnlockedDungeon > 2){
                    this.game.player.latestUnlockedDungeon = 2;
                }
                this.dungeonText.text = `Dungeon ${this.game.player.latestUnlockedDungeon}, Enemies Left: ${this.game.dungeons[this.game.player.latestUnlockedDungeon].enemiesLeft}`;
            }
            //level up?
            if(player.exp > playerLevels[player.level].maxExp){
                player.level += 1;
                this.errorText.text += 'Level Up!';
                this.errorText.visible = true;
            }


            this.saveDungeonData();
            this.game.player.savePlayerData();

            this.updateLootTextAndButtons(loot);

            console.log('--raid gave:', loot);
        } else {
            this.errorText.text = 'You should rest for a while.';
            this.errorText.visible = true;
        }
    }

    cleanUpLootButtons(){
        let allBtns = this.lootKeepBtns.concat(this.lootSellBtns);
        allBtns.forEach((btn) => {
            btn.kill();
        });
    }

    updateLootTextAndButtons(loot){
        this.lootText.text = '';

        this.cleanUpLootButtons();

        this.lootKeepBtns = [];
        this.lootSellBtns = [];

        loot.forEach((item, index) => {
            console.log('--loot text', item);
            this.lootText.text += `[${item.level}] ${item.name} \n`;
            this.lootText.text += `Dmg: ${item.dmg.min} - ${item.dmg.max} \n`;
            if(item.magic.effect.attribute != null){
                this.lootText.text += `${item.magic.effect.attribute} +${item.magic.effect.value}\n`;
            }
            this.lootText.text += `\n`;

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

            let addBtnText = this.add.text(this.game, this.game.world.centerX - 250, this.game.world.centerY + 125*(index+1), '+');
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

            let sellBtnText = this.add.text(this.game, this.game.world.centerX - 200, this.game.world.centerY + 125*(index+1), '$');
            sellBtnText.font = 'Nunito';
            sellBtnText.fontSize = 24;
            sellBtnText.fill = '#111111';
            sellBtnText.anchor.setTo(0.5);
            sellBtnText.visible = true;
        });

        // keep button click: //this.tryToPlaceItemInInventory(loot[i]);
    }

    tryToPlaceItemInInventory(item){
        let invSlots = this.game.player.backpack;
        let itemPlaced = false;
        for(let y = 0; y < invSlots.length; y++){//(row, y, slotsRow) => {
            let row = invSlots[y];
            for(let x = 0; x < row.length; x++){//row.forEach((slot, x, slotsCol) => {
                itemPlaced = placeItemInSlot(this.game.player, item, {x,y});
                if(itemPlaced){break;}
            }
            if(itemPlaced){break;}
        }
        if(itemPlaced === false){
            this.errorText.visible = true;
        }
        return itemPlaced;
        //console.log('--new item placed:', itemPlaced);
    }

    saveDungeonData(){
        if(localStorage){
            localStorage.setItem('loot-hoarder-dungeons', JSON.stringify(this.game.dungeons));
        }
    }

    update(){
        this.healthText.text = `Health: ${this.game.player.battleStats.currentHealth}/${this.game.player.battleStats.health}`;
    }

    render (){
        let time = Math.floor(this.time.totalElapsedSeconds());
        if(this.game.lastGameTime != time){
            this.game.lastGameTime = time;
            if(this.game.player.battleStats.currentHealth < this.game.player.battleStats.health){
                this.game.player.heal();

            }
        }
    }

}
