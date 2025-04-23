import { gameState } from "../core/GameState";
import { i18n } from "../services/i18nService";
import { sceneManager } from "../services/SceneManager";
import { UIButton } from "../ui/UIButton";

enum gameOverType {
    dead = "dead",
    left = "left",
    winForceFullOnly = "winForceFullOnly",
    winIntelligenceFullOnly = "winIntelligenceFullOnly",
    winFull = "winFull",
    disappointed = "disappointed",
    winSimple = "winSimple"
}

export class GameOverScene extends Phaser.Scene {
    gameOverType!: gameOverType;

    constructor() {
        super("GameOverScene");
    }

    create() {
        sceneManager.getSoundScene().stopAll(1000);

        this.setGameOverType();

        sceneManager.getSoundScene().play(this.getSoundKey(), {}, false);

        this.createImages();

        this.createExit();

        this.createDescription();

        this.createUIText();

    }

    setGameOverType() {
        this.gameOverType = gameOverType.disappointed;

        if (gameState.playerHealt <= 0) {
            this.gameOverType = gameOverType.dead;
        }else
        if (gameState.coins <= 0) {
            this.gameOverType = gameOverType.left;
        }else
        if (gameState.coins > gameState.taxWin) {
            this.gameOverType = gameOverType.winSimple;

            if (gameState.playerForce > 1 && gameState.playerIntelligence < 2) {
                this.gameOverType = gameOverType.winForceFullOnly;
            }else
            if (gameState.playerIntelligence > 1 && gameState.playerForce < 2) {
                this.gameOverType = gameOverType.winIntelligenceFullOnly;
            }else
            if (gameState.playerForce > 1 && gameState.playerIntelligence > 1) {
                this.gameOverType = gameOverType.winFull;
            }
        }


    }

    createImages() {

        this.createBG();

        this.createFloatingGameOver();
    }
    
    getImgaeBG(): string {
        let imageBG = "main_background";

        if (this.gameOverType === gameOverType.dead) {
            imageBG = "game_over_dani_dead"; 
        }else
        if (this.gameOverType === gameOverType.disappointed) {
            imageBG = "game_over_dani_disappointed"; 
        }else
        if (this.gameOverType === gameOverType.left) {
            imageBG = "game_over_dani_left"; 
        }else
        if (this.gameOverType === gameOverType.winForceFullOnly) {
            imageBG = "game_over_dani_winForceFullOnly"; 
        }else
        if (this.gameOverType === gameOverType.winFull) {
            imageBG = "game_over_dani_winFull"; 
        }else
        if (this.gameOverType === gameOverType.winIntelligenceFullOnly) {
            imageBG = "game_over_dani_winIntelligenceFullOnly"; 
        }else
        if (this.gameOverType === gameOverType.winSimple) {
            imageBG = "game_over_dani_winSimple"; 
        }
        
        return imageBG;
    }

    getSoundKey() {
        if (this.gameOverType === gameOverType.dead ||
            this.gameOverType === gameOverType.disappointed ||
            this.gameOverType === gameOverType.left
        ) {
            return "game_over_sad";
        }else {
            return "game_over_happy";
        }
    }
    
    createBG() {
        let imageBG = this.getImgaeBG();

        this.add.image(640, 360, imageBG).setScale(1).setDepth(0);
    }

    createFloatingGameOver() {
        let gameOver = this.add.image(640, 180, "game_over").setDepth(10);
        this.tweens.add({
            targets: gameOver,
            y: 150,
            scale: gameOver.scale * 0.75,
            yoyo: true,
            duration: 5000,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
    }

    createExit() {
        let exitButton = new UIButton(this, 640, 680, i18n.t("game.exit"), "button");
        sceneManager.getSoundScene().createButtonSounds(exitButton.image);
        
        exitButton.image.on("pointerup", () => {
            this.scene.stop();
            this.scene.start("MainMenuScene");
        });
    }

    createDescription() {
        let descriptionText = this.getDescriptionText();

        let description = sceneManager.getText(this, {
            x: 640, y: 480, textKey: descriptionText, originX: 0.5, align: "center"
        });
        
        description.setWordWrapWidth(1000);
    }

    getDescriptionText(): string {
        return "game.game_over_dani_" + this.gameOverType.toString();
    }

    createUIText() {

        sceneManager.getText(this, {x: 1240, y: 50, originX: 1, originY: 0.5, textKey: i18n.t("game.balance") + ": " + gameState.coins});

        sceneManager.getText(this, {x: 1240, y: 100, originX: 1, originY: 0.5, textKey: i18n.t("game.force") + ": " + gameState.playerForce});

        sceneManager.getText(this, {x: 1240, y: 150, originX: 1, originY: 0.5, textKey: i18n.t("game.intelligence") + ": " + gameState.playerIntelligence});
    }

}