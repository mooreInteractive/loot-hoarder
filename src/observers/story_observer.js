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
        this.startGame = this.startGame.bind(this);
    }

    notify(gameState, event){
        switch(event){
        case 'START_GAME': this.startGame(gameState);
            break;
        case 'CLICK_SHOP': this.clickShop(gameState);
            break;
        case 'CLICK_INVENTORY': this.clickInventory(gameState);
            break;
        case 'CLICK_MAIN': this.clickMain(gameState);
            break;
        case 'CLICK_RAID': this.clickRaid(gameState);
        }
    }

    //event handlers - story gate logic
    clickShop(gameState){
        if(!gameState.game.player.story.chapter1.rescuedShopKeep){
            StoryFunctions.chapter1.shopNote(gameState.game, gameState);
        } else {
            console.log('Open The Shop ALREADY!');
        }
    }

    clickInventory(gameState){
        console.log('observed inventory click', gameState.game.player);
    }

    clickMain(gameState){
        console.log('observed main click', gameState.game.player);
    }

    clickRaid(gameState){
        console.log('observed raid click', gameState.game.player);
    }

    startGame(gameState){
        if(!gameState.game.player.story.chapter1.start){
            StoryFunctions.chapter1.welcome(gameState.game, gameState);
        }
    }

}
