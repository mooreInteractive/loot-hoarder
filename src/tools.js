import * as Forge from './items/Forge';

export default class Tools {

    constructor (game) {
        this.game = game;
        window.addLoot = this.addLoot.bind(this);
        window.mobParty = this.mobParty.bind(this);
        window.beefcake = this.beefcake.bind(this);
        window.levelUp = this.levelUp.bind(this);
        window.addSkill = this.addSkill.bind(this);
    }

    addSkill(skill){
        this.game.player.skills.push(skill);
    }

    addLoot(amt=3, lvlMin=1, lvlMax=5){
        for(let i = 0; i < amt; i++){
            this.game.loot.push(Forge.getRandomItem(lvlMin,lvlMax));
        }
    }

    addBestLoot(amt=3){
        this.addLoot(amt, 8, 10);
    }

    beefcake(statsAmt=50){
        let stats = this.game.player.baseStats;
        stats.strength = statsAmt;
        stats.vitality = statsAmt;
        stats.wisdom = statsAmt;
        stats.dexterity = statsAmt;
        this.addBestLoot(5);
        this.game.player.updateBattleStats();
        this.game.player.latestUnlockedDungeon = 5;
    }

    levelUp(){
        this.game.player.exp += this.game.player.nextLevel.minExp;
        this.game.player.levelUp();
    }

    mobParty(){
        let mobs = ['goo','whisper','goon','antler','artichoke','hand','moss','skelly','wraith','blood_skull'];
        let mobSprites = [];
        mobs.forEach((enemy, index)=>{
            let addedSprite = this.game.add.sprite(50 + ((index/4)*150), 50 + ((index%4)*250), enemy);
            addedSprite.anchor.setTo(0);
            addedSprite.scale.setTo(1);
            addedSprite.animations.add('walk');
            addedSprite.animations.play('walk', 5, true);
            mobSprites.push(addedSprite);
        });

        setTimeout(()=>{
            mobSprites.forEach((sprite)=>{
                sprite.destroy();
            });
        }, 6000);
    }
}
