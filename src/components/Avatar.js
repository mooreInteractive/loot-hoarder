
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
            //walkign man
            this.dude = this.gameState.add.sprite(settings.x, settings.y, 'walkingMan');
            this.dude.anchor.setTo(0.5);
            this.dude.scale.setTo(settings.scale);
            this.dude.animations.add('walk', [143,144,145,146,147,148,149,150,151], 15);
            this.dude.animations.play('walk', 15, true);
        }
    }

    update(){
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
