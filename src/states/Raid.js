import Phaser from 'phaser';
import * as Forge from '../items/Forge';
import {playerLevels} from '../data/levels';
import LootList from '../components/LootList';

export default class extends Phaser.State {
    init (dungeon) {
        this.inventoryOpen = false;
        this.game.player.savePlayerData();
        this.dungeon = dungeon;
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

        this.EnhealthBarBg = this.game.add.sprite(this.game.world.centerX+155, this.game.world.centerY-15, EnHpBarBg);
        this.EnhealthBar = this.game.add.sprite(this.game.world.centerX+158, this.game.world.centerY-12, EnHpBar);
        this.EnhealthBarBg.visible = false;
        this.EnhealthBar.visible = false;

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
        this.enSprite.visible = false;

        this.raidDungeon(this.dungeon);

    }

    raidDungeon(dungeon){
        console.log('--dungeon beign raided:', dungeon);
        let player = this.game.player;
        if(player.battleStats.currentHealth > 1){
            player.battling = true;
            let loot = [];
            this.enSprite.visible = true;

            let checkForEnemies = () => {
                if(dungeon.currentEnemies.length > 0){
                    let tween = this.game.add.tween(this.enSprite).to( { x: this.game.world.centerX + 235 }, 400, null, true);
                    tween.onComplete.addOnce(() => {
                        this.EnhealthBarBg.visible = true;
                        this.EnhealthBar.visible = true;
                        battleEnemy(dungeon.currentEnemies[0]);
                    }, this);
                }
            };


            let battleEnemy = (enemy) => {
                enemy.originalHp = enemy.hp;
                while(enemy.hp > 0){
                    let enHealthPercent = enemy.hp/enemy.originalHp < 0 ? 0 : enemy.hp/enemy.originalHp;
                    this.EnhealthBar.scale.x = enHealthPercent;

                    let strike = Forge.rand(player.battleStats.dmg.min, player.battleStats.dmg.max);
                    enemy.hp -= strike;
                    let armorReduction = Math.ceil(enemy.dps*(player.battleStats.armor/100));
                    let enStrike = enemy.dps - armorReduction;
                    player.battleStats.currentHealth -= enStrike;
                    console.log(`En: -${strike}hp (${enemy.hp}), Pl: -${enStrike}hp (${player.battleStats.currentHealth})`);
                    if(player.battleStats.currentHealth < 1){ break; }
                }

                setTimeout(() => {
                    if(enemy.hp < 1){//killed an enemey
                        //get loot
                        let lootChance = Forge.rand(0,100);
                        if( lootChance > 50){
                            loot.push(Forge.getRandomItem(1,3));
                        }
                        //get exp
                        player.exp += Math.floor((enemy.dps + enemy.originalHp) / 3);
                        //remove enemy from dungeon
                        //this.enSprite.visible = false;
                        this.enSprite.position.x = this.game.world.width + 70;
                        dungeon.currentEnemies.splice(0, 1);
                        dungeon.enemiesLeft = dungeon.currentEnemies.length;
                    }

                    if(dungeon.currentEnemies.length == 0 || player.battleStats.currentHealth < 1){
                        this.EnhealthBarBg.visible = false;
                        this.EnhealthBar.visible = false;
                        finishUpRaid();
                    } else {
                        this.EnhealthBarBg.visible = false;
                        this.EnhealthBar.visible = false;
                        checkForEnemies();
                    }
                }, 1000);

            };

            let finishUpRaid = () => {

                //Done with enemies for loop
                if(player.battleStats.currentHealth < 1){
                    this.errorText.text = 'You\'re tired. ';
                    if(loot.length > 0){
                        this.errorText.text += 'loot: ' + loot.length;
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

                this.lootList.updateLootTextAndButtons(loot);

                console.log('--raid gave:', loot);

                this.game.state.start('MainMenu', true, false, loot);
            };

            checkForEnemies();
        } else {
            this.errorText.text = 'You should rest for a while.';
            this.errorText.visible = true;
        }
    }

    saveDungeonData(){
        if(localStorage){
            localStorage.setItem('loot-hoarder-dungeons', JSON.stringify(this.game.dungeons));
        }
    }

    update(){
        /* Player Health */
        let currHealth = this.game.player.battleStats.currentHealth;
        let maxHealth = this.game.player.battleStats.health;
        let healthPercent = currHealth/maxHealth;
        if(healthPercent < 0){ healthPercent = 0; }

        this.healthText.text = `Hp: ${currHealth}/${maxHealth}`;
        this.healthBar.scale.x = healthPercent;
    }

    render (){

    }

}
