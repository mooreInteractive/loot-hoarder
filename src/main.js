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
        let width = document.documentElement.clientWidth > 768 ? 768 : document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight > 1024 ? 1024 : document.documentElement.clientHeight;

        super(width, height, Phaser.AUTO, 'content', null);

        let playerData = null;
        if(localStorage){
            playerData = JSON.parse(localStorage.getItem('loot-hoarder-player'));
        }
        //Loot Hoarder Variables
        this.player = new Player(playerData);

        this.setupDungeons();
        this.lastGameTime = 0;

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
                enemies: [
                    {hp: 5, dps: 1},
                    {hp: 5, dps: 1},
                    {hp: 12, dps: 2},
                    {hp: 6, dps: 2},
                    {hp: 6, dps: 2},
                    {hp: 20, dps: 3}
                ]
            },
            {
                level: 2,
                enemiesAmount: 8,
                enemiesLeft: 8,
                miniBoss: 3,
                boss: 7,
                enemies: [
                    {hp: 5, dps: 1},
                    {hp: 6, dps: 2},
                    {hp: 6, dps: 2},
                    {hp: 16, dps: 2},
                    {hp: 6, dps: 2},
                    {hp: 6, dps: 2},
                    {hp: 5, dps: 4},
                    {hp: 35, dps: 4}
                ]
            },
            {
                level: 3,
                enemiesAmount: 6,
                enemiesLeft: 6,
                miniBoss: 2,
                boss: 5,
                enemies: [
                    {hp: 6, dps: 2},
                    {hp: 6, dps: 3},
                    {hp: 10, dps: 4},
                    {hp: 10, dps: 4},
                    {hp: 25, dps: 6},
                    {hp: 6, dps: 4},
                    {hp: 12, dps: 2},
                    {hp: 12, dps: 2},
                    {hp: 15, dps: 5},
                    {hp: 55, dps: 10}
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
}

window.game = new Game();
