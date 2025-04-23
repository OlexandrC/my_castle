import Phaser from "phaser";
import { sceneManager } from "../services/SceneManager";
import { UIButtonObject } from "../ui/UIButtonObject";
import { gameState } from "../core/GameState";
import { messageToPlayer } from "../services/MessageToPlayerService";
import { i18n } from "../services/i18nService";

export class CastleGameScene extends Phaser.Scene {
    statsTexts: Array<Phaser.GameObjects.Text> = [];
    chest!: UIButtonObject;
    letter!: UIButtonObject;

    constructor() {
        super("CastleGameScene");
    }

    create() {
        this.createBackground();

        sceneManager.getBackButton(this);

        this.createChest();

        this.createLetter();
        
        if (!gameState.secretKeyUsed) {
            sceneManager.getTextDescription(this, {textKey: "game.castle_description"});
        }
    }

    createBackground() {
        this.add.image(640, 360, "room" )
            .setDepth(0)
            .setScale(1);
    }

    createChest() {
        let imageKey = "chest";
        let posX = 450;
        let posY = 450;

        if (gameState.secretKeyUsed) { 
            imageKey = "chest_opened";
        }

        this.chest = new UIButtonObject(this, {
            x: posX, y: posY,
            imageOriginX: 0.5, imageOriginY: 1,
            imageKey: imageKey,
            imageScaleX: 1, imageScaleY: 1
        });

        this.chest.container.setDepth(100);
        this.chest.image.postFX.addGlow();

        sceneManager.getSoundScene().createButtonSounds(this.chest.image);

        this.chest.image.on("pointerup", () => {
            this.openChest();
        });
    }

    createLetter() {
        this.letter = new UIButtonObject(this, {
            x: 640, y: 360, 
            imageKey: "paper", 
            imageDepth: 200,
            imageOriginX: 0.5,
            imageOriginY: 0.5, 
            textKey: i18n.t("game.letter"),
            textOriginX: 0.5,
            textOriginY: 0.5,
            textFontSize: 30,
            textStrokeThickness: 10,
            textRelativeX: 0.5
        });

        this.letter.label?.setWordWrapWidth(500);
        this.letter.container.setDepth(200);
        this.letter.label?.setAlign("center");

        this.letter.image.setAlpha(0);
        this.letter.image.setActive(false);
        this.letter.label?.setAlpha(0);
        this.letter.label?.setActive(false);
        this.letter.image.removeInteractive();

        sceneManager.getSoundScene().createButtonSounds(this.letter.image);

        this.letter.image.on("pointerup", () => {
            this.hideLetter();
        });
    }

    showLetter() {
        let xOffset = 200;
        let duration = 2000;

        this.letter.image.x -= xOffset;
        this.letter.image.setScale(0);
        if (this.letter.label) {
            this.letter.label.x -= xOffset;
            this.letter.label.setScale(0);
        }

        this.tweens.add({
            targets: [this.letter.image, this.letter.label],
            alpha: 1,
            x: -50,
            scale: 1,
            duration: duration,
            repeat: 0,
            yoyo: false,
            onComplete: () => {
                this.letter.image.setActive(true);
                this.letter.label?.setActive(true);
                this.letter.image.setInteractive();
            }
        });

        this.tweens.add({
            targets: [this.letter.image, this.letter.label],
            duration: duration/2,
            y: -200,
            yoyo: true,
            ease: Phaser.Math.Easing.Sine.InOut
        });
        
    }

    hideLetter() {
        this.letter.image.setActive(false);
        this.letter.label?.setActive(false);
        this.letter.image.removeInteractive();

        this.tweens.add({
            targets: [this.letter.image, this.letter.label],
            alpha: 0,
            duration: 2000,
            repeat: 0,
            yoyo: false
        });

    }

    openChest() {

        sceneManager.getSoundScene().play("locked_door", {}, false);

        if (gameState.secretKeyUsed) {

            this.showLetter();
            return;
        }

        if (!gameState.secretKeyFound) {
            messageToPlayer.send(this, i18n.t("game.no_secret_key"));
            return;
        }else{
            gameState.secretKeyUsed = true;
            gameState.coins += 500;
            messageToPlayer.send(this, i18n.t("game.chest_opened") + " +500");

            this.chest.destroy();
            this.createChest();
            this.showLetter();
        }

    }
}