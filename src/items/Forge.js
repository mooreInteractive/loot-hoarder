//Forge.js
import * as Weapon from './Weapon';
import * as Armor from './Armor';
import * as Accessory from './Accessory';
import * as Misc from './Misc';

export function getRandomItem(levelMin, levelMax){
    let type = rand(0,100);
    if(type < 30){
        return Misc.build(levelMax);
    } else if(type < 63){
        return Armor.build(levelMin, levelMax);
    } else if(type < 96){
        return Weapon.build(levelMin, levelMax);
    } else {
        return Accessory.build(levelMin, levelMax);
    }
}

export function getRandomWeapon(levelMin, levelMax){
    return Weapon.build(levelMin, levelMax);
}

export function rand(min, max) {
    return Math.floor(Math.random() * ((max+1) - min)) + min;
}
