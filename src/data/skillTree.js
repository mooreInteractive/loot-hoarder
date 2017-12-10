let slices = ['str','dex','vit','wis'];
let strSkills = [
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
        neighbors: [6,'p-17']
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
        neighbors: [7,17]
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
        neighbors: [13,16,'p-18']
    },
    {
        x: 414,
        y: 442,
        type: 'attr',
        attr: 2,
        neighbors: [13,16,18]
    },
    {
        x: 386,
        y: 508,
        type: 'attr',
        attr: 2,
        neighbors: [14,15]
    },
    {
        x: 539,
        y: 256,
        type: 'attr',
        attr: 1,
        neighbors: [10, 'n-8']
    },
    {
        x: 464,
        y: 446,
        type: 'attr',
        attr: 1,
        neighbors: [15, 'n-14']
    }
];
let strDexSkills = [
    {
        x: 644,
        y: 134,
        type: 'attr',
        attr: -1,
        neighbors: [4]
    },
    {
        x: 728,
        y: 183,
        type: 'attr',
        attr: 0,
        neighbors: [4]
    },
    {
        x: 822,
        y: 276,
        type: 'attr',
        attr: 0,
        neighbors: [5]
    },
    {
        x: 879,
        y: 368,
        type: 'attr',
        attr: -1,
        neighbors: [5]
    },
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
        x: 657,
        y: 290,
        type: 'attr',
        attr: 0,
        neighbors: [4,8,9]
    },
    {
        x: 726,
        y: 359,
        type: 'attr',
        attr: 0,
        neighbors: [5,9,10]
    },
    {
        x: 588,
        y: 288,
        type: 'attr',
        attr: 2,
        neighbors: [6,'p-17']
    },
    {
        x: 651,//-215
        y: 363,//+35
        type: 'skill',
        name: 'unarmed-attack',
        title: 'Unarmed Attack Bonus',
        desc: 'The hero can make strong attacks without a weapon equipped.\ndmg = str x dex',
        introSkill: true,
        neighbors: [6,7,11,12]
    },
    {
        x: 735,
        y: 429,
        type: 'attr',
        attr: 2,
        neighbors: [7,17]
    },
    {
        x: 572,
        y: 364,
        type: 'attr',
        attr: 2,
        neighbors: [9,13]
    },
    {
        x: 657,
        y: 445,
        type: 'attr',
        attr: 2,
        neighbors: [9,13]
    },
    {
        x: 577,
        y: 441,
        type: 'skill',
        name: 'dodge-first',
        title: 'Dodge First attack',
        desc: 'The hero always dodges the first attack in a battle.',
        neighbors: [11,12,14,15]
    },
    {
        x: 506,
        y: 478,
        type: 'attr',
        attr: -1,
        neighbors: [13,16,'p-18']
    },
    {
        x: 548,
        y: 518,
        type: 'attr',
        attr: -1,
        neighbors: [13,16,18]
    },
    {
        x: 480,
        y: 544,
        type: 'attr',
        attr: 0,
        neighbors: [14,15]
    },
    {
        x: 763,
        y: 478,
        type: 'attr',
        attr: 1,
        neighbors: [10, 'n-8']
    },
    {
        x: 574,
        y: 560,
        type: 'attr',
        attr: 1,
        neighbors: [15, 'n-14']
    }
];
let dexSkills = [
    {
        x: 921,
        y: 461,
        type: 'attr',
        attr: -1,
        neighbors: [4]
    },
    {
        x: 945,
        y: 555,
        type: 'attr',
        attr: -1,
        neighbors: [4]
    },
    {
        x: 947,
        y: 687,
        type: 'attr',
        attr: -1,
        neighbors: [5]
    },
    {
        x: 923,
        y: 793,
        type: 'attr',
        attr: 1,
        neighbors: [5]
    },
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
        x: 819,
        y: 580,
        type: 'attr',
        attr: -1,
        neighbors: [4,8,9]
    },
    {
        x: 821,
        y: 679,
        type: 'attr',
        attr: 1,
        neighbors: [5,9,10]
    },
    {
        x: 772,
        y: 530,
        type: 'attr',
        attr: 0,
        neighbors: [6,'p-17']
    },
    {
        x: 766,
        y: 635,
        type: 'skill',
        name: 'two-one-handed',
        title: 'Equip two One-Handed Weapons',
        desc: 'The hero can equip two one-handed weapons. One in each hand.',
        introSkill: true,
        neighbors: [6,7,11,12]
    },
    {
        x: 780,
        y: 734,
        type: 'attr',
        attr: 0,
        neighbors: [7,17]
    },
    {
        x: 709,
        y: 572,
        type: 'attr',
        attr: 0,
        neighbors: [9,13]
    },
    {
        x: 712,
        y: 689,
        type: 'attr',
        attr: 0,
        neighbors: [9,13]
    },
    {
        x: 655,
        y: 635,
        type: 'skill',
        name: 'crit-chance-up',
        title: 'Crit Chance Up',
        desc: 'Every weapon\'s critical hit chance increases by 10%',
        neighbors: [11,12,14,15]
    },
    {
        x: 581,
        y: 607,
        type: 'attr',
        attr: 2,
        neighbors: [13,16,'p-18']
    },
    {
        x: 583,
        y: 664,
        type: 'attr',
        attr: 2,
        neighbors: [13,16,18]
    },
    {
        x: 515,
        y: 635,
        type: 'attr',
        attr: 2,
        neighbors: [14,15]
    },
    {
        x: 758,
        y: 790,
        type: 'attr',
        attr: 1,
        neighbors: [10, 'n-8']
    },
    {
        x: 570,
        y: 717,
        type: 'attr',
        attr: 1,
        neighbors: [15, 'n-14']
    }
];
let dexVitSkills = [
    {
        x: 889,
        y: 892,
        type: 'attr',
        attr: -1,
        neighbors: [4]
    },
    {
        x: 839,
        y: 976,
        type: 'attr',
        attr: 0,
        neighbors: [4]
    },
    {
        x: 746,
        y: 1069,
        type: 'attr',
        attr: 0,
        neighbors: [5]
    },
    {
        x: 655,
        y: 1126,
        type: 'attr',
        attr: -1,
        neighbors: [5]
    },
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
        x: 733,
        y: 903,
        type: 'attr',
        attr: 0,
        neighbors: [4,8,9]
    },
    {
        x: 663,
        y: 972,
        type: 'attr',
        attr: 0,
        neighbors: [5,9,10]
    },
    {
        x: 736,
        y: 836,
        type: 'attr',
        attr: 2,
        neighbors: [6,'p-17']
    },
    {
        x: 659,
        y: 903,
        type: 'skill',
        name: 'crit-heal',
        title: 'Crit Heal',
        desc: 'When landing a Critical hit in battle, the hero gains health.',
        introSkill: true,
        neighbors: [6,7,11,12]
    },
    {
        x: 594,
        y: 983,
        type: 'attr',
        attr: 2,
        neighbors: [7,17]
    },
    {
        x: 660,
        y: 822,
        type: 'attr',
        attr: 2,
        neighbors: [9,13]
    },
    {
        x: 579,
        y: 906,
        type: 'attr',
        attr: 2,
        neighbors: [9,13]
    },
    {
        x: 575,
        y: 827,
        type: 'skill',
        name: 'death-heal',
        title: 'Death Heal',
        desc: 'The hero gains a small amount of health every time it kills an enemy.',
        neighbors: [11,12,14,15]
    },
    {
        x: 546,
        y: 754,
        type: 'attr',
        attr: -1,
        neighbors: [13,16,'p-18']
    },
    {
        x: 505,
        y: 795,
        type: 'attr',
        attr: -1,
        neighbors: [13,16,18]
    },
    {
        x: 478,
        y: 729,
        type: 'attr',
        attr: 0,
        neighbors: [14,15]
    },
    {
        x: 540,
        y: 1009,
        type: 'attr',
        attr: 1,
        neighbors: [10, 'n-8']
    },
    {
        x: 466,
        y: 823,
        type: 'attr',
        attr: 1,
        neighbors: [15, 'n-14']
    }
];
let vitSkills = [
    {
        x: 558,
        y: 1168,
        type: 'attr',
        attr: -1,
        neighbors: [4]
    },
    {
        x: 465,
        y: 1193,
        type: 'attr',
        attr: -1,
        neighbors: [4]
    },
    {
        x: 333,
        y: 1195,
        type: 'attr',
        attr: -1,
        neighbors: [5]
    },
    {
        x: 229,
        y: 1170,
        type: 'attr',
        attr: 1,
        neighbors: [5]
    },
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
        x: 440,
        y: 1067,
        type: 'attr',
        attr: -1,
        neighbors: [4,8,9]
    },
    {
        x: 341,
        y: 1069,
        type: 'attr',
        attr: 1,
        neighbors: [5,9,10]
    },
    {
        x: 489,
        y: 1021,
        type: 'attr',
        attr: 0,
        neighbors: [6,'p-17']
    },
    {
        x: 386,
        y: 1018,
        type: 'skill',
        name: 'vitality-mastery',
        title: 'Vitality Mastery',
        desc: 'Twice the hero\'s vitality score is added to max HP.',
        introSkill: true,
        neighbors: [6,7,11,12]
    },
    {
        x: 286,
        y: 1026,
        type: 'attr',
        attr: 0,
        neighbors: [7,17]
    },
    {
        x: 446,
        y: 956,
        type: 'attr',
        attr: 0,
        neighbors: [9,13]
    },
    {
        x: 329,
        y: 960,
        type: 'attr',
        attr: 0,
        neighbors: [9,13]
    },
    {
        x: 383,
        y: 906,
        type: 'skill',
        name: 'undying',
        title: 'Undying',
        desc: 'The hero\'s health cannot go below 0.',
        neighbors: [11,12,14,15]
    },
    {
        x: 411,
        y: 829,
        type: 'attr',
        attr: 2,
        neighbors: [13,16,'p-18']
    },
    {
        x: 355,
        y: 829,
        type: 'attr',
        attr: 2,
        neighbors: [13,16,18]
    },
    {
        x: 385,
        y: 765,
        type: 'attr',
        attr: 2,
        neighbors: [14,15]
    },
    {
        x: 233,
        y: 1010,
        type: 'attr',
        attr: 1,
        neighbors: [10, 'n-8']
    },
    {
        x: 306,
        y: 825,
        type: 'attr',
        attr: 1,
        neighbors: [15, 'n-14']
    }
];
let vitWisSkills = [
    {
        x: 131,
        y: 1132,
        type: 'attr',
        attr: -1,
        neighbors: [4]
    },
    {
        x: 46,
        y: 1085,
        type: 'attr',
        attr: 0,
        neighbors: [4]
    },
    {
        x: -46,
        y: 996,
        type: 'attr',
        attr: 0,
        neighbors: [5]
    },
    {
        x: -105,
        y: 901,
        type: 'attr',
        attr: -1,
        neighbors: [5]
    },
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
        y: 979,
        type: 'attr',
        attr: 0,
        neighbors: [4,8,9]
    },
    {
        x: 47,
        y: 911,
        type: 'attr',
        attr: 0,
        neighbors: [5,9,10]
    },
    {
        x: 186,
        y: 982,
        type: 'attr',
        attr: 2,
        neighbors: [6,'p-17']
    },
    {
        x: 117,
        y: 907,
        type: 'skill',
        name: 'heal',
        title: 'Heal',
        desc: 'The hero gains a heal spell which can be used like a potion. It takes a while to recharge though.',
        introSkill: true,
        neighbors: [6,7,11,12]
    },
    {
        x: 38,
        y: 841,
        type: 'attr',
        attr: 2,
        neighbors: [7,17]
    },
    {
        x: 200,
        y: 905,
        type: 'attr',
        attr: 2,
        neighbors: [9,13]
    },
    {
        x: 115,
        y: 826,
        type: 'attr',
        attr: 2,
        neighbors: [9,13]
    },
    {
        x: 192,
        y: 829,
        type: 'skill',
        name: 'fast-heal',
        title: 'Fast Heal',
        desc: 'The hero\'s heal spell recharges quickly.',
        neighbors: [11,12,14,15]
    },
    {
        x: 266,
        y: 791,
        type: 'attr',
        attr: -1,
        neighbors: [13,16,'p-18']
    },
    {
        x: 225,
        y: 752,
        type: 'attr',
        attr: -1,
        neighbors: [13,16,18]
    },
    {
        x: 291,
        y: 725,
        type: 'attr',
        attr: 0,
        neighbors: [14,15]
    },
    {
        x: 9,
        y: 797,
        type: 'attr',
        attr: 1,
        neighbors: [10, 'n-8']
    },
    {
        x: 198,
        y: 721,
        type: 'attr',
        attr: 1,
        neighbors: [15, 'n-14']
    }
];
let wisSkills = [
    {
        x: -152,
        y: 810,
        type: 'attr',
        attr: -1,
        neighbors: [4]
    },
    {
        x: -176,
        y: 715,
        type: 'attr',
        attr: -1,
        neighbors: [4]
    },
    {
        x: -176,
        y: 585,
        type: 'attr',
        attr: -1,
        neighbors: [5]
    },
    {
        x: -154,
        y: 478,
        type: 'attr',
        attr: 1,
        neighbors: [5]
    },
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
        x: -50,
        y: 690,
        type: 'attr',
        attr: -1,
        neighbors: [4,8,9]
    },
    {
        x: -50,
        y: 591,
        type: 'attr',
        attr: 1,
        neighbors: [5,9,10]
    },
    {
        x: -4,
        y: 739,
        type: 'attr',
        attr: 0,
        neighbors: [6,'p-17']
    },
    {
        x: 1,
        y: 635,
        type: 'skill',
        name: 'tomes',
        title: 'Tomes',
        desc: 'The hero can read and equip Tomes. Tomes hold various spells that can be used in battle.',
        introSkill: true,
        neighbors: [6,7,11,12]
    },
    {
        x: -10,
        y: 536,
        type: 'attr',
        attr: 0,
        neighbors: [7,17]
    },
    {
        x: 60,
        y: 696,
        type: 'attr',
        attr: 0,
        neighbors: [9,13]
    },
    {
        x: 60,
        y: 580,
        type: 'attr',
        attr: 0,
        neighbors: [9,13]
    },
    {
        x: 113,
        y: 635,
        type: 'skill',
        name: 'aura',
        title: 'Magical Aura',
        desc: 'The hero gains a magic aura.',
        neighbors: [11,12,14,15]
    },
    {
        x: 188,
        y: 661,
        type: 'attr',
        attr: 2,
        neighbors: [13,16,'p-18']
    },
    {
        x: 188,
        y: 602,
        type: 'attr',
        attr: 2,
        neighbors: [13,16,18]
    },
    {
        x: 253,
        y: 635,
        type: 'attr',
        attr: 2,
        neighbors: [14,15]
    },
    {
        x: 9,
        y: 488,
        type: 'attr',
        attr: 1,
        neighbors: [10, 'n-8']
    },
    {
        x: 197,
        y: 563,
        type: 'attr',
        attr: 1,
        neighbors: [15, 'n-14']
    }
];
let wisStrSkills = [
    {
        x: -117,
        y: 377,
        type: 'attr',
        attr: -1,
        neighbors: [4]
    },
    {
        x: -68,
        y: 293,
        type: 'attr',
        attr: 0,
        neighbors: [4]
    },
    {
        x: 22,
        y: 200,
        type: 'attr',
        attr: 0,
        neighbors: [5]
    },
    {
        x: 115,
        y: 141,
        type: 'attr',
        attr: -1,
        neighbors: [5]
    },
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
        x: 38,
        y: 365,
        type: 'attr',
        attr: 0,
        neighbors: [4,8,9]
    },
    {
        x: 106,
        y: 293,
        type: 'attr',
        attr: 0,
        neighbors: [5,9,10]
    },
    {
        x: 35,
        y: 432,
        type: 'attr',
        attr: 2,
        neighbors: [6,'p-17']
    },
    {
        x: 113,
        y: 367,
        type: 'skill',
        name: 'magic-attack',
        title: 'Magic Attack',
        desc: 'The hero\'s weapon attacks are imbued with magic damage.',
        introSkill: true,
        neighbors: [6,7,11,12]
    },
    {
        x: 177,
        y: 284,
        type: 'attr',
        attr: 2,
        neighbors: [7,17]
    },
    {
        x: 112,
        y: 449,
        type: 'attr',
        attr: 2,
        neighbors: [9,13]
    },
    {
        x: 192,
        y: 361,
        type: 'attr',
        attr: 2,
        neighbors: [9,13]
    },
    {
        x: 195,
        y: 443,
        type: 'skill',
        name: 'aura',
        title: 'Magical Aura',
        desc: 'The hero gains a magic aura.',
        neighbors: [11,12,14,15]
    },
    {
        x: 228,
        y: 513,
        type: 'attr',
        attr: -1,
        neighbors: [13,16,'p-18']
    },
    {
        x: 266,
        y: 472,
        type: 'attr',
        attr: -1,
        neighbors: [13,16,18]
    },
    {
        x: 293,
        y: 538,
        type: 'attr',
        attr: 0,
        neighbors: [14,15]
    },
    {
        x: 226,
        y: 267,
        type: 'attr',
        attr: 1,
        neighbors: [10, 'n-8']
    },
    {
        x: 306,
        y: 453,
        type: 'attr',
        attr: 1,
        neighbors: [15, 'n-14']
    }
];

function generateSlice (attrIndex, slice, sliceIndex){
    let strSlice;
    strSlice = slice.slice(0);
    strSlice.forEach((item, index) => {
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
        item.index = `${sliceIndex}-${index}`;
    });
    return strSlice;
}

let skillSlices = generateSlice(0, strSkills, 0)
    .concat(generateSlice(0, strDexSkills, 1))
    .concat(generateSlice(1, dexSkills, 2))
    .concat(generateSlice(1, dexVitSkills, 3))
    .concat(generateSlice(2, vitSkills, 4))
    .concat(generateSlice(2, vitWisSkills, 5))
    .concat(generateSlice(3, wisSkills, 6))
    .concat(generateSlice(3, wisStrSkills, 7));
export default skillSlices;
