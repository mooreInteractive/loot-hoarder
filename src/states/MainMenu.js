import Phaser from 'phaser';
import LootList from '../components/LootList';

export default class extends Phaser.State {
    init (loot = []) {
        this.inventoryOpen = false;
        this.game.player.savePlayerData();
        this.loot = loot;
    }

    create () {
        this.lootList = new LootList(this.game, this.loot, this);
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

        //Raid Dungeons
        this.raidBtns = [];
        this.raidTexts = [];
        this.dungeonTexts = [];
        this.game.dungeons.forEach((dungeon, index)=> {
            let btn = new Phaser.Button(this.game, 150, 55 + 55*(index+1), 'redButton', this.viewMap.bind(this, dungeon), this);
            btn.anchor.setTo(0.5);
            this.game.add.existing(btn);
            this.raidBtns.push(btn);

            let raidText = this.add.text(150, 55 + 55*(index+1), `Raid D-${(index+1)}`);
            raidText.font = 'Nunito';
            raidText.fontSize = 28;
            raidText.fill = '#111111';
            raidText.anchor.setTo(0.5);
            this.raidTexts.push(raidText);

            let dungeonText = this.add.text(250, 45 + 55*(index+1), `Enemies Left: ${dungeon.enemiesLeft}`);
            dungeonText.font = 'Nunito';
            dungeonText.fontSize = 22;
            dungeonText.fill = '#000000';
            this.dungeonTexts.push(dungeonText);
        });



        this.errorText = this.add.text(this.game.world.centerX, this.game.world.centerY + 50, 'You\'re over-encumbered');
        this.errorText.font = 'Nunito';
        this.errorText.fontSize = 22;
        this.errorText.fill = '#DE1313';
        this.errorText.anchor.setTo(0.5);
        this.errorText.visible = false;

        /* Player Health Bar Graphic and Text */
        let healthBarBackgroundBitMap = this.game.add.bitmapData(106, 26);
        let healthBarBitMap = this.game.add.bitmapData(100, 20);

        healthBarBackgroundBitMap.ctx.beginPath();
        healthBarBackgroundBitMap.ctx.rect(0, 0, 106, 26);
        healthBarBackgroundBitMap.ctx.fillStyle = '#111111';
        healthBarBackgroundBitMap.ctx.fill();

        healthBarBitMap.ctx.beginPath();
        healthBarBitMap.ctx.rect(0, 0, 100, 20);
        healthBarBitMap.ctx.fillStyle = '#DE1111';
        healthBarBitMap.ctx.fill();

        this.healthBarBg = this.game.add.sprite(this.game.world.centerX-55, this.game.world.centerY-15, healthBarBackgroundBitMap);
        this.healthBar = this.game.add.sprite(this.game.world.centerX-52, this.game.world.centerY-12, healthBarBitMap);

        this.healthText = this.add.text(this.game.world.centerX - 50, this.game.world.centerY-12, 'Hp:');
        this.healthText.font = 'Nunito';
        this.healthText.fontSize = 14;
        this.healthText.fill = '#FFFFFF';

        //walkign man
        this.dude = this.game.add.sprite(this.game.world.centerX - 50, this.game.world.centerY - 120, 'walkingMan');
        this.dude.scale.setTo(1.5, 1.5);
        this.dude.animations.add('walk', [30,31,32,33,34,35,36,37,38], 18);
        this.dude.animations.play('walk', 18, true);

        this.lootList.updateLootTextAndButtons(this.loot);

    }

    clearPlayerData(){
        if(localStorage){
            localStorage.removeItem('loot-hoarder-dungeons');
            localStorage.removeItem('loot-hoarder-player');
            localStorage.removeItem('loot-hoarder-clock');
            window.location.reload();
        }
    }

    openInventory(){
        this.state.start('Inventory');
    }

    viewMap(dungeon){
        this.errorText.visible = false;
        this.state.start('Raid', true, false, dungeon);
    }

    update(){
        let currHealth = this.game.player.battleStats.currentHealth;
        let maxHealth = this.game.player.battleStats.health;
        let healthPercent = currHealth/maxHealth;
        if(healthPercent < 0){ healthPercent = 0; }

        this.healthText.text = `Hp: ${currHealth}/${maxHealth}`;
        this.healthBar.scale.x = healthPercent;
    }

    render (){
        let time = Math.floor((new Date).getTime()/1000);
        if(localStorage.getItem('loot-hoarder-clock') != time){
            localStorage.setItem('loot-hoarder-clock', time);
            if(this.game.player.battleStats.currentHealth < this.game.player.battleStats.health){
                this.game.player.heal();
            }
        }
    }

}
