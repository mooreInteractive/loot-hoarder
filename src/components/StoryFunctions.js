import Dialogue from './Dialogue';

export let saveStory = (story) => {
    if(localStorage){
        localStorage.setItem('loot-hoarder-story', JSON.stringify(story));
    }
};

export let chapter1 = {
    shopNote: (game, gameState) => {
        switch(game.player.story.chapter1.timesCheckedShop){
        case 0: new Dialogue(game, gameState, 'ok', 'Back in 5 minutes!', ()=>{});
            break;
        case 1: new Dialogue(game, gameState, 'ok', 'Maybe 20 minutes...', ()=>{});
            break;
        case 2:
        default: new Dialogue(game, gameState, 'ok', 'Actually, I might need some help\nat the southern-most ranch', ()=>{});
            break;
        }
        game.player.story.chapter1.timesCheckedShop += 1;
        localStorage.setItem('loot-hoarder-story', JSON.stringify(game.player.story));
    },

    dropNote: (game) => {
        game.loot.push({
            type: 'special',
            desc: 'a note of distress',
            task: 'readNote'
        });
    },

    readNote: (game, gameState) => {
        let story = game.story;
        new Dialogue(game, gameState, 'ok', 'What I need is in the\ntown on the dirt cliffs.\nCome find me.', ()=>{
            story.chapter1.foundSecondNote = true;
            saveStory(story);
        });
    }
};
