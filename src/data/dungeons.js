export let dungeons = [
    {
        level: 1,
        name: 'Weapon Shop',
        enemiesAmount: 6,
        enemiesLeft: 6,
        miniBoss: 2,
        boss: 5,
        defeated: false,
        sprite: {
            image: 'brown_town',
            x: 576,
            y: 672
        },
        heardMessage: false,
        currentEnemies: [],
        enemies: [
            {hp: 8, dps: 1, sprite: 'goo'},
            {hp: 8, dps: 1, sprite: 'goo'},
            {hp: 20, dps: 3, sprite: 'whisper', boss: true},
            {hp: 15, dps: 2, sprite: 'goo'},
            {hp: 15, dps: 2, sprite: 'goo'},
            {hp: 30, dps: 4, sprite: 'artichoke', boss: true, message: 'There\'s nothing good left\nin this town anyway.'}
        ]
    },
    {
        level: 2,
        name: 'Potion Shop',
        enemiesAmount: 6,
        enemiesLeft: 6,
        miniBoss: 3,
        boss: 6,
        defeated: false,
        sprite: {
            image: 'yellow_ranch',
            x: 352,
            y: 766
        },
        heardMessage: false,
        currentEnemies: [],
        enemies: [
            {hp: 8, dps: 2, sprite: 'goo'},
            {hp: 12, dps: 4, sprite: 'whisper'},
            {hp: 24, dps: 4, sprite: 'artichoke', boss: true},
            {hp: 12, dps: 3, sprite: 'whisper'},
            {hp: 10, dps: 4, sprite: 'artichoke'},
            {hp: 55, dps: 6, sprite: 'moss', boss: true, message: 'Your friend isn\'t here chump.'}
        ]
    },
    {
        level: 3,
        name: 'Scroll Shop',
        enemiesAmount: 7,
        enemiesLeft: 7,
        miniBoss: 3,
        boss: 7,
        defeated: false,
        sprite: {
            image: 'red_ranch',
            x: 160,
            y: 608
        },
        heardMessage: false,
        currentEnemies: [],
        enemies: [
            {hp: 18, dps: 3, sprite: 'whisper'},
            {hp: 18, dps: 4, sprite: 'artichoke'},
            {hp: 44, dps: 10, sprite: 'moss', boss: true},
            {hp: 18, dps: 8, sprite: 'artichoke'},
            {hp: 24, dps: 6, sprite: 'antler'},
            {hp: 24, dps: 12, sprite: 'artichoke'},
            {hp: 85, dps: 16, sprite: 'blood_skull', boss: true, message: 'Who are you anyways kid?'}
        ]
    },
    {
        level: 4,
        name: 'Midfort',
        enemiesAmount: 10,
        enemiesLeft: 10,
        miniBoss: 4,
        boss: 9,
        defeated: false,
        sprite: {
            image: 'chesslike',
            x: 320,
            y: 480
        },
        heardMessage: false,
        currentEnemies: [],
        enemies: [
            {hp: 40, dps: 10, sprite: 'artichoke'},
            {hp: 40, dps: 10, sprite: 'artichoke'},
            {hp: 55, dps: 15, sprite: 'moss'},
            {hp: 55, dps: 15, sprite: 'moss'},
            {hp: 75, dps: 20, sprite: 'blood_skull', boss: true},
            {hp: 40, dps: 18, sprite: 'artichoke'},
            {hp: 45, dps: 14, sprite: 'moss'},
            {hp: 45, dps: 14, sprite: 'moss'},
            {hp: 60, dps: 20, sprite: 'skelly'},
            {hp: 120, dps: 36, sprite: 'wraith', boss: true, message: 'Well aren\'t you cute?'}
        ]
    },
    {
        level: 5,
        name: 'Clifftown',
        enemiesAmount: 12,
        enemiesLeft: 12,
        miniBoss: 4,
        boss: 9,
        defeated: false,
        sprite: {
            image: 'brown_town',
            x: 128,
            y: 384
        },
        heardMessage: false,
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
            {hp: 250, dps: 60, sprite: 'wraith', boss: true, message: 'Come to save your\nfriend have you?'}
        ]
    },
    {
        level: 6,
        name: 'Cricket Cave',
        enemiesAmount: 12,
        enemiesLeft: 12,
        miniBoss: 4,
        boss: 9,
        defeated: false,
        sprite: {
            image: 'cave',
            x: 336,
            y: 352
        },
        heardMessage: false,
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
    },
    {
        level: 7,
        name: 'Woodwatch',
        enemiesAmount: 12,
        enemiesLeft: 12,
        miniBoss: 4,
        boss: 9,
        defeated: false,
        sprite: {
            image: 'small_tower',
            x: 576,
            y: 382
        },
        heardMessage: false,
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
            {hp: 500, dps: 120, sprite: 'hand', boss: true}
        ]
    },
    {
        level: 8,
        name: 'Cap Castle',
        enemiesAmount: 12,
        enemiesLeft: 12,
        miniBoss: 4,
        boss: 9,
        defeated: false,
        sprite: {
            image: 'castle_courtyard',
            x: 496,
            y: 176
        },
        heardMessage: false,
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
    },
    {
        level: 9,
        name: 'Norfort',
        enemiesAmount: 12,
        enemiesLeft: 12,
        miniBoss: 4,
        boss: 9,
        defeated: false,
        sprite: {
            image: 'tall_tower',
            x: 192,
            y: 128
        },
        heardMessage: false,
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
    },
    {
        level: 10,
        name: 'Dragon Cave',
        enemiesAmount: 12,
        enemiesLeft: 12,
        miniBoss: 4,
        boss: 9,
        defeated: false,
        sprite: {
            image: 'lair',
            x: 176,
            y: 256
        },
        heardMessage: false,
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
            {hp: 1024, dps: 500, sprite: 'wraith', boss: true}
        ]
    }
];
