import Phaser from "phaser";
import { sceneManager } from "../services/SceneManager";
import { gameState } from "../core/GameState";
import { i18n } from "../services/i18nService";
import { messageToPlayer } from "../services/MessageToPlayerService";
import { BackyardObject, LevelService } from "../services/LevelService";
import { ItemService } from "../services/ItemService";
import { UIButton } from "../ui/UIButton";
import { uiGrid } from "../ui/UIGrid";

export class BackyardScene extends Phaser.Scene {
    levelService!: LevelService;
    itemService!: ItemService;

    tiles: Array<Phaser.GameObjects.Image> = [];
    movePointsText?: Phaser.GameObjects.Text;
    levelText?: Phaser.GameObjects.Text;
    healthText?: Phaser.GameObjects.Text;

    player!: Phaser.GameObjects.Container;
    playerPositionRowColumn: { row: number; column: number, x: number, y: number } = { row: 0, column: 0 , x: 0, y: 0};
    playerTargetPosition: {x: number, y: number} = {x: 0, y: 0};

    backyardObjectImages: Array<{rowColumn: string, image: Phaser.GameObjects.Image}> = [];

    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd!: any;
    level: integer = 0;

    playerMoveAnimationDuration: number = 1000;

    lastPlayerMoveTime = Date.now();
    playerMovementIsAnimating = false;

    depth = {
        background: 0,
        tile: 10,
        tileObject: 20,
        player: 50,
        item_armor: 60,
        item_helmet: 70,
        item_sword: 80,
        ui: 1000,
    }

    constructor() {
        super("BackyardScene");
    }

    init(data: { level: number }) {
        this.level = data.level ?? 0;
        this.playerMovementIsAnimating = false;
    }

    create() {
        this.levelService = new LevelService(this);
        this.itemService = new ItemService();

        this.createInputs();

        this.createPlayer();

        this.createBackground();

        sceneManager.getBackButton(this);

        this.setMovePointsText();
        this.setLevelText();
        this.setHealthText();

        this.createTiles();
        this.createWall();
        this.createObjects();

        this.createMoveButtons();

        sceneManager.getTextDescription(this, {textKey: "game.backyard_description"});

        this.events.on("shutdown", () => {
            this.tiles = [];
            this.backyardObjectImages = [];
        });
    }

    createInputs() {
        if (!this.input.keyboard) {
            console.warn("Keyboard input is not available.");
            return;
        }
    
        this.cursors = this.input.keyboard.createCursorKeys();
    
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    createPlayer() {
        this.playerPositionRowColumn.column = 0;
        this.playerPositionRowColumn.row = Math.floor(gameState.backyardRowColumnAmount/2.0);

        let {x, y} = sceneManager.getTilePositionByRowColumn(this, this.playerPositionRowColumn.row, this.playerPositionRowColumn.column, gameState.backyardTilesAmount, gameState.backyardTileSize);
        this.playerPositionRowColumn.x = this.playerTargetPosition.x = x;
        this.playerPositionRowColumn.y = this.playerTargetPosition.y = y;

        let container = this.add.container(x, y);
        container.setDepth(this.depth.player);

        let image = this.add.image(0, 0, "player_100");

        container.add(image);

        this.cameras.main.startFollow(container, true, 0.05, 0.05);

        this.player = container;

        this.addPlayerItems();
    }

    addPlayerItems() {
        if (this.itemService.itemAlreadyExists_Includes("item_boots")) {
            this.player.add(
                this.add.image(0, 40, "item_boots_on").setScale(0.5, 0.3)
            );
        }
        if (this.itemService.itemAlreadyExists_Includes("item_armor")) {
            this.player.add(
                this.add.image(0, 17, "item_armor_on").setScale(0.5, 0.45)
            );
        }
        if (this.itemService.itemAlreadyExists_Includes("item_helmet")) {
            this.player.add(
                this.add.image(1, -25, "item_helmet_on").setScale(0.8, 0.6)
            );
        }
        if (this.itemService.itemAlreadyExists_Includes("item_gloves")) {
            this.player.add(
                //right
                this.add.image(20, 25, "item_gloves").setScale(0.2).setRotation(0.3)
            );
            this.player.add(
                //left
                this.add.image(-19, 25, "item_gloves").setScale(0.2, 0.2).setRotation(0.7)
            );
        }

        if (this.itemService.itemAlreadyExists_Includes("item_sword")) {
            this.player.add(
                this.add.image(30, 0, "item_sword").setScale(0.5).setRotation(-0.5)
            );
        }
        if (this.itemService.itemAlreadyExists_Includes("item_shield")) {
            this.player.add(
                this.add.image(-20, 20, "item_shield").setScale(0.5).setRotation(-0.5)
            );
        }
    }

    createBackground() {
        this.add.image(640, 360, "game_garden_background" )
            .setDepth(this.depth.background)
            .setScale(1)
            .setScrollFactor(0);
    }

    createTiles() {
        this.add.image(640, 360, "game_yard_tiles" )
            .setDepth(this.depth.background)
            .setScale(1.81)
            .setScrollFactor(1);

        uiGrid.drawGridOverlay({
            scene: this,
            x: 640,
            y: 360,
            cellWidth: gameState.backyardTileSize,
            cellHeight: gameState.backyardTileSize,
            rows: gameState.backyardRowColumnAmount,
            cols: gameState.backyardRowColumnAmount,
            color: 0xffffff,
            alpha: 0.2});
    }

    createWall() {
        let gate1: {column: number, row: number} = {row: Math.floor(gameState.backyardRowColumnAmount/2.0), column: -1};
        let gate2: {column: number, row: number} = {row: Math.floor(gameState.backyardRowColumnAmount/2.0), column: gameState.backyardRowColumnAmount};

        for (let rowIndex = -1; rowIndex < gameState.backyardRowColumnAmount + 1; rowIndex++) {
            for (let columnIndex = -1; columnIndex < gameState.backyardRowColumnAmount + 1; columnIndex++) {
                let {x, y} = sceneManager.getTilePositionByRowColumn(this, rowIndex, columnIndex, gameState.backyardTilesAmount, gameState.backyardTileSize);

                let canDraw = () => {
                    if (rowIndex === -1) { return true; };
                    if (rowIndex === gameState.backyardRowColumnAmount) { return true; };

                    if (columnIndex === -1) { return true; };
                    if (columnIndex === gameState.backyardRowColumnAmount) { return true; };

                    return false;
                }

                if (!canDraw()) { continue; }

                let image = "backyard_wall";
                if (rowIndex === gate2.row && columnIndex === gate2.column) {
                    image = "backyard_gate";
                }
                if (rowIndex === gate1.row && columnIndex === gate1.column) {
                    image = "backyard_gate_closed";
                }

                this.add.image(x, y, image).setDepth(this.depth.tile);
            }
        }
    }

    createObjects() {
        for(let object of gameState.backyardObjects.levels[this.level].objects) {
            let {x, y} = sceneManager.getTilePositionByRowColumn(this, object.row, object.column, gameState.backyardTilesAmount, gameState.backyardTileSize);

            let image = this.add.image(x, y, object.image_key).setDepth(this.depth.tileObject);

            this.backyardObjectImages.push({rowColumn: object.rowColumn, image: image});

            this.setEnemyAnimation(image, object);
        }
    }

    createMoveButtons() {
        let posX = 200;
        let posY = 300;

        let buttonUp = this.createMoveButton(posX, posY, "w↑");
        let buttonDown = this.createMoveButton(posX, posY + 80, "s↓");
        let buttonLeft = this.createMoveButton(posX - 80, posY + 80, "←a");
        let buttonRight = this.createMoveButton(posX + 80, posY + 80, "d→");

        buttonUp.image.on("pointerup", () => {
            this.movePlayer({targetRow: this.playerPositionRowColumn.row - 1});
        });
        buttonDown.image.on("pointerup", () => {
            this.movePlayer({targetRow: this.playerPositionRowColumn.row + 1});
        });
        buttonLeft.image.on("pointerup", () => {
            this.movePlayer({targetColumn: this.playerPositionRowColumn.column - 1});
        });
        buttonRight.image.on("pointerup", () => {
            this.movePlayer({targetColumn: this.playerPositionRowColumn.column + 1});
        });

    }

    createMoveButton(x: number, y: number, text: string): UIButton {
        let button = new UIButton(this, x, y, text, "button");

        button.container.setDepth(100).setScrollFactor(0);
        button.image.setScale(0.08, 0.15);
        
        sceneManager.getSoundScene().createButtonSounds(button.image);


        return button;
    }

    setEnemyAnimation(image: Phaser.GameObjects.Image, object: {    image_key: string;
        x: number;
        y: number;
        row: number;
        column: number;}) {
        if (object.image_key.includes("backyard_enemy_2")) {
            this.tweens.add({
                targets: image,
                y: image.y + Phaser.Math.Between(-20, 20),
                yoyo: true,
                repeat: -1,
                duration: Phaser.Math.Between(1000, 3000)
            });
        }

        if (object.image_key.includes("backyard_enemy_3") || object.image_key.includes("backyard_enemy_1")) {
            let xDiff = Phaser.Math.Between(-20, 20);
            let direction = Math.sign(xDiff); // -1 або 1
        
            image.scaleX = Math.abs(image.scaleX) * direction;
        
            let isFlipped = true;
        
            this.tweens.add({
                targets: image,
                x: image.x + xDiff,
                yoyo: true,
                repeat: -1,
                duration: Phaser.Math.Between(1000, 3000),
                onYoyo: () => {
                    isFlipped = !isFlipped;
                    image.scaleX = Math.abs(image.scaleX) * (isFlipped ? -direction : direction);
                },
                onRepeat: () => {
                    isFlipped = !isFlipped;
                    image.scaleX = Math.abs(image.scaleX) * (isFlipped ? -direction : direction);
                }
            });
        }
        
    }

    setMovePointsText() {
        let movePointsText = i18n.t("game.move_points") + ": " + gameState.movePointsCurrent;

        this.movePointsText?.destroy();

        this.time.delayedCall(10, () => {
            this.movePointsText = sceneManager.getText(this, {x: 50, y: 50, textKey: movePointsText, originX: 0, originY: 0.5});

            this.movePointsText.setDepth(this.depth.ui);
        });

    }

    setLevelText() {
        let levelText = i18n.t("game.level") + ": " + this.level;

        this.levelText?.destroy();

        this.time.delayedCall(10, () => {
            this.levelText = sceneManager.getText(this, {x: 50, y: 100, textKey: levelText, originX: 0, originY: 0.5});
    
            this.levelText.setDepth(this.depth.ui);
        });
    }

    setHealthText() {
        let healthText = i18n.t("game.health") + ": " + gameState.playerHealt;

        this.healthText?.destroy();

        this.time.delayedCall(10, () => {
            this.healthText = sceneManager.getText(this, {x: 50, y: 150, textKey: healthText, originX: 0, originY: 0.5});
            this.healthText.setDepth(this.depth.ui);
        });
    }

    isPlayerMoving() {
        return (Math.abs(this.player.x - this.playerPositionRowColumn.x) > 1 ||
            Math.abs(this.player.y - this.playerPositionRowColumn.y) > 1);
    }

    update() {
        if (!this.player) { return; }

        if ((this.player.x !== this.playerTargetPosition.x || this.player.y !== this.playerTargetPosition.y) && !this.playerMovementIsAnimating) {
            this.playerMovementIsAnimating = true;
            this.tweens.add({
                targets: this.player,
                x: this.playerTargetPosition.x,
                y: this.playerTargetPosition.y,
                duration: this.playerMoveAnimationDuration,
                ease: Phaser.Math.Easing.Sine.InOut,
                onComplete: () => {
                    this.playerMovementIsAnimating = false;
                }
            });
        }

        if (this.isPlayerMoving()) { return; }

        this.changeLevel();

        if (this.cursors.left?.isDown || this.wasd.left?.isDown) {
            this.movePlayer({targetColumn: this.playerPositionRowColumn.column - 1});
        }
        if (this.cursors.right?.isDown || this.wasd.right?.isDown) {
            this.movePlayer({targetColumn: this.playerPositionRowColumn.column + 1});
        }
        if (this.cursors.up?.isDown || this.wasd.up?.isDown) {
            this.movePlayer({targetRow: this.playerPositionRowColumn.row - 1});
        }
        if (this.cursors.down?.isDown || this.wasd.down?.isDown) {
            this.movePlayer({targetRow: this.playerPositionRowColumn.row + 1});
        }

    }

    changeLevel() {
        if (this.playerPositionRowColumn.column === gameState.backyardRowColumnAmount - 1 && this.playerPositionRowColumn.row === Math.floor(gameState.backyardRowColumnAmount/2.0)) {
            if (this.level < gameState.backyardObjects.levels.length - 1) {
                this.scene.restart({level: this.level + 1});
            }else{
                this.scene.restart({level: 0});
            }
        }
    }

    /** once on player move */ 
    movePlayer(target: {targetRow?: number, targetColumn?: number}) {
        if (Date.now() - this.lastPlayerMoveTime < this.playerMoveAnimationDuration ) {  return; }
        this.lastPlayerMoveTime = Date.now();

        const {
            targetRow = this.playerPositionRowColumn.row,
            targetColumn = this.playerPositionRowColumn.column
        } = target;

        this.flipPLayer(target);

        let result = this.canPlayerMove(targetRow, targetColumn);
        if (result.length > 0) {
            messageToPlayer.send(this, result);
            sceneManager.getSoundScene().play(Phaser.Utils.Array.GetRandom(["no_1", "no_2", "no_3"]), {}, false);
            return;
        }

        this.playerPositionRowColumn.row = targetRow;
        this.playerPositionRowColumn.column = targetColumn;

        this.notrmilizePlayerRowColumn();

        this.playerTargetPosition = sceneManager.getTilePositionByRowColumn(this, this.playerPositionRowColumn.row, this.playerPositionRowColumn.column, gameState.backyardTilesAmount, gameState.backyardTileSize);
        
        this.playerPositionRowColumn.x = this.playerTargetPosition.x;
        this.playerPositionRowColumn.y = this.playerTargetPosition.y;
        
        gameState.movePointsCurrent--;

        this.setMovePointsText();
        this.playWalkSound();

        this.secretKey(this.playerPositionRowColumn.row, this.playerPositionRowColumn.column);

        this.resolveCollision(this.playerPositionRowColumn.row, this.playerPositionRowColumn.column);

    }

    flipPLayer(target: {targetRow?: number, targetColumn?: number}) {
        if (!target.targetColumn) { return; }

        let flipX = -1
        if (this.playerPositionRowColumn.column < target.targetColumn) { 
            flipX = 1;
            this.player.setScale(Math.abs(this.player.scaleX) * flipX, this.player.scaleY);
        }else
        if (this.playerPositionRowColumn.column > target.targetColumn) {
            this.player.setScale(Math.abs(this.player.scaleX) * flipX, this.player.scaleY);
        }

    }

    resolveCollision(targetRow: number, targetColumn: number) {
        let levelObject = this.levelService.getObject(this.level, targetRow, targetColumn);

        let defence = this.getDefence();
        let damage = this.getDamage(levelObject.image_key);
        
        gameState.playerHealt -= Math. max(0, (damage - defence));
        this.setHealthText();

        if (gameState.playerHealt <= 0) {
            sceneManager.getSoundScene().stopAll();
            this.scene.stop();
            this.scene.start("GameOverScene");
        }
        
        let bonuseMessage = this.addBonuse(levelObject);

        let message = this.getMessage(levelObject.image_key);

        messageToPlayer.send(this, 
            i18n.t(message) + " " + 
            i18n.t(bonuseMessage));

        this.destroyObject(levelObject);

    }

    destroyObject(levelObject: BackyardObject) {
        gameState.backyardObjects.levels[this.level].objects = gameState.backyardObjects.levels[this.level].objects.filter(o => o.rowColumn !== `${levelObject.row}_${levelObject.column}`);

        this.backyardObjectImages.find(o => o.rowColumn === `${levelObject.row}_${levelObject.column}`)?.image.destroy();
        this.backyardObjectImages = this.backyardObjectImages.filter(o => o.rowColumn !== `${levelObject.row}_${levelObject.column}`);

        this.soundOnDestroyObject(levelObject);
    }

    soundOnDestroyObject(levelObject: BackyardObject) {

        let battleAudio = [];

        if (this.itemService.itemAlreadyExists_Includes("sword")) {
            if (Math.random() > 0.5) {
                battleAudio.push("sword_battle_start");
            }
            for (let soundsAmount = 0; soundsAmount <= Phaser.Math.Between(1,2); soundsAmount++) {
                battleAudio.push(Phaser.Utils.Array.GetRandom(["sword_battle_1", "sword_battle_2", "sword_battle_3"]));
            }
        }else{
            for (let soundsAmount = 0; soundsAmount <= Phaser.Math.Between(1, 2); soundsAmount++) {
                battleAudio.push(Phaser.Utils.Array.GetRandom(["fist_battle_1", "fist_battle_2", "fist_battle_4"]));
            }
        }

        if (levelObject.image_key.includes("enemy")) {
            sceneManager.getSoundScene().playQueue(battleAudio);
        }
        
    }

    getDefence(): number {
        let helmetDefence = this.itemService.itemAlreadyExists_Includes("helmet") ? 1 : 0;
        let armorDefence = this.itemService.itemAlreadyExists_Includes("armor") ? 3 : 0;
        let bootsDefence = this.itemService.itemAlreadyExists_Includes("boots") ? 1 : 0;

        let glovesDefence = this.itemService.itemAlreadyExists_Includes("gloves") ? 1 : 0;
        let shieldDefence = this.itemService.itemAlreadyExists_Includes("shield") ? 3 : 0;
        let swordDefence = this.itemService.itemAlreadyExists_Includes("sword") ? 1 : 0;

        return helmetDefence + armorDefence + bootsDefence + glovesDefence + shieldDefence + swordDefence;
    }

    getDamage(type: string): number {
        if (type.includes("grass")) {
            return Phaser.Math.Between(1, 5);
        }
        if (type.includes("stone")) {
            return Phaser.Math.Between(1, 10);
        }
        if (type.includes("enemy")) {
            return Phaser.Math.Between(11, 15);
        }

        return 0;
    }

    getMessage(type: string): string {
        if (type.includes("grass")) {
            return "game.plant_was_destroyed";
        }
        if (type.includes("stone")) {
            return "game.stone_was_destroyed";
        }
        if (type.includes("enemy")) {
            return "game.enemy_was_defeated";
        }
        if (type.includes("treasure")) {
            return "game.treasure_was_found";
        }

        return "";
    }

    addBonuse(levelObject: BackyardObject): string {
        let coins = 0;
        if (levelObject.image_key.includes("grass")) {
            coins = Phaser.Utils.Array.GetRandom([0,0,0,0,1]);
        }
        if (levelObject.image_key.includes("stone")) {
            coins = Phaser.Utils.Array.GetRandom([0,0,0,0,1]);
        }
        if (levelObject.image_key.includes("enemy")) {
            coins = Phaser.Utils.Array.GetRandom([0,1,2,3]);
        }
        if (levelObject.image_key.includes("treasure")) {
            coins = Phaser.Utils.Array.GetRandom([1,2,3,4,5]);
        }

        gameState.coins += coins;
        if (coins > 0) {
            let coinImage = this.add.image(levelObject.x, levelObject.y, "coin").setDepth(100).setScale(0.5);

            sceneManager.getSoundScene().play(
                Phaser.Utils.Array.GetRandom(["coin_1", "coin_2"]),
                {volume: 0.5},
                false
            )

            this.tweens.add({
                targets: coinImage,
                y: coinImage.y - 100,
                alpha: 0,
                duration: this.playerMoveAnimationDuration,
                onComplete: () => {
                    coinImage.destroy();
                }
            });
        }

        return coins > 0 ? "+" + coins.toString() : "";
    }

    notrmilizePlayerRowColumn() {
        if (this.playerPositionRowColumn.row <= 0) { this.playerPositionRowColumn.row = 0; } //up restriction

        if (this.playerPositionRowColumn.column <= 0) { this.playerPositionRowColumn.column = 0; } // left restriction

        if (this.playerPositionRowColumn.row > gameState.backyardRowColumnAmount - 1) { this.playerPositionRowColumn.row = gameState.backyardRowColumnAmount - 1; } // down restriction

        if (this.playerPositionRowColumn.column > gameState.backyardRowColumnAmount - 1) { this.playerPositionRowColumn.column = gameState.backyardRowColumnAmount - 1; } // right restriction
    }

    /** returns description why player can not move */
    canPlayerMove(targetRow: number, targetColumn: number): string {
        if (gameState.movePointsCurrent <= 0) {
            return "game.not_enough_move_points";
        }

        let backyardObject = this.levelService.getObject(this.level, targetRow, targetColumn);

        if (backyardObject.image_key.includes('stone') && gameState.playerForce < 1) { return "game.not_enough_force";}

        return "";
    }

    secretKey(targetRow: number, targetColumn: number) {
        if (gameState.secretKeyFound) { return; }
        if (this.level !== 2) { return; }

        if (gameState.secretKeyPosition.column === targetColumn &&
            gameState.secretKeyPosition.row ===
            targetRow
        ){
            gameState.secretKeyFound = true;

            this.time.delayedCall(500, () => {
                sceneManager.getSoundScene().play("magic_1", {}, false);

                let pos = sceneManager.getTilePositionByRowColumn(this, targetColumn, targetRow, gameState.backyardTilesAmount, gameState.backyardTileSize)
    
                let keyImage = this.add.image(pos.x, pos.y, "key").setDepth(100).setScale(0.5);
    
                this.tweens.add({
                    targets: keyImage,
                    y: keyImage.y - 100,
                    alpha: 0,
                    angle: 360,
                    duration: 5000,
                    onComplete: () => {
                        keyImage.destroy();
                    }
                });

                messageToPlayer.send(this, "game.secret_key_found");
            });

        }
    }

    playWalkSound() {
        let walkSounds = ["walk_01", "walk_02", "walk_03", "walk_04", "walk_05"];
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                const randomSound = walkSounds[Math.floor(Math.random() * walkSounds.length)];
                sceneManager.getSoundScene().play(randomSound, {}, false);
            }, i * 300);
        }
    }

    drawTileBackground(x: number, y: number) {

        let tile = this.add.image(x, y, this.getTileNameOfBackground())
            .setDepth(10)
            .setOrigin(0.5)
            .setScale(1);
        
        tile.preFX?.addGlow();

        this.tiles.push(tile);
    }

    getTileNameOfBackground(): string {
        let tileNames = ["garden_tile_01", "garden_tile_02", "garden_tile_03", "garden_tile_04", "garden_tile_05"];
        return tileNames[Math.round(Math.random() * 4)];
    }
}