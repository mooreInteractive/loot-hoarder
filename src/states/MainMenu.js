import Phaser from 'phaser';
import MainNavigation from '../components/MainNavigation';
import Avatar from '../components/Avatar';
import * as StoryFunctions from '../components/StoryFunctions';

export default class extends Phaser.State {
    init (passedEvent) {
        this.inventoryOpen = false;
        this.game.player.savePlayerData();
        this.passedEvent = passedEvent;
        this.game.dialogueOpen = false;
    }

    create () {
        //initialize components
        this.createMap();

        this.currentDungeon = this.game.dungeons[this.game.player.currentDungeon];

        this.mainNav = new MainNavigation(this.game, this);

        let avatarSettings = {x: this.currentDungeon.sprite.x, y: this.currentDungeon.sprite.y, scale: 1};
        let hpSettings = {x: 203, y: this.game.world.height - 160 };
        this.avatar = new Avatar(this.game, this, avatarSettings, hpSettings, true, true); //Need to call avatar.update() and avatar.render()

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

        if(this.passedEvent != null){
            StoryFunctions.chapter1[this.passedEvent.name](this.game, this);
        }
        //Send Event to Start Game
        this.game.storyEvents.notify(this, 'START_GAME');
    }

    createMap(){
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

            if(this.game.player.latestUnlockedDungeon >= dungeon.level){
                /* Player Health Bar Graphic and Text */
                let dungeonProgressBG = this.add.bitmapData(64, 5);
                let dungeonProgress = this.add.bitmapData(60, 3);

                dungeonProgressBG.ctx.beginPath();
                dungeonProgressBG.ctx.rect(0, 0, 64, 5);
                dungeonProgressBG.ctx.fillStyle = '#111111';
                dungeonProgressBG.ctx.fill();

                dungeonProgress.ctx.beginPath();
                dungeonProgress.ctx.rect(0, 0, 60, 3);
                dungeonProgress.ctx.fillStyle = '#DE1111';
                dungeonProgress.ctx.fill();

                this.dungeonProgressBg = this.add.sprite(dungeon.sprite.x-32, dungeon.sprite.y-(btn.height/2) - 10, dungeonProgressBG);
                this.dungeonProgress = this.add.sprite(dungeon.sprite.x-30, dungeon.sprite.y-(btn.height/2) - 8, dungeonProgress);

                let progress = dungeon.enemiesLeft / dungeon.enemiesAmount;
                this.dungeonProgress.scale.x = progress;
            }
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
        this.mainNav.update(this.currentDungeon);
        this.avatar.update();
    }
}
