/* -- Story Observer --
*  The Story observer will observe various user interactions,
*  and game events, then trigger story functions throughout the game.
*  This file basically matches up game events to story events.
*/
import * as StoryFunctions from '../components/StoryFunctions';
import Dialogue from '../components/Dialogue';

export default class StoryObserver{
    constructor(){
        this.notify = this.notify.bind(this);
        this.clickShop = this.clickShop.bind(this);
        this.clickInventory = this.clickInventory.bind(this);
        this.clickMain = this.clickMain.bind(this);
        this.clickRaid = this.clickRaid.bind(this);
        this.startGame = this.startGame.bind(this);
    }

    notify(gameState, event, cb){
        switch(event){
        case 'START_GAME': this.startGame(gameState);
            break;
        case 'CLICK_SHOP': this.clickShop(gameState, cb);
            break;
        case 'CLICK_INVENTORY': this.clickInventory(gameState);
            break;
        case 'CLICK_MAIN': this.clickMain(gameState);
            break;
        case 'CLICK_RAID': this.clickRaid(gameState, cb);
        }
    }

    //event handlers - story gate logic
    clickShop(gameState, openShop){
        if(!gameState.game.player.story.chapter1.shopkeepersDebt){
            openShop();
        } else {
            StoryFunctions.chapter1.shopkeepersDebt(gameState.game, gameState);
        }
    }

    clickInventory(gameState){
        console.log('observed inventory click', gameState.game.player);
    }

    clickMain(gameState){
        console.log('observed main click', gameState.game.player);
    }

    clickRaid(gameState, cb){
        let equippedGear = false;
        let equipment = gameState.game.player.equipped;
        let dungeon = gameState.game.dungeons[gameState.game.player.currentDungeon];

        Object.keys(equipment).forEach((slot) => {
            if(equipment[slot] != null){
                equippedGear = true;
                return;
            }
        });
        if(!equippedGear && !gameState.game.player.story.chapter1.firstRaid){
            StoryFunctions.chapter1.firstRaid(gameState.game, gameState.gameState);
        } else {
            if(gameState.game.player.latestUnlockedDungeon >= dungeon.level){
                if(gameState.game.player.battleStats.currentHealth > 1){
                    cb(dungeon);
                }
            } else {
                new Dialogue(gameState.game, gameState.gameState, 'ok', 'shopkeeper', 'Youre weak son.', ()=>{});
            }
        }
    }

    startGame(gameState){
        if(!gameState.game.player.story.chapter1.start){
            StoryFunctions.chapter1.welcome(gameState.game, gameState);
        }
    }

}
