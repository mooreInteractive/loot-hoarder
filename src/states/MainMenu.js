import Phaser from 'phaser';
import MainNavigation from '../components/MainNavigation';
import Avatar from '../components/Avatar';
import Dialogue from '../components/Dialogue';

export default class extends Phaser.State {
    init () {
        this.inventoryOpen = false;
        this.game.player.savePlayerData();
    }

    create () {
        //initialize components
        this.createMap();

        new MainNavigation(this.game, this);

        this.currentDungeon = this.game.dungeons[this.game.player.currentDungeon];

        let avatarSettings = {x: this.currentDungeon.sprite.x - 50, y: this.currentDungeon.sprite.y + 25, scale: 2};
        let hpSettings = {x: this.game.world.centerX, y: this.game.world.height - 220 };
        this.avatar = new Avatar(this.game, this, avatarSettings, hpSettings); //Need to call avatar.update() and avatar.render()

        //clear data button
        this.optionsBtn = new Phaser.Button(this.game, this.game.world.width - 118, 0, 'optionsBanner', this.viewOptions, this);
        this.optionsBtn.scale.setTo(2,2);
        this.game.add.existing(this.optionsBtn);

        this.raidBtn = new Phaser.Button(this.game, this.game.world.width - 150, this.game.world.height - 180, 'redButton', this.raidCurrentDungeon, this);
        this.raidBtn.scale.setTo(1.2,3);
        this.raidBtn.anchor.setTo(0.5);
        this.raidBtn.alpha = 0.5;
        this.game.add.existing(this.raidBtn);

        let raidBtnStyle = {fontSize: 72, font: 'Oswald', fill: '#000000'};
        this.raidBtnText = this.add.text(this.game.world.width - 150, this.game.world.height - 180, 'RAID', raidBtnStyle);
        this.raidBtnText.anchor.setTo(0.5);
        this.raidBtnText.alpha = 0.5;

        this.lootBtn = new Phaser.Button(this.game, 150, this.game.world.height - 180, 'greenButton', this.viewLoot, this);
        this.lootBtn.scale.setTo(1.2,3);
        this.lootBtn.anchor.setTo(0.5);
        this.lootBtn.alpha = 0.5;
        this.game.add.existing(this.lootBtn);

        this.lootBtnText = this.add.text(150, this.game.world.height - 180, 'LOOT', raidBtnStyle);
        this.lootBtnText.anchor.setTo(0.5);
        this.lootBtnText.alpha = 0.5;

        this.errorText = this.add.text(this.game.world.centerX, this.game.world.centerY + 75, 'You\'re over-encumbered');
        this.errorText.font = 'Oswald';
        this.errorText.fontSize = 22;
        this.errorText.fill = '#DE1313';
        this.errorText.anchor.setTo(0.5);
        this.errorText.visible = false;


    }

    createMap(){
        //MAP
        //this.waterBg = this.game.add.sprite(0, 0, 'water');
        this.water = this.add.tileSprite(0, 0, 32 * 6, 32 * 9, 'water');
        this.water.scale.setTo(4,4);
        this.water.animations.add('flow', null, 4, true);
        this.water.animations.play('flow');

        this.island = this.game.add.image(0,0,'island');

        //Raid Dungeons
        this.raidBtns = [];
        this.raidTexts = [];
        this.dungeonTexts = [];
        this.game.dungeons.forEach((dungeon, index)=> {

            let btn = this.add.sprite(dungeon.sprite.x, dungeon.sprite.y, dungeon.sprite.image);
            btn.anchor.setTo(0.5);
            btn.animations.add('idle', [0,1,2], 4, true);
            btn.animations.play('idle');

            btn.inputEnabled = true;
            btn.events.onInputDown.add(this.switchDungeon.bind(this, dungeon), this);
            btn.input.useHandCursor = true;
            this.raidBtns.push(btn);

            if(this.game.player.latestUnlockedDungeon >= (index+1)){
                btn.alpha = 1;
            } else {
                btn.alpha = 0.5;
            }


        });
    }

    switchDungeon(dungeon){
        let player = this.game.player;
        let avatarSettings = {x: dungeon.sprite.x - 50, y: dungeon.sprite.y + 25};
        this.avatar.moveToAtScale(avatarSettings, null, 300, () => {});
        this.currentDungeon = dungeon;
        this.game.player.currentDungeon = dungeon.level-1;
        player.savePlayerData();
    }

    viewOptions(){
        this.state.start('Options');
    }

    raidCurrentDungeon(){
        let equippedGear = false;
        let equipment = this.game.player.equipped;
        Object.keys(equipment).forEach((slot) => {
            if(equipment[slot] != null){
                equippedGear = true;
                return;
            }
        });

        if(!equippedGear){
            new Dialogue(this.game, this, 'ok', 'You should equip\nsomething before raiding...', ()=>{});
        } else {
            let dungeon = this.currentDungeon;

            if(this.game.player.latestUnlockedDungeon >= dungeon.level){
                if(this.game.player.battleStats.currentHealth > 1){
                    this.errorText.visible = false;
                    this.state.start('Raid', true, false, dungeon);
                } else {
                    this.errorText.visible = true;
                    this.errorText.text = 'You\'re too tired.';
                }
            }
        }

    }

    viewLoot(){
        if(this.game.loot.length > 0){
            this.state.start('LootView');
        }
    }

    update(){
        this.avatar.update();

        let currHealth = this.game.player.battleStats.currentHealth;

        if(currHealth > 1 && this.currentDungeon.level <= this.game.player.latestUnlockedDungeon){
            this.raidBtn.alpha = 1;
            this.raidBtnText.alpha = 1;
        } else {
            this.raidBtn.alpha = 0.5;
            this.raidBtnText.alpha = 0.5;
        }

        if(this.game.loot.length > 0){
            this.lootBtn.alpha = 1;
            this.lootBtnText.alpha = 1;
        } else {
            this.lootBtn.alpha = 0.5;
            this.lootBtnText.alpha = 0.5;
        }
    }
}
