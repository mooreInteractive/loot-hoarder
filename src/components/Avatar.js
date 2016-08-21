
export default class Avatar{

    constructor(game, gameState, settings, hpSettings={x: settings.x-105, y: settings.y}, render=true){
        this.game = game;
        this.gameState = gameState;
        this.update = this.update.bind(this);
        let animSpeed = 6;
        let hpWidth = 212;
        let hpHeight = 52;
        let healthBarBackgroundBitMap = this.gameState.add.bitmapData(hpWidth, hpHeight);
        let healthBarBitMap = this.gameState.add.bitmapData(hpWidth-10, hpHeight-12);

        this.animSpeed = animSpeed;

        /* Player Health Bar Graphic and Text */
        healthBarBackgroundBitMap.ctx.beginPath();
        healthBarBackgroundBitMap.ctx.rect(0, 0, hpWidth, hpHeight);
        healthBarBackgroundBitMap.ctx.fillStyle = '#111111';
        healthBarBackgroundBitMap.ctx.fill();

        healthBarBitMap.ctx.beginPath();
        healthBarBitMap.ctx.rect(0, 0, hpWidth-10, hpHeight-12);
        healthBarBitMap.ctx.fillStyle = '#DE1111';
        healthBarBitMap.ctx.fill();

        this.healthBarBg = this.gameState.add.sprite(hpSettings.x - (hpWidth/2), hpSettings.y - (hpHeight/2), healthBarBackgroundBitMap);
        this.healthBar = this.gameState.add.sprite(hpSettings.x - (hpWidth/2) + 6, hpSettings.y - (hpHeight/2) + 6, healthBarBitMap);

        this.healthText = this.gameState.add.text(hpSettings.x - (hpWidth/2) + 12, hpSettings.y - (hpHeight/2) + 6, 'Hp:');
        this.healthText.font = 'Oswald';
        this.healthText.fontSize = 24;
        this.healthText.fill = '#FFFFFF';

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
            this.weapons.right = this.dude.create(settings.x, settings.y, weaponSprite);
            this.weapons.right.anchor.setTo(0.5);
            this.weapons.right.scale.setTo(settings.scale);
            this.weapons.right.animations.add('walk', [0,1,2,3], animSpeed);
            //console.log('--sprite:', this.game.player.equipped.rightHand, (this.game.player.equipped.rightHand == null), this.weapons);
            if(this.game.player.equipped.leftHand == null){
                this.weapons.right.visible = false;
            }

            this.weapons.right.animations.play('walk', animSpeed, true);
            this.armor.head.animations.play('walk', animSpeed, true);
            this.armor.torso.animations.play('walk', animSpeed, true);
            this.armor.feet.animations.play('walk', animSpeed, true);
            this.nakie.animations.play('walk', animSpeed, true);
        }
        console.log('this.armor:', this.armor);
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
                weaponSprite = 'sword';
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
            this.armor.torso.visible = true;
        }

        if(this.game.player.equipped.leftHand == null){
            this.weapons.right.visible = false;
        } else {
            let weaponSprite = this.getWeaponSprite(this.game.player.equipped.leftHand);
            if(weaponSprite != this.weapons.right.key){
                this.weapons.right.loadTexture(weaponSprite, 0);
                this.weapons.right.animations.add('walk');
                equipmentChanged = true;
            }
            this.weapons.right.visible = true;
        }

        if(equipmentChanged == true){
            this.weapons.right.animations.stop(null, true);
            this.armor.head.animations.stop(null, true);
            this.armor.torso.animations.stop(null, true);
            this.armor.feet.animations.stop(null, true);
            this.nakie.animations.stop(null, true);
            this.weapons.right.animations.play('walk', this.animSpeed, true);
            this.armor.head.animations.play('walk', this.animSpeed, true);
            this.armor.torso.animations.play('walk', this.animSpeed, true);
            this.armor.feet.animations.play('walk', this.animSpeed, true);
            this.nakie.animations.play('walk', this.animSpeed, true);
        }

        let time = Math.floor((new Date).getTime()/1000);
        let storedTime = localStorage.getItem('loot-hoarder-clock');
        let player = this.game.player;

        if( storedTime != time){
            let timeDiff = time - storedTime;
            localStorage.setItem('loot-hoarder-clock', time);
            if(player.battleStats.currentHealth < player.battleStats.health && !player.battling){
                for(let i = 0; i < timeDiff; i++){
                    player.heal();
                }
            }
        }

        let currHealth = player.battleStats.currentHealth;
        let maxHealth = player.battleStats.health;
        let healthPercent = currHealth/maxHealth;
        if(healthPercent < 0){ healthPercent = 0; }

        this.healthText.text = `Hp: ${currHealth}/${maxHealth}`;
        this.healthBar.scale.x = healthPercent;
    }

    moveToAtScale(settings={x:this.nakie.x, y:this.nakie.y, scale:this.nakie.scale.x}, hpSettings, speed, cb){
        let animTime = speed;
        let hpWidth = 212;
        let hpHeight = 52;


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
            //hp bar and text
            this.gameState.add.tween(this.healthBarBg).to( { x: hpSettings.x - (hpWidth/2), y: hpSettings.y - (hpHeight/2) }, animTime, null, true);
            this.gameState.add.tween(this.healthBar).to( { x: hpSettings.x - (hpWidth/2) + 6, y: hpSettings.y - (hpHeight/2) + 6 }, animTime, null, true);

            this.gameState.add.tween(this.healthText).to( { x: hpSettings.x - (hpWidth/2) + 12 , y: hpSettings.y - (hpHeight/2) + 6 }, animTime, null, true);
        }



        tween.onComplete.addOnce(cb.bind(this.gameState));
    }

}
