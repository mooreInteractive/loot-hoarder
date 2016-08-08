import Phaser from 'phaser';
import * as Forge from '../items/Forge';
import {playerLevels} from '../data/levels';

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
        this.endAnimStarted = false;
    }

    create () {
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

        /* Reused Enemy HealthBar Graphic */
        let EnHpBarBg = this.game.add.bitmapData(212, 52);
        let EnHpBar = this.game.add.bitmapData(212, 40);

        EnHpBarBg.ctx.beginPath();
        EnHpBarBg.ctx.rect(0, 0, 212, 52);
        EnHpBarBg.ctx.fillStyle = '#111111';
        EnHpBarBg.ctx.fill();

        EnHpBar.ctx.beginPath();
        EnHpBar.ctx.rect(0, 0, 200, 40);
        EnHpBar.ctx.fillStyle = '#DE11CD';
        EnHpBar.ctx.fill();

        this.enHealthBarBg = this.game.add.sprite(this.game.world.centerX+155, this.game.world.centerY+140, EnHpBarBg);
        this.enHealthBar = this.game.add.sprite(this.game.world.centerX+161, this.game.world.centerY+146, EnHpBar);
        this.enHealthBarBg.visible = false;
        this.enHealthBar.visible = false;

        this.errorText = this.add.text(this.game.world.centerX, this.game.world.centerY + 275, '');
        this.errorText.font = 'Oswald';
        this.errorText.fontSize = 22;
        this.errorText.fill = '#DE1313';
        this.errorText.anchor.setTo(0.5);

        //walkign man
        this.dude = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY-200, 'walkingMan');
        this.dude.anchor.setTo(0.5);
        this.dude.scale.setTo(6,6);
        this.dude.animations.add('walk', [143,144,145,146,147,148,149,150,151], 15);
        this.dude.animations.play('walk', 15, true);

        //enSprite
        this.enSprite = this.game.add.sprite(this.game.world.width + 70, this.game.world.centerY + 25, 'mob1');
        this.enSprite.anchor.setTo(0.5);
        this.enSprite.scale.setTo(-6,6);
        this.enSprite.animations.add('walk', [0,1,2,3,4,5,6,7], 10);
        this.enSprite.animations.play('walk', 10, true);

        this.dmgText = this.add.text(this.game.world.centerX - 200, this.game.world.centerY + 80, '');
        this.dmgText.font = 'Oswald';
        this.dmgText.fontSize = 28;
        this.dmgText.fill = '#CD1313';
        this.dmgText.visible = false;

        this.enDmgText = this.add.text(this.game.world.centerX + 160, this.game.world.centerY + 80, '');
        this.enDmgText.font = 'Oswald';
        this.enDmgText.fontSize = 28;
        this.enDmgText.fill = '#CD1313';
        this.enDmgText.visible = false;

        this.animateBattleStart();

    }

    animateBattleStart(){
        let animTime = 400;
        //Move Avater to battle position, then start the battle
        let tween = this.game.add.tween(this.dude).to( { x: this.game.world.centerX - 200, y: this.game.world.centerY }, animTime, null, true);
        this.game.add.tween(this.dude.scale).to( { x: 4, y: 4 }, animTime, null, true);

        //hp bar and text
        this.game.add.tween(this.healthBarBg).to( { x: this.game.world.centerX-305, y: this.game.world.centerY + 140 }, animTime, null, true);
        this.game.add.tween(this.healthBar).to( { x: this.game.world.centerX-299, y: this.game.world.centerY+146 }, animTime, null, true);

        this.game.add.tween(this.healthText).to( { x: this.game.world.centerX - 295, y: this.game.world.centerY+146 }, animTime, null, true);


        tween.onComplete.addOnce(() => {
            this.queueEnemy();
        }, this);

        //Move the health bar and text with it

    }

    animateBattleEnd(){
        this.endAnimStarted = true;
        let animTime = 600;
        //Move Avater to battle position, then start the battle
        let tween = this.game.add.tween(this.dude).to( { x: this.game.world.centerX, y: this.game.world.centerY - 200 }, animTime, null, true);
        this.game.add.tween(this.dude.scale).to( { x: 6, y: 6 }, animTime, null, true);

        //hp bar and text
        this.game.add.tween(this.healthBarBg).to( { x: this.game.world.centerX-105, y: this.game.world.centerY }, animTime, null, true);
        this.game.add.tween(this.healthBar).to( { x: this.game.world.centerX-99, y: this.game.world.centerY+6 }, animTime, null, true);

        this.game.add.tween(this.healthText).to( { x: this.game.world.centerX - 95, y: this.game.world.centerY+6 }, animTime, null, true);

        tween.onComplete.addOnce(() => {
            this.game.state.start('MainMenu', true, false);
        }, this);


    }

    queueEnemy(){
        if(this.dungeon.currentEnemies.length > 0 && this.currentEnemy == null){
            this.game.add.tween(this.enSprite).to( { x: this.game.world.centerX + 255 }, 400, null, true);
            this.currentEnemy = this.dungeon.currentEnemies[0];
            this.currentEnemy.originalHp = this.currentEnemy.originalHp ? this.currentEnemy.originalHp : this.currentEnemy.hp;
            this.enHealthBarBg.visible = true;
            this.enHealthBar.visible = true;

        } else if(this.dungeon.currentEnemies.length == 0){
            this.errorText.text += '\nNo more enemies in this dungeon...';
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
            this.errorText.text += `\nDefeated Enemy.`;
            //get loot
            let lootChance = Forge.rand(0,100);
            let lootThreshold = 50;
            let lootMin = 1;
            let lootMax = 3;
            if(enemy.boss){lootThreshold = 20; lootMin = 2;}
            if( lootChance > lootThreshold){
                this.game.loot.push(Forge.getRandomItem(lootMin,lootMax));
                this.errorText.text += `\nDropped item!`;
            } else if(lootChance > 10){
                let goldDrop = Math.floor(lootChance / 10);
                this.game.player.gold += goldDrop;
                this.errorText.text += `\nDropped ${goldDrop} gold.`;
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
            this.errorText.text += '\nYou were knocked out.';
            if(this.game.loot.length > 0){
                this.errorText.text += `\n total loot: ${this.game.loot.length}.`;
            }

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
            let latest = this.game.player.latestUnlockedDungeon;
            if(latest < dungeon.level + 1){
                this.game.player.latestUnlockedDungeon += 1;
            }
        }

        //level up?
        if(player.exp > playerLevels[player.level].maxExp){
            player.levelUp();
            this.errorText.text += 'Level Up!';
        }

        player.battling = false;
        this.saveDungeonData();
        this.game.player.savePlayerData();

        console.log('--raid gave:', this.game.loot);

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
            if(this.raidEnded){
                if(!this.endAnimStarted){
                    this.animateBattleEnd();
                }
                //this.game.state.start('MainMenu', true, false);
            } else {
                this.resetHitText();
                this.queueEnemy();
                this.action();
                this.assessment();
            }
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
        let healthPercent = currHealth / maxHealth;
        if(healthPercent < 0){ healthPercent = 0; }

        this.healthText.text = `Hp: ${currHealth}/${maxHealth}`;
        this.healthBar.scale.x = healthPercent;

        /* Enemy Health */
        this.enHealthBar.scale.x = this.currentEnemy ? this.currentEnemy.hp / this.currentEnemy.originalHp : 0;
    }

    render (){

    }

}
