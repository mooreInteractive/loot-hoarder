import Dialogue from './Dialogue';

export let saveStory = (story) => {
    if(localStorage){
        localStorage.setItem('loot-hoarder-story', JSON.stringify(story));
    }
};

export let chapter1 = {
    shopNote: (game, gameState) => {
        if(game.player.story.chapter1.foudnSecondNote){
            new Dialogue(game, gameState, 'ok', 'Don\'t forget you can sell loot\nfrom your inventory screen\nhere until I get back', ()=>{});
        } else {
            switch(game.player.story.chapter1.timesCheckedShop){
            case 0: new Dialogue(game, gameState, 'ok', 'Back in 5 minutes!', ()=>{});
                break;
            case 1: new Dialogue(game, gameState, 'ok', 'Maybe 20 minutes...', ()=>{});
                break;
            case 2:
            default: new Dialogue(game, gameState, 'ok', 'Actually, I might need some\nhelp at the southern-most\nranch.', ()=>{});
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
        new Dialogue(game, gameState, 'ok', 'What I need is in the\ntown on the dirt cliffs.\nCome find me.', ()=>{
            story.chapter1.foundSecondNote = true;
            saveStory(story);
            cb();
        });
    },

    RescuedShopKeep: (game, gameState) => {
        let story = game.player.story;
        new Dialogue(game, gameState, 'ok', 'Thanks for rescuing me!\nIt seems the towns folk are\nreturning to their shops!', ()=>{
            story.chapter1.RescuedShopKeep = true;
            saveStory(story);
        });
    },

    FirstDungeonBeat: (game, gameState) => {
        new Dialogue(game, gameState, 'ok', 'Thanks for clearing my town!\nI\'m going to charge ahead, and\ntry to help some others.', ()=>{
            new Dialogue(game, gameState, 'ok', 'Feel Free to drop items you\ndon\'t want anymore in my\nshop for what they\'re\nworth. I trust you.', ()=>{});
        });
    }
};
