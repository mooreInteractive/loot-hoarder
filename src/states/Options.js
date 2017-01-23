import Phaser from 'phaser';
import MainNavigation from '../components/MainNavigation';
import Dialogue from '../components/Dialogue';

let credits = [
    {text: 'Loxmyth - Avatar/Enemies Art', link: 'http://loxmyth.com'},
    {text: 'Nick Heathfield - Music', link: 'http://nickheathfield.co.uk'},
    {text: 'Buch(OGA) - overworld, portraits', link: 'http://opengameart.org/users/buch'},
    {text: 'Bevouliin(OGA) - battle backgrounds', link: 'http://bevouliin.com/'},
    {text: 'Kenney (Asset Jesus) - Buttons Art', link: 'http://kenney.nl'}
];

export default class extends Phaser.State {
    init () {
        this.game.dialogueOpen = false;
    }

    create () {
        new MainNavigation(this.game, this);

        //clear data button
        this.clearDataBtn = new Phaser.Button(this.game, this.game.world.centerX, 700, 'redButton', this.checkToClearPlayerData, this);
        this.clearDataBtn.anchor.setTo(0.5);
        this.clearDataBtn.scale.setTo(2,2);
        this.game.add.existing(this.clearDataBtn);

        //music buttons
        this.musicOn = new Phaser.Button(this.game, this.game.world.centerX + 140, 105, 'music_on', this.toggleMusic, this);
        this.musicOn.anchor.setTo(0.5);
        this.game.add.existing(this.musicOn);
        this.musicOn.visible = !this.game.music.mute;

        this.musicOff = new Phaser.Button(this.game, this.game.world.centerX + 140, 105, 'music_off', this.toggleMusic, this);
        this.musicOff.anchor.setTo(0.5);
        this.game.add.existing(this.musicOff);
        this.musicOff.visible = this.game.music.mute;

        let textStyle = {fontSize: 24, font: 'Press Start 2P', fill: '#000000'};
        let smallTextStyle = {fontSize: 18, font: 'Press Start 2P', fill: '#000000'};

        this.clearBtnText = this.add.text(this.game.world.centerX, 700, 'Clear Game Data', textStyle);
        this.clearBtnText.anchor.setTo(0.5);

        this.musicText = this.add.text(this.game.world.centerX - 50, 110, 'Music on/off:', textStyle);
        this.musicText.anchor.setTo(0.5);

        this.creditsText = this.add.text(75, 200, 'Credtis(Thank you!):', textStyle);
        //credits:
        this.creditBtns = [];

        credits.forEach((credit, index) => {
            let btn = this.add.text(75, (250+(index*35)), credit.text, smallTextStyle);
            btn.inputEnabled = true;
            btn.events.onInputDown.add(this.creditClicked.bind(this, index), this);
            btn.input.useHandCursor = true;
            this.creditBtns.push(btn);
        });
    }

    creditClicked(index){
        window.open(credits[index].link, '_blank');
    }

    checkToClearPlayerData(){
        new Dialogue(this.game, this, 'bool', null, 'Are you sure you want to erase all your saved data and progress?', (reply)=>{
            if(reply == 'yes'){
                this.clearPlayerData();
            } else if(reply == 'no'){
                console.log('that was a close one...');
            }
        });
    }

    clearPlayerData(){
        if(localStorage){
            localStorage.removeItem('loot-hoarder-dungeons');
            localStorage.removeItem('loot-hoarder-player');
            localStorage.removeItem('loot-hoarder-clock');
            localStorage.removeItem('loot-hoarder-loot');
            localStorage.removeItem('loot-hoarder-story');
            localStorage.removeItem('loot-hoarder-ver');
            window.location.reload();
        }
    }

    toggleMusic(){
        this.game.music.mute = !this.game.music.mute;
        this.musicOn.visible = !this.game.music.mute;
        this.musicOff.visible = this.game.music.mute;
        if(localStorage){
            localStorage.setItem('loot-hoarder-music', this.game.music.mute);
        }
    }

}
