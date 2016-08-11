import { placeItemInSlot } from './utils';

class Player {
    constructor(saveData){
        if(saveData){
            this.loadPlayerData(saveData);
        } else {
            this.createNewPlayer();
        }

        this.updateBattleStats = this.updateBattleStats.bind(this);
    }

    createNewPlayer(){
        this.level = 0;
        this.exp = 0;
        this.skillPoints = 0;
        this.battling = false;
        this.latestUnlockedDungeon = 1;
        this.inventory = [];
        this.gold = 0;
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
            totalWeight: 0
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

        this.generateStarterWeapon();

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
                [1,0,0,0],
                [1,0,0,0],
                [0,0,0,0],
                [0,0,0,0]],
            'shapeWidth': 1,
            'shapeHeight': 2,
            'inventorySlot': {x:0, y:0},
            'sprite': 'shank0',
            'value': 1
        };

        placeItemInSlot(this, item, {x:0,y:0});
    }

    heal(){
        if(!this.battling){
            this.battleStats.currentHealth += this.battleStats.wisdom * 1;
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
    }

    skillUp(skill){
        switch(skill){
        case 0: this.baseStats.strength += 1;
            break;
        case 1: this.baseStats.dexterity += 1;
            break;
        case 2: this.baseStats.vitality += 1;
            this.baseStats.health += 10;
            break;
        case 3: this.baseStats.wisdom += 1;
            break;
        }
        this.skillPoints -= 1;
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

        let health = this.battleStats.vitality * 10;
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

        this.battleStats.totalWeight = weight;
        this.battleStats.health = health;
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
                skillPoints: this.skillPoints,
                inventory: this.inventory,
                backpack: backpackImage,
                equipped: this.equipped,
                gold: this.gold,
                baseStats: this.baseStats,
                latestUnlockedDungeon: this.latestUnlockedDungeon,
                currentHealth: this.battleStats.currentHealth
            });
            localStorage.setItem('loot-hoarder-player', playerData);
            localStorage.setItem('loot-hoarder-clock', (new Date).getTime());
        } else {
            console.warn('localStorage doesn\'t exist');
        }
    }

    loadPlayerData(playerData){
        console.log('loading player data:', playerData);
        let oldTime = localStorage.getItem('loot-hoarder-clock');
        let newTime = Math.floor((new Date).getTime()/1000);
        let baseHealth = playerData.baseStats.health;
        let timeDiff = (newTime - oldTime) > 0 ? newTime - oldTime : 0 ;
        let healthOverTime = playerData.currentHealth + timeDiff;
        let currHp = healthOverTime > baseHealth ? baseHealth : healthOverTime;
        console.log('--timeDiff, overtime, currHP', oldTime, newTime, timeDiff, healthOverTime, currHp);

        this.level = playerData.level;
        this.exp = playerData.exp;
        this.skillPoints = playerData.skillPoints;
        this.battling = false;
        this.inventory = playerData.inventory;
        this.equipped = playerData.equipped;
        this.gold = playerData.gold;
        this.baseStats = playerData.baseStats;
        this.latestUnlockedDungeon = playerData.latestUnlockedDungeon;
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
