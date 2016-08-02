//Accessory.js
import * as Constants from './constants';

export function build() {
    let accessory = {
        'name': 'null',
        'type': 'accessory',
        'inventoryType': 'accessory',
        'weight': 1,
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

    let strength = this.rand(0,5);
    accessory.magic.effect = this.getMagicEffect(strength);
    accessory.name = 'Ring of '+accessory.magic.effect.attribute;
    accessory.value += 175*strength;

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
