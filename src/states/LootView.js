import Phaser from 'phaser';
import MainNavigation from '../components/MainNavigation';
import LootList from '../components/LootList';

export default class extends Phaser.State {
    init (currDungeon) {
        this.currentDungeon = currDungeon;
    }

    create () {
        this.mainNav = new MainNavigation(this.game, this);
        this.lootList = new LootList(this.game, this);
        this.lootList.updateLootTextAndButtons();
    }

    update(){
        this.mainNav.update(this.currentDungeon);
    }

}
