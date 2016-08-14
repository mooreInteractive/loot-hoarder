import Phaser from 'phaser';
import * as Forge from '../items/Forge';
import {playerLevels} from '../data/levels';
import Avatar from '../components/Avatar';

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
        let avatarSettings = {x: this.dungeon.sprite.x - 50, y: this.dungeon.sprite.y + 25, scale: 2};
        let hpSettings = {x: this.game.world.centerX, y: this.game.world.height - 220 };
        this.avatar = new Avatar(this.game, this, avatarSettings, hpSettings); //Need to call avatar.update() and avatar.render()

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

        this.loadedSprites = [];
        this.enemySprites = {};
        this.dungeon.enemies.forEach((enemy)=>{
            if(this.loadedSprites.indexOf(enemy.sprite) == -1){
                this.loadedSprites.push(enemy.sprite);
                console.log('--enemy sprite:', enemy.sprite);
                let addedSprite = this.game.add.sprite(this.game.world.width + 200, this.game.world.centerY + 100, enemy.sprite);
                addedSprite.anchor.setTo(0.5, 1);
                addedSprite.scale.setTo(2,2);
                addedSprite.animations.add('walk');
                addedSprite.animations.play('walk', 5, true);

                this.enemySprites[enemy.sprite] = addedSprite;
            }
        });


        this.dmgText = this.add.text(this.game.world.centerX - 200, this.game.world.centerY + 80, '');
        this.dmgText.font = 'Oswald';
        this.dmgText.fontSize = 32;
        this.dmgText.stroke = '#FFFFFF';
        this.dmgText.strokeThickness = 2;
        this.dmgText.fill = '#CD1313';
        this.dmgText.visible = false;

        this.enDmgText = this.add.text(this.game.world.centerX + 160, this.game.world.centerY + 80, '');
        this.enDmgText.font = 'Oswald';
        this.enDmgText.fontSize = 32;
        this.enDmgText.stroke = '#FFFFFF';
        this.enDmgText.strokeThickness = 2;
        this.enDmgText.fill = '#1313CD';
        this.enDmgText.visible = false;

        this.animateBattleStart();

    }

    animateBattleStart(){
        let avatarSettings = {x: this.game.world.centerX - 200, y: this.game.world.centerY, scale: 4};
        let hpSettings = {x: this.game.world.centerX - 200, y: this.game.world.centerY + 164};
        this.avatar.moveToAtScale(avatarSettings, hpSettings, 400, this.queueEnemy);
    }

    animateBattleEnd(){
        let endCB = () => {
            this.game.player.battling = false;
            this.game.state.start('MainMenu', true, false);
        };
        let avatarSettings = {x: this.dungeon.sprite.x - 50, y: this.dungeon.sprite.y + 25, scale: 2};
        let hpSettings = {x: this.game.world.centerX, y: this.game.world.height - 220 };
        this.avatar.moveToAtScale(avatarSettings, hpSettings, 400, endCB);
    }

    queueEnemy(){
        if(this.dungeon.currentEnemies.length > 0 && this.currentEnemy == null){
            this.currentEnemy = this.dungeon.currentEnemies[0];
            console.log('--current Enmey Sprite:', this.enemySprites[this.currentEnemy.sprite]);
            this.game.add.tween(this.enemySprites[this.currentEnemy.sprite]).to( { x: this.game.world.centerX + 255 }, 400, null, true);
            this.currentEnemy.originalHp = this.currentEnemy.originalHp ? this.currentEnemy.originalHp : this.currentEnemy.hp;
            this.enHealthBarBg.visible = true;
            this.enHealthBar.visible = true;
        } else {
            if(this.currentEnemy == null){
                console.log('--no enemies left here...');
            }
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

        this.dmgText.text = enStrike;
        this.dmgText.visible = true;
        this.enDmgText.text = strike;
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
            let lootMax = this.dungeon.level;
            if(enemy.boss){lootThreshold = 20; lootMin = this.dungeon.level - 1 > 1 ? this.dungeon.level - 1 : this.dungeon.level;}
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
            this.enemySprites[enemy.sprite].position.x = this.game.world.width + 70;//TODO animate out/explode/die
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
            //let tween = this.game.add.tween(this.enemySprites[enemy.sprite]).to( { x: this.game.world.width + 135 }, 400, null, true);
        }

        //Dungeon Done
        if(dungeon.enemiesLeft < 1){
            dungeon.currentEnemies = dungeon.enemies.slice();
            dungeon.enemies.forEach((enemy, index)=>{
                dungeon.currentEnemies[index] = JSON.parse(JSON.stringify(enemy));
            });
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
            this.errorText.text += '\nLevel Up!';
        }

        this.saveDungeonData();
        this.game.player.savePlayerData();

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
        this.dmgText.alpha = 1;
        this.enDmgText.alpha = 1;
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
        this.dmgText.alpha -= 0.01;
        this.enDmgText.alpha -= 0.01;

        this.avatar.update();

        /* Enemy Health */
        this.enHealthBar.scale.x = this.currentEnemy ? this.currentEnemy.hp / this.currentEnemy.originalHp : 0;
    }

    render (){
        if(this.dungeon.enemies[0].hp < 1){
            console.log('--dungeon.currentEnemies corrupted!', this.dungeon);
        }
    }

}
