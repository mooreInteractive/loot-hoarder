import { rand } from './items/Forge';
import { tryToPlaceItemInBackpack } from './utils';
import * as Story from './data/story';

class Player {
    constructor(saveData, version, story){
        this.version = version;
        this.story = story;
        if(saveData){
            this.loadPlayerData(saveData, version, story);
        } else {
            this.createNewPlayer();
        }

        this.updateBattleStats = this.updateBattleStats.bind(this);
    }

    createNewPlayer(){
        this.level = 0;
        this.exp = 0;
        this.nextLevel = {level: 1, minExp: 25, maxExp: 50};
        this.skillPoints = 0;
        this.skills = [];
        this.skillUps = [];
        this.battling = false;
        this.hitDie = 4;
        this.lastSkillWheelRotation = 0;
        this.latestUnlockedDungeon = 1;
        this.currentDungeon = 0;
        this.inventory = [];
        this.potions = 0;
        this.gold = 0;
        this.magicFX = {name: null, time: 0, totalTime: 300, effect: ''};
        this.baseStats = {
            strength: 1,
            vitality: 1,
            wisdom: 1,
            dexterity: 1,
            health: 10
        };
        this.battleStats = {
            strength: 1,
            vitality: 1,
            wisdom: 1,
            dexterity: 1,
            dmg: {
                min: 0,
                max: 1
            },
            health: 10,
            currentHealth: 10,
            armor: 0,
            totalWeight: 0,
            maxWeight: 0,
            overEncumbered: false
        };

        this.backpack = [
            [{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1}],
            [{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1}],
            [{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1}],
            [{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1},{invItem:-1}]];

        this.equipped = {
            head: null,
            body: null,
            feet: null,
            leftHand: null,
            rightHand: null,
            accessory1: null,
            accessory2: null,
            accessory3: null,
            accessory4: null
        };

        this.story = Story.Story;
        this.generateStarterWeapon();

    }

    setMagicEffect(magicFX){
        this.magicFX = magicFX;
    }

    receiveItem(item){
        let placed = tryToPlaceItemInBackpack(item, this.inventory, this.backpack);
        if(!placed){
            return false;
        }
        this.savePlayerData();
        return true;
    }

    generateStarterWeapon(){
        let item = {
            'name': 'pocket knife',
            'type': 'melee',
            'inventoryType': 'hand',
            'level': 1,
            'range': 0,
            'durability': 12,
            'weight': 1,
            'dmg': {
                'min': 1,
                'max': 2
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
            'frame': 12,
            'value': 1
        };

        this.receiveItem(item);
        // placeItemInSlot(this.backpack, this.inventory, item, {x:0,y:0});
        // this.savePlayerData();
    }

    heal(){
        if(!this.battling){
            this.battleStats.currentHealth += Math.floor(this.battleStats.wisdom * 0.5) || 1;
            //this.savePlayerData();
            //healed hooks
            if(    this.battleStats.currentHealth == this.baseStats.health
                || this.battleStats.currentHealth%(Math.floor(this.baseStats.health/.25)) == 0//quarter health increments
            ){
                this.savePlayerData();
            }
        }
        if(this.battleStats.currentHealth > this.battleStats.health){
            this.battleStats.currentHealth = this.battleStats.health;
        }
    }

    levelUp(){
        this.level += 1;
        this.skillPoints += 1;
        let healthUp = rand(1, (this.hitDie+1));
        console.log('health up:', this.baseStats.health, healthUp);
        this.baseStats.health += healthUp;
        this.nextLevel = this.nextPlayerLevel();
        this.updateBattleStats();
        this.savePlayerData();
    }

    nextPlayerLevel(){
        let minExp = this.nextLevel.minExp*2;
        let maxExp = minExp*2;
        return {level: this.level, minExp, maxExp};
    }

    skillUp(skill){
        switch(skill){
        case 0: this.baseStats.strength += 1;
            break;
        case 1: this.baseStats.dexterity += 1;
            break;
        case 2: this.baseStats.vitality += 1;
            break;
        case 3: this.baseStats.wisdom += 1;
            break;
        }
        this.updateBattleStats();
        this.savePlayerData();
    }

    addSkill(skill){
        this.skills.push(skill);
        this.updateBattleStats();
        this.savePlayerData();
    }

    resetBattleStatsAttributes(){
        this.battleStats.strength = this.baseStats.strength;
        this.battleStats.vitality = this.baseStats.vitality;
        this.battleStats.dexterity = this.baseStats.dexterity;
        this.battleStats.wisdom = this.baseStats.wisdom;
    }

    updateBattleStats(){
        this.resetBattleStatsAttributes();

        Object.keys(this.equipped).forEach((type) => {
            let equipment = this.equipped[type];
            if(equipment != null){
                if(equipment.magic.effect.attribute != null){
                    this.battleStats[equipment.magic.effect.attribute] += equipment.magic.effect.value;
                }
            }
        });

        let dmg = {
            min: this.battleStats.strength - 1,
            max: this.battleStats.strength + 2
        };

        let vitMastery = this.skills.includes('vitality-mastery')
            ? (this.battleStats.vitality*2)
            : 0;
        let health = this.baseStats.health + vitMastery;
        let armor = 0;
        let weight = 0;

        Object.keys(this.equipped).forEach((type) => {
            let equipment = this.equipped[type];
            if(equipment != null){
                if(equipment.type == 'melee' || equipment.type == 'ranged'){
                    dmg.min += equipment.dmg.min;
                    dmg.max += equipment.dmg.max;
                } else if((['head','body','feet','hand']).indexOf(equipment.type) > -1){
                    armor += equipment.ac;
                }
                weight += equipment.weight;
            }
        });

        /* weight/encumberment */
        this.battleStats.totalWeight = weight;
        this.battleStats.maxWeight = 10 + (this.battleStats.strength*5) + (this.battleStats.strength*this.battleStats.dexterity);
        this.battleStats.overEncumbered = this.skills.includes('no-weight') ? false : (this.battleStats.totalWeight > this.battleStats.maxWeight);

        this.battleStats.health = health;
        if(this.battleStats.currentHealth > this.battleStats.health){
            this.battleStats.currentHealth = this.battleStats.health;
        }
        this.battleStats.dmg = dmg;
        this.battleStats.armor = armor;
    }

    savePlayerData(){

        console.log('***saving player data...');
        let backpackImage = [[],[],[],[]];
        this.backpack.forEach((row, index) => {
            this.backpack[index].forEach((slot, index2) => {
                backpackImage[index][index2] = slot.invItem;
            });
        });
        if(localStorage){
            let playerData = JSON.stringify({
                level:this.level,
                exp: this.exp,
                nextLevel: this.nextLevel,
                skillPoints: this.skillPoints,
                skills: this.skills,
                skillUps: this.skillUps,
                hitDie: this.hitDie,
                magicFX: this.magicFX,
                inventory: this.inventory,
                potions: this.potions,
                backpack: backpackImage,
                equipped: this.equipped,
                gold: this.gold,
                baseStats: this.baseStats,
                lastSkillWheelRotation: this.lastSkillWheelRotation,
                latestUnlockedDungeon: this.latestUnlockedDungeon,
                currentDungeon: this.currentDungeon,
                currentHealth: this.battleStats.currentHealth
            });
            localStorage.setItem('loot-hoarder-player', playerData);
            localStorage.setItem('loot-hoarder-clock', (new Date).getTime());
            localStorage.setItem('loot-hoarder-story', JSON.stringify(this.story));
        } else {
            console.warn('localStorage doesn\'t exist');
        }
    }

    loadPlayerData(playerData, version, story){
        //version wipe
        if(localStorage && localStorage.getItem('loot-hoarder-ver') != version){
            console.log(localStorage.getItem('loot-hoarder-ver'), version, 'Player data was for an outdated version, and has been destroyed. :(');

            localStorage.removeItem('loot-hoarder-dungeons');
            localStorage.removeItem('loot-hoarder-player');
            localStorage.removeItem('loot-hoarder-clock');
            localStorage.removeItem('loot-hoarder-loot');
            localStorage.removeItem('loot-hoarder-ver');
            localStorage.removeItem('loot-hoarder-story');

            this.createNewPlayer();
            return;
        }

        //console.log('loading player data:', playerData);
        let oldTime = localStorage.getItem('loot-hoarder-clock');
        let newTime = Math.floor((new Date).getTime()/1000);
        let baseHealth = playerData.baseStats.health;
        let timeDiff = (newTime - oldTime) > 0 ? newTime - oldTime : 0 ;
        let healthOverTime = playerData.currentHealth + timeDiff;
        let currHp = healthOverTime > baseHealth ? baseHealth : healthOverTime;
        //console.log('--timeDiff, overtime, currHP', oldTime, newTime, timeDiff, healthOverTime, currHp);

        this.story = story;
        this.level = playerData.level;
        this.exp = playerData.exp;
        this.nextLevel = playerData.nextLevel;
        this.skillPoints = playerData.skillPoints;
        this.skills = playerData.skills;
        this.skillUps = playerData.skillUps;
        this.hitDie = playerData.hitDie;
        this.magicFX = playerData.magicFX;
        this.battling = false;
        this.inventory = playerData.inventory;
        this.equipped = playerData.equipped;
        this.potions = playerData.potions;
        this.gold = playerData.gold;
        this.baseStats = playerData.baseStats;
        this.currentDungeon = playerData.currentDungeon;
        this.latestUnlockedDungeon = playerData.latestUnlockedDungeon;
        this.lastSkillWheelRotation = playerData.lastSkillWheelRotation;
        this.battleStats = {
            strength: playerData.baseStats.strength,
            vitality: playerData.baseStats.vitality,
            wisdom: playerData.baseStats.wisdom,
            dexterity: playerData.baseStats.dexterity,
            dmg: {
                min: playerData.baseStats.strength-1,
                max: playerData.baseStats.strength
            },
            health: baseHealth,
            currentHealth: currHp,
            armor: 0,
            totalWeight: 0
        };


        this.backpack = [[],[],[],[]];
        playerData.backpack.forEach((row, index) => {
            playerData.backpack[index].forEach((slot, index2) => {
                this.backpack[index][index2] = {invItem: playerData.backpack[index][index2]};
            });
        });

        this.updateBattleStats();
    }


}

export default Player;
