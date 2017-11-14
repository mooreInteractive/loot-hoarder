export default class ItemReadOut{
    constructor(game, gameState, item, settings, color='#000000'){
        this.game = game;
        this.gameState = gameState;
        this.item = item;
        this.settings = settings;
        this.textColor = color;

        let blueColor = color === '#000000' ? '#1113DE' : '#ADD8E6';

        this.regularBlack = {font: 'Press Start 2P', fontSize: 18, fill: this.textColor};
        this.magicBlue = {font: 'Press Start 2P', fontSize: 18, fill: blueColor};

        this.lootTextGroup = game.add.group();
        // this.lootText = this.gameState.add.text(this.settings.x, this.settings.y, '', regularBlack);
        // this.lootTextGroup.add(game.make.text(this.settings.x, this.settings.y+(25*0), 'firstLine',  regularBlack));
        // this.lootText.lineSpacing = -5;

        if(this.item != null){
            this.drawItemText();
        }
    }

    updateItem(item){
        this.item = item;
        if(this.item != null){
            this.drawItemText();
        }
    }

    clearItem(){
        this.item = null;
        this.lootTextGroup.removeAll(true);
    }

    drawItemText(){
        //clear it out
        this.lootTextGroup.removeAll(true);
        if(this.item.type == 'special'){
            this.lootTextGroup.add(
                this.game.make.text(
                    this.settings.x,
                    this.settings.y+(24*0),
                    this.item.desc,
                    this.regularBlack
                )
            );
        } else{
            let magicItem = this.item.magic.effect.attribute != null || this.item.magic.type != null;
            //first line - item title
            let itemName = `${this.item.name}`;
            this.lootTextGroup.add(
                this.game.make.text(
                    this.settings.x,
                    this.settings.y+(24*0),
                    itemName,
                    magicItem ? this.magicBlue : this.regularBlack
                )
            );
            //second line - item descriptions
            let line2Text = '';
            let line3Text = '';
            if(this.item.ac != null){//Armor
                line2Text = `AC: ${this.item.ac}`;
                line3Text = `Type: ${this.item.type}`;
            } else if(this.item.dmg != null){//Weapon
                let critPercent = (100 - this.item.crit.threshold) + '%';
                line2Text = `Dmg: ${this.item.dmg.min}-${this.item.dmg.max}`;
                line3Text = `Crit: x${this.item.crit.multiplier}(${critPercent})`;
            } else if(this.item.type == 'misc'){
                line2Text = `${this.item.description}`;
            }
            this.lootTextGroup.add(
                this.game.make.text(
                    this.settings.x,
                    this.settings.y+(24*1),
                    line2Text,
                    this.regularBlack
                )
            );
            this.lootTextGroup.add(
                this.game.make.text(
                    this.settings.x,
                    this.settings.y+(24*2),
                    line3Text,
                    this.regularBlack
                )
            );
            //fourth line - magic properties
            let magicText = '';
            if(this.item.magic.effect.attribute != null){
                magicText = `${this.item.magic.effect.attribute} +${this.item.magic.effect.value}\n`;
            } else if(this.item.magic.type){
                magicText = `${this.item.magic.type}`;
            }
            this.lootTextGroup.add(
                this.game.make.text(
                    this.settings.x,
                    this.settings.y+(24*3),
                    magicText,
                    this.magicBlue
                )
            );
        }
    }
}
