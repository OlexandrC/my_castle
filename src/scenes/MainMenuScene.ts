import Phaser from "phaser";
import { i18n } from "../services/i18nService";
import { UIButton } from "../ui/UIButton";
import { sceneManager } from "../services/SceneManager";
import { LevelService } from "../services/LevelService";
import { gameState } from "../core/GameState";

export class MainMenuScene extends Phaser.Scene {
    levelService!: LevelService;

    constructor() {
        super("MainMenuScene");
    }

    create() {

        gameState.reset();
        
        sceneManager.getSoundScene().stopAll(1000);

        this.levelService = new LevelService(this);

        this.createButtons();
        this.createImages();
        this.createAudio();

        // let quickTestButton = this.add.image(640, 400, "button").setDepth(50).setScale(0.5).setInteractive();
        // quickTestButton.on("pointerup", () => {
        //     // gameState.secretKeyFound = true;
        //     i18n.setLanguage('uk');
        //     // this.scene.stop();
        //     // this.scene.start("CastleGameScene");
        //     // return;

        //     // this.scene.stop();
        //     // this.scene.start("GameOverScene");
        //     // return;

        //     gameState.movePointsCurrent = 500;
        //     gameState.playerHealt = 500;

        //     for (let i = 0; i < 8; i++) {

        //         gameState.gardenCells[i] = "trees_on_earth";
        //     }

        //     this.levelService.generateLevels();
        //     gameState.secretKeyPosition = {row: 0, column: 0};
        //     gameState.secretKeyFound = true;

        //     this.scene.stop();
        //     this.scene.start("BackyardScene", {level: 4});

        //     // sceneManager.getSoundScene().playQueue(["fist_battle_1", "fist_battle_2", "fist_battle_4"]);
        // })
    }

    createButtons() {
        let xOffset = 200;
        let yOffset = 200;

        let playButton = this.createButton(i18n.t("menu.play"), xOffset, 260 + yOffset, "button");
        let settingsButton = this.createButton(i18n.t("menu.settings"), xOffset, 320 + yOffset, "button");
        let langButton = this.createButton(i18n.t("menu.language"), xOffset, 380 + yOffset, "button");
        let infoButton = this.createButton(i18n.t("menu.info"), xOffset, 440 + yOffset, "button");

        playButton.image.on("pointerup", () => {
            this.scene.stop();

            this.levelService.generateLevels();
            // gameState.reset();

            this.scene.start("IntroScene", {
                sceneConstructions: sceneManager.getIntroSceneConstructions()
            });
        });

        settingsButton.image.on("pointerup", () => {
            this.scene.stop();
            this.scene.start("ConfigScene", {backScene: "MainMenuScene"});
        });

        langButton.image.on("pointerup", () => {
            this.scene.stop();
            this.scene.launch("LanguageSelectScene");
        });

        infoButton.image.on("pointerup", ()=> {
            this.scene.stop();
            this.scene.start("InfoScene");
        });
    }

    createImages() {
        this.add.image(640, 360, "main_background").setOrigin(0.5, 0.5).setScale(0.85).setDepth(0);

        let logo = this.add.image(640, 150, "my_castle_logo").setOrigin(0.5, 0.5).setScale(0.3).setDepth(10);

        this.tweens.add({
            targets: logo,
            y: 100,
            ease: "Sine.easeInOut",
            duration: 5000,
            yoyo: true,
            repeat: -1,
        });
    }

    createAudio() {
        sceneManager.getSoundScene().play("main_menu_01", {}, false);
    }

    createButton(text: string, x: number, y: number, bgKey: string): UIButton {
        const button = new UIButton(this, x, y, text, bgKey);
    
        sceneManager.getSoundScene().createButtonSounds(button.image)
    
        return button;
    }
    
}
