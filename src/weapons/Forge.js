//Weapon.js

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
        'shape': [
            [1,1,0,0],
            [1,1,0,0],
            [1,1,0,0],
            [0,0,0,0]],
        'shapeWidth': 2,
        'shapeHeight': 3,
        'inventorySlot': {x:0, y:0},
        'value': 0
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
            break;
        case 1: weapon.name = 'Sword';
            break;
        case 2: weapon.name = 'Axe';
            break;
        }
        weapon.shape = [
            [1,0,0,0],
            [1,0,0,0],
            [1,0,0,0],
            [0,0,0,0]];
        weapon.shapeWidth = 1;
        weapon.shapeHeight = 3;
    } else {
        weapon.name = 'Bow';
    }

    //weapon level
    weapon.level = this.rand(levelMin, levelMax);
    weapon.value = 20*weapon.level;
    //add level modifier to name
    switch(weapon.level){
    case 1: weapon.name = 'Broken '+weapon.name;
        weapon.range = 2;
        weapon.weight = 4;
        weapon.durability = this.rand(8,12);
        weapon.dmg.min = this.rand(1,2);
        weapon.dmg.max = this.rand(5,6);
        break;
    case 2: weapon.name = 'Worn '+weapon.name;
        weapon.range = 3;
        weapon.weight = 5;
        weapon.durability = this.rand(10,15);
        weapon.dmg.min = this.rand(2,3);
        weapon.dmg.max = this.rand(7,8);
        break;
    case 3: weapon.range = 4;
        weapon.weight = 7;
        weapon.durability = this.rand(12,16);
        weapon.dmg.min = this.rand(3,4);
        weapon.dmg.max = this.rand(9,10);
        break;
    case 4: weapon.name = 'Sharp '+weapon.name;
        weapon.range = 4;
        weapon.weight = 6;
        weapon.durability = this.rand(15,18);
        weapon.dmg.min = this.rand(5,6);
        weapon.dmg.max = this.rand(10,12);
        break;
    case 5: weapon.name = 'Superior '+weapon.name;
        weapon.range = 5;
        weapon.weight = 6;
        weapon.durability = this.rand(18,22);
        weapon.dmg.min = this.rand(8,10);
        weapon.dmg.max = this.rand(15,18);
        break;
    }

    weapon.value += weapon.dmg.max - weapon.dmg.min;
    weapon.value += weapon.durability - 10;

    switch(this.rand(0,6)){
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
