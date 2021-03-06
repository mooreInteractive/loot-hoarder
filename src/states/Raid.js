import Phaser from 'phaser';
import * as Forge from '../items/Forge';
import Avatar from '../components/Avatar';
import Dialogue from '../components/Dialogue';
import randomColor from 'randomcolor';
import LootList from '../components/LootList';
import * as lootUtils from '../components/lootUtils';
//import LootParticle from '../components/particle';

export default class extends Phaser.State {
    init (dungeon) {
        this.showLoot = this.showLoot.bind(this);
        this.inventoryOpen = false;
        this.game.player.savePlayerData();
        this.dungeon = dungeon;
        this.frameCount = 1;
        this.droppedGold = 0;
        this.currentEnemy = null;
        this.game.player.battling = true;
        this.raidStarted = false;
        this.raidEnded = false;
        this.endAnimStarted = false;
        this.showClearText = false;
        this.game.dialogueOpen = false;

        /* Restart Ads */
        let rand = Forge.rand(0,1000);
        document.querySelector('#lb').data = 'lb.html?rand='+rand;

        /* track google event */
        window.ga('send', 'event', 'game_states', 'raid', 'start');
    }

    create () {
        //Backgrounds
        let bg = this.add.image(-100,-10,'sunny-hills');
        bg.scale.setTo(3.2);
        this.lightBG = this.add.image(-100,-10,'sunny-hills');
        this.lightBG.scale.setTo(3.2);
        if(this.dungeon.beaten){
            this.lightBG.alpha = 1;
        } else {
            this.lightBG.alpha = 0;
        }


        let avatarSettings = {x: this.dungeon.sprite.x - 50, y: this.dungeon.sprite.y + 25, scale: 2};
        let hpSettings = {x: this.game.world.centerX, y: this.game.world.height - 260 };
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

        this.enHealthBarBg = this.add.sprite(this.game.world.centerX+155, this.game.world.height-120, EnHpBarBg);
        this.enHealthBar = this.add.sprite(this.game.world.centerX+161, this.game.world.height-114, EnHpBar);
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
                let addedSprite = this.game.add.sprite(this.game.world.width + 200, this.game.world.height-165, enemy.sprite);
                addedSprite.anchor.setTo(0.5,1);
                addedSprite.scale.setTo(2,2);
                addedSprite.animations.add('walk');
                addedSprite.animations.play('walk', 5, true);

                this.enemySprites[enemy.sprite] = addedSprite;
            }
        });

        let fontStyles = {font: 'Press Start 2P', stroke: '#FFFFFF', fontSize: 32};
        this.dmgText = this.add.text(this.game.world.centerX - 200, this.game.world.centerY + 60, '', fontStyles);
        this.dmgText.fill = '#CD1313';
        this.dmgText.visible = false;
        this.dmgText.stroke = '#FFFFFF';
        this.dmgText.strokeThickness = 2;

        this.enDmgText = this.add.text(this.game.world.centerX + 160, this.game.world.centerY + 60, '', fontStyles);
        this.enDmgText.fill = '#1313CD';
        this.enDmgText.visible = false;
        this.enDmgText.stroke = '#FFFFFF';
        this.enDmgText.strokeThickness = 2;

        //post-battle
        let fullBlack = this.add.bitmapData(768, 1080);
        fullBlack.ctx.beginPath();
        fullBlack.ctx.rect(0, 0, 768, 1080);
        fullBlack.ctx.fillStyle = '#000000';
        fullBlack.ctx.fill();

        this.backdrop = this.add.sprite(0, 0, fullBlack);
        this.backdrop.alpha = 0;

        let clearStyle = {font: '104px Musketeer', fill: '#0013FF', align: 'center'};
        this.clearText = this.add.text(this.game.world.centerX, -175, 'Monsters\nCleared!', clearStyle);
        this.clearText.anchor.setTo(0.5);
        this.clearText.stroke = '#000000';
        this.clearText.strokeThickness = 12;
        this.clearText.visible = false;


        let koQuote = Forge.rand(0,3);
        let koString = 'You\'ve\nblacked out!';
        switch(koQuote){
        case 0: koString = 'You\'ve\nblacked out!';
            break;
        case 1: koString = 'You can no\nlonger fight!';
            break;
        case 2: koString = 'Your HP is\ndepleted!';
            break;
        case 3: koString = 'Go rest\nup kid!';
            break;
        }
        let koStyle = {font: '84px Musketeer', fill: '#FF1313', align: 'center'};
        this.koText = this.add.text(this.game.world.centerX, -175, koString, koStyle);
        this.koText.anchor.setTo(0.5);
        this.koText.stroke = '#000000';
        this.koText.strokeThickness = 19;

        this.chest = this.add.sprite(this.game.world.centerX, -500, 'basic_loot');
        this.chest.anchor.setTo(0.5);
        this.chest.angle = -15;
        this.chest.animations.add('open');

        let lootStyle = {font: '104px Musketeer', fill: '#FFFF00', align: 'center'};
        this.getLootText = this.add.text(this.game.world.centerX, this.game.world.centerY + 175, 'LOOT DROP!', lootStyle);
        this.getLootText.anchor.setTo(0.5);
        this.getLootText.stroke = '#000000';
        this.getLootText.strokeThickness = 12;
        this.getLootText.visible = false;

        //particles
        this.emitter = this.game.add.emitter(this.chest.x, this.chest.y, 5000);

        this.emitter.width = 424;
        this.emitter.height = 192;

        //Loot List overlay background
        let itemBlack = this.add.bitmapData(768, 450);
        itemBlack.ctx.beginPath();
        itemBlack.ctx.rect(0, 0, 768, 450);
        itemBlack.ctx.fillStyle = '#000000';
        itemBlack.ctx.fill();

        this.itemBackdrop = this.add.sprite(0, 90, itemBlack);
        this.itemBackdrop.alpha = 0;

        this.lootTitle = this.add.text(30, 40, 'Items Dropped:');
        this.lootTitle.font = 'Press Start 2P';
        this.lootTitle.fontSize = 28;
        this.lootTitle.fill = '#E6E6E8';
        this.lootTitle.alpha = 0;

        //  Here is the important line. This will tell the Emitter to emit our custom MonsterParticle class instead of a normal Particle object.
        //this.emitter.particleClass = LootParticle;

        this.emitter.makeParticles(['part_sm_yellow', 'part_med_yellow', 'part_lg_yellow', 'part_sm_purple', 'part_med_purple', 'part_lg_purple']);

        // this.emitter.minParticleSpeed.set(0, 300);
        // this.emitter.maxParticleSpeed.set(0, 400);
        this.emitter.setRotation(0, 0);
        this.emitter.setScale(1, 2.5, 1, 2.5, 1000, Phaser.Easing.Quintic.Out, false);
        this.emitter.gravity = -100;

        this.animateBattleStart();

    }

    animateBattleStart(){
        let avatarSettings = {x: this.game.world.centerX - 200, y: this.game.world.height-315, scale: 2};
        let hpSettings = {x: this.game.world.centerX - 200, y: this.game.world.height - 93};
        this.avatar.moveToAtScale(avatarSettings, hpSettings, 400, this.queueEnemy);
        if(this.game.player.skills.includes('berserker')){
            this.updateLogText('BERSERKER!');
        }
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

        //type of ending
        if(this.showClearText === true){//cleared dungeon, loot undetermined
            this.clearDungeonAnimation(avatarSettings, hpSettings, endCB);
        } else {
            this.KOAnimation(avatarSettings, hpSettings, endCB);
        }
    }

    KOAnimation(avatarSettings, hpSettings, endCB){
        let clearTween = this.add.tween(this.koText).to( {y: this.game.world.centerY - 150}, 600, Phaser.Easing.Bounce.Out, true);
        clearTween.onComplete.addOnce(()=>{
            setTimeout(() => {
                let clearTweenOut = this.add.tween(this.koText).to( {y: this.game.world.height + 250}, 600, Phaser.Easing.Bounce.Out, true);

                clearTweenOut.onComplete.addOnce(() => {
                    //after clear animation...
                    if(this.game.loot.length > 0){//knocked out with loot
                        this.showLoot();
                    } else {//knocked out without loot
                        this.avatar.moveToAtScale(avatarSettings, hpSettings, 400, endCB);
                    }
                });
            }, 1500);
        });
    }

    clearDungeonAnimation(avatarSettings, hpSettings, endCB){
        this.clearText.visible = true;
        this.add.tween(this.lightBG).to( {alpha: 1}, 600, Phaser.Easing.Bounce.Out, true);
        let clearTween = this.add.tween(this.clearText).to( {y: this.game.world.centerY - 150}, 600, Phaser.Easing.Bounce.Out, true);
        clearTween.onComplete.addOnce(()=>{
            setTimeout(() => {
                let clearTweenOut = this.add.tween(this.clearText).to( {y: this.game.world.height + 250}, 600, Phaser.Easing.Bounce.Out, true);

                clearTweenOut.onComplete.addOnce(() => {
                    this.clearText.visible = false;
                    //after clear animation...
                    if(this.game.loot.length > 0){//knocked out with loot
                        this.showLoot();
                    } else {//knocked out without loot
                        this.avatar.moveToAtScale(avatarSettings, hpSettings, 400, endCB);
                    }
                });
            }, 1200);
        });
    }

    showLoot(){
        //start particles before drop
        this.emitter.start(false, 2000, 50);
        this.game.player.battling = false;
        this.add.tween(this.backdrop).to( {alpha: 0.5}, 600, null, true);
        this.add.tween(this.logBackground).to( {alpha: 0}, 600, null, true);
        this.add.tween(this.errorText).to( {alpha: 0}, 600, null, true);
        let tween_CHEST = this.add.tween(this.chest).to( {angle: 0, y: this.game.world.centerY}, 600, Phaser.Easing.Bounce.Out, true);

        tween_CHEST.onComplete.addOnce(()=>{
            this.getLootText.visible = true;
            this.chest.inputEnabled = true;
            this.chest.input.useHandCursor = true;
            this.chest.events.onInputDown.add(() =>{
                this.emitter.frequency = 1;
                this.emitter.gravity = -400;
                this.emitter.setScale(1, 4, 1, 4, 6000, Phaser.Easing.Quintic.Out, false);
                this.emitter.width = 768;
                let anim = this.chest.animations.play('open', 15, false);
                anim.onComplete.add(()=>{
                    this.add.tween(this.backdrop).to( {alpha: 0.8}, 600, null, true);
                    this.add.tween(this.getLootText).to( {y: this.game.world.centerY + 475}, 600, Phaser.Easing.Bounce.Out, true);
                    let tween_CHEST_DOWN = this.add.tween(this.chest).to( {y: this.game.world.centerY + 300}, 600, Phaser.Easing.Bounce.Out, true);
                    tween_CHEST_DOWN.onComplete.addOnce(()=>{
                        let endCB = () => {
                            this.game.player.battling = false;
                            this.game.state.start('MainMenu', true, false, this.passedEvent);
                        };
                        this.add.tween(this.itemBackdrop).to( {alpha: 0.5}, 600, null, true);
                        this.add.tween(this.lootTitle).to( {alpha: 1}, 600, null, true);
                        this.lootList = new LootList(this.game, this, '#FFFFFF', this.droppedGold, endCB.bind(this));
                    });
                    //this.game.state.start('LootView', true, false);
                });
            }, this);
        });
    }

    updateLogText(logText){
        let currText = this.errorText.text;
        let lines = currText.split('\n');
        console.log('lines length:', lines.length);
        if(lines.length == 7){
            lines.splice(6, 2);
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
                    new Dialogue(this.game, this, 'ok', null, this.currentEnemy.message, ()=>{
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
        let leftThresh = player.equipped.leftHand ? player.equipped.leftHand.crit.threshold : 95;
        let rightThresh = player.equipped.rightHand ? player.equipped.rightHand.crit.threshold : 95;
        let leftMulti = player.equipped.leftHand ? player.equipped.leftHand.crit.multiplier : 2;
        let rightMulti = player.equipped.rightHand ? player.equipped.rightHand.crit.multiplier: 2;
        let bestThresh = Math.min(leftThresh, rightThresh);
        let bestMulti = Math.max(leftMulti, rightMulti);
        let critThreshold = bestThresh;
        if(
            (player.magicFX.time > 0 && player.magicFX.name == 'CRIT')
            || player.skills.includes('crit-chance-up')
        ){ critThreshold -= 15;}
        let critMulti = bestMulti;
        if(player.skills.includes('crit-dmg-up')){critMulti += 1;}

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

        if(enemy.hp < 1){//killed an enemey
            let drop = lootUtils.generateLoot(enemy, this);
            this.droppedGold = drop.gold;
            if(drop.text.length > 0){
                this.updateLogText(drop.text);
            }
            //get exp
            let newExp = Math.floor((enemy.dps + enemy.originalHp) / 2);
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
            this.showClearText = true;
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
            } else {
                //keep the particles with the chest, vertically
                this.emitter.y = this.chest.y;
            }
        } else {
            this.frameCount += 1;
        }

        if(this.clearText.visible){
            if(this.frameCount%15 == 0){
                this.clearText.fill = randomColor({luminosity: 'bright', hue: 'blue'});
            }
        }
        if(this.frameCount%15 == 0){
            this.getLootText.fill = randomColor({luminosity: 'dark', hue: 'yellow'});
        }
        if(this.frameCount%15 == 0){
            this.koText.fill = randomColor({luminosity: 'bright', hue: 'red'});
        }

        let enemySpeedStandIn = 60;
        /*player speed calculation*/
        let normalPlayerModifier = Math.floor(this.game.player.battleStats.dexterity / 3);
        let playerStartingSpeed = this.game.player.battleStats.overEncumbered && !this.game.player.skills.includes('no-weight') ? 90 : 60;
        let berzerker = this.game.player.skills.includes('berserker') && this.frameCount < 150 ? 30 : 0;
        let playerSpeed = playerStartingSpeed - normalPlayerModifier - berzerker;

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
