import * as Forge from '../items/Forge';
import * as utils from '../utils';

export default class Avatar{

    constructor(game, gameState, settings, hpSettings={x: settings.x-105, y: settings.y}, render=true, renderHp=true){
        this.game = game;
        this.gameState = gameState;
        this.update = this.update.bind(this);
        this.renderHp = renderHp;
        let animSpeed = 6;
        let hpWidth = 212;
        let hpHeight = 62;

        this.animSpeed = animSpeed;
        let charBackgroundBitMap = this.game.make.bitmapData(hpWidth, 95);
        let healthBarBitMap = this.game.make.bitmapData(200, 25);
        let expBarBitMap = this.game.make.bitmapData(190, 6);
        let magicFXBitMap = this.gameState.add.bitmapData(200, 25);
        this.characterHUD = this.gameState.add.group();
        /* Player Health Bar Graphic and Text */
        charBackgroundBitMap.ctx.beginPath();
        charBackgroundBitMap.ctx.rect(0, 0, hpWidth, 95);
        charBackgroundBitMap.ctx.fillStyle = '#111111';
        charBackgroundBitMap.ctx.fill();


        healthBarBitMap.ctx.beginPath();
        healthBarBitMap.ctx.rect(0, 0, 200, 25);
        healthBarBitMap.ctx.fillStyle = '#DE3434';
        healthBarBitMap.ctx.fill();

        magicFXBitMap.ctx.beginPath();
        magicFXBitMap.ctx.rect(0, 0, 200, 25);
        magicFXBitMap.ctx.fillStyle = '#DE34DE';
        magicFXBitMap.ctx.fill();

        this.charBg = this.characterHUD.create(hpSettings.x - (hpWidth/2) - 10, hpSettings.y - 55, charBackgroundBitMap);
        this.healthBar = this.characterHUD.create(hpSettings.x - (hpWidth/2) + 6, hpSettings.y - 52, healthBarBitMap);
        this.magicFX = this.characterHUD.create(hpSettings.x - (hpWidth/2) + 6, hpSettings.y + 10, magicFXBitMap);

        //Experience Bar
        expBarBitMap.ctx.beginPath();
        expBarBitMap.ctx.rect(0, 0, 190, 6);
        expBarBitMap.ctx.fillStyle = '#2b54b6';
        expBarBitMap.ctx.fill();

        this.expBar = this.characterHUD.create(hpSettings.x - (hpWidth/2) + 16, hpSettings.y - 25, expBarBitMap);

        //Level Icon
        //levelIconBitMap.circle(50,50,50, '#111111');
        //levelIconBitMap.circle(50,50,40, '#FFFFFF');
        let hudPos = {x: hpSettings.x - (hpWidth/2) - 70, y: hpSettings.y - hpHeight + 5};
        this.levelIconBg = this.characterHUD.create(hudPos.x, hudPos.y, 'hud_main');
        this.levelIconBg.inputEnabled = true;
        this.levelIconBg.input.useHandCursor = true;
        this.levelIconBg.events.onInputDown.add(() => {
            if(!this.game.player.battling && this.gameState.key != 'SkillTree'){
                this.gameState.state.start('SkillTree');
            }
        }, this);
        this.levelIconBg.animations.add('pulse', null, 12);
        if(this.game.player.skillPoints > 0){
            this.levelIconBg.animations.play('pulse', 12, true);
        }
        let Pixel28Black = {font: 'Press Start 2P', fontSize: 36, fill: '#FFFFFF', align: 'center' };
        this.levelText = this.gameState.add.text(hpSettings.x - (hpWidth/2) - 18, hpSettings.y - hpHeight + 60, this.game.player.level, Pixel28Black, this.characterHUD);
        this.levelText.anchor.setTo(0.5);
        //this.characterHUD.add(this.leveltext);
        //HP Text
        let Pixel12White = {font: 'Press Start 2P', fontSize: 16, fill: '#FFFFFF' };
        this.healthText = this.gameState.add.text(hpSettings.x - (hpWidth/2) + 25, hpSettings.y - 48, 'Hp:', Pixel12White, this.characterHUD);

        //Magical Effect Text
        this.magicFXText = this.gameState.add.text(hpSettings.x - (hpWidth/2) + 27, hpSettings.y + 15, 'Valor 0:00', Pixel12White, this.characterHUD);
        if(this.game.player.magicFX.time != 0){
            let timeLeft = utils.convertSecondsToTime(this.game.player.magicFX.time);
            this.magicFXText.text = `${this.game.player.magicFX.name} ${timeLeft}`;
        } else {
            this.magicFX.visible = false;
            this.magicFXText.visible = false;
        }


        this.dude = this.gameState.add.group();
        this.armor = {head: null, torso: null, feet: null};
        this.weapons = {right: null};

        if(render){
            //walkign man
            this.nakie = this.dude.create(settings.x, settings.y, 'strong_man');
            this.nakie.anchor.setTo(0.5);
            this.nakie.scale.setTo(settings.scale);
            this.nakie.animations.add('walk', [0,1,2,3], animSpeed);

            let equipped = this.game.player.equipped;
            let headSprite = equipped.head ? equipped.head.avatarSprite : 'hair';
            let torsoSprite = equipped.torso ? equipped.torso.avatarSprite : 'armor_leather';
            let feetSprite = equipped.torso ? equipped.torso.avatarSprite : 'boots_leather';


            this.armor.head = this.dude.create(settings.x, settings.y, headSprite);
            this.armor.head.anchor.setTo(0.5);
            this.armor.head.scale.setTo(settings.scale);
            this.armor.head.animations.add('walk', [0,1,2,3], animSpeed);

            this.armor.torso = this.dude.create(settings.x, settings.y, torsoSprite);
            this.armor.torso.anchor.setTo(0.5);
            this.armor.torso.scale.setTo(settings.scale);
            this.armor.torso.animations.add('walk', [0,1,2,3], animSpeed);
            if(this.game.player.equipped.body == null){
                this.armor.torso.visible = false;
            }
            //[28,29,30,31,32,33,34,35,36]
            this.armor.feet = this.dude.create(settings.x, settings.y, feetSprite);
            this.armor.feet.anchor.setTo(0.5);
            this.armor.feet.scale.setTo(settings.scale);
            this.armor.feet.animations.add('walk', [0,1,2,3], animSpeed);
            if(this.game.player.equipped.feet == null){
                this.armor.feet.visible = false;
            }

            let weaponSprite = this.getWeaponSprite(this.game.player.equipped.leftHand);
            this.weapons.left = this.dude.create(settings.x, settings.y, weaponSprite);
            this.weapons.left.anchor.setTo(0.5);
            this.weapons.left.scale.setTo(settings.scale);
            this.weapons.left.animations.add('walk', [0,1,2,3], animSpeed);
            //console.log('--sprite:', this.game.player.equipped.rightHand, (this.game.player.equipped.rightHand == null), this.weapons);
            if(this.game.player.equipped.leftHand == null){
                this.weapons.left.visible = false;
            }

            let weaponSpriteRight = this.getWeaponSprite(this.game.player.equipped.rightHand) + '_off';
            this.weapons.right = this.dude.create(settings.x, settings.y, weaponSpriteRight);
            this.weapons.right.anchor.setTo(0.5);
            this.weapons.right.scale.setTo(settings.scale);
            this.weapons.right.animations.add('walk', [0,1,2,3], animSpeed);
            //console.log('--sprite:', this.game.player.equipped.rightHand, (this.game.player.equipped.rightHand == null), this.weapons);
            if(this.game.player.equipped.rightHand == null){
                this.weapons.right.visible = false;
            }

            this.weapons.right.animations.play('walk', animSpeed, true);
            this.weapons.left.animations.play('walk', animSpeed, true);
            this.armor.head.animations.play('walk', animSpeed, true);
            this.armor.torso.animations.play('walk', animSpeed, true);
            this.armor.feet.animations.play('walk', animSpeed, true);
            this.nakie.animations.play('walk', animSpeed, true);
        }
    }

    getWeaponSprite(weapon){
        let weaponSprite = 'dagger';
        if(weapon){
            if(weapon.name.search(/knife/ig) > -1){
                weaponSprite = 'dagger';
            } else if(weapon.name.search(/axe/ig) > -1){
                weaponSprite = 'axe';
            } else if(weapon.name.search(/sword/ig) > -1){
                weaponSprite = 'sword';
            } else if(weapon.name.search(/bow/ig) > -1){
                weaponSprite = 'bow';
            } else if(weapon.name.search(/spear/ig) > -1){
                weaponSprite = 'spear';
            }
        }
        return weaponSprite;
    }

    update(){
        //avatar armor equipped
        let equipmentChanged = false;

        if(this.game.player.equipped.head != null){
            if(this.game.player.equipped.head.avatarSprite != this.armor.head.key){
                this.armor.head.loadTexture(this.game.player.equipped.head.avatarSprite, 0);
                this.armor.head.animations.add('walk');
                equipmentChanged = true;
            }
            if(this.armor.head.visible == false){ equipmentChanged = true; }
            this.armor.head.visible = true;
        } else {
            if(this.armor.head.key != 'hair'){
                this.armor.head.loadTexture('hair', 0);
                this.armor.head.animations.add('walk');
                equipmentChanged = true;
            }
        }

        if(this.game.player.equipped.feet == null){
            this.armor.feet.visible = false;
        } else {
            if(this.game.player.equipped.feet.avatarSprite != this.armor.feet.key){
                this.armor.feet.loadTexture(this.game.player.equipped.feet.avatarSprite, 0);
                this.armor.feet.animations.add('walk');
                equipmentChanged = true;
            }
            if(this.armor.feet.visible == false){ equipmentChanged = true; }
            this.armor.feet.visible = true;
        }

        if(this.game.player.equipped.body == null){
            this.armor.torso.visible = false;
        } else {
            if(this.game.player.equipped.body.avatarSprite != this.armor.torso.key){
                this.armor.torso.loadTexture(this.game.player.equipped.body.avatarSprite, 0);
                this.armor.torso.animations.add('walk');
                equipmentChanged = true;
            }
            if(this.armor.torso.visible == false){ equipmentChanged = true; }
            this.armor.torso.visible = true;
        }

        if(this.game.player.equipped.leftHand == null){
            this.weapons.left.visible = false;
        } else {
            let weaponSprite = this.getWeaponSprite(this.game.player.equipped.leftHand);
            if(weaponSprite != this.weapons.left.key){
                this.weapons.left.loadTexture(weaponSprite, 0);
                this.weapons.left.animations.add('walk');
                equipmentChanged = true;
            }
            if(this.weapons.left.visible == false){ equipmentChanged = true; }
            this.weapons.left.visible = true;
        }

        if(this.game.player.equipped.rightHand == null){
            this.weapons.right.visible = false;
        } else {
            let weaponSpriteRight = this.getWeaponSprite(this.game.player.equipped.rightHand) + '_off';
            if(weaponSpriteRight != this.weapons.right.key){
                this.weapons.right.loadTexture(weaponSpriteRight, 0);
                this.weapons.right.animations.add('walk');
                equipmentChanged = true;
            }
            if(this.weapons.right.visible == false){ equipmentChanged = true; }
            this.weapons.right.visible = true;
        }

        if(equipmentChanged == true){
            this.weapons.right.animations.stop(null, true);
            this.weapons.left.animations.stop(null, true);
            this.armor.head.animations.stop(null, true);
            this.armor.torso.animations.stop(null, true);
            this.armor.feet.animations.stop(null, true);
            this.nakie.animations.stop(null, true);
            this.weapons.right.animations.play('walk', this.animSpeed, true);
            this.weapons.left.animations.play('walk', this.animSpeed, true);
            this.armor.head.animations.play('walk', this.animSpeed, true);
            this.armor.torso.animations.play('walk', this.animSpeed, true);
            this.armor.feet.animations.play('walk', this.animSpeed, true);
            this.nakie.animations.play('walk', this.animSpeed, true);
        }

        let time = Math.floor((new Date).getTime()/1000);
        let storedTime = localStorage.getItem('loot-hoarder-clock');
        let player = this.game.player;
        let timeDiff = time - storedTime < 0 ? 0 : time - storedTime;

        //If at least one second has passed, if more, compensate
        if(storedTime != time){
            localStorage.setItem('loot-hoarder-clock', time);
            //Update Character Health
            if(player.battleStats.currentHealth < player.battleStats.health && !player.battling){
                for(let i = 0; i < timeDiff; i++){
                    player.heal();
                }
            }
            //Update magic FX
            if(player.magicFX.time > 0){
                this.game.player.magicFX.time -= timeDiff;
                let timeLeft = utils.convertSecondsToTime(this.game.player.magicFX.time);
                this.magicFXText.text = `${this.game.player.magicFX.name} ${timeLeft}`;
                if(this.renderHp){
                    this.magicFXText.visible = true;
                    this.magicFX.visible = true;
                }
            } else {
                this.magicFXText.visible = false;
                this.magicFX.visible = false;
            }
        }

        let currHealth = player.battleStats.currentHealth;
        let maxHealth = player.battleStats.health;
        let healthPercent = currHealth/maxHealth;
        if(healthPercent < 0){ healthPercent = 0; }

        let currExp = player.exp;
        let nextExp = player.nextLevel.minExp;
        let nextExpAdjust = player.level == 0 ? 0 : (nextExp/2);
        let expPercent = (currExp - nextExpAdjust)/nextExp;

        if (expPercent < 0) {
            expPercent = 0;
        } else if (expPercent > 1){
            expPercent = 1;
        }

        let magicFXPercent = player.magicFX.time/player.magicFX.totalTime > 0 ? player.magicFX.time/player.magicFX.totalTime : 0;

        this.healthText.text = `HP ${currHealth}/${maxHealth}`;
        this.healthBar.scale.x = healthPercent;

        this.magicFX.scale.x = magicFXPercent;

        this.expBar.scale.x = expPercent;

        if(this.game.player.skillPoints == 0){
            this.levelIconBg.frame = 0;
            this.levelIconBg.animations.stop();
        }
    }

    moveToAtScale(settings={x:this.nakie.x, y:this.nakie.y, scale:this.nakie.scale.x}, hpSettings, speed, cb){
        let animTime = speed;


        let tween = this.gameState.add.tween(this.nakie).to( {x: settings.x, y: settings.y}, animTime, null, true);
        if(settings.scale != this.nakie.scale.x){
            this.gameState.add.tween(this.nakie.scale).to( { x: settings.scale, y: settings.scale }, animTime, null, true);
        }

        //Move Avater to battle position, then start the battle
        Object.keys(this.armor).forEach((key)=>{
            let armor = this.armor[key];
            this.gameState.add.tween(armor).to( {x: settings.x, y: settings.y}, animTime, null, true);
            if(settings.scale != this.nakie.scale.x){
                this.gameState.add.tween(armor.scale).to( { x: settings.scale, y: settings.scale }, animTime, null, true);
            }
        });

        //move avatar weapons
        Object.keys(this.weapons).forEach((key)=>{
            let weapon = this.weapons[key];
            this.gameState.add.tween(weapon).to( {x: settings.x, y: settings.y}, animTime, null, true);
            if(settings.scale != this.nakie.scale.x){
                this.gameState.add.tween(weapon.scale).to( { x: settings.scale, y: settings.scale }, animTime, null, true);
            }
        });

        if(hpSettings){
            console.log('hud position:', this.characterHUD.position);
            this.gameState.add.tween(this.characterHUD.position).to({x: -150, y: 165}, animTime, null, true);
            //this.gameState.add.tween(this.characterHUD.position).to({x: hpSettings.x - (hpWidth/2) - 57, y: hpSettings.y - hpHeight + 40}, animTime, null, true);
            //hp bar and text
            // this.gameState.add.tween(this.levelIconBg).to( { x:hpSettings.x - (hpWidth/2) - 57, y: hpSettings.y - hpHeight + 40 }, animTime, null, true);
            // this.gameState.add.tween(this.healthBar).to( { x: hpSettings.x - (hpWidth/2) + 6, y: hpSettings.y - 52 }, animTime, null, true);
            // this.gameState.add.tween(this.expBar).to( { x: hpSettings.x - (hpWidth/2) + 6, y: hpSettings.y + (hpHeight/2) }, animTime, null, true);
            //
            // this.gameState.add.tween(this.healthText).to( { x: hpSettings.x - (hpWidth/2) + 25, y: hpSettings.y - 48 }, animTime, null, true);
        }

        tween.onComplete.addOnce(cb.bind(this.gameState));
    }

    fakeUpdate(){

        let headSprites = ['helm_leather','helm_stone','helm_iron','helm_steel','hair'];
        let headSprite = headSprites[Forge.rand(0, headSprites.length)];
        this.armor.head.loadTexture(headSprite, 0);
        this.armor.head.animations.add('walk');
        this.armor.head.visible = true;

        let feetSprites = ['boots_leather','boots_stone','boots_iron','boots_steel'];
        let feetSprite = feetSprites[Forge.rand(0, feetSprites.length)];
        this.armor.feet.loadTexture(feetSprite, 0);
        this.armor.feet.animations.add('walk');
        this.armor.feet.visible = true;

        let bodySprites = ['armor_leather','armor_stone','armor_iron','armor_steel'];
        let random = Forge.rand(0, bodySprites.length);
        let bodySprite = bodySprites[random];
        this.armor.torso.loadTexture(bodySprite, 0);
        this.armor.torso.animations.add('walk');
        this.armor.torso.visible = true;

        let weaponSprites = ['axe', 'sword', 'dagger', 'bow', 'spear'];
        let weaponSprite = weaponSprites[Forge.rand(0, weaponSprites.length)];
        this.weapons.left.loadTexture(weaponSprite, 0);
        this.weapons.left.animations.add('walk');
        this.weapons.left.visible = true;

        let weaponSpritesR = ['axe_off', 'sword_off', 'dagger_off', 'bow_off', 'spear_off'];
        let weaponSpriteR = weaponSpritesR[Forge.rand(0, weaponSpritesR.length)];
        this.weapons.right.loadTexture(weaponSpriteR, 0);
        this.weapons.right.animations.add('walk');
        this.weapons.right.visible = true;

        this.weapons.right.animations.stop(null, true);
        this.weapons.left.animations.stop(null, true);
        this.armor.head.animations.stop(null, true);
        this.armor.torso.animations.stop(null, true);
        this.armor.feet.animations.stop(null, true);
        this.nakie.animations.stop(null, true);
        this.weapons.right.animations.play('walk', this.animSpeed, true);
        this.weapons.left.animations.play('walk', this.animSpeed, true);
        this.armor.head.animations.play('walk', this.animSpeed, true);
        this.armor.torso.animations.play('walk', this.animSpeed, true);
        this.armor.feet.animations.play('walk', this.animSpeed, true);
        this.nakie.animations.play('walk', this.animSpeed, true);
    }

}
