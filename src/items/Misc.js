//Misc.js
import * as Constants from './constants';

export function build() {
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
    let type = this.rand(0,2);
    switch(type){
    case 0: accessory.name = 'Health Potion';
        accessory.sprite = 'potion';
        accessory.value += 175;
        accessory.battleAction = {
            name: 'heal'
        };
        break;
    case 1:accessory.name = 'Unknown Scroll';
        accessory.sprite = 'scroll';
        accessory.hiddenStats = {
            name: 'Scroll of Fireball',
            battleAction: 'fireball',
            battleDamage: 'wisdom-5'
        };
        accessory.value += 500;
        accessory.battleAction = {
            name: 'unknown'
        };
        break;
    }
    //return the accessory
    return accessory;
}

export function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
