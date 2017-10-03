import Dialogue from './Dialogue';

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
        new Dialogue(game, gameState, 'ok', 'shopkeeper', 'You should equip something before raiding...', ()=>{});
    },
    shopNote: (game, gameState) => {
        console.log('story gameState:', gameState);
        if(game.player.story.chapter1.foundSecondNote){
            new Dialogue(game, gameState, 'ok', 'shopkeeper', 'Don\'t forget you can sell loot from your inventory screen here until I get back', ()=>{});
        } else {
            switch(game.player.story.chapter1.timesCheckedShop){
            case 0: new Dialogue(game, gameState, 'ok', 'shopkeeper', 'Back in 5 minutes! Sell items from your inventory here until I get back.', ()=>{});
                break;
            case 1: new Dialogue(game, gameState, 'ok', 'shopkeeper', 'Maybe 20 minutes...', ()=>{});
                break;
            case 2:
            default: new Dialogue(game, gameState, 'ok', 'shopkeeper', 'Actually, I might need some help at the southern-most ranch.', ()=>{});
                break;
            }
            game.player.story.chapter1.timesCheckedShop += 1;
        }
        localStorage.setItem('loot-hoarder-story', JSON.stringify(game.player.story));
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
