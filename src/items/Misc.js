//Misc.js
import * as Constants from './constants';

export function build(levelMax) {
    let accessory = {
        'name': 'null',
        'type': 'misc',
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
    let type = this.rand(0,levelMax);
    switch(type){
    default:
    case 0: accessory.name = 'Health Potion';
        accessory.description = 'Use to return to battle quicker.';
        accessory.sprite = 'potion';
        accessory.value = 40;
        break;
    case 4:accessory.name = 'Unknown Scroll';
        accessory.sprite = 'scroll';
        accessory.magicFX = {name: 'EXP', time: 120, totalTime: 120, effect: 'double exp'};
        accessory.hiddenName = 'Scroll of Experience';
        accessory.hiddenDescription = 'For 2 minutes you will gain double experience\nin battle.';
        accessory.description = 'Take this to an expert to be identified.';
        accessory.value = 350;
        accessory.hiddenValue = 600;
        accessory.identified = false;
        accessory.buttonText = 'use';
        break;
    }
    //return the accessory
    return accessory;
}

export function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
