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
        this.latestUnlockedDungeon = 0;
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
            armor: 0
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
            'inventorySlot': {x:0, y:0}
        };

        placeItemInSlot(this, item, {x:0,y:0});
    }

    heal(){
        this.battleStats.health += this.battleStats.wisdom * 1;
        if(this.battleStats.health > this.baseStats.health){
            this.battleStats.health = this.baseStats.health;
        }
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

        Object.keys(this.equipped).forEach((type) => {
            let equipment = this.equipped[type];
            if(equipment != null){
                switch(type){
                case 'leftHand':
                case 'rightHand':
                    if(equipment.type == 'melee' || equipment.type == 'ranged'){
                        dmg.min += equipment.dmg.min;
                        dmg.max += equipment.dmg.max;
                    } else {
                        armor += equipment.ac;
                    }
                    break;
                }
            }
        });

        this.battleStats.health = health;
        this.battleStats.dmg = dmg;
        this.battleStats.armor = armor;
    }

    savePlayerData(){
        let backpackImage = [[],[],[],[]];
        this.backpack.forEach((row, index) => {
            this.backpack[index].forEach((slot, index2) => {
                backpackImage[index][index2] = slot.invItem;
            });
        });
        if(localStorage){
            let playerData = JSON.stringify({
                level:this.level,
                inventory: this.inventory,
                backpack: backpackImage,
                equipped: this.equipped,
                gold: this.gold,
                baseStats: this.baseStats,
                latestUnlockedDungeon: this.latestUnlockedDungeon
            });
            localStorage.setItem('loot-hoarder-player', playerData);
        } else {
            console.warn('localStorage doesn\'t exist');
        }
    }

    loadPlayerData(playerData){
        console.log('loading player data:', playerData);
        this.level = playerData.level;
        this.exp = playerData.exp;
        this.inventory = playerData.inventory;
        this.equipped = playerData.equipped;
        this.gold = playerData.gold;
        this.baseStats = playerData.baseStats;
        this.latestUnlockedDungeon = playerData.latestUnlockedDungeon;
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
            armor: 0
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
