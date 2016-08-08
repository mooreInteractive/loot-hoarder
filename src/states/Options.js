import Phaser from 'phaser';
import MainNavigation from '../components/MainNavigation';

export default class extends Phaser.State {
    init () {}

    create () {
        new MainNavigation(this.game, this);

        //clear data button
        this.clearDataBtn = new Phaser.Button(this.game, this.game.world.centerX, this.game.world.centerY, 'redButton', this.clearPlayerData, this);
        this.clearDataBtn.anchor.setTo(0.5);
        this.clearDataBtn.scale.setTo(2,2);
        this.game.add.existing(this.clearDataBtn);

        let clearBtnStyle = {fontSize: 32, font: 'Oswald', fill: '#000000'};
        this.clearBtnText = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Clear Game Data', clearBtnStyle);
        this.clearBtnText.anchor.setTo(0.5);
    }

    clearPlayerData(){
        if(localStorage){
            localStorage.removeItem('loot-hoarder-dungeons');
            localStorage.removeItem('loot-hoarder-player');
            localStorage.removeItem('loot-hoarder-clock');
            window.location.reload();
        }
    }

}
