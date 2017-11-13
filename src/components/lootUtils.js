//Loot Utils
import * as StoryFunctions from '../components/StoryFunctions';
import * as Forge from '../items/Forge';

export function generateLoot(enemy, gameState){
    //get loot
    let game = gameState.game;
    let player = game.player;
    let story = player.story;
    let dungeon = gameState.dungeon;

    let drop = {gold: 0, text: []};

    let lootChance = Forge.rand(1,100);
    let lootThreshold = 65;
    let lootMin = dungeon.level - 1 > 1 ? dungeon.level - 1 : dungeon.level;
    let lootMax = dungeon.level;
    if(dungeon.defeated){
        lootThreshold = 85;
    }
    if(enemy.boss){lootThreshold = 0; lootMax = dungeon.level + 1;}
    if(player.magicFX.time > 0 && player.magicFX.name === 'LEWT'){lootThreshold -= 15;}
    if( lootChance > lootThreshold || !story.chapter1.firstLootDrop){
        if(!story.chapter1.firstLootDrop){
            story.chapter1.firstLootDrop = true;
            StoryFunctions.saveStory(story);
            game.loot.push(Forge.getRandomWeapon(lootMin,lootMax));
        } else if(enemy.boss && dungeon.enemiesLeft > 1){//miniBoss
            game.loot.push(Forge.getRandomItem(lootMin,lootMax));
            drop.text.push('Dropped item!');
            let gold = Forge.rand(1,51*player.level);
            drop.gold += gold;
            drop.text.push(`Dropped ${gold} gold.`);
        } else if(enemy.boss && dungeon.enemiesLeft <= 1){//Boss
            game.loot.push(Forge.getRandomWeapon(lootMin,lootMax, 'rare'));
            drop.text.push('Dropped rare item!');
            game.loot.push(Forge.getRandomItem(lootMin,lootMax));
            drop.text.push('Dropped item!');
            let gold = Forge.rand(1,101*player.level);
            drop.gold += gold;
            drop.text.push(`Dropped ${gold} gold.`);
        } else {
            game.loot.push(Forge.getRandomItem(lootMin,lootMax));
            drop.text.push('Dropped item!');
            let goldChance = Forge.rand(0,100);
            if(goldChance > 65){
                let goldDrop = Math.floor(lootChance / 10);
                drop.gold += goldDrop;
                drop.text.push(`Dropped ${goldDrop} gold.`);
            }
        }
    } else{
        let goldChance = Forge.rand(0,100);
        if(goldChance > 65){
            let goldDrop = Math.floor(lootChance / 10);
            //this.game.player.gold += goldDrop;
            drop.gold += goldDrop;
            drop.text.push(`Dropped ${goldDrop} gold.`);
        }
    }

    //Return the drop
    drop.text = drop.text.join('\n');
    player.gold += drop.gold;
    return drop;
}
