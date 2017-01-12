import 'pixi';
import 'p2';
import Phaser from 'phaser';

import BootState from './states/Boot';
import LoadingState from './states/Loading';
import GameState from './states/Game';
import MainMenu from './states/MainMenu';
import Options from './states/Options';
import Inventory from './states/Inventory';
import Raid from './states/Raid';
import LootView from './states/LootView';
import WeaponShop from './states/shops/WeaponShop';
import ScrollShop from './states/shops/ScrollShop';
import Tools from './tools';
import * as Story from './data/story';
import StoryObserver from './observers/story_observer';
import * as DungeonData from './data/dungeons';

import Player from './Player';

class Game extends Phaser.Game {

    constructor () {
        let baseWidth = 768;
        let baseHeight = 1080;

        super(baseWidth, baseHeight, Phaser.AUTO, 'content', null);

        this.baseWidth = baseWidth;
        this.baseHeight = baseHeight;

        /***** VERSION NUMBER - UPDATING WILL WIPE PLAYER DATA *************
        /****
        /**/
        this.version = '0.0.24'; //updated
        /**/
        /****
        *******************************************************************/
        //Set up Dev Tools - Maybe remove before publishing
        new Tools(this);

        let field = document.getElementById('content');
        //Init Utilities
        this.disableContextMenu(field);
        window.addEventListener('resize', this.OnResizeCalled.bind(this), false);
        //this.OnResizeCalled();

        let playerData = null;
        let playerClock = 0;
        let playerStory = Story.Story;
        if(localStorage){
            playerData = JSON.parse(localStorage.getItem('loot-hoarder-player'));
            playerClock = JSON.parse(localStorage.getItem('loot-hoarder-clock')) ||  Math.floor((new Date).getTime()/1000);
            let story = localStorage.getItem('loot-hoarder-story');
            if(story != null){
                playerStory = JSON.parse(story);
            }

            //shop data
            this.lastShopRefresh = localStorage.getItem('loot-hoarder-shop-time') || playerClock;
            this.shopItems = JSON.parse(localStorage.getItem('loot-hoarder-shop')) || [];
        } else {
            playerClock = Math.floor((new Date).getTime()/1000);
            this.lastShopRefresh = playerClock;
            this.shopItems = [];
        }
        //Loot Hoarder Variables
        this.player = new Player(playerData, this.version, playerStory);
        this.loot = [];
        this.storyEvents = new StoryObserver();
        this.dialogueOpen = false;

        //save new game data
        if(localStorage){
            localStorage.setItem('loot-hoarder-ver', this.version);
            localStorage.setItem('loot-hoarder-story', JSON.stringify(this.player.story));
        }

        this.saveLootData = this.saveLootData.bind(this);

        this.setupDungeons();
        this.lastGameTime = playerClock;

        this.state.add('Boot', BootState, false);
        this.state.add('Loading', LoadingState, false);
        this.state.add('Game', GameState, false);

        this.state.add('MainMenu', MainMenu, false);
        this.state.add('Options', Options, false);
        this.state.add('Inventory', Inventory, false);
        this.state.add('Raid', Raid, false);
        this.state.add('LootView', LootView, false);
        this.state.add('WeaponShop', WeaponShop, false);
        this.state.add('ScrollShop', ScrollShop, false);

        this.state.start('Boot');
    }

    setupDungeons(){
        //set default
        this.dungeons = DungeonData.dungeons;

        this.dungeons.forEach((dungeon) => {
            dungeon.currentEnemies = JSON.parse(JSON.stringify(dungeon.enemies));
        });

        if(localStorage){
            let dungeonsString = localStorage.getItem('loot-hoarder-dungeons');
            if(dungeonsString != undefined){
                this.dungeons = JSON.parse(dungeonsString);
            }

            let lootString = localStorage.getItem('loot-hoarder-loot');
            if(lootString != undefined){
                this.loot = JSON.parse(lootString);
            }
        }

    }

    saveLootData(game){
        if(localStorage){
            localStorage.setItem('loot-hoarder-loot', JSON.stringify(game.loot));
        }
    }

    OnResizeCalled() {
        let gameWidth = window.innerWidth;
        let scaleToFitX = gameWidth / this.baseWidth;
        let scaleAd = (window.innerWidth*0.15625);
        let scaleDownForAd = this.device.desktop ? 0 : scaleAd;
        let gameHeight = window.innerHeight - scaleDownForAd;
        let scaleToFitY = gameHeight / this.baseHeight;
        let optimalRatio = Math.min(scaleToFitX, scaleToFitY);

        this.scale.setUserScale(optimalRatio, optimalRatio, 0, 0);
    }

    disableContextMenu(element) {
        element.oncontextmenu = function(e) {
            if (e){e.stopPropagation();}
            return false;
        };
    }
}

window.game = new Game();
