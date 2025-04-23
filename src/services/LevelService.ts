import { gameState } from "../core/GameState";
import { SceneManager } from "./SceneManager";

export type BackyardObject = {
    image_key: string;
    x: number;
    y: number;
    row: number;
    column: number;
    rowColumn: string
};

export class LevelService {

    rowColumnAmount: number = 11;
    sceneManager!: SceneManager;
    tileSize!: number;
    tilesAmount!: number;
    scene!: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.sceneManager = new SceneManager();

        this.tileSize = gameState.backyardTileSize;
        this.tilesAmount = gameState.backyardTilesAmount;

        this.scene = scene;
    }

    generateLevels() {

        for(let level = 0; level < gameState.backyardObjectsPlan.levels.length; level++) {
            this.generateLevel(level);
        }

        this.putSecretKey();
    }

    generateLevel(level: number) {
        const plan = gameState.backyardObjectsPlan.levels[level];
        const objects: BackyardObject[] = gameState.backyardObjects.levels[level].objects = [];

        const totalToPlace = [
            { count: plan.stones, image_keys: ['backyard_stone_1', 'backyard_stone_2', 'backyard_stone_3'] },
            { count: plan.enemies, image_keys: ['backyard_enemy_1', 'backyard_enemy_2', 'backyard_enemy_3'] },
            { count: plan.treasure, image_keys: ['backyard_treasure_1', 'backyard_treasure_2', 'backyard_treasure_3'] }
        ];
    
        const grassImages = ['backyard_grass_1', 'backyard_grass_2', 'backyard_grass_3'];
    
        const usedPositions = new Set<string>();
        const generateKey = (row: number, column: number) => `${row},${column}`;
    
        let playerColumn = 0;
        let playerRow = Math.floor(this.rowColumnAmount / 2.0);
        usedPositions.add(generateKey(playerRow, playerColumn));
        usedPositions.add(generateKey(playerRow, this.rowColumnAmount - 1));
    
        for (let item of totalToPlace) {
            let count = item.count;
            while (count > 0) {
                const row = Math.floor(Math.random() * this.rowColumnAmount);
                const column = Math.floor(Math.random() * this.rowColumnAmount);
                const key = generateKey(row, column);
    
                if (usedPositions.has(key)) continue;
    
                usedPositions.add(key);
                const { x, y } = this.sceneManager.getTilePositionByRowColumn(this.scene, row, column, this.tilesAmount, this.tileSize);
    
                const image_key = item.image_keys[Math.floor(Math.random() * item.image_keys.length)];
    
                let rowColumn = `${row}_${column}`;

                objects.push({ image_key, x, y, row, column, rowColumn });
                count--;
            }
        }
    
        // fill in grass
        for (let row = 0; row < this.rowColumnAmount; row++) {
            for (let column = 0; column < this.rowColumnAmount; column++) {
                const key = generateKey(row, column);
                if (usedPositions.has(key)) continue;
    
                const { x, y } = this.sceneManager.getTilePositionByRowColumn(this.scene, row, column, this.tilesAmount, this.tileSize);
    
                const image_key = grassImages[Math.floor(Math.random() * grassImages.length)];
    
                let rowColumn = `${row}_${column}`;

                objects.push({ image_key, x, y, row, column, rowColumn});
            }
        }
    }
    
    getObject(level: integer, row: integer, column:integer) {
        let objects = gameState.backyardObjects.levels[level].objects;

        let backyardObject: BackyardObject = {
            column: -1,
            row: -1,
            image_key: "",
            x: 0,
            y: 0,
            rowColumn: `${row}_${column}`
        };

        for(let bObject of objects) {
            if (bObject.column === column && bObject.row === row) {
                backyardObject = bObject;
                break;
            }
        }

        return backyardObject;
    }

    putSecretKey() {
        gameState.backyardRowColumnAmount;
        let row = Phaser.Math.Between(0, gameState.backyardRowColumnAmount - 1);
        let column = Phaser.Math.Between(0, gameState.backyardRowColumnAmount - 1);

        gameState.secretKeyPosition = {row: row, column: column};
    }
}

