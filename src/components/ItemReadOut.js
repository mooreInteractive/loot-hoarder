export default class ItemReadOut{
    constructor(game, gameState, item, settings){
        this.game = game;
        this.gameState = gameState;
        this.item = item;
        this.settings = settings;

        let Oswald24Black = {font: 'Oswald', fontSize: 22, fill: '#000000'};
        this.lootText = this.gameState.add.text(this.settings.x, this.settings.y, '', Oswald24Black);

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

    drawItemText(){
        //clear it out
        this.lootText.text = '';
        if(this.item.magic.effect.attribute != null){
            this.lootText.fill = '#1313AB';
        } else {
            this.lootText.fill = '#000000';
        }

        if(this.item.ac != null){//Armor
            this.lootText.text += `[${this.item.level}] ${this.item.name} \n`;
            this.lootText.text += `AC: ${this.item.ac}, Type: ${this.item.type} \n`;
            if(this.item.magic.effect.attribute != null){
                this.lootText.text += `${this.item.magic.effect.attribute} +${this.item.magic.effect.value}\n`;
            }
        } else if(this.item.dmg != null){//Weapon
            this.lootText.text += `[${this.item.level}] ${this.item.name} \n`;
            this.lootText.text += `Dmg: ${this.item.dmg.min} - ${this.item.dmg.max} \n`;
            if(this.item.magic.effect.attribute != null){
                this.lootText.text += `${this.item.magic.effect.attribute} +${this.item.magic.effect.value}\n`;
            }
        } else {
            this.lootText.text += `${this.item.name} \n`;
            if(this.item.magic.effect.attribute != null){
                this.lootText.text += `${this.item.magic.effect.attribute} +${this.item.magic.effect.value}\n`;
            }
        }
    }
}
