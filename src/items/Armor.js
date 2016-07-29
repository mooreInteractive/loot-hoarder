//Armor.js

export function build(levelMin, levelMax) {
    let armor = {
        'name': 'null',
        'type': 'null',
        'inventoryType': 'hand',
        'level': 0,
        'durability': 0,
        'weight': 0,
        'ac': 0,
        'magic': {
            'effect':{
                'attribute': null,
                'value': -1
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

    switch(this.rand(0,3)){
    case 0: armor.type = 'head'; armor.inventoryType = 'head';
        break;
    case 1: armor.type = 'body'; armor.inventoryType = 'body';
        break;
    case 2: armor.type = 'feet'; armor.inventoryType = 'feet';
        break;
    case 3: armor.type = 'hand'; armor.inventoryType = 'head';
        break;
    }

    switch(armor.type){
    case 'head':
        armor.name = 'Helm';
        armor.shape = [
            [1,1,0,0],
            [1,1,0,0],
            [0,0,0,0],
            [0,0,0,0]];
        armor.shapeWidth = 2;
        armor.shapeHeight = 2;
        armor.value += 15;
        armor.ac = 5;
        break;
    case 'body':
        armor.name = 'Armor';
        armor.shape = [
            [1,1,0,0],
            [1,1,0,0],
            [1,1,0,0],
            [0,0,0,0]];
        armor.shapeWidth = 2;
        armor.shapeHeight = 3;
        armor.value += 25;
        armor.ac = 10;
        break;
    case 'feet':
        armor.name = 'Boots';
        armor.shape = [
            [1,1,0,0],
            [1,1,0,0],
            [0,0,0,0],
            [0,0,0,0]];
        armor.shapeWidth = 2;
        armor.shapeHeight = 2;
        armor.value += 10;
        armor.ac = 5;
        break;
    case 'hand':
        armor.name = 'Shield';
        armor.sprite = 'shield3';
        armor.shape = [
            [1,1,0,0],
            [1,1,0,0],
            [0,0,0,0],
            [0,0,0,0]];
        armor.shapeWidth = 2;
        armor.shapeHeight = 2;
        armor.value += 15;
        armor.ac = 5;
        break;
    }

    //armor level
    armor.level = this.rand(levelMin, levelMax);
    armor.value += 20*armor.level;
    //add level modifier to name
    switch(armor.level){
    case 1: armor.name = 'Leather '+armor.name;
        armor.weight = 4;
        if(armor.type == 'body'){ armor.weight = 7; }
        armor.durability = this.rand(8,12);
        break;
    case 2: armor.name = 'Stone '+armor.name;
        armor.weight = 5;
        if(armor.type == 'body'){ armor.weight = 9; }
        armor.durability = this.rand(10,15);
        armor.ac = armor.ac * 1.5;
        break;
    case 3: armor.name = 'Iron '+armor.name;
        armor.weight = 7;
        if(armor.type == 'body'){ armor.weight = 12; }
        armor.durability = this.rand(12,16);
        armor.ac = armor.ac * 2;
        break;
    case 4: armor.name = 'Steel '+armor.name;
        armor.weight = 9;
        if(armor.type == 'body'){ armor.weight = 18; }
        armor.durability = this.rand(15,18);
        armor.ac = armor.ac * 2.5;
        break;
    case 5: armor.name = 'Mythril '+armor.name;
        armor.weight = 2;
        if(armor.type == 'body'){ armor.weight = 4; }
        armor.durability = this.rand(18,22);
        armor.ac = armor.ac * 3;
        break;
    }

    armor.value += armor.ac;
    armor.value += armor.durability - 10;

    switch(this.rand(0,6)){
    case 0:
        armor.magic.effect = this.getMagicEffect(armor.level);
        armor.name += ' of '+armor.magic.effect.attribute;
        armor.value += 100*armor.level;
        break;
    default:
        break;
    }

    //return the armor
    return armor;
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
