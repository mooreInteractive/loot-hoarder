//Accessory.js
import * as Constants from './constants';

export function build(levelMin, levelMax) {
    let accessory = {
        'name': 'null',
        'type': 'accessory',
        'inventoryType': 'accessory',
        'weight': 1,
        'durability': 100,
        'magic': {
            'effect':{
                'attribute': null,
                'value': -1
            }
        },
        'shape': Constants.shapes.shape1x1,
        'shapeWidth': 1,
        'shapeHeight': 1,
        'inventorySlot': {x:0, y:0},
        'value': 0
    };

    let strength = Math.ceil(this.rand(levelMin, levelMax)/2);
    accessory.level = strength;
    accessory.magic.effect = this.getMagicEffect(strength);
    accessory.name = 'Ring of '+accessory.magic.effect.attribute;
    accessory.value += 175*strength;
    accessory.sprite = accessory.magic.effect.sprite;

    //return the accessory
    return accessory;
}

export function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function getMagicEffect(lvl) {
    var effect = {};

    switch(this.rand(0,4)){
    case 0: effect.attribute = 'strength';
        effect.sprite = 'redRing';
        break;
    case 1: effect.attribute = 'dexterity';
        effect.sprite = 'blueRing';
        break;
    case 2: effect.attribute = 'wisdom';
        effect.sprite = 'purpleRing';
        break;
    case 3: effect.attribute = 'vitality';
        effect.sprite = 'pinkRing';
        break;
    }

    effect.value = lvl;


    return effect;
}
