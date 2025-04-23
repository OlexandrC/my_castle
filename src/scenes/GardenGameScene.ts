import Phaser from "phaser";
import { sceneManager } from "../services/SceneManager";
import { gameState } from "../core/GameState";
import { i18n } from "../services/i18nService";
import { messageToPlayer } from "../services/MessageToPlayerService";

export class GardenGameScene extends Phaser.Scene {
    tileSize: number = 100;
    toPlantButtons: Array<Phaser.GameObjects.Image> = [];
    toPlantMovePoints: Array<Phaser.GameObjects.Text> = [];
    plantsOnTiles: Array<Phaser.GameObjects.Image> = [];
    tiles: Array<Phaser.GameObjects.Image> = [];
    movePointsText?: Phaser.GameObjects.Text;

    constructor() {
        super("GardenGameScene");
    }

    create() {
        this.createBackground();

        sceneManager.getBackButton(this);

        this.createGarden();

        sceneManager.getTextDescription(this, {textKey: "game.garden_description"});
    }

    createBackground() {
        this.add.image(640, 360, "game_garden_background" )
            .setDepth(0)
            .setScale(1);
    }

    createGarden() {
        let totalTiles = gameState.gardenCells.length;

        for (let i = 0; i < totalTiles; i++) {
            let {x, y} = sceneManager.getTilePositionByIndex(this, i, totalTiles, this.tileSize);
    
            this.drawCell(x, y, i);
        }

        this.createMovePoints();
    }

    createMovePoints() {
        let movePointsText = i18n.t("game.move_points") + ": " + gameState.movePointsCurrent;
        this.movePointsText = sceneManager.getText(this, {x: 50, y: 50, textKey: movePointsText, originX: 0, originY: 0.5});
    }

    drawCell(x: number, y: number, i: number) {
        this.drawCellBackground(x, y, i);

        const gardenCellPlantName = gameState.gardenCells[i];
        if (gardenCellPlantName) {
            let plantOnTile = this.add.image(x, y, gardenCellPlantName);
            plantOnTile.setDepth(50);
            this.plantsOnTiles.push(plantOnTile);
        }
    }

    drawCellBackground(x: number, y: number, i: number) {

        this.deleteToPlantButtons();

        let tile = this.add.image(x, y, this.getTileNameOfBackground())
            .setDepth(10)
            .setOrigin(0.5)
            .setScale(1);
        
        tile.preFX?.addGlow();

        tile.setInteractive();

        this.tiles.push(tile);

        sceneManager.getSoundScene().createButtonSounds(tile);

        tile.on("pointerup", () => {
            
            this.toPlantActions(i);
        });
    }

    toPlantActions(i: number) {
        this.deleteToPlantButtons();
        this.deleteToPlantMovePoints();

        this.drawToPlant(250, 250, i, "vegetables_on_earth", this.canBePlant("vegetables_on_earth"));
        this.drawToPlant(250, 350, i, "berries_on_earth", this.canBePlant("berries_on_earth"));
        this.drawToPlant(250, 450, i, "trees_on_earth", this.canBePlant("trees_on_earth"));

        this.createDeletePlantButton(i);
    }

    createDeletePlantButton(i: number) {
        let deleteButton = this.add.image(250, 550, "delete_tile");
        this.toPlantButtons.push(deleteButton);

        if (gameState.todayGardenAlreadyUsed) {
            deleteButton.setTint(0x000000, 0x000000, 0x000000, 0x000000);
        }else{
            deleteButton.setInteractive();
            sceneManager.getSoundScene().createButtonSounds(deleteButton);
            deleteButton.on("pointerup", () => {
                this.toDeletePlantAction(i);
            });
        }
    }

    canBePlant(type: string) {
        if (gameState.todayGardenAlreadyUsed) {
            return false;
        }

        if (type === "vegetables_on_earth") {
            return true;
        }else
        if (type === "berries_on_earth") {
            return gameState.playerIntelligence >=1;
        }else
        if (type === "trees_on_earth") {
            return gameState.playerIntelligence >= 2;
        }
        
        return true;
    }

    toDeletePlantAction(i: number) {
        this.deleteToPlantButtons();
        this.deleteToPlantMovePoints();

        if (gameState.movePointsCurrent < 1) {
            messageToPlayer.send(this, "game.not_enough_move_points");
            return;
        }
        if (gameState.gardenCells[i].length === 0) {
            messageToPlayer.send(this, "game.no_plants_to_delete");
            return;
        }

        gameState.gardenCells[i] = "";
        gameState.movePointsCurrent --;
        
        this.redrawScene();
    }

    deleteToPlantButtons() {
        for (let toPlantButton of this.toPlantButtons) {
            toPlantButton.destroy();
        }
        this.toPlantButtons = [];
    }

    deleteToPlantMovePoints() {
        for (let toPlantMovePoints of this.toPlantMovePoints) {
            toPlantMovePoints.destroy();
        }
        this.toPlantMovePoints = [];
    }

    deleteTiles() {
        for (let tile of this.tiles) {
            tile.destroy();
        }
        this.tiles = [];
    }

    deletePlantsOnTiles() {
        for (let plantOnTile of this.plantsOnTiles) {
            plantOnTile.destroy();
        }
        this.plantsOnTiles = [];

        gameState.todayGardenAlreadyUsed = true;
    }

    drawToPlant(x: number, y: number, i: number, type: string, isActive: boolean) {
        let plantButton = this.add.image(x, y, type).setDepth(10);

        let movePoints = "1";
        if (type === "berries_on_earth") { movePoints = "2"; }
        if (type === "trees_on_earth") { movePoints = "5"; }
        let toPlantMovePointText = sceneManager.getText(this, {x: x+100, y: y, textKey: movePoints});
        this.toPlantMovePoints.push(toPlantMovePointText);

        if (isActive) {
            plantButton.setInteractive();
        }else{
            plantButton.setTint(0x000000, 0x000000, 0x000000, 0x000000);
        }
    
        plantButton.on("pointerup", () => {
            this.toPlantAction(i, type);

        });
    
        sceneManager.getSoundScene().createButtonSounds(plantButton);
    
        plantButton.preFX?.addGlow();
    
        this.toPlantButtons.push(plantButton);
    }

    toPlantAction(i: number, type: string) {
        this.deleteToPlantButtons();
        this.deleteToPlantMovePoints();

        let isBuisyTile = gameState.gardenCells[i].length > 0;
        if (isBuisyTile) {
            messageToPlayer.send(this, "game.plant_exists");
            return;
        }

        let movePoints = 1;
        if (type === "berries_on_earth") { movePoints = 2; }
        if (type === "trees_on_earth") { movePoints = 5; }

        if (gameState.movePointsCurrent - movePoints < 0) {
            messageToPlayer.send(this, "game.not_enough_move_points");
            return;
        }

        gameState.movePointsCurrent -= movePoints;

        gameState.gardenCells[i] = type;

        gameState.todayGardenAlreadyUsed = true;

        this.redrawScene();
    }
    
    getTileNameOfBackground(): string {
        let tileNames = ["garden_tile_01", "garden_tile_02", "garden_tile_03", "garden_tile_04", "garden_tile_05"];
        return tileNames[Math.round(Math.random() * 4)];
    }

    deleteSceneObjects() {
        this.deleteTiles();
        this.deletePlantsOnTiles();
        this.deleteToPlantButtons();
        this.deleteToPlantMovePoints();

        this.movePointsText?.destroy();
    }

    redrawScene() {
        this.deleteSceneObjects();

        this.time.delayedCall(50, () => {
            this.createGarden();
        })
    }
}