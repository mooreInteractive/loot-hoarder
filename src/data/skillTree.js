let slices = ['str','dex','vit','wis'];
let strSlice = generateSlice(0);
function generateSlice (attrIndex){
    let attr = slices[attrIndex];
    let strSlice;
    strSlice = sliceSchema.slice(0);
    strSlice.forEach(item => {
        let adjustedIndex = item.attr + attr;
        let setAttr;
        if(adjustedIndex < 0){
            setAttr = slices[slices.length - 1];
        } else if(adjustedIndex > 3){
            setAttr = slices[adjustedIndex%4];
        } else {
            setAttr = slices[adjustedIndex];
        }
        item.attr = setAttr;
    });

    return strSlice;
}
let sliceSchema = [
    {
        x: 260,
        y: 68,
        type: 'attr',
        attr: -1,
        neighbors: [4]
    },
    {
        x: 331,
        y: 48,
        type: 'attr',
        attr: -1,
        neighbors: [4]
    },
    {
        x: 434,
        y: 47,
        type: 'attr',
        attr: -1,
        neighbors: [5]
    },
    {
        x: 509,
        y: 68,
        type: 'attr',
        attr: 1,
        neighbors: [5]
    },
    {
        x: 304,
        y: 98,
        type: 'skill',
        name: 'skill-two',
        title: 'Skill Two',
        desc: 'Skill Two is awesome because reasons',
        neighbors: [0,1,6]
    },
    {
        x: 461,
        y: 98,
        type: 'skill',
        name: 'skill-three',
        title: 'Skill Three',
        desc: 'Skill Three is awesome because reasons',
        neighbors: [2,3,7]
    },
    {
        x: 343,
        y: 124,
        type: 'attr',
        attr: -1,
        neighbors: [4,8,9]
    },
    {
        x: 423,
        y: 124,
        type: 'attr',
        attr: 1,
        neighbors: [5,9,10]
    },
    {
        x: 317,
        y: 148,
        type: 'attr',
        attr: 0,
        neighbors: [6,'ld0']
    },
    {
        x: 383,
        y: 148,
        type: 'skill',
        name: 'skill-one',
        title: 'Skill One',
        desc: 'Skill One is awesome because reasons',
        neighbors: [6,7,11,12]
    },
    {
        x: 446,
        y: 148,
        type: 'attr',
        attr: 0,
        neighbors: [7,'rd0']
    },
    {
        x: 335,
        y: 187,
        type: 'attr',
        attr: 0,
        neighbors: [9,13]
    },
    {
        x: 411,
        y: 187,
        type: 'attr',
        attr: 0,
        neighbors: [9,13]
    },
    {
        x: 383,
        y: 235,
        type: 'skill',
        name: 'skill-four',
        title: 'Skill Four',
        desc: 'Skill Four is awesome because reasons',
        neighbors: [11,12,14,15]
    },
    {
        x: 364,
        y: 270,
        type: 'attr',
        attr: 2,
        neighbors: [13,16,'ld1']
    },
    {
        x: 406,
        y: 270,
        type: 'attr',
        attr: 2,
        neighbors: [13,16,'rd1']
    },
    {
        x: 384,
        y: 324,
        type: 'attr',
        attr: 2,
        neighbors: [14,15,'center']
    }
];

export default strSlice;
