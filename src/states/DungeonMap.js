import Phaser from 'phaser';
import MainNavigation from '../components/MainNavigation';

export default class extends Phaser.State {
    init () {}

    create () {
        new MainNavigation(this.game, this);

        //Raid Dungeons
        this.raidBtns = [];
        this.raidTexts = [];
        this.dungeonTexts = [];
        this.game.dungeons.forEach((dungeon, index)=> {
            let btn = new Phaser.Button(this.game, 150, 55 + 55*(index+1), 'redButton', this.startRaid.bind(this, dungeon), this);
            btn.anchor.setTo(0.5);
            this.game.add.existing(btn);
            this.raidBtns.push(btn);

            let raidText = this.add.text(150, 55 + 55*(index+1), `Raid D-${(index+1)}`);
            raidText.font = 'Oswald';
            raidText.fontSize = 28;
            raidText.fill = '#111111';
            raidText.anchor.setTo(0.5);
            this.raidTexts.push(raidText);

            if(this.game.player.latestUnlockedDungeon >= (index+1)){
                btn.alpha = 1;
                raidText.alpha = 1;
                let dungeonText = this.add.text(250, 45 + 55*(index+1), `Enemies Left: ${dungeon.enemiesLeft}`);
                dungeonText.font = 'Oswald';
                dungeonText.fontSize = 22;
                dungeonText.fill = '#000000';
                this.dungeonTexts.push(dungeonText);
            } else {
                btn.alpha = 0.5;
                raidText.alpha = 0.5;
            }


        });


    }

    startRaid(dungeon){
        if(this.game.player.latestUnlockedDungeon >= dungeon.level){
            this.state.start('Raid', true, false, dungeon);
        }
    }

}
