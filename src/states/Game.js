import Phaser from 'phaser';

export default class extends Phaser.State {
    init () {}
    preload () {}

    create () {
        let playBtn = new Phaser.Button(this.game, this.game.world.centerX, this.game.world.centerY, 'mushroom', this.playClicked, this);
        playBtn.anchor.setTo(0.5);

        this.game.add.existing(playBtn);

        let banner = this.add.text(this.game.world.centerX, this.game.world.centerY+50, 'Play');
        banner.font = 'Nunito';
        banner.fontSize = 40;
        banner.fill = '#111111';
        banner.anchor.setTo(0.5);

    }

    render () {

    }

    playClicked(){
        this.state.start('MainMenu');
    }
}
