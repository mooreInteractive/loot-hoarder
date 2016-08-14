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
import Tools from './tools';

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
        this.version = 3; //updated 8/13 5:30pm
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
        if(localStorage){
            playerData = JSON.parse(localStorage.getItem('loot-hoarder-player'));
            playerClock = JSON.parse(localStorage.getItem('loot-hoarder-clock'));
        } else {
            playerClock = Math.floor((new Date).getTime()/1000);
        }
        //Loot Hoarder Variables
        this.player = new Player(playerData, this.version);
        this.loot = [];

        if(localStorage){localStorage.setItem('loot-hoarder-ver', this.version);}

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

        this.state.start('Boot');
    }

    setupDungeons(){
        //set default
        this.dungeons = [
            {
                level: 1,
                enemiesAmount: 6,
                enemiesLeft: 6,
                miniBoss: 2,
                boss: 5,
                defeated: false,
                sprite: {
                    image: 'chesslike',
                    x: 519,
                    y: 678
                },
                currentEnemies: [],
                enemies: [
                    {hp: 15, dps: 1, sprite: 'goo'},
                    {hp: 15, dps: 1, sprite: 'goo'},
                    {hp: 36, dps: 3, sprite: 'whisper', boss: true},
                    {hp: 18, dps: 3, sprite: 'goo'},
                    {hp: 18, dps: 3, sprite: 'goo'},
                    {hp: 60, dps: 5, sprite: 'artichoke', boss: true}
                ]
            },
            {
                level: 2,
                enemiesAmount: 8,
                enemiesLeft: 8,
                miniBoss: 3,
                boss: 7,
                defeated: false,
                sprite: {
                    image: 'chesslike',
                    x: 569,
                    y: 378
                },
                currentEnemies: [],
                enemies: [
                    {hp: 15, dps: 3, sprite: 'goo'},
                    {hp: 18, dps: 6, sprite: 'whisper'},
                    {hp: 18, dps: 6, sprite: 'whisper'},
                    {hp: 48, dps: 6, sprite: 'artichoke', boss: true},
                    {hp: 18, dps: 6, sprite: 'whisper'},
                    {hp: 18, dps: 6, sprite: 'whisper'},
                    {hp: 15, dps: 12, sprite: 'artichoke'},
                    {hp: 105, dps: 12, sprite: 'moss', boss: true}
                ]
            },
            {
                level: 3,
                enemiesAmount: 10,
                enemiesLeft: 10,
                miniBoss: 4,
                boss: 9,
                defeated: false,
                sprite: {
                    image: 'chesslike',
                    x: 219,
                    y: 527
                },
                currentEnemies: [],
                enemies: [
                    {hp: 18, dps: 6, sprite: 'whisper'},
                    {hp: 18, dps: 9, sprite: 'whisper'},
                    {hp: 30, dps: 12, sprite: 'artichoke'},
                    {hp: 30, dps: 12, sprite: 'artichoke'},
                    {hp: 75, dps: 18, sprite: 'moss', boss: true},
                    {hp: 18, dps: 12, sprite: 'artichoke'},
                    {hp: 36, dps: 6, sprite: 'antler'},
                    {hp: 36, dps: 6, sprite: 'antler'},
                    {hp: 45, dps: 15, sprite: 'artichoke'},
                    {hp: 165, dps: 30, sprite: 'blood_skull', boss: true}
                ]
            },
            {
                level: 4,
                enemiesAmount: 12,
                enemiesLeft: 12,
                miniBoss: 4,
                boss: 9,
                defeated: false,
                sprite: {
                    image: 'chesslike',
                    x: 360,
                    y: 275
                },
                currentEnemies: [],
                enemies: [
                    {hp: 32, dps: 10, sprite: 'artichoke'},
                    {hp: 32, dps: 10, sprite: 'artichoke'},
                    {hp: 55, dps: 18, sprite: 'moss'},
                    {hp: 55, dps: 18, sprite: 'moss'},
                    {hp: 55, dps: 18, sprite: 'moss'},
                    {hp: 150, dps: 44, sprite: 'blood_skull', boss: true},
                    {hp: 85, dps: 20, sprite: 'artichoke'},
                    {hp: 100, dps: 8, sprite: 'moss'},
                    {hp: 100, dps: 8, sprite: 'moss'},
                    {hp: 150, dps: 50, sprite: 'skelly'},
                    {hp: 150, dps: 50, sprite: 'skelly'},
                    {hp: 250, dps: 60, sprite: 'wraith', boss: true}
                ]
            }
        ];

        this.dungeons.forEach((dungeon) => {
            dungeon.currentEnemies = JSON.parse(JSON.stringify(dungeon.enemies));
            // dungeon.enemies.forEach((enemy, index)=>{
            //     dungeon.currentEnemies[index] = JSON.parse(JSON.stringify(enemy));
            // });
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
        let gameHeight = window.innerHeight;
        let scaleToFitX = gameWidth / this.baseWidth;
        let scaleToFitY = gameHeight / this.baseHeight;
        let optimalRatio = Math.min(scaleToFitX, scaleToFitY);

        this.scale.setUserScale(optimalRatio, optimalRatio, 0, 0);
    }

    //function castleUI (){return true;}
    disableContextMenu(element) {
        element.oncontextmenu = function(e) {
            if (e){e.stopPropagation();}
            return false;
        };
    }
}

window.game = new Game();
