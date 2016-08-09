import Phaser from 'phaser';
import MainNavigation from '../components/MainNavigation';

export default class extends Phaser.State {
    init () {}

    create () {
        //this.waterBg = this.game.add.sprite(0, 0, 'water');
        this.water = this.game.add.tileSprite(0, 0, 32 * 6, 32 * 9, 'water');
        this.water.scale.setTo(4,4);
        this.water.animations.add('flow', null, 4, true);
        this.water.animations.play('flow');

        this.island = this.game.add.image(0,50,'island');

        new MainNavigation(this.game, this);

        //Raid Dungeons
        this.raidBtns = [];
        this.raidTexts = [];
        this.dungeonTexts = [];
        this.game.dungeons.forEach((dungeon, index)=> {

            let btn = this.game.add.sprite(dungeon.sprite.x, dungeon.sprite.y, dungeon.sprite.image);
            btn.animations.add('idle', [0,1,2], 4, true);
            btn.animations.play('idle');

            btn.inputEnabled = true;
            btn.events.onInputDown.add(this.startRaid.bind(this, dungeon), this);
            btn.input.useHandCursor = true;
            this.raidBtns.push(btn);

            // let raidText = this.add.text(150, 55 + 55*(index+1), `Raid D-${(index+1)}`);
            // raidText.font = 'Oswald';
            // raidText.fontSize = 28;
            // raidText.fill = '#111111';
            // raidText.anchor.setTo(0.5);
            // this.raidTexts.push(raidText);

            if(this.game.player.latestUnlockedDungeon >= (index+1)){
                btn.alpha = 1;
                //raidText.alpha = 1;
                //let dungeonText = this.add.text(250, 45 + 55*(index+1), `Enemies Left: ${dungeon.enemiesLeft}`);
                //dungeonText.font = 'Oswald';
                //dungeonText.fontSize = 22;
                //dungeonText.fill = '#000000';
                //this.dungeonTexts.push(dungeonText);
            } else {
                btn.alpha = 0.5;
                //raidText.alpha = 0.5;
            }


        });


    }

    startRaid(dungeon){
        if(this.game.player.latestUnlockedDungeon >= dungeon.level){
            this.state.start('Raid', true, false, dungeon);
        }
    }

    render (){
        let time = Math.floor((new Date).getTime()/1000);
        let storedTime = localStorage.getItem('loot-hoarder-clock');
        if( storedTime != time){
            let timeDiff = time - storedTime;
            localStorage.setItem('loot-hoarder-clock', time);
            if(this.game.player.battleStats.currentHealth < this.game.player.battleStats.health){
                for(let i = 0; i < timeDiff; i++){
                    this.game.player.heal();
                }
            }
        }
    }

}
