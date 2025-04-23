import Phaser from "phaser";
import { sceneManager } from "../services/SceneManager";
import { gameState } from "../core/GameState";
import { i18n } from "../services/i18nService";
import { messageToPlayer } from "../services/MessageToPlayerService";
import { UIButtonObject } from "../ui/UIButtonObject";
import { SoundScene } from "./SoundScene";

export class GymScene extends Phaser.Scene {
    soundScene!: SoundScene;
    statsTexts: Array<Phaser.GameObjects.Text> = [];
    buttons: Array<UIButtonObject> = [];

    constructor() {
        super("GymScene");
    }

    create() {
        this.soundScene = sceneManager.getSoundScene();

        this.createBackground();

        sceneManager.getBackButton(this);

        this.createButtons();
        this.createStats();
        
        sceneManager.getTextDescription(this, {textKey: "game.gym_description"});
    }

    createBackground() {
        this.add.image(640, 360, "gym_inside" )
            .setDepth(0)
            .setScale(1);
    }

    createButtons() {
        this.createButton(400, 450, "upgrade_move_points");
        this.createButton(640, 450, "upgrade_force");
        this.createButton(880, 450, "upgrade_intelligence");
    }

    createButton(x: number, y: number, type: string) {
        let movePointsCost = this.getMovePointsCost(type);
        let movePointsCostText = movePointsCost.toString();

        if (type === "upgrade_move_points" && gameState.movePointsMax >= 15) { movePointsCostText = "max";}else
        if (type === "upgrade_force" && gameState.playerForce >= 2) { movePointsCostText = "max";}else
        if (type === "upgrade_intelligence" && gameState.playerIntelligence >= 2) { movePointsCostText = "max";}

        let upgradeMovePointsButton = new UIButtonObject(this, {x: x, y: y, imageKey: type, textKey: movePointsCostText, textRelativeY: 75, textFontSize: 50});
        upgradeMovePointsButton.image.preFX?.addGlow();
            
        if (!this.skillCanBeTrained(type)) {
            upgradeMovePointsButton.image.setTint(0x000000, 0x000000, 0x000000, 0x000000);
            upgradeMovePointsButton.image.removeInteractive();
        }else{
            this.soundScene.createButtonSounds(upgradeMovePointsButton.image);
            
            upgradeMovePointsButton.image.on("pointerup", () => {
                this.onUpgradeAction(type);
            });
        }


        this.buttons.push(upgradeMovePointsButton);
    }

    skillCanBeTrained(type: string) {
        if (gameState.todayGymAlreadyUsed) {
            return false;
        }

        if (type === "upgrade_force") {
            if (gameState.playerForce >= 2) {
                return false;
            }
        }
        if (type === "upgrade_intelligence") {
            if (gameState.playerIntelligence >= 2) {
                return false;
            }
        }
        if (type === "upgrade_move_points") {
            if (gameState.movePointsMax >= 15) {
                return false;
            }
        }

        return true;
    }

    getMovePointsCost(type: string) {
        if (type === "upgrade_move_points") {
            return gameState.movePointsMax;
        }else
        if (type === "upgrade_force") {
            return 5 + 5 * gameState.playerForce;
        }else
        if (type === "upgrade_intelligence") {
            return 5 + 5 * gameState.playerIntelligence;
        }

        return 999999;
    }

    onUpgradeAction(type: string) {
        let result = true;
        if (type === "upgrade_force") {
            result = this.upgradeForce();
        }else
        if (type === "upgrade_intelligence") {
            result = this.upgradeIntelligence();
        }else
        if (type === "upgrade_move_points") {
            result = this.upgradeMovepoints();
        }

        if (result ) {
            gameState.todayGymAlreadyUsed = true;
        }

        this.redrawScene();
    }

    upgradeForce(): boolean {
        let movepointsToUpgrade = this.getMovePointsCost("upgrade_force");

        if (gameState.movePointsCurrent < movepointsToUpgrade) {
            messageToPlayer.send(this, "game.not_enough_move_points");
            return false;
        }

        gameState.playerForce++;
        gameState.playerHealtMax += 10;
        gameState.movePointsCurrent -= movepointsToUpgrade;
        return true;
    }

    upgradeIntelligence() {
        let movepointsToUpgrade = this.getMovePointsCost("upgrade_intelligence");

        if (gameState.movePointsCurrent < movepointsToUpgrade) {
            messageToPlayer.send(this, "game.not_enough_move_points");
            return false;
        }

        gameState.playerIntelligence++;
        gameState.movePointsCurrent -= movepointsToUpgrade;
        return true;
    }

    upgradeMovepoints() {
        let movepointsToUpgrade = this.getMovePointsCost("upgrade_move_points");

        if (gameState.movePointsCurrent < movepointsToUpgrade) {
            messageToPlayer.send(this, "game.not_enough_move_points");
            return false;
        }

        gameState.movePointsMax++;
        gameState.movePointsCurrent -= movepointsToUpgrade;
        return true;
    }

    createStats() {
        let playerMovePointsText = sceneManager.getText(this, {x: 50, y: 50, textKey: i18n.t("game.move_points") + " " + gameState.movePointsCurrent + "(" + gameState.movePointsMax + ")", originX: 0, originY: 0.5});
        this.statsTexts.push(playerMovePointsText);

        let playerHealth = sceneManager.getText(this, {x: 50, y: 100, textKey: i18n.t("game.health") + " " + gameState.playerHealt + "(" + gameState.playerHealtMax + ")", originX: 0, originY: 0.5});
        this.statsTexts.push(playerHealth);

        let playerForce = sceneManager.getText(this, {x: 50, y: 150, textKey: i18n.t("game.force") + " " + gameState.playerForce, originX: 0, originY: 0.5});
        this.statsTexts.push(playerForce);

        let playerIntelligence = sceneManager.getText(this, {x: 50, y: 200, textKey: i18n.t("game.intelligence") + " " + gameState.playerIntelligence, originX: 0, originY: 0.5});
        this.statsTexts.push(playerIntelligence);

    }

    deleteStats() {
        for (let stat of this.statsTexts) {
            stat.destroy();
        }

        this.statsTexts = [];
    }

    deleteButtons() {
        for (let button of this.buttons) {
            button.container.destroy();
        }

        this.buttons = [];
    }

    redrawScene() {
        this.deleteStats();
        this.deleteButtons();

        this.time.delayedCall(10, () => {
            this.createStats();
            this.createButtons();
        });
    }
}