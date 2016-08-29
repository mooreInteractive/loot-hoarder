//Weapon.js
import * as Constants from './constants';
import * as Weapons from '../data/weapons';

export function build(levelMin, levelMax) {
    let weapon = {
        'name': 'null',
        'type': 'null',
        'inventoryType': 'hand',
        'level': 0,
        'range': 0,
        'durability': 0,
        'weight': 0,
        'dmg': {
            'min': 0,
            'max': 0
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
        'shape': Constants.shapes.shape2x3,
        'shapeWidth': 2,
        'shapeHeight': 3,
        'inventorySlot': {x:0, y:0},
        'value': 0,
        'sprite': ''
    };

    switch(this.rand(0,2)){
    case 0: weapon.type = 'melee';
        break;
    case 1: weapon.type = 'ranged';
        break;
    }

    if(weapon.type == 'melee'){
        switch(this.rand(0,3)){
        case 0: weapon.name = 'Spear';
            weapon.sprite = 'spear0';
            weapon.shape = Constants.shapes.shape1x3;
            weapon.shapeWidth = 1;
            weapon.shapeHeight = 3;
            break;
        case 1: weapon.name = 'Sword';
            weapon.sprite = 'sword2';
            weapon.shape = Constants.shapes.shape1x3;
            weapon.shapeWidth = 1;
            weapon.shapeHeight = 3;
            break;
        case 2: weapon.name = 'Axe';
            weapon.sprite = 'axe0';
            break;
        }
    } else {
        weapon.name = 'Bow';
        weapon.sprite = 'bow0';
    }

    //weapon level
    weapon.level = this.rand(levelMin, levelMax+1);
    weapon.value = 20*weapon.level;
    //add level modifier to name
    if(weapon.name == 'Sword'){
        let weaponSet = Weapons.swords.filter((sword)=>{
            return sword.level == weapon.level;
        });
        let sword = weaponSet[this.rand(0,weaponSet.length-1)];
        let dmgSplit = sword.dmg.split('+');
        let modifier = parseInt(dmgSplit[1]) || 0;
        let dmgMinMax = dmgSplit[0].split('d');
        let dmgMin = parseInt(dmgMinMax[0])+modifier;
        let dmgMax = (parseInt(dmgMinMax[0])*parseInt(dmgMinMax[1]))+modifier;

        weapon.name = sword.name;
        weapon.weight = parseInt(sword.weight);
        weapon.dmg.min = dmgMin;
        weapon.dmg.max = dmgMax;
    } else {
        switch(weapon.level){
        case 1: weapon.name = 'Broken '+weapon.name;
            weapon.weight = 4;
            weapon.durability = this.rand(8,12);
            weapon.dmg.min = this.rand(1,2);
            weapon.dmg.max = this.rand(5,6);
            break;
        case 2: weapon.name = 'Worn '+weapon.name;
            weapon.weight = 5;
            weapon.durability = this.rand(10,15);
            weapon.dmg.min = this.rand(2,3);
            weapon.dmg.max = this.rand(7,8);
            break;
        case 3: weapon.weight = 7;
            weapon.durability = this.rand(12,16);
            weapon.dmg.min = this.rand(3,4);
            weapon.dmg.max = this.rand(9,10);
            break;
        case 4: weapon.name = 'Sharp '+weapon.name;
            weapon.weight = 6;
            weapon.durability = this.rand(15,18);
            weapon.dmg.min = this.rand(5,6);
            weapon.dmg.max = this.rand(10,12);
            break;
        case 5: weapon.name = 'Superior '+weapon.name;
            weapon.weight = 6;
            weapon.durability = this.rand(18,22);
            weapon.dmg.min = this.rand(8,10);
            weapon.dmg.max = this.rand(15,18);
            break;
        }
    }



    weapon.value += weapon.dmg.max - weapon.dmg.min;
    weapon.value += weapon.durability - 10;

    switch(this.rand(0,12)){
    case 0:
        weapon.magic.effect = this.getMagicEffect(weapon.level);
        weapon.name += ' of '+weapon.magic.effect.attribute;
        weapon.value += 100*weapon.level;
        break;
    default:
        break;
    }
    //return the weapon
    return weapon;
}

export function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function getMagicEffect(lvl) {
    var effect = {};

    switch(this.rand(0,4)){
    case 0: effect.attribute = 'strength';
        break;
    case 1: effect.attribute = 'dexterity';
        break;
    case 2: effect.attribute = 'wisdom';
        break;
    case 3: effect.attribute = 'vitality';
        break;
    }

    effect.value = lvl;


    return effect;
}
