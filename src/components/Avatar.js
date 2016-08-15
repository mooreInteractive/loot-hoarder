
export default class Avatar{

    constructor(game, gameState, settings, hpSettings={x: settings.x-105, y: settings.y}, render=true){
        this.game = game;
        this.gameState = gameState;
        this.update = this.update.bind(this);
        let hpWidth = 212;
        let hpHeight = 52;
        let healthBarBackgroundBitMap = this.gameState.add.bitmapData(hpWidth, hpHeight);
        let healthBarBitMap = this.gameState.add.bitmapData(hpWidth-10, hpHeight-12);

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

        if(render){
            this.dude = this.gameState.add.group();
            this.armor = {};
            //walkign man
            this.nakie = this.dude.create(settings.x, settings.y, 'walkingMan');
            this.nakie.anchor.setTo(0.5);
            this.nakie.scale.setTo(settings.scale);
            this.nakie.animations.add('walk', [143,144,145,146,147,148,149,150,151], 15);


            this.armor.head = this.dude.create(settings.x, settings.y, 'head_chain');
            this.armor.head.anchor.setTo(0.5);
            this.armor.head.scale.setTo(settings.scale);
            this.armor.head.animations.add('walk', [28,29,30,31,32,33,34,35,36], 15);
            if(this.game.player.equipped.head == null){
                this.armor.head.visible = false;
            }

            this.armor.torso = this.dude.create(settings.x, settings.y, 'torso_leather');
            this.armor.torso.anchor.setTo(0.5);
            this.armor.torso.scale.setTo(settings.scale);
            this.armor.torso.animations.add('walk', [28,29,30,31,32,33,34,35,36], 15);
            if(this.game.player.equipped.body == null){
                this.armor.torso.visible = false;
            }
            //[28,29,30,31,32,33,34,35,36]
            this.armor.feet = this.dude.create(settings.x, settings.y, 'feet_leather');
            this.armor.feet.anchor.setTo(0.5);
            this.armor.feet.scale.setTo(settings.scale);
            this.armor.feet.animations.add('walk', [28,29,30,31,32,33,34,35,36], 15);
            if(this.game.player.equipped.feet == null){
                this.armor.feet.visible = false;
            }
            this.armor.head.animations.play('walk', 15, true);
            this.armor.torso.animations.play('walk', 15, true);
            this.armor.feet.animations.play('walk', 15, true);
            this.nakie.animations.play('walk', 15, true);
        }
    }

    update(){
        //avatar armor equipped
        if(this.game.player.equipped.head == null){
            this.armor.head.visible = false;
        } else {
            this.armor.head.visible = true;
        }
        if(this.game.player.equipped.feet == null){
            this.armor.feet.visible = false;
        } else {
            this.armor.feet.visible = true;
        }
        if(this.game.player.equipped.body == null){
            this.armor.torso.visible = false;
        } else {
            this.armor.torso.visible = true;
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

    moveToAtScale(settings={x:this.dude.x, y:this.dude.y, scale:this.dude.scale.x}, hpSettings, speed, cb){
        let animTime = speed;
        let hpWidth = 212;
        let hpHeight = 52;

        //Move Avater to battle position, then start the battle
        let tween = this.gameState.add.tween(this.dude).to( {x: settings.x, y: settings.y}, animTime, null, true);
        if(settings.scale != this.dude.scale.x){
            this.gameState.add.tween(this.dude.scale).to( { x: settings.scale, y: settings.scale }, animTime, null, true);
        }

        if(hpSettings){
            //hp bar and text
            this.gameState.add.tween(this.healthBarBg).to( { x: hpSettings.x - (hpWidth/2), y: hpSettings.y - (hpHeight/2) }, animTime, null, true);
            this.gameState.add.tween(this.healthBar).to( { x: hpSettings.x - (hpWidth/2) + 6, y: hpSettings.y - (hpHeight/2) + 6 }, animTime, null, true);

            this.gameState.add.tween(this.healthText).to( { x: hpSettings.x - (hpWidth/2) + 12 , y: hpSettings.y - (hpHeight/2) + 6 }, animTime, null, true);
        }



        tween.onComplete.addOnce(cb.bind(this.gameState));
    }

}
