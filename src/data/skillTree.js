let slices = ['str','dex','vit','wis'];
let sliceSchema = [
    {
        x: 212,
        y: 102,
        type: 'attr',
        attr: -1,
        neighbors: [4]
    },
    {
        x: 290,
        y: 78,
        type: 'attr',
        attr: -1,
        neighbors: [4]
    },
    {
        x: 437,
        y: 78,
        type: 'attr',
        attr: -1,
        neighbors: [5]
    },
    {
        x: 543,
        y: 102,
        type: 'attr',
        attr: 1,
        neighbors: [5]
    },
    {
        x: 273,
        y: 160,
        type: 'skill',
        name: 'two-hand1hand',
        title: 'Two Handed Weapons with One Hand',
        desc: 'Able to equip two-handed weapons in a single hand.',
        neighbors: [0,1,6]
    },
    {
        x: 468,
        y: 151,
        type: 'skill',
        name: 'crit-dmg-up',
        title: 'Increase Critical Hit Damage',
        desc: 'When landing a critical hit, it\'ll do extra damage.',
        neighbors: [2,3,7]
    },
    {
        x: 334,
        y: 204,
        type: 'attr',
        attr: -1,
        neighbors: [4,8,9]
    },
    {
        x: 413,
        y: 199,
        type: 'attr',
        attr: 1,
        neighbors: [5,9,10]
    },
    {
        x: 287,
        y: 259,
        type: 'attr',
        attr: 0,
        neighbors: [6,'ld0']
    },
    {
        x: 378,
        y: 258,
        type: 'skill',
        name: 'berserker',
        title: 'Berserker',
        desc: 'The hero performs a flurry of quick attacks at the beginning of a raid.',
        introSkill: true,
        neighbors: [6,7,11,12]
    },
    {
        x: 462,
        y: 255,
        type: 'attr',
        attr: 0,
        neighbors: [7,'rd0']
    },
    {
        x: 319,
        y: 319,
        type: 'attr',
        attr: 0,
        neighbors: [9,13]
    },
    {
        x: 429,
        y: 319,
        type: 'attr',
        attr: 0,
        neighbors: [9,13]
    },
    {
        x: 378,
        y: 376,
        type: 'skill',
        name: 'no-weight',
        title: 'No Over Encumberment',
        desc: 'The hero cannot become over encumbered.',
        neighbors: [11,12,14,15]
    },
    {
        x: 357,
        y: 445,
        type: 'attr',
        attr: 2,
        neighbors: [13,16,'ld1']
    },
    {
        x: 414,
        y: 442,
        type: 'attr',
        attr: 2,
        neighbors: [13,16,'rd1']
    },
    {
        x: 386,
        y: 508,
        type: 'attr',
        attr: 2,
        neighbors: [14,15,'center']
    }
];
let strDexSkills = [
    {
        x: 657,
        y: 212,
        type: 'skill',
        name: 'sneak-attack',
        title: 'Sneak Attack',
        desc: 'The hero catches enemies off gaurd and lands an attack before battle time begins.',
        neighbors: [0,1,6]
    },
    {
        x: 800,
        y: 347,
        type: 'skill',
        name: 'micro-meditation',
        title: 'Micro Meditation',
        desc: 'The hero heals a small amoutn of health when the enemies misses an attack.',
        neighbors: [2,3,7]
    },
    {
        x: 651,//-215
        y: 363,//+35
        type: 'skill',
        name: 'unarmed-attack',
        title: 'Unarmed Attack Bonus',
        desc: 'The hero can make strong attacks without a weapon equipped.\ndmg = str x dex',
        neighbors: [6,7,11,12]
    },
    {
        x: 577,
        y: 441,
        type: 'skill',
        name: 'dodge-first',
        title: 'Dodge First attack',
        desc: 'The hero always dodges the first attack in a battle.',
        neighbors: [11,12,14,15]
    }
];

let dexSkills = [
    {
        x: 877,
        y: 527,
        type: 'skill',
        name: 'evasion-up',
        title: 'Evasion Up',
        desc: 'The hero has an increased chance to dodge every attack.',
        neighbors: [0,1,6]
    },
    {
        x: 883,//-215
        y: 727,//+35
        type: 'skill',
        name: 'steal-items',
        title: 'Steal Items',
        desc: 'The hero may occasionally steal an item from an enemy during battle.',
        neighbors: [2,3,7]
    },
    {
        x: 766,
        y: 635,
        type: 'skill',
        name: 'two-one-handed',
        title: 'Equip two One-Handed Weapons',
        desc: 'The hero can equip two one-handed weapons. One in each hand.',
        neighbors: [6,7,11,12]
    },
    {
        x: 655,
        y: 635,
        type: 'skill',
        name: 'crit-chance-up',
        title: 'Crit Chance Up',
        desc: 'Every weapon\'s critical hit chance increases by 10%',
        neighbors: [11,12,14,15]
    }
];

let dexVitSkills = [
    {
        x: 809,
        y: 909,
        type: 'skill',
        name: 'en-crit-dmg-down',
        title: 'Enemy Crit Damage Down',
        desc: 'The enemies citical hits are weakened.',
        neighbors: [0,1,6]
    },
    {
        x: 673,//-215
        y: 1051,//+35
        type: 'skill',
        name: 'shop-mastery',
        title: 'Shop Mastery',
        desc: 'The hero sells items for their full value, and buy items with no markup.',
        neighbors: [2,3,7]
    },
    {
        x: 659,
        y: 903,
        type: 'skill',
        name: 'crit-heal',
        title: 'Crit Heal',
        desc: 'When landing a Critical hit in battle, the hero gains health.',
        neighbors: [6,7,11,12]
    },
    {
        x: 575,
        y: 827,
        type: 'skill',
        name: 'death-heal',
        title: 'Death Heal',
        desc: 'The hero gains a small amount of health every time it kills an enemy.',
        neighbors: [11,12,14,15]
    }
];

let vitSkills = [
    {
        x: 493,
        y: 1125,
        type: 'skill',
        name: 'as-up',
        title: 'Attack Speed Up',
        desc: 'All weapons have increased attack speed.',
        neighbors: [0,1,6]
    },
    {
        x: 295,//-215
        y: 1130,//+35
        type: 'skill',
        name: 'more-gold',
        title: 'More Gold',
        desc: 'The hero will find a bit more gold when looting enemies.',
        neighbors: [2,3,7]
    },
    {
        x: 386,
        y: 1018,
        type: 'skill',
        name: 'vitality-mastery',
        title: 'Vitality Mastery',
        desc: 'Twice the hero\'s vitality score is added to max HP.',
        neighbors: [6,7,11,12]
    },
    {
        x: 383,
        y: 906,
        type: 'skill',
        name: 'undying',
        title: 'Undying',
        desc: 'The hero\'s health cannot go below 0.',
        neighbors: [11,12,14,15]
    }
];

let vitWisSkills = [
    {
        x: 113,
        y: 1055,
        type: 'skill',
        name: 'potion-mastery',
        title: 'Potion Mastery',
        desc: 'Potions heal more health.',
        neighbors: [0,1,6]
    },
    {
        x: -33,//-215
        y: 921,//+35
        type: 'skill',
        name: 'crit-potion',
        title: 'Crit Potion',
        desc: 'The hero will gain a potion when landing a critical hit.',
        neighbors: [2,3,7]
    },
    {
        x: 117,
        y: 907,
        type: 'skill',
        name: 'heal',
        title: 'Heal',
        desc: 'The hero gains a heal spell which can be used like a potion. It takes a while to recharge though.',
        neighbors: [6,7,11,12]
    },
    {
        x: 192,
        y: 829,
        type: 'skill',
        name: 'fast-heal',
        title: 'Fast Heal',
        desc: 'The hero\'s heal spell recharges quickly.',
        neighbors: [11,12,14,15]
    }
];

let wisSkills = [
    {
        x: -107,
        y: 739,
        type: 'skill',
        name: 'revival',
        title: 'Revival',
        desc: 'The Hero will revive once when dying in battle.',
        neighbors: [0,1,6]
    },
    {
        x: -113,//-215
        y: 543,//+35
        type: 'skill',
        name: 'find-tomes-up',
        title: 'Find More Tomes',
        desc: 'The hero will find more tomes.',
        neighbors: [2,3,7]
    },
    {
        x: 1,
        y: 635,
        type: 'skill',
        name: 'tomes',
        title: 'Tomes',
        desc: 'The hero can read and equip Tomes. Tomes hold various spells that can be used in battle.',
        neighbors: [6,7,11,12]
    },
    {
        x: 113,
        y: 635,
        type: 'skill',
        name: 'aura',
        title: 'Magical Aura',
        desc: 'The hero gains a magic aura.',
        neighbors: [11,12,14,15]
    }
];

let wisStrSkills = [
    {
        x: -39,
        y: 359,
        type: 'skill',
        name: 'scroll-lit',
        title: 'Scroll Literacy',
        desc: 'The Hero can read scrolls, and does not need them deciphered.',
        neighbors: [0,1,6]
    },
    {
        x: 97,//-215
        y: 215,//+35
        type: 'skill',
        name: 'find-scrolls-up',
        title: 'Find More Scrolls',
        desc: 'The hero will find more scrolls.',
        neighbors: [2,3,7]
    },
    {
        x: 113,
        y: 367,
        type: 'skill',
        name: 'magic-attack',
        title: 'Magic Attack',
        desc: 'The hero\'s weapon attacks are imbued with magic damage.',
        neighbors: [6,7,11,12]
    },
    {
        x: 195,
        y: 443,
        type: 'skill',
        name: 'aura',
        title: 'Magical Aura',
        desc: 'The hero gains a magic aura.',
        neighbors: [11,12,14,15]
    }
];

function generateSlice (attrIndex){
    let strSlice;
    strSlice = sliceSchema.slice(0);
    strSlice.forEach(item => {
        if(item.type === 'attr'){
            let adjustedIndex = item.attr + attrIndex;
            let setAttr;
            if(adjustedIndex < 0){
                setAttr = slices[slices.length - 1];
            } else if(adjustedIndex > 3){
                setAttr = slices[adjustedIndex%4];
            } else {
                setAttr = slices[adjustedIndex];
            }
            item.attr = setAttr;
        }
    });
    return strSlice;
}

let skillSlices = generateSlice(0)
    .concat(strDexSkills)
    .concat(dexSkills)
    .concat(dexVitSkills)
    .concat(vitSkills)
    .concat(vitWisSkills)
    .concat(wisSkills)
    .concat(wisStrSkills);
export default skillSlices;
