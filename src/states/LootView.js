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

        let errorStyle = {font: 'Oswald', fontSize: 22, fill: '#DE1313'};
        this.errorText = this.add.text(125, 175, '', errorStyle);
        this.errorText.font = 'Oswald';
        this.errorText.fontSize = 22;
        this.errorText.fill = '#DE1313';
        this.errorText.anchor.setTo(0.5);
    }

    update(){
        this.mainNav.update(this.currentDungeon);
    }

}
