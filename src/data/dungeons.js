export let dungeons = [
    {
        level: 1,
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
            {hp: 15, dps: 1, sprite: 'goo'},
            {hp: 15, dps: 1, sprite: 'goo'},
            {hp: 36, dps: 3, sprite: 'whisper', boss: true},
            {hp: 18, dps: 3, sprite: 'goo'},
            {hp: 18, dps: 3, sprite: 'goo'},
            {hp: 60, dps: 5, sprite: 'artichoke', boss: true, message: 'There\'s nothing good left\nin this town anyway.'}
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
            image: 'yellow_ranch',
            x: 352,
            y: 766
        },
        heardMessage: false,
        currentEnemies: [],
        enemies: [
            {hp: 15, dps: 3, sprite: 'goo'},
            {hp: 18, dps: 6, sprite: 'whisper'},
            {hp: 18, dps: 6, sprite: 'whisper'},
            {hp: 48, dps: 6, sprite: 'artichoke', boss: true},
            {hp: 18, dps: 6, sprite: 'whisper'},
            {hp: 18, dps: 6, sprite: 'whisper'},
            {hp: 15, dps: 12, sprite: 'artichoke'},
            {hp: 105, dps: 12, sprite: 'moss', boss: true, message: 'Your friend isn\'t here chump.'}
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
            image: 'red_ranch',
            x: 160,
            y: 608
        },
        heardMessage: false,
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
            {hp: 165, dps: 30, sprite: 'blood_skull', boss: true, message: 'Who are you anyways kid?'}
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
            x: 320,
            y: 480
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
        level: 5,
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
            {hp: 250, dps: 60, sprite: 'wraith', boss: true}
        ]
    }
];
