export class GameState {
    day: number = 1;

    dayChangeAnimationDuration = 5000;
    
    coins: number = 100;

    playerHealt: number = 100;
    playerHealtMax: number = 100;
    playerForce: number = 0;
    playerIntelligence: number = 0;

    movePointsMax: number = 10;
    movePointsCurrent: number = 10;

    // taxDay: number = 10 + (Math.floor(this.day/10));
    taxDay() {
        return 10 + (Math.floor(this.day/10));
    }
    taxWin: number = 1000;

    gardenCells = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    items: Array<string> = [];

    backyardObjectsPlan = {
        levels: [
            {
                stones: 10,
                enemies: 10,
                treasure: 10,
            },
            {
                stones: 10,
                enemies: 20,
                treasure: 10,
            },
            {
                stones: 20,
                enemies: 40,
                treasure: 10,
            },
            {
                stones: 10,
                enemies: 80,
                treasure: 10,
            },
            {
                stones: 0,
                enemies: 119,
                treasure: 0,
            }
        ]
    };

    backyardObjects = {
        levels: [
            {
                objects: [
                    {
                        image_key: "",
                        x: 0,
                        y: 0,
                        row: 0,
                        column: 0,
                        rowColumn: ""
                    }

                ]
            },
            {
                objects: [
                    {
                        image_key: "",
                        x: 0,
                        y: 0,
                        row: 0,
                        column: 0,
                        rowColumn: ""
                    }

                ]
            },
            {
                objects: [
                    {
                        image_key: "",
                        x: 0,
                        y: 0,
                        row: 0,
                        column: 0,
                        rowColumn: ""
                    }

                ]
            },
            {
                objects: [
                    {
                        image_key: "",
                        x: 0,
                        y: 0,
                        row: 0,
                        column: 0,
                        rowColumn: ""
                    }

                ]
            },
            {
                objects: [
                    {
                        image_key: "",
                        x: 0,
                        y: 0,
                        row: 0,
                        column: 0,
                        rowColumn: ""
                    }

                ]
            },
        ]
    };

    backyardTileSize: number = 100;
    backyardRowColumnAmount: number = 11;
    backyardTilesAmount: number = this.backyardRowColumnAmount * this.backyardRowColumnAmount;

    soundVolume: number = 0.5;

    todayWorkshopAlreadyUsed = false;
    todayGymAlreadyUsed = false;
    todayGardenAlreadyUsed = false;

    secretKeyPosition = {row: -1, column: -1};
    secretKeyFound: boolean = false;
    secretKeyUsed: boolean = false;

    reset() {
        let soundVolume = this.soundVolume;

        const freshState = new GameState();
        Object.assign(this, freshState);

        this.soundVolume = soundVolume;
    }
    
}

export const gameState = new GameState();