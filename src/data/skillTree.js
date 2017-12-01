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
        name: 'skill-two',
        title: 'Skill Two',
        desc: 'Skill Two is awesome because reasons',
        neighbors: [0,1,6]
    },
    {
        x: 468,
        y: 151,
        type: 'skill',
        name: 'skill-three',
        title: 'Skill Three',
        desc: 'Skill Three is awesome because reasons',
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
        name: 'skill-one',
        title: 'Skill One',
        desc: 'Skill One is awesome because reasons',
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
        name: 'skill-four',
        title: 'Skill Four',
        desc: 'Skill Four is awesome because reasons',
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

let strSkills = [

    {
        name: 'two-hand1hand',
        title: 'Two Handed Weapons with One Hand',
        desc: 'Able to equip two-handed weapons in a single hand.'
    },
    {
        name: 'crit-dmg-up',
        title: 'Increase Critical Hit Damage',
        desc: 'When landing a critical hit, it\'ll do extra damage.'
    },
    {
        name: 'berserker',
        title: 'Berserker',
        desc: 'Performs a flurry of quick attacks at the beginning of a raid.',
        introSkill: true
    },
    {
        name: 'no-weight',
        title: 'No Over Encumberment',
        desc: 'The player cannot become over encumbered.'
    }
];

function generateSlice (attrIndex){
    let strSlice;
    strSlice = sliceSchema.slice(0);
    let currentSkill = 0;
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
        } else if(item.type === 'skill'){
            Object.assign(item, strSkills[currentSkill]);
            currentSkill += 1;
        }
    });

    return strSlice;
}

let strSlice = generateSlice(0);
export default strSlice;
