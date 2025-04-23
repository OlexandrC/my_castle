import Phaser from "phaser";
import { i18n } from "../services/i18nService";
import { UIButton } from "../ui/UIButton";
import { sceneManager } from "../services/SceneManager";
import { gameState } from "../core/GameState";

export class ConfigScene extends Phaser.Scene {

    volumeText?: Phaser.GameObjects.Text;

    backScene: string = "MainMenuScene";

    constructor() {
        super("ConfigScene");
    }

    init(data: {backScene: string}) {
        if (data.backScene) {
            this.backScene = data.backScene;
        }
    }

    create() {
        this.createBackground();

        this.createPanel();
        this.createButtonsVolume();

        sceneManager.getBackButton(this, this.backScene);
    }

    createBackground() {
        this.add.image(640, 360, "main_background").setOrigin(0.5, 0.5).setScale(0.85).setDepth(0);
    }

    createPanel() {

        this.add.image(640, 200, "panel_1").setOrigin(0.5, 0.5).setScale(0.8, 0.15).setDepth(0);

        this.add.text(320, 200, i18n.t("game.sound_volume"), {
                fontSize: "48px",
                color: "#ffffff",
            })
            .setOrigin(0, 0.5)
            .setStroke("#ffffff", 5)
            .setWordWrapWidth(100)
            .setAlign("center");


        // this.add.image(250, 300, "panel_1").setOrigin(0.5, 0.5).setScale(0.5, 0.15).setDepth(0);

        // this.add.text(250, 300, i18n.t("menu.sound_volume_fx"), {
        //         fontSize: "48px",
        //         color: "#ffffff",
        //     })
        //     .setOrigin(0.5, 0.5)
        //     .setStroke("#ffffff", 5)
        //     .setWordWrapWidth(100)
        //     .setAlign("center");
    }

    createButtonsVolume() {
        let buttonMinus = new UIButton(this, 700, 200, "-", "button"); 
        buttonMinus.image.setScale(0.1, 0.1);
        sceneManager.getSoundScene().createButtonSounds(buttonMinus.image);
        buttonMinus.image.on("pointerup", ()=> {
            gameState.soundVolume = Math.max(0, Phaser.Math.RoundTo(gameState.soundVolume - 0.1, -1));
            this.setVolumeText();
        });

        let buttonPlus = new UIButton(this, 800, 200, "+", "button"); 
        buttonPlus.image.setScale(0.1, 0.1);
        sceneManager.getSoundScene().createButtonSounds(buttonPlus.image);
        buttonPlus.image.on("pointerup", ()=> {
            gameState.soundVolume = Math.min(1, Phaser.Math.RoundTo(gameState.soundVolume + 0.1, -1));
            this.setVolumeText();
        });

        this.setVolumeText();

    }

    setVolumeText() {
        let text = (gameState.soundVolume * 100).toString() + "%";

        if (!this.volumeText || !this.volumeText.scene) {
            this.volumeText = sceneManager.getText(this, {x: 920, y: 200, textKey: text}).setDepth(100);
        }else{
            this.volumeText.setText(text);
        }

        this.sound.setVolume(gameState.soundVolume);
    }
}
