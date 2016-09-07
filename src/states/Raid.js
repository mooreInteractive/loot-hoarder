import Phaser from 'phaser';
import * as Forge from '../items/Forge';
import Avatar from '../components/Avatar';
import Dialogue from '../components/Dialogue';
import * as StoryFunctions from '../components/StoryFunctions';

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

        /* Restart Ads */
        let rand = Forge.rand(0,1000);
        document.querySelector('#lb').data = 'lb.html?rand='+rand;
    }

    create () {
        //Backgrounds
        let bg = 'field-tan';
        if(this.dungeon.beaten){
            bg = 'field-blue';
        }
        this.add.image(0,0,bg);


        let avatarSettings = {x: this.dungeon.sprite.x - 50, y: this.dungeon.sprite.y + 25, scale: 2};
        let hpSettings = {x: this.game.world.centerX, y: this.game.world.height - 220 };
        this.avatar = new Avatar(this.game, this, avatarSettings, hpSettings, true, false); //Need to call avatar.update() and avatar.render()

        /* Reused Enemy HealthBar Graphic */
        let EnHpBarBg = this.add.bitmapData(212, 52);
        let EnHpBar = this.add.bitmapData(212, 40);

        EnHpBarBg.ctx.beginPath();
        EnHpBarBg.ctx.rect(0, 0, 212, 52);
        EnHpBarBg.ctx.fillStyle = '#111111';
        EnHpBarBg.ctx.fill();

        EnHpBar.ctx.beginPath();
        EnHpBar.ctx.rect(0, 0, 200, 40);
        EnHpBar.ctx.fillStyle = '#DE11CD';
        EnHpBar.ctx.fill();

        this.enHealthBarBg = this.add.sprite(this.game.world.centerX+155, this.game.world.height-80, EnHpBarBg);
        this.enHealthBar = this.add.sprite(this.game.world.centerX+161, this.game.world.height-74, EnHpBar);
        this.enHealthBarBg.visible = false;
        this.enHealthBar.visible = false;

        let logBg = this.add.bitmapData(568, 200);
        logBg.ctx.beginPath();
        logBg.ctx.rect(0, 0, 568, 200);
        logBg.ctx.fillStyle = '#FFFFFF';
        logBg.ctx.fill();

        this.logBackground = this.add.sprite(100, 15, logBg);
        this.logBackground.alpha = 0.3;

        this.errorText = this.add.text(110, 20, '');
        this.errorText.font = 'Press Start 2P';
        this.errorText.fontSize = 18;
        this.errorText.fill = '#131389';

        this.loadedSprites = [];
        this.enemySprites = {};
        this.dungeon.enemies.forEach((enemy)=>{
            if(this.loadedSprites.indexOf(enemy.sprite) == -1){
                this.loadedSprites.push(enemy.sprite);
                let addedSprite = this.game.add.sprite(this.game.world.width + 200, this.game.world.height-125, enemy.sprite);
                addedSprite.anchor.setTo(0.5,1);
                addedSprite.scale.setTo(2,2);
                addedSprite.animations.add('walk');
                addedSprite.animations.play('walk', 5, true);

                this.enemySprites[enemy.sprite] = addedSprite;
            }
        });

        this.dmgText = this.add.text(this.game.world.centerX - 200, this.game.world.centerY + 100, '');
        this.dmgText.font = 'Press Start 2P';
        this.dmgText.fontSize = 32;
        this.dmgText.stroke = '#FFFFFF';
        this.dmgText.strokeThickness = 2;
        this.dmgText.fill = '#CD1313';
        this.dmgText.visible = false;

        this.enDmgText = this.add.text(this.game.world.centerX + 160, this.game.world.centerY + 100, '');
        this.enDmgText.font = 'Press Start 2P';
        this.enDmgText.fontSize = 32;
        this.enDmgText.stroke = '#FFFFFF';
        this.enDmgText.strokeThickness = 2;
        this.enDmgText.fill = '#1313CD';
        this.enDmgText.visible = false;

        this.animateBattleStart();

    }

    animateBattleStart(){
        let avatarSettings = {x: this.game.world.centerX - 200, y: this.game.world.height-275, scale: 2};
        let hpSettings = {x: this.game.world.centerX - 200, y: this.game.world.height - 53};
        this.avatar.moveToAtScale(avatarSettings, hpSettings, 400, this.queueEnemy);
    }

    animateBattleEnd(){
        let endCB = () => {
            this.game.player.battling = false;
            this.game.state.start('MainMenu', true, false, this.passedEvent);
        };
        this.endAnimStarted = true;
        this.updateLogText('Battle has ended.');
        let avatarSettings = {x: this.dungeon.sprite.x, y: this.dungeon.sprite.y, scale: 1};
        let hpSettings = {x: this.game.world.centerX, y: this.game.world.height - 220 };
        this.avatar.moveToAtScale(avatarSettings, hpSettings, 400, endCB);
    }

    updateLogText(logText){
        let currText = this.errorText.text;
        let lines = currText.split('\n');
        if(lines.length == 7){
            lines.splice(6, 1);
        }
        lines.reverse();
        lines.push(logText);
        lines.reverse();
        this.errorText.text = lines.join('\n');
    }

    queueEnemy(){
        if(this.dungeon.currentEnemies.length > 0 && this.currentEnemy == null){
            this.battlePaused = true;
            this.currentEnemy = this.dungeon.currentEnemies[0];
            this.currentEnemy.originalHp = this.currentEnemy.originalHp ? this.currentEnemy.originalHp : this.currentEnemy.hp;
            this.enHealthBarBg.x = this.game.world.width + 200 - this.enHealthBarBg.width/2;
            this.enHealthBar.x = this.game.world.width + 200 - 100;
            this.enHealthBarBg.visible = true;
            this.enHealthBar.visible = true;

            let introTween = this.add.tween(this.enemySprites[this.currentEnemy.sprite]).to( { x: this.game.world.centerX + 195 }, 400, null, true);
            this.add.tween(this.enHealthBarBg).to( { x: this.game.world.centerX + 195 - this.enHealthBarBg.width/2 }, 400, null, true);
            this.add.tween(this.enHealthBar).to( { x: this.game.world.centerX + 195 - 100 }, 400, null, true);

            introTween.onComplete.add(()=>{
                if(this.currentEnemy.boss && this.dungeon.enemiesLeft == 1 && this.currentEnemy.message && !this.dungeon.heardMessage){
                    new Dialogue(this.game, this, 'ok', this.currentEnemy.message, ()=>{
                        this.dungeon.heardMessage = true;
                        this.battlePaused = false;
                    });
                } else {
                    this.battlePaused = false;
                    this.frameCount = 0;
                }
            }, this);
        }
    }

    playerAction(){
        let enemy = this.currentEnemy;
        let player = this.game.player;

        let strike = Forge.rand(player.battleStats.dmg.min, player.battleStats.dmg.max);
        let miss = Forge.rand(0+player.baseStats.dexterity, 100);
        let crit = Forge.rand(0+player.baseStats.dexterity, 100);
        let critThreshold = player.equipped.leftHand ? player.equipped.leftHand.crit.threshold : 95;
        if(player.magicFX.time > 0 && player.magicFX.name == 'CRIT'){ critThreshold -= 15;}
        let critMulti = player.equipped.leftHand ? player.equipped.leftHand.crit.multiplier : 95;

        if(miss > 15){
            if(crit > critThreshold){
                strike = Math.floor(player.battleStats.dmg.max*critMulti);
                this.enDmgText.fontSize = 40;
                this.enDmgText.text = strike+'!';
            } else {
                this.enDmgText.fontSize = 32;
                this.enDmgText.text = strike;
            }
            enemy.hp -= strike;
        } else {
            this.enDmgText.text = 'miss';
        }

        this.enDmgText.visible = true;
    }

    enemyAction(){
        let enemy = this.currentEnemy;
        let player = this.game.player;

        let armorReduction = Math.ceil(enemy.dps*(player.battleStats.armor/100));
        let enStrike = enemy.dps - armorReduction;
        let enMiss = Forge.rand(0+player.baseStats.dexterity, 100);
        //let enCrit = Forge.rand(0+player.baseStats.dexterity, 100);
        if(enMiss > 15){
            player.battleStats.currentHealth -= enStrike;
            this.dmgText.text = enStrike;
        } else {
            this.dmgText.text = 'miss';
        }

        this.dmgText.visible = true;
    }

    assessment(){
        let player = this.game.player;
        let enemy = this.currentEnemy;
        let story = this.game.player.story;

        if(enemy.hp < 1){//killed an enemey
            //get loot
            let lootChance = Forge.rand(0,100);
            let lootThreshold = 65;
            let lootMin = this.dungeon.level - 1 > 1 ? this.dungeon.level - 1 : this.dungeon.level;
            let lootMax = this.dungeon.level;
            if(this.dungeon.defeated){
                lootThreshold = 85;
            }
            if(enemy.boss){lootThreshold = 35; lootMax = this.dungeon.level + 1;}
            if(player.magicFX.time > 0 && player.magicFX.name === 'LEWT'){lootThreshold -= 15;}
            if( lootChance > lootThreshold || !story.chapter1.firstLootDrop){
                //Story Junk - TODO offload somewhere? This will get bad
                if(this.dungeon.level == 2 && !story.chapter1.foundSecondNote && story.chapter1.timesCheckedShop > 0){
                    StoryFunctions.chapter1.dropNote(this.game, this, story);
                    story.chapter1.foundSecondNote = true;
                } else {
                    if(!story.chapter1.firstLootDrop){
                        story.chapter1.firstLootDrop = true;
                        StoryFunctions.saveStory(story);
                        this.game.loot.push(Forge.getRandomWeapon(lootMin,lootMax));
                    } else {
                        this.game.loot.push(Forge.getRandomItem(lootMin,lootMax));
                    }
                    this.updateLogText('Dropped item!');
                }

            } else{
                let goldChance = Forge.rand(0,100);
                if(goldChance > 65){
                    let goldDrop = Math.floor(lootChance / 10);
                    this.game.player.gold += goldDrop;
                    this.updateLogText(`Dropped ${goldDrop} gold.`);
                }
            }
            //get exp
            let newExp = Math.floor((enemy.dps + enemy.originalHp) / 3);
            if(player.magicFX.time != 0 && player.magicFX.name == 'EXP'){ newExp = newExp*2; }
            player.exp += newExp;

            this.updateLogText(`Defeated ${enemy.sprite}. +${newExp} XP`);
            //remove enemy from dungeon
            //this.enSprite.visible = false;
            this.enemySprites[enemy.sprite].position.x = this.game.world.width + 300;//TODO animate out/explode/die
            this.dungeon.currentEnemies.splice(0, 1);
            this.dungeon.enemiesLeft = this.dungeon.currentEnemies.length;
            this.enHealthBarBg.visible = false;
            this.enHealthBar.visible = false;

            this.currentEnemy = null;
        }

        if(this.dungeon.currentEnemies.length == 0 || player.battleStats.currentHealth < 1){
            this.finishUpRaid();
        } else {
            this.queueEnemy();
        }
    }

    finishUpRaid(){
        let player = this.game.player;
        let dungeon = this.dungeon;
        //Done with enemies for loop
        if(player.battleStats.currentHealth < 1){
            this.updateLogText('You can\'t raid any longer.');
            if(this.game.loot.length > 0){
                this.updateLogText(`Total loot: ${this.game.loot.length}.`);
            }

            //remove enemy sprite
            //let tween = this.game.add.tween(this.enemySprites[enemy.sprite]).to( { x: this.game.world.width + 135 }, 400, null, true);
        }

        //Dungeon Done
        this.passedEvent = null;
        if(dungeon.enemiesLeft < 1){
            dungeon.currentEnemies = dungeon.enemies.slice();
            dungeon.enemies.forEach((enemy, index)=>{
                dungeon.currentEnemies[index] = JSON.parse(JSON.stringify(enemy));
            });
            dungeon.beaten = true;
            dungeon.enemiesLeft = dungeon.currentEnemies.length;
            let latest = this.game.player.latestUnlockedDungeon;
            if(latest < dungeon.level + 1){
                this.game.player.latestUnlockedDungeon += 1;
                //TODO story stuff
                console.log('end dungeon level:', dungeon.level);
                if(dungeon.level == 5){
                    this.passedEvent = {
                        name: 'RescuedShopKeep'
                    };
                }
                if(dungeon.level == 1){
                    this.passedEvent = {
                        name: 'FirstDungeonBeat'
                    };
                }
            }
        }

        //level up?
        if(player.exp > player.nextLevel.minExp){
            player.levelUp();
            this.updateLogText('Level Up!');
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

    resetEnHitText(){
        this.enDmgText.text = '';
        this.enDmgText.visible = false;
        this.enDmgText.position.y = this.game.world.centerY + 100;
        this.enDmgText.alpha = 1;
    }

    resetPlHitText(){
        this.dmgText.text = '';
        this.dmgText.visible = false;
        this.dmgText.position.y = this.game.world.centerY + 100;
        this.dmgText.alpha = 1;
    }

    render(){

    }

    update(){
        if(this.raidEnded){
            if(this.frameCount > 0){ this.frameCount = 0; }

            if(!this.endAnimStarted){
                this.frameCount -= 1;
                if(this.frameCount <= -120){
                    this.animateBattleEnd();
                }
            }
        } else {
            this.frameCount += 1;
        }

        let enemySpeedStandIn = 60;
        let playerSpeed = 60 - Math.floor(this.game.player.battleStats.dexterity / 3);

        if(this.raidStarted && !this.battlePaused && !this.raidEnded){
            if((this.frameCount % playerSpeed == 0) && this.currentEnemy){
                this.resetEnHitText();
                this.playerAction();
                this.assessment();
            }
            if(this.currentEnemy && (this.frameCount % enemySpeedStandIn == 0)){
                this.resetPlHitText();
                this.enemyAction();
                this.assessment();
            }
        } else if(!this.raidStarted){
            this.raidStarted = true;
            this.queueEnemy();
        }


        this.dmgText.position.y -= 1;
        this.enDmgText.position.y -= 1;
        this.dmgText.alpha -= 0.01;
        this.enDmgText.alpha -= 0.01;

        this.avatar.update();

        /* Enemy Health */
        this.enHealthBar.scale.x = this.currentEnemy ? this.currentEnemy.hp / this.currentEnemy.originalHp : 0;
    }

}
