import Phaser from 'phaser';
import * as Forge from '../items/Forge';
import {playerLevels} from '../data/levels';
import LootList from '../components/LootList';

export default class extends Phaser.State {
    init (dungeon) {
        this.inventoryOpen = false;
        this.game.player.savePlayerData();
        this.dungeon = dungeon;
        this.frameCount = 1;
        this.currentEnemy = null;
        this.game.player.battling = true;
        this.raidStarted = false;
        this.raidEnded = false;
        this.loot = [];
    }

    create () {
        this.lootList = new LootList(this.game, [], this);

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

        /* Reused Enemy HealthBar Graphic */
        let EnHpBarBg = this.game.add.bitmapData(106, 26);
        let EnHpBar = this.game.add.bitmapData(100, 20);

        EnHpBarBg.ctx.beginPath();
        EnHpBarBg.ctx.rect(0, 0, 106, 26);
        EnHpBarBg.ctx.fillStyle = '#111111';
        EnHpBarBg.ctx.fill();

        EnHpBar.ctx.beginPath();
        EnHpBar.ctx.rect(0, 0, 100, 20);
        EnHpBar.ctx.fillStyle = '#DE11CD';
        EnHpBar.ctx.fill();

        this.enHealthBarBg = this.game.add.sprite(this.game.world.centerX+155, this.game.world.centerY-15, EnHpBarBg);
        this.enHealthBar = this.game.add.sprite(this.game.world.centerX+158, this.game.world.centerY-12, EnHpBar);
        this.enHealthBarBg.visible = false;
        this.enHealthBar.visible = false;

        this.errorText = this.add.text(this.game.world.centerX, this.game.world.centerY + 50, 'You\'re over-encumbered');
        this.errorText.font = 'Nunito';
        this.errorText.fontSize = 22;
        this.errorText.fill = '#DE1313';
        this.errorText.anchor.setTo(0.5);
        this.errorText.visible = false;

        //walkign man
        this.dude = this.game.add.sprite(this.game.world.centerX - 50, this.game.world.centerY - 120, 'walkingMan');
        this.dude.scale.setTo(1.5, 1.5);
        this.dude.animations.add('walk', [30,31,32,33,34,35,36,37,38], 18);
        this.dude.animations.play('walk', 18, true);

        //enSprite
        this.enSprite = this.game.add.sprite(this.game.world.width + 70, this.game.world.centerY - 90, 'mob1');
        this.enSprite.scale.x = -2;
        this.enSprite.scale.y = 2;
        this.enSprite.animations.add('walk', [0,1,2,3,4,5,6,7], 10);
        this.enSprite.animations.play('walk', 10, true);

        this.dmgText = this.add.text(this.game.world.centerX, this.game.world.centerY - 120, '');
        this.dmgText.font = 'Nunito';
        this.dmgText.fontSize = 22;
        this.dmgText.fill = '#CD1313';
        this.dmgText.visible = false;

        this.enDmgText = this.add.text(this.game.world.centerX + 160, this.game.world.centerY - 120, '');
        this.enDmgText.font = 'Nunito';
        this.enDmgText.fontSize = 22;
        this.enDmgText.fill = '#CD1313';
        this.enDmgText.visible = false;

        this.queueEnemy();
    }

    queueEnemy(){
        if(this.dungeon.currentEnemies.length > 0 && this.currentEnemy == null){
            this.game.add.tween(this.enSprite).to( { x: this.game.world.centerX + 235 }, 400, null, true);
            this.currentEnemy = this.dungeon.currentEnemies[0];
            this.currentEnemy.originalHp = this.currentEnemy.originalHp ? this.currentEnemy.originalHp : this.currentEnemy.hp;
            this.enHealthBarBg.visible = true;
            this.enHealthBar.visible = true;

        } else if(this.dungeon.currentEnemies.length == 0){
            console.log('no more enemies in this dungeon...');
        }
    }

    action(){
        let player = this.game.player;
        let enemy = this.currentEnemy;
        let strike = Forge.rand(player.battleStats.dmg.min, player.battleStats.dmg.max);

        enemy.hp -= strike;

        let armorReduction = Math.ceil(enemy.dps*(player.battleStats.armor/100));
        let enStrike = enemy.dps - armorReduction;

        player.battleStats.currentHealth -= enStrike;

        this.dmgText.text = `- ${enStrike}hp`;
        this.dmgText.visible = true;
        this.enDmgText.text = `- ${strike}hp`;
        this.enDmgText.visible = true;

        console.log(`En: -${strike}hp (${enemy.hp}/${enemy.originalHp}), Pl: -${enStrike}hp (${player.battleStats.currentHealth})`);
    }

    assessment(){
        let player = this.game.player;
        let enemy = this.currentEnemy;

        if(enemy.hp < 1){//killed an enemey
            //get loot
            let lootChance = Forge.rand(0,100);
            let lootThreshold = 50;
            let lootMin = 1;
            let lootMac = 3;
            if(enemy.boss){lootThreshold = 20; lootMin = 2;}
            if( lootChance > lootThreshold){
                this.loot.push(Forge.getRandomItem(1,3));
            }
            //get exp
            player.exp += Math.floor((enemy.dps + enemy.originalHp) / 3);
            //remove enemy from dungeon
            //this.enSprite.visible = false;
            this.enSprite.position.x = this.game.world.width + 70;//TODO animate out/explode/die
            this.dungeon.currentEnemies.splice(0, 1);
            this.dungeon.enemiesLeft = this.dungeon.currentEnemies.length;
            this.enHealthBarBg.visible = false;
            this.enHealthBar.visible = false;

            this.currentEnemy = null;
        }

        if(this.dungeon.currentEnemies.length == 0 || player.battleStats.currentHealth < 1){
            this.finishUpRaid();
        }
    }

    finishUpRaid(){
        let player = this.game.player;
        let dungeon = this.dungeon;
        //Done with enemies for loop
        if(player.battleStats.currentHealth < 1){
            this.errorText.text = 'You\'re tired. ';
            if(this.loot.length > 0){
                this.errorText.text += 'loot: ' + this.loot.length;
            }
            this.errorText.visible = true;

            //remove enemy sprite
            let tween = this.game.add.tween(this.enSprite).to( { x: this.game.world.width + 135 }, 400, null, true);
            tween.onComplete.addOnce(() => {
                this.enSprite.visible = false;
            }, this);
        }

        //Dungeon Done
        if(dungeon.enemiesLeft < 1){
            dungeon.currentEnemies = dungeon.enemies;
            dungeon.beaten = true;
            //TODO - bestowe dungeon ring
            dungeon.enemiesLeft = dungeon.currentEnemies.length;
            this.game.player.latestUnlockedDungeon += 1;
            if(this.game.player.latestUnlockedDungeon > 2){
                this.game.player.latestUnlockedDungeon = 2;
            }
        }

        //level up?
        if(player.exp > playerLevels[player.level].maxExp){
            player.level += 1;
            this.errorText.text += 'Level Up!';
            this.errorText.visible = true;
        }

        player.battling = false;
        this.saveDungeonData();
        this.game.player.savePlayerData();

        this.lootList.updateLootTextAndButtons(this.loot);

        console.log('--raid gave:', this.loot);

        this.raidEnded = true;
    }

    saveDungeonData(){
        if(localStorage){
            localStorage.setItem('loot-hoarder-dungeons', JSON.stringify(this.game.dungeons));
        }
    }

    resetHitText(){
        this.dmgText.text = '';
        this.dmgText.visible = false;
        this.enDmgText.text = '';
        this.enDmgText.visible = false;
        this.dmgText.position.y = this.game.world.centerY - 120;
        this.enDmgText.position.y = this.game.world.centerY - 120;
    }

    update(){
        if(this.frameCount == 0){
            if(this.raidEnded){this.game.state.start('MainMenu', true, false, this.loot);}
            this.resetHitText();
            this.queueEnemy();
            this.action();
            this.assessment();
        }

        this.frameCount += 1;

        if(this.raidStarted){
            if(this.frameCount == 60){
                this.frameCount = 0;
            }
        } else {
            if(this.frameCount == 90){
                this.raidStarted = true;
                this.frameCount = 0;
            }
        }


        this.dmgText.position.y -= 1;
        this.enDmgText.position.y -= 1;
        /* Player Health */
        let currHealth = this.game.player.battleStats.currentHealth;
        let maxHealth = this.game.player.battleStats.health;
        let healthPercent = currHealth/maxHealth;
        if(healthPercent < 0){ healthPercent = 0; }

        this.healthText.text = `Hp: ${currHealth}/${maxHealth}`;
        this.healthBar.scale.x = healthPercent;

        /* Enemy Health */
        this.enHealthBar.scale.x = this.currentEnemy ? this.currentEnemy.hp/this.currentEnemy.originalHp : 0;
    }

    render (){

    }

}
