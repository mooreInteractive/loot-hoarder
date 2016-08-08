import Phaser from 'phaser';
import MainNavigation from '../components/MainNavigation';
import LootList from '../components/LootList';

export default class extends Phaser.State {
    init () {}

    create () {
        new MainNavigation(this.game, this);
        this.lootList = new LootList(this.game, this);
        this.lootList.updateLootTextAndButtons();
    }

}
