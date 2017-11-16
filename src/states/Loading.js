import Phaser from 'phaser';

export default class extends Phaser.State {
    init () {}

    preload () {
        this.loaderBg = this.add.sprite(this.game.world.centerX - 150, this.game.world.centerY, 'loaderBg');
        this.loaderBar = this.add.sprite(this.game.world.centerX - 145, this.game.world.centerY+5, 'loaderBar');
        let text = this.add.text(this.world.centerX, this.world.centerY+45, 'loading graphics', { font: '28px Tahoma', fill: '#000000', align: 'center' });
        text.anchor.setTo(0.5, 0.5);

        //particle images
        this.game.load.image('part_sm_purple', './assets/images/particles/small_purple.png');
        this.game.load.image('part_med_purple', './assets/images/particles/med_purple.png');
        this.game.load.image('part_lg_purple', './assets/images/particles/lg_purple.png');
        this.game.load.image('part_sm_yellow', './assets/images/particles/small_yellow.png');
        this.game.load.image('part_med_yellow', './assets/images/particles/med_yellow.png');
        this.game.load.image('part_lg_yellow', './assets/images/particles/lg_yellow.png');

        //Button Backgrounds
        this.game.load.image('blueButton', './assets/images/blue_button00.png');
        this.game.load.image('greenButton', './assets/images/green_button00.png');
        this.game.load.image('greyButton', './assets/images/grey_button00.png');
        this.game.load.image('yellowButton', './assets/images/yellow_button00.png');
        this.game.load.image('redButton', './assets/images/red_button00.png');
        this.game.load.image('optionsBanner', './assets/images/options_banner.png');
        this.game.load.image('yellow_dotted', './assets/images/yellow_dotted.png');
        this.game.load.image('music_on', './assets/images/ui/musicOn.png', 100, 100);
        this.game.load.image('music_off', './assets/images/ui/musicOff.png', 100, 100);

        //UI
        this.game.load.spritesheet('hud_main', './assets/images/hud_character.png', 276, 100);
        this.game.load.image('hud_loot', './assets/images/hud_loot.png');
        this.game.load.image('inv_bg', './assets/images/INV.png');
        this.game.load.image('main_nav_bg', './assets/images/ui/main_nav_bg.png');
        this.game.load.spritesheet('basic_loot', './assets/images/ui/chest_anim.png', 384, 384);
        this.game.load.spritesheet('raid_shop_slider', './assets/images/ui/raid_shop_slider.png', 258, 234);
        this.game.load.spritesheet('inventory_btn', './assets/images/ui/inventory.png', 60, 60);
        this.game.load.spritesheet('world_btn', './assets/images/ui/world.png', 60, 60);
        this.game.load.image('buy_bg', './assets/images/ui/shop_rough_buy.png');
        this.game.load.image('sell_bg', './assets/images/ui/shop_rough_sell.png');
        this.game.load.image('scroll_shop_bg', './assets/images/ui/scroll_shop.png');

        //Portraits
        this.game.load.spritesheet('portraits', './assets/images/portraits/sheet.png', 32, 48);

        //weapons
        this.game.load.image('shield3', './assets/images/items/shield.png');
        this.game.load.image('helm1', './assets/images/items/stone_helm.png');
        this.game.load.image('boots1', './assets/images/items/stone_boots.png');
        this.game.load.image('armor0', './assets/images/items/leather_armor.png');
        this.game.load.image('redRing', './assets/images/items/ring.png');
        this.game.load.image('blueRing', './assets/images/items/blue_ring.png');
        this.game.load.image('purpleRing', './assets/images/items/purple_ring.png');
        this.game.load.image('pinkRing', './assets/images/items/pink_ring.png');
        this.game.load.image('potion', './assets/images/items/potion.png');
        this.game.load.image('scroll', './assets/images/items/scroll.png');
        this.game.load.spritesheet('misc_items', './assets/images/items/Items1_3x.png', 96, 96);
        this.game.load.spritesheet('axes', './assets/images/items/Fantasy_Axes_3x.png', 96, 96);
        this.game.load.spritesheet('swords', './assets/images/items/Fantasy_Swords_3x.png', 96, 96);
        this.game.load.spritesheet('daggers', './assets/images/items/Fantasy_Daggers_3x.png', 96, 96);
        this.game.load.spritesheet('spears', './assets/images/items/Spears_3x.png', 48, 96);
        this.game.load.spritesheet('misc_weap', './assets/images/items/Weapons1_3x.png', 96, 96);

        //terrain
        this.game.load.spritesheet('water', './assets/images/terrain/water.png', 32, 32);
        this.game.load.image('chesslike', './assets/images/terrain/wide_castle.png', 48, 32);
        this.game.load.image('lair', './assets/images/terrain/large_cave.png', 48, 32);
        this.game.load.image('cave', './assets/images/terrain/small_cave.png', 48, 32);
        this.game.load.image('yellow_town', './assets/images/terrain/yellow_town.png', 32, 32);
        this.game.load.image('brown_town', './assets/images/terrain/brown_town.png', 32, 32);
        this.game.load.image('tall_tower', './assets/images/terrain/tall_tower.png', 32, 32);
        this.game.load.image('small_tower', './assets/images/terrain/small_tower.png', 32, 32);
        this.game.load.image('clay_town', './assets/images/terrain/clay_town.png', 32, 32);
        this.game.load.image('yellow_ranch', './assets/images/terrain/yellow_ranch.png', 32, 32);
        this.game.load.image('red_ranch', './assets/images/terrain/red_ranch.png', 32, 32);
        this.game.load.image('castle_courtyard', './assets/images/terrain/castle_courtyard.png', 48, 48);

        this.game.load.image('island', './assets/images/terrain/island_bare.png');
        this.game.load.image('field-blue', './assets/images/terrain/field-blue.png');
        this.game.load.image('field-tan', './assets/images/terrain/field-tan.png');
        this.game.load.image('sunny-hills', './assets/images/terrain/sunny-hills.png');
        this.game.load.image('sunny-hills-dark', './assets/images/terrain/sunny-hills-dark.png');

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

        this.game.load.audio('heathfield_music', ['assets/audio/pillage_the_village.mp3']);


        this.game.load.onFileComplete.add(this.fileComplete, this);
    }

    fileComplete(progress) {
        this.loaderBar.scale.x = progress/100;
        if(progress == 100){
            this.state.start('Game');
        }
    }


}
