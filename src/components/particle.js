import Phaser from 'phaser';

// export default class LootParticle extends Phaser.Particle {
//     constructor(game, x, y){
//         super(game, x, y, game.cache.getBitmapData('particleShade'));
//         console.log('creating particle...');
//     }
// }

//  Here is our custom Particle
export default function LootParticle (game, x, y) {
    console.log('cerating particle...');
    Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleShade'));

}

LootParticle.prototype = Object.create(Phaser.Particle.prototype);
LootParticle.prototype.constructor = LootParticle;
