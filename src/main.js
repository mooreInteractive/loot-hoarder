import 'pixi';
import 'p2';
import Phaser from 'phaser';

import BootState from './states/Boot';
import SplashState from './states/Splash';
import GameState from './states/Game';
import MainMenu from './states/MainMenu';
import Options from './states/Options';
import Inventory from './states/Inventory';
import Raid from './states/Raid';
import DungeonMap from './states/DungeonMap';
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
        this.player = new Player(playerData);
        this.loot = [];

        this.saveLootData = this.saveLootData.bind(this);

        this.setupDungeons();
        this.lastGameTime = playerClock;

        this.state.add('Boot', BootState, false);
        this.state.add('Splash', SplashState, false);
        this.state.add('Game', GameState, false);

        this.state.add('MainMenu', MainMenu, false);
        this.state.add('Options', Options, false);
        this.state.add('Inventory', Inventory, false);
        this.state.add('Raid', Raid, false);
        this.state.add('DungeonMap', DungeonMap, false);
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
                    x: 450,
                    y: 650
                },
                enemies: [
                    {hp: 15, dps: 1},
                    {hp: 15, dps: 1},
                    {hp: 36, dps: 3, boss: true},
                    {hp: 18, dps: 3},
                    {hp: 18, dps: 3},
                    {hp: 60, dps: 5, boss: true}
                ],
                currentEnemies: [
                    {hp: 15, dps: 1},
                    {hp: 15, dps: 1},
                    {hp: 36, dps: 3, boss: true},
                    {hp: 18, dps: 3},
                    {hp: 18, dps: 3},
                    {hp: 60, dps: 5, boss: true}
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
                    x: 500,
                    y: 350
                },
                enemies: [
                    {hp: 15, dps: 3},
                    {hp: 18, dps: 6},
                    {hp: 18, dps: 6},
                    {hp: 48, dps: 6, boss: true},
                    {hp: 18, dps: 6},
                    {hp: 18, dps: 6},
                    {hp: 15, dps: 12},
                    {hp: 105, dps: 12, boss: true}
                ],
                currentEnemies: [
                    {hp: 15, dps: 3},
                    {hp: 18, dps: 6},
                    {hp: 18, dps: 6},
                    {hp: 48, dps: 6, boss: true},
                    {hp: 18, dps: 6},
                    {hp: 18, dps: 6},
                    {hp: 15, dps: 12},
                    {hp: 105, dps: 12, boss: true}
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
                    x: 150,
                    y: 500
                },
                enemies: [
                    {hp: 18, dps: 6},
                    {hp: 18, dps: 9},
                    {hp: 30, dps: 12},
                    {hp: 30, dps: 12},
                    {hp: 75, dps: 18, boss: true},
                    {hp: 18, dps: 12},
                    {hp: 36, dps: 6},
                    {hp: 36, dps: 6},
                    {hp: 45, dps: 15},
                    {hp: 165, dps: 30, boss: true}
                ],
                currentEnemies: [
                    {hp: 18, dps: 6},
                    {hp: 18, dps: 9},
                    {hp: 30, dps: 12},
                    {hp: 30, dps: 12},
                    {hp: 75, dps: 18, boss: true},
                    {hp: 18, dps: 12},
                    {hp: 36, dps: 6},
                    {hp: 36, dps: 6},
                    {hp: 45, dps: 15},
                    {hp: 165, dps: 30, boss: true}
                ]
            }
        ];

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
