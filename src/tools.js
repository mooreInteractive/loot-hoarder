import * as Forge from './items/Forge';

export default class Tools {

    constructor (game) {
        this.game = game;
        window.addLoot = this.addLoot.bind(this);
    }

    addLoot(amt){
        for(let i = 0; i < amt; i++){
            this.game.loot.push(Forge.getRandomItem(1,5));
        }
    }
}
