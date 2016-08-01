import 'pixi';
import 'p2';
import Phaser from 'phaser';

import BootState from './states/Boot';
import SplashState from './states/Splash';
import GameState from './states/Game';
import MainMenu from './states/MainMenu';
import Inventory from './states/Inventory';
import Player from './Player';

class Game extends Phaser.Game {

    constructor () {
        let width = 768;
        let height = 1024;

        super(width, height, Phaser.AUTO, 'content', null);

        // let scalor = new ScaleManager(this, 100, 100);
        // console.log("scalor:", scalor);

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

        this.setupDungeons();
        this.lastGameTime = playerClock;

        this.state.add('Boot', BootState, false);
        this.state.add('Splash', SplashState, false);
        this.state.add('Game', GameState, false);
        this.state.add('MainMenu', MainMenu, false);
        this.state.add('Inventory', Inventory, false);

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
                enemies: [
                    {hp: 15, dps: 3},
                    {hp: 15, dps: 3},
                    {hp: 36, dps: 6},
                    {hp: 18, dps: 6},
                    {hp: 18, dps: 6},
                    {hp: 60, dps: 9}
                ],
                currentEnemies: [
                    {hp: 15, dps: 3},
                    {hp: 15, dps: 3},
                    {hp: 36, dps: 6},
                    {hp: 18, dps: 6},
                    {hp: 18, dps: 6},
                    {hp: 60, dps: 9}
                ]
            },
            {
                level: 2,
                enemiesAmount: 8,
                enemiesLeft: 8,
                miniBoss: 3,
                boss: 7,
                defeated: false,
                enemies: [
                    {hp: 15, dps: 3},
                    {hp: 18, dps: 6},
                    {hp: 18, dps: 6},
                    {hp: 48, dps: 6},
                    {hp: 18, dps: 6},
                    {hp: 18, dps: 6},
                    {hp: 15, dps: 12},
                    {hp: 105, dps: 12}
                ],
                currentEnemies: [
                    {hp: 15, dps: 3},
                    {hp: 18, dps: 6},
                    {hp: 18, dps: 6},
                    {hp: 48, dps: 6},
                    {hp: 18, dps: 6},
                    {hp: 18, dps: 6},
                    {hp: 15, dps: 12},
                    {hp: 105, dps: 12}
                ]
            },
            {
                level: 3,
                enemiesAmount: 10,
                enemiesLeft: 10,
                miniBoss: 4,
                boss: 9,
                defeated: false,
                enemies: [
                    {hp: 18, dps: 6},
                    {hp: 18, dps: 9},
                    {hp: 30, dps: 12},
                    {hp: 30, dps: 12},
                    {hp: 75, dps: 18},
                    {hp: 18, dps: 12},
                    {hp: 36, dps: 6},
                    {hp: 36, dps: 6},
                    {hp: 45, dps: 15},
                    {hp: 165, dps: 30}
                ],
                currentEnemies: [
                    {hp: 18, dps: 6},
                    {hp: 18, dps: 9},
                    {hp: 30, dps: 12},
                    {hp: 30, dps: 12},
                    {hp: 75, dps: 18},
                    {hp: 18, dps: 12},
                    {hp: 36, dps: 6},
                    {hp: 36, dps: 6},
                    {hp: 45, dps: 15},
                    {hp: 165, dps: 30}
                ]
            }
        ];

        if(localStorage){
            let dungeonsString = localStorage.getItem('loot-hoarder-dungeons');
            if(dungeonsString != undefined){
                this.dungeons = JSON.parse(dungeonsString);
            }
        }

    }

    OnResizeCalled() {
        let gameWidth = window.innerWidth;
        let gameHeight = window.innerHeight;
        let scaleToFitX = gameWidth / 768;
        let scaleToFitY = gameHeight / 1024;

        let currentScreenRatio = gameHeight / gameWidth;
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
