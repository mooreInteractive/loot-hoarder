export default class ItemReadOut{
    constructor(game, gameState, item, settings, color='#000000'){
        this.game = game;
        this.gameState = gameState;
        this.item = item;
        this.settings = settings;
        this.textColor = color;

        let Oswald24Black = {font: 'Oswald', fontSize: 22, fill: this.textColor};
        this.lootText = this.gameState.add.text(this.settings.x, this.settings.y, '', Oswald24Black);
        this.lootText.lineSpacing = -5;

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
        this.lootText.text = '';
    }

    drawItemText(){
        //clear it out
        this.lootText.text = '';
        if(this.item.type == 'special'){
            console.log('item', this.item);
            this.lootText.text = this.item.desc;
        } else{
            // if(this.item.magic.effect.attribute != null){
            //     this.lootText.fill = '#1113DE';
            // } else {
            //     this.lootText.fill = this.textColor;
            // }

            if(this.item.ac != null){//Armor
                this.lootText.text += `${this.item.name} \n`;
                this.lootText.text += `AC: ${this.item.ac}, Type: ${this.item.type} \n`;
                if(this.item.magic.effect.attribute != null){
                    this.lootText.text += `${this.item.magic.effect.attribute} +${this.item.magic.effect.value}\n`;
                }
            } else if(this.item.dmg != null){//Weapon
                let critPercent = (100 - this.item.crit.threshold) + '%';
                this.lootText.text += `${this.item.name} \n`;
                this.lootText.text += `Dmg: ${this.item.dmg.min} - ${this.item.dmg.max}   Crit: ${critPercent} - x${this.item.crit.multiplier}\n`;
                if(this.item.magic.effect.attribute != null){
                    this.lootText.text += `${this.item.magic.effect.attribute} +${this.item.magic.effect.value}\n`;
                }
            } else if(this.item.type == 'misc'){
                this.lootText.text += `${this.item.name} \n`;
                this.lootText.text += `${this.item.description} \n`;
            } else {
                this.lootText.text += `${this.item.name} \n`;
                if(this.item.magic.effect.attribute != null){
                    this.lootText.text += `${this.item.magic.effect.attribute} +${this.item.magic.effect.value}\n`;
                }
            }
        }
    }
}
