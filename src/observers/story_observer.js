import * as StoryFunctions from './StoryFunctions';

export default class StoryObserver{
    constructor(){
        this.notify = this.notify.bind(this);
    }

    static notify(game, gameState, entity, event){
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

    //private functions
    clickShop(gameState, player){
        if(!player.story.chapter1.rescuedShopKeep){
            StoryFunctions.chapter1.shopNote(gameState.game, gameState);
        } else {
            console.log('Open The Shop ALREADY!');
        }
    }

    clickInventory(gameState, player){
        console.log('observed inventory click');
    }

    clickMain(gameState, player){
        console.log('observed main click');
    }
    clickRaid(gameState, player){
        console.log('observed raid click');
    }

}
