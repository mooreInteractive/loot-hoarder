/* -- Story Observer --
*  The Story observer will observe various user interactions,
*  and game events, then trigger story functions throughout the game.
*  This file basically matches up game events to story events.
*/
import * as StoryFunctions from '../components/StoryFunctions';

export default class StoryObserver{
    constructor(){
        this.notify = this.notify.bind(this);
        this.clickShop = this.clickShop.bind(this);
        this.clickInventory = this.clickInventory.bind(this);
        this.clickMain = this.clickMain.bind(this);
        this.clickRaid = this.clickRaid.bind(this);
    }

    notify(game, gameState, entity, event){
        switch(event){
        case 'CLICK_SHOP': this.clickShop(gameState, entity);
            break;
        case 'CLICK_INVENTORY': this.clickInventory(gameState, entity);
            break;
        case 'CLICK_MAIN': this.clickMain(gameState, entity);
            break;
        case 'CLICK_RAID': this.clickRaid(gameState, entity);
        }
    }

    //event handlers - story gate logic
    clickShop(gameState, player){
        if(!player.story.chapter1.rescuedShopKeep){
            StoryFunctions.chapter1.shopNote(gameState.game, gameState);
        } else {
            console.log('Open The Shop ALREADY!');
        }
    }

    clickInventory(gameState, player){
        console.log('observed inventory click', player);
    }

    clickMain(gameState, player){
        console.log('observed main click', player);
    }
    clickRaid(gameState, player){
        console.log('observed raid click', player);
    }

}
