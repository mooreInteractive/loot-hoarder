import Phaser from 'phaser';
import MainNavigation from '../components/MainNavigation';
import Avatar from '../components/Avatar';
import * as StoryFunctions from '../components/StoryFunctions';

export default class extends Phaser.State {
    init (passedEvent) {
        this.inventoryOpen = false;
        this.game.player.savePlayerData();
        this.passedEvent = passedEvent;
    }

    create () {
        //initialize components
        this.createMap();

        this.currentDungeon = this.game.dungeons[this.game.player.currentDungeon];

        this.mainNav = new MainNavigation(this.game, this);

        let avatarSettings = {x: this.currentDungeon.sprite.x, y: this.currentDungeon.sprite.y, scale: 1};
        let hpSettings = {x: 200, y: this.game.world.height - 220 };
        this.avatar = new Avatar(this.game, this, avatarSettings, hpSettings); //Need to call avatar.update() and avatar.render()

        //clear data button
        this.optionsBtn = new Phaser.Button(this.game, this.game.world.width - 118, 0, 'optionsBanner', this.viewOptions, this);
        this.optionsBtn.scale.setTo(2,2);
        this.game.add.existing(this.optionsBtn);



        this.errorText = this.add.text(this.game.world.centerX, this.game.world.centerY + 75, 'You\'re over-encumbered');
        this.errorText.font = 'Oswald';
        this.errorText.fontSize = 22;
        this.errorText.fill = '#DE1313';
        this.errorText.anchor.setTo(0.5);
        this.errorText.visible = false;

        if(this.passedEvent){
            StoryFunctions.chapter1[this.passedEvent.name](this.game, this);
        }


    }

    createMap(){
        //MAP
        //this.waterBg = this.game.add.sprite(0, 0, 'water');
        // this.water = this.add.tileSprite(0, 0, 32 * 6, 32 * 9, 'water');
        // this.water.scale.setTo(4,4);
        // this.water.animations.add('flow', null, 4, true);
        // this.water.animations.play('flow');

        this.island = this.game.add.image(0,0,'island');
        this.island.scale.setTo(2,2);

        //Raid Dungeons
        this.raidBtns = [];
        this.raidTexts = [];
        this.dungeonTexts = [];
        this.game.dungeons.forEach((dungeon)=> {

            let btn = this.add.sprite(dungeon.sprite.x, dungeon.sprite.y, dungeon.sprite.image);
            btn.anchor.setTo(0.5);
            btn.scale.setTo(2);

            btn.inputEnabled = true;
            btn.events.onInputDown.add(this.switchDungeon.bind(this, dungeon), this);
            btn.input.useHandCursor = true;
            this.raidBtns.push(btn);
        });
    }

    switchDungeon(dungeon){
        let player = this.game.player;
        let avatarSettings = {x: dungeon.sprite.x, y: dungeon.sprite.y};
        this.avatar.moveToAtScale(avatarSettings, null, 300, () => {});
        this.currentDungeon = dungeon;
        this.game.player.currentDungeon = dungeon.level-1;
        player.savePlayerData();
    }

    viewOptions(){
        this.state.start('Options');
    }

    update(){
        this.avatar.update();
        this.mainNav.update(this.currentDungeon);
    }
}
