//Weapon.js
import * as Constants from './constants';
import * as Weapons from '../data/weapons';

export function build(levelMin, levelMax) {
    let weapon = {
        'name': 'null',
        'type': 'null',
        'inventoryType': 'hand',
        'level': 0,
        'hands': 1,
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

    //weapon level
    weapon.level = this.rand(levelMin, levelMax+1);
    //add level modifier to name

    let weaponSet = Weapons.weapons.filter((randWeapon)=>{
        return randWeapon.level == weapon.level;
    });
    let newWeapon = weaponSet[this.rand(0,weaponSet.length-1)];
    let dmgSplit = newWeapon.dmg.split('+');
    let modifier = parseInt(dmgSplit[1]) || 0;
    let dmgMinMax = dmgSplit[0].split('d');
    let dmgMin = parseInt(dmgMinMax[0])+modifier;
    let dmgMax = (parseInt(dmgMinMax[0])*parseInt(dmgMinMax[1]))+modifier;
    let critData = newWeapon.crit.split('/');
    let critThreshold = critData.length > 1 ? critData[0] : 95;
    let critMultiplier = critData.length > 1 ? critData[1].slice(1) : critData[0].slice(1);

    weapon.name = newWeapon.name;
    weapon.hands = newWeapon.twoHanded ? 2 : newWeapon.hands ? newWeapon.hands : 1;
    weapon.weight = parseInt(newWeapon.weight);
    weapon.frame = parseInt(newWeapon.frame);
    weapon.dmg.min = parseInt(dmgMin);
    weapon.dmg.max = parseInt(dmgMax);
    weapon.value = parseInt(newWeapon.value);
    weapon.crit = {};
    weapon.crit.multiplier = critMultiplier;
    weapon.crit.threshold = critThreshold;

    switch(newWeapon.spriteType){
    case 'spear':
        weapon.sprite = 'misc_weap';
        weapon.shape = Constants.shapes.shape2x3;
        weapon.shapeWidth = 2;
        weapon.shapeHeight = 3;
        break;
    case 'sword':
        weapon.sprite = 'swords';
        weapon.shape = Constants.shapes.shape2x3;
        weapon.shapeWidth = 2;
        weapon.shapeHeight = 3;
        break;
    case 'axe':
        weapon.sprite = 'axes';
        weapon.shape = Constants.shapes.shape2x3;
        weapon.shapeWidth = 2;
        weapon.shapeHeight = 3;
        break;
    case 'dagger':
        weapon.sprite = 'misc_weap';
        weapon.shape = Constants.shapes.shape2x2;
        weapon.shapeWidth = 2;
        weapon.shapeHeight = 2;
        break;
    case 'bow':
        weapon.sprite = 'misc_weap';
        weapon.shape = Constants.shapes.shape2x3;
        weapon.shapeWidth = 2;
        weapon.shapeHeight = 3;
        break;
    }

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
