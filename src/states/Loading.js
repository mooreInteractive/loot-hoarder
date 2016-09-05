import Phaser from 'phaser';

export default class extends Phaser.State {
    init () {}

    preload () {
        this.loaderBg = this.add.sprite(this.game.world.centerX - 150, this.game.world.centerY, 'loaderBg');
        this.loaderBar = this.add.sprite(this.game.world.centerX - 145, this.game.world.centerY+5, 'loaderBar');
        let text = this.add.text(this.world.centerX, this.world.centerY+45, 'loading graphics', { font: '28px Tahoma', fill: '#000000', align: 'center' });
        text.anchor.setTo(0.5, 0.5);

        //Button Backgrounds
        this.load.image('blueButton', './assets/images/blue_button00.png');
        this.load.image('greenButton', './assets/images/green_button00.png');
        this.load.image('greyButton', './assets/images/grey_button00.png');
        this.load.image('yellowButton', './assets/images/yellow_button00.png');
        this.load.image('redButton', './assets/images/red_button00.png');
        this.load.image('optionsBanner', './assets/images/options_banner.png');
        this.load.image('yellow_dotted', './assets/images/yellow_dotted.png');

        //UI
        this.load.spritesheet('hud_main', './assets/images/hud_character.png', 276, 100);
        this.load.image('hud_loot', './assets/images/hud_loot.png');

        //weapons
        this.load.image('shank0', './assets/images/items/shank.png');
        this.load.image('spear0', './assets/images/items/spear.png');
        this.load.image('shield3', './assets/images/items/shield.png');
        this.load.image('helm1', './assets/images/items/stone_helm.png');
        this.load.image('boots1', './assets/images/items/stone_boots.png');
        this.load.image('armor0', './assets/images/items/leather_armor.png');
        this.load.image('sword2', './assets/images/items/sword.png');
        this.load.image('axe0', './assets/images/items/axe.png');
        this.load.image('bow0', './assets/images/items/bow.png');
        this.load.image('redRing', './assets/images/items/ring.png');
        this.load.image('blueRing', './assets/images/items/blue_ring.png');
        this.load.image('purpleRing', './assets/images/items/purple_ring.png');
        this.load.image('pinkRing', './assets/images/items/pink_ring.png');
        this.load.image('potion', './assets/images/items/potion.png');
        this.load.image('scroll', './assets/images/items/scroll.png');

        //terrain
        this.load.spritesheet('water', './assets/images/terrain/water.png', 32, 32);
        this.load.image('chesslike', './assets/images/terrain/wide_castle.png', 48, 32);
        this.load.image('lair', './assets/images/terrain/large_cave.png', 48, 32);
        this.load.image('cave', './assets/images/terrain/small_cave.png', 48, 32);
        this.load.image('yellow_town', './assets/images/terrain/yellow_town.png', 32, 32);
        this.load.image('brown_town', './assets/images/terrain/brown_town.png', 32, 32);
        this.load.image('tall_tower', './assets/images/terrain/tall_tower.png', 32, 32);
        this.load.image('small_tower', './assets/images/terrain/small_tower.png', 32, 32);
        this.load.image('clay_town', './assets/images/terrain/clay_town.png', 32, 32);
        this.load.image('yellow_ranch', './assets/images/terrain/yellow_ranch.png', 32, 32);
        this.load.image('red_ranch', './assets/images/terrain/red_ranch.png', 32, 32);
        this.load.image('castle_courtyard', './assets/images/terrain/castle_courtyard.png', 48, 48);

        this.load.image('island', './assets/images/terrain/island_bare.png');
        this.load.image('field-blue', './assets/images/terrain/field-blue.png');
        this.load.image('field-tan', './assets/images/terrain/field-tan.png');

        //Mobs
        this.game.load.spritesheet('goo', './assets/images/mobs/goo.png', 77, 72);
        this.game.load.spritesheet('whisper', './assets/images/mobs/whisper.png', 96, 144);
        this.game.load.spritesheet('goon', './assets/images/mobs/goon.png', 192, 192);
        this.game.load.spritesheet('antler', './assets/images/mobs/antler.png', 96, 128);
        this.game.load.spritesheet('artichoke', './assets/images/mobs/artichoke.png', 96, 169);
        this.game.load.spritesheet('blood_skull', './assets/images/mobs/blood_skull.png', 65, 124);
        this.game.load.spritesheet('hand', './assets/images/mobs/hand.png', 192, 192);
        this.game.load.spritesheet('moss', './assets/images/mobs/moss.png', 192, 192);
        this.game.load.spritesheet('skelly', './assets/images/mobs/skelly.png', 96, 144);
        this.game.load.spritesheet('wraith', './assets/images/mobs/wraith.png', 192, 192);

        this.game.load.spritesheet('strong_man', './assets/images/avatar/man_full_hp.png', 96, 144);
        this.game.load.spritesheet('tired_man', './assets/images/avatar/man_half_hp.png', 96, 144);
        this.game.load.spritesheet('hair', './assets/images/avatar/hair.png', 96, 144);

        this.game.load.spritesheet('helm_leather', './assets/images/avatar/helm_leather.png', 96, 144);
        this.game.load.spritesheet('armor_leather', './assets/images/avatar/armor_leather.png', 96, 144);
        this.game.load.spritesheet('boots_leather', './assets/images/avatar/boots_leather.png', 96, 144);

        this.game.load.spritesheet('helm_stone', './assets/images/avatar/helm_stone.png', 96, 144);
        this.game.load.spritesheet('armor_stone', './assets/images/avatar/armor_stone.png', 96, 144);
        this.game.load.spritesheet('boots_stone', './assets/images/avatar/boots_stone.png', 96, 144);

        this.game.load.spritesheet('helm_iron', './assets/images/avatar/helm_iron.png', 96, 144);
        this.game.load.spritesheet('armor_iron', './assets/images/avatar/armor_iron.png', 96, 144);
        this.game.load.spritesheet('boots_iron', './assets/images/avatar/boots_iron.png', 96, 144);

        this.game.load.spritesheet('helm_steel', './assets/images/avatar/helm_steel.png', 96, 144);
        this.game.load.spritesheet('armor_steel', './assets/images/avatar/armor_steel.png', 96, 144);
        this.game.load.spritesheet('boots_steel', './assets/images/avatar/boots_steel.png', 96, 144);

        this.game.load.spritesheet('axe', './assets/images/avatar/axe.png', 96, 144);
        this.game.load.spritesheet('sword', './assets/images/avatar/sword.png', 96, 144);
        this.game.load.spritesheet('dagger', './assets/images/avatar/dagger.png', 96, 144);
        this.game.load.spritesheet('bow', './assets/images/avatar/bow.png', 96, 144);
        this.game.load.spritesheet('spear', './assets/images/avatar/spear.png', 96, 144);

        this.game.load.spritesheet('axe_off', './assets/images/avatar/axe_off.png', 96, 144);
        this.game.load.spritesheet('sword_off', './assets/images/avatar/sword_off.png', 96, 144);
        this.game.load.spritesheet('dagger_off', './assets/images/avatar/dagger_off.png', 96, 144);
        this.game.load.spritesheet('bow_off', './assets/images/avatar/bow_off.png', 96, 144);
        this.game.load.spritesheet('spear_off', './assets/images/avatar/spear_off.png', 96, 144);



        this.game.load.onFileComplete.add(this.fileComplete, this);
    }

    fileComplete(progress) {
        this.loaderBar.scale.x = progress/100;
        if(progress == 100){
            this.state.start('Game');
        }
    }


}
