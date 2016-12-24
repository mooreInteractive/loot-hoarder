import Phaser from 'phaser';
import MainNavigation from '../components/MainNavigation';
import LootList from '../components/LootList';

export default class extends Phaser.State {
    init () {
        this.currentDungeon = this.game.dungeons[this.game.player.currentDungeon];
    }

    create () {
        this.mainNav = new MainNavigation(this.game, this);
        this.lootList = new LootList(this.game, this);
    }

    update(){
        this.mainNav.update(this.currentDungeon);
    }

}
