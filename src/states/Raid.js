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

        this.enHealthBarBg = this.add.sprite(this.game.world.centerX+155, this.game.world.centerY-10, EnHpBarBg);
        this.enHealthBar = this.add.sprite(this.game.world.centerX+161, this.game.world.centerY-4, EnHpBar);
        this.enHealthBarBg.visible = false;
        this.enHealthBar.visible = false;

        let logBg = this.add.bitmapData(568, 200);
        logBg.ctx.beginPath();
        logBg.ctx.rect(0, 0, 568, 200);
        logBg.ctx.fillStyle = '#FFFFFF';
        logBg.ctx.fill();

        this.logBackground = this.add.sprite(100, this.game.world.centerY + 265, logBg);

        this.errorText = this.add.text(110, this.game.world.centerY + 275, '');
        this.errorText.font = 'Press Start 2P';
        this.errorText.fontSize = 18;
        this.errorText.fill = '#131389';

        this.loadedSprites = [];
        this.enemySprites = {};
        this.dungeon.enemies.forEach((enemy)=>{
            if(this.loadedSprites.indexOf(enemy.sprite) == -1){
                this.loadedSprites.push(enemy.sprite);
                let addedSprite = this.game.add.sprite(this.game.world.width + 200, this.game.world.centerY -25, enemy.sprite);
                addedSprite.anchor.setTo(0.5,1);
                addedSprite.scale.setTo(2,2);
                addedSprite.animations.add('walk');
                addedSprite.animations.play('walk', 5, true);

                this.enemySprites[enemy.sprite] = addedSprite;
            }
        });

        //Load action items from inventory...
        let equipment = this.game.player.equipped;
        this.accessories = [equipment.accessory1, equipment.accessory2, equipment.accessory3, equipment.accessory4];
        let battleItems = this.accessories.filter((item)=>{
            return item != null && item.type == 'misc' && !(item.name.search(/unknown/ig) > -1);
        });
        this.battleButtons = [];
        if(battleItems.length > 0){
            battleItems.forEach((item, index)=>{
                let btn = new Phaser.Button(this.game, 200+(120*index), this.game.world.centerY + 150, item.sprite, this.useItem.bind(this, item, index), this);
                btn.anchor.setTo(0.5);
                btn.visible = true;

                this.add.existing(btn);
                this.battleButtons.push(btn);
            });
        }

        this.dmgText = this.add.text(this.game.world.centerX - 200, this.game.world.centerY -70, '');
        this.dmgText.font = 'Press Start 2P';
        this.dmgText.fontSize = 32;
        this.dmgText.stroke = '#FFFFFF';
        this.dmgText.strokeThickness = 2;
        this.dmgText.fill = '#CD1313';
        this.dmgText.visible = false;

        this.enDmgText = this.add.text(this.game.world.centerX + 160, this.game.world.centerY -70, '');
        this.enDmgText.font = 'Press Start 2P';
        this.enDmgText.fontSize = 32;
        this.enDmgText.stroke = '#FFFFFF';
        this.enDmgText.strokeThickness = 2;
        this.enDmgText.fill = '#1313CD';
        this.enDmgText.visible = false;

        this.animateBattleStart();

    }

    animateBattleStart(){
        let avatarSettings = {x: this.game.world.centerX - 200, y: this.game.world.centerY - 160, scale: 2};
        let hpSettings = {x: this.game.world.centerX - 200, y: this.game.world.centerY + 14};
        this.avatar.moveToAtScale(avatarSettings, hpSettings, 400, this.queueEnemy);
    }

    animateBattleEnd(){
        let endCB = () => {
            this.game.player.battling = false;
            this.game.state.start('MainMenu', true, false, this.passedEvent);
        };
        let avatarSettings = {x: this.dungeon.sprite.x, y: this.dungeon.sprite.y, scale: 1};
        let hpSettings = {x: this.game.world.centerX, y: this.game.world.height - 220 };
        this.avatar.moveToAtScale(avatarSettings, hpSettings, 400, endCB);
    }

    useItem(item, btnIndex){
        this.updateLogText('used item:'+item.name);
        switch(item.name){
        case 'Health Potion': this.game.player.battleStats.currentHealth = this.game.player.battleStats.health;
            break;
        case 'Scroll of Fireball': console.log('using a fireball...');
            break;
        }
        this.game.player.equipped[item.inventorySlot] = null;
        this.battleButtons[btnIndex].kill();

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
                }
            }, this);
        } else {
            if(this.currentEnemy == null){
                console.log('--no enemies left here...');
            }
        }
    }

    action(){
        if(!this.battlePaused){
            let player = this.game.player;
            let enemy = this.currentEnemy;

            let strike = Forge.rand(player.battleStats.dmg.min, player.battleStats.dmg.max);
            let miss = Forge.rand(0+player.baseStats.dexterity, 100);
            let crit = Forge.rand(0+player.baseStats.dexterity, 100);
            if(miss > 15){
                if(crit > 95){
                    strike = Math.floor(player.battleStats.dmg.max*1.5);
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
            this.enDmgText.visible = true;

            console.log(`En: -${strike}hp (${enemy.hp}/${enemy.originalHp}), Pl: -${enStrike}hp (${player.battleStats.currentHealth})`);
        }
    }

    assessment(){
        let player = this.game.player;
        let enemy = this.currentEnemy;
        let story = this.game.player.story;

        if(enemy.hp < 1){//killed an enemey
            this.updateLogText('Defeated Enemy.');
            //get loot
            let lootChance = Forge.rand(0,100);
            let lootThreshold = 65;
            let lootMin = this.dungeon.level - 1 > 1 ? this.dungeon.level - 1 : this.dungeon.level;
            let lootMax = this.dungeon.level;
            if(this.dungeon.defeated){
                lootThreshold = 85;
            }
            if(enemy.boss){lootThreshold = 35; lootMax = this.dungeon.level + 1;}
            if( lootChance > lootThreshold || !story.chapter1.firstLootDrop){
                //Story Junk - TODO offload somewhere? This will get bad
                if(this.dungeon.level == 2 && !story.chapter1.foundSecondNote && story.chapter1.timesCheckedShop > 1){
                    StoryFunctions.chapter1.dropNote(this.game, this, story);
                    story.chapter1.foundSecondNote = true;
                } else {
                    if(!story.chapter1.firstLootDrop){
                        story.chapter1.firstLootDrop = true;
                        StoryFunctions.saveStory(story);
                    }

                    //Generate Loot
                    this.game.loot.push(Forge.getRandomItem(lootMin,lootMax));
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
            player.exp += Math.floor((enemy.dps + enemy.originalHp) / 3);
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
        }
    }

    finishUpRaid(){
        let player = this.game.player;
        let dungeon = this.dungeon;
        //Done with enemies for loop
        if(player.battleStats.currentHealth < 1){
            this.updateLogText('You were knocked out.');
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

    resetHitText(){
        this.dmgText.text = '';
        this.dmgText.visible = false;
        this.enDmgText.text = '';
        this.enDmgText.visible = false;
        this.dmgText.position.y = this.game.world.centerY - 270;
        this.enDmgText.position.y = this.game.world.centerY - 270;
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

}
