import Dialogue from './Dialogue';
import { removeItemFromBackpack } from '../utils';


const shopkeepersDagger = {
    'name': `shopkeeper's Dagger`,
    'type': 'melee',
    'inventoryType': 'hand',
    'level': 1,
    'range': 0,
    'durability': 12,
    'weight': 1,
    'dmg': {
        'min': 1,
        'max': 3
    },
    'crit':{
        'multiplier': '2',
        'threshold': '95'
    },
    'magic': {
        'effect':{
            'attribute': null,
            'value': -1
        },
        'damage':{
            'type': null,
            'value': 0,
            'uses': -1
        }
    },
    'shape': [
        [1,1,0,0],
        [1,1,0,0],
        [0,0,0,0],
        [0,0,0,0]],
    'shapeWidth': 2,
    'shapeHeight': 2,
    'inventorySlot': {x:0, y:0},
    'sprite': 'misc_weap',
    'frame': 13,
    'value': 1
};

export let saveStory = (story) => {
    if(localStorage){
        localStorage.setItem('loot-hoarder-story', JSON.stringify(story));
    }
};

export let chapter1 = {
    welcome: (game, gameState) => {
        new Dialogue(game, gameState, 'ok', 'shopkeeper', 'Hey kid! Help me raid this town and clear it of monsters. I don\'t know where they came from!', ()=>{
            game.player.story.chapter1.start = true;
        });
    },
    firstRaid: (game, gameState) => {
        new Dialogue(game, gameState, 'bool', 'shopkeeper', `Don't you have any sort of weapon?`, (reply)=>{
            if(reply === 'yes'){
                new Dialogue(game, gameState, 'ok', 'shopkeeper', `You'd better equip it before raiding.`, ()=>{});
                game.player.story.chapter1.firstRaid = true;
            } else {
                new Dialogue(game, gameState, 'ok', 'shopkeeper', 'Oh, well here take this and equip it.', ()=>{
                    game.player.receiveItem(shopkeepersDagger);
                    game.player.story.chapter1.firstRaid = true;
                    game.player.story.chapter1.shopkeepersDebt = true;
                });
            }
        });
        localStorage.setItem('loot-hoarder-story', JSON.stringify(game.player.story));
    },

    shopkeepersDebt: (game, gameState) => {
        new Dialogue(game, gameState, 'ok', 'shopkeeper', 'Hey kid! I gave you my last good dagger. Can you bring me something made of iron so i can reopen my shop?', ()=>{
            new Dialogue(game, gameState, 'bool', 'shopkeeper', 'Do you have a piece of iron for me?', (reply)=>{
                if(reply === 'yes'){
                    console.log('Check Inventory for Iron Item...', game.player);
                    let invItems = game.player.inventory.filter((item) => {
                        return item.name.search(/iron/gi) > -1;
                    });
                    let ironItems = invItems;
                    let askAboutItem = (index) => {
                        new Dialogue(game, gameState, 'bool', 'shopkeeper', `This one?  '${ironItems[index].name}'`, (reply)=>{
                            if(reply === 'yes'){
                                console.log('remove item:', ironItems[index]);
                                removeItemFromBackpack(game.player.backpack, ironItems[index]);

                                //player
                                console.log('removeing:', index);
                                let inv = game.player.inventory;
                                inv.splice(index, 1);
                                game.player.story.chapter1.shopKeepersDebt = false;
                                game.player.savePlayerData();
                                console.log('inventory after removal:', game.player.inventory);
                            } else {
                                if(index+1 < ironItems.length-1){
                                    askAboutItem(index+1);
                                } else {
                                    new Dialogue(game, gameState, 'ok', 'shopkeeper', `Ok. Well come back when you have one for me.`, ()=>{});
                                }
                            }
                        });
                    };
                    if(ironItems.length > 0){
                        askAboutItem(0);
                    } else {
                        new Dialogue(game, gameState, 'ok', 'shopkeeper', `Are you sure? It's not in your inventory.`, ()=>{});
                    }

                } else {
                    new Dialogue(game, gameState, 'ok', 'shopkeeper', `Are you sure? It's not in your inventory.`, ()=>{});
                }
            });
        });
    },

    dropNote: (game) => {
        game.loot.push({
            type: 'special',
            desc: 'a note of distress',
            task: 'readNote'
        });
    },

    readNote: (game, gameState, cb) => {
        let story = game.player.story;
        new Dialogue(game, gameState, 'ok', 'shopkeeper', 'What I need is in the town on the dirt cliffs. Come find me.', ()=>{
            story.chapter1.foundSecondNote = true;
            saveStory(story);
            cb();
        });
    },

    RescuedShopKeep: (game, gameState) => {
        let story = game.player.story;
        new Dialogue(game, gameState, 'ok', 'shopkeeper', 'Thanks for rescuing me! It seems the towns folk are returning to their shops!', ()=>{
            story.chapter1.RescuedShopKeep = true;
            saveStory(story);
        });
    },

    FirstDungeonBeat: (game, gameState) => {
        new Dialogue(game, gameState, 'ok', 'shopkeeper', 'Thanks for clearing my town!  I\'m going to charge ahead,  and try to help some others.', ()=>{
            new Dialogue(game, gameState, 'ok', 'shopkeeper', 'Feel Free to drop items you  don\'t want anymore in my  shop for what they\'re  worth. I trust you.', ()=>{});
        });
    }
};
