import Phaser from 'phaser';
import MainNavigation from '../components/MainNavigation';

export default class extends Phaser.State {
    init () {
        this.inventoryOpen = false;
        this.game.player.savePlayerData();
    }

    create () {
        new MainNavigation(this.game, this);
        //clear data button
        this.optionsBtn = new Phaser.Button(this.game, this.game.world.width - 118, 0, 'optionsBanner', this.viewOptions, this);
        this.optionsBtn.scale.setTo(2,2);
        this.game.add.existing(this.optionsBtn);

        this.raidBtn = new Phaser.Button(this.game, this.game.world.width - 200, this.game.world.height - 300, 'redButton', this.viewMap, this);
        this.raidBtn.scale.setTo(1.5,4);
        this.raidBtn.anchor.setTo(0.5);
        this.raidBtn.alpha = 0.5;
        this.game.add.existing(this.raidBtn);

        let raidBtnStyle = {fontSize: 72, font: 'Oswald', fill: '#000000'};
        this.raidBtnText = this.add.text(this.game.world.width - 200, this.game.world.height - 300, 'RAID', raidBtnStyle);
        this.raidBtnText.anchor.setTo(0.5);
        this.raidBtnText.alpha = 0.5;

        this.lootBtn = new Phaser.Button(this.game, 200, this.game.world.height - 300, 'greenButton', this.viewLoot, this);
        this.lootBtn.scale.setTo(1.5,4);
        this.lootBtn.anchor.setTo(0.5);
        this.lootBtn.alpha = 0.5;
        this.game.add.existing(this.lootBtn);

        this.lootBtnText = this.add.text(200, this.game.world.height - 300, 'LOOT', raidBtnStyle);
        this.lootBtnText.anchor.setTo(0.5);
        this.lootBtnText.alpha = 0.5;

        this.errorText = this.add.text(this.game.world.centerX, this.game.world.centerY + 75, 'You\'re over-encumbered');
        this.errorText.font = 'Oswald';
        this.errorText.fontSize = 22;
        this.errorText.fill = '#DE1313';
        this.errorText.anchor.setTo(0.5);
        this.errorText.visible = false;

        /* Player Health Bar Graphic and Text */
        let healthBarBackgroundBitMap = this.game.add.bitmapData(212, 52);
        let healthBarBitMap = this.game.add.bitmapData(200, 40);

        healthBarBackgroundBitMap.ctx.beginPath();
        healthBarBackgroundBitMap.ctx.rect(0, 0, 212, 52);
        healthBarBackgroundBitMap.ctx.fillStyle = '#111111';
        healthBarBackgroundBitMap.ctx.fill();

        healthBarBitMap.ctx.beginPath();
        healthBarBitMap.ctx.rect(0, 0, 200, 40);
        healthBarBitMap.ctx.fillStyle = '#DE1111';
        healthBarBitMap.ctx.fill();

        this.healthBarBg = this.game.add.sprite(this.game.world.centerX-105, this.game.world.centerY, healthBarBackgroundBitMap);
        this.healthBar = this.game.add.sprite(this.game.world.centerX-99, this.game.world.centerY+6, healthBarBitMap);

        this.healthText = this.add.text(this.game.world.centerX - 95, this.game.world.centerY+6, 'Hp:');
        this.healthText.font = 'Oswald';
        this.healthText.fontSize = 24;
        this.healthText.fill = '#FFFFFF';

        //walkign man
        this.dude = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY-200, 'walkingMan');
        this.dude.anchor.setTo(0.5);
        this.dude.scale.setTo(6,6);
        this.dude.animations.add('walk', [143,144,145,146,147,148,149,150,151], 15);
        this.dude.animations.play('walk', 15, true);
    }

    viewOptions(){
        this.state.start('Options');
    }

    viewMap(){
        if(this.game.player.battleStats.currentHealth > 1){
            this.errorText.visible = false;
            this.state.start('DungeonMap');
            //this.state.start('Raid', true, false, dungeon);
        } else {
            this.errorText.visible = true;
            this.errorText.text = 'You\'re too tired.';
        }
    }

    viewLoot(){
        if(this.game.loot.length > 0){
            this.state.start('LootView');
        }
    }

    update(){
        let currHealth = this.game.player.battleStats.currentHealth;
        let maxHealth = this.game.player.battleStats.health;
        let healthPercent = currHealth/maxHealth;
        if(healthPercent < 0){ healthPercent = 0; }

        this.healthText.text = `Hp: ${currHealth}/${maxHealth}`;
        this.healthBar.scale.x = healthPercent;

        if(currHealth > 1){
            this.raidBtn.alpha = 1;
            this.raidBtnText.alpha = 1;
        } else {
            this.raidBtn.alpha = 0.5;
            this.raidBtnText.alpha = 0.5;
        }

        if(this.game.loot.length > 0){
            this.lootBtn.alpha = 1;
            this.lootBtnText.alpha = 1;
        } else {
            this.lootBtn.alpha = 0.5;
            this.lootBtnText.alpha = 0.5;
        }
    }

    render (){
        let time = Math.floor((new Date).getTime()/1000);
        let storedTime = localStorage.getItem('loot-hoarder-clock');
        if( storedTime != time){
            let timeDiff = time - storedTime;
            localStorage.setItem('loot-hoarder-clock', time);
            if(this.game.player.battleStats.currentHealth < this.game.player.battleStats.health){
                for(let i = 0; i < timeDiff; i++){
                    this.game.player.heal();
                }
            }
        }
    }

}
