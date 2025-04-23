import Phaser from "phaser";
import { i18n } from "../services/i18nService";
import { UIButton } from "../ui/UIButton";
import { SoundScene } from "./SoundScene";
import { sceneManager } from "../services/SceneManager";

export class LanguageSelectScene extends Phaser.Scene {
    soundScene!: SoundScene;

    constructor() {
        super("LanguageSelectScene");
    }

    create() {
        this.soundScene = sceneManager.getSoundScene();

        this.createBackground();

        this.createTitle();
        
        this.createLanguageButtons();

        // MainMenuScene
        sceneManager.getBackButton(this, "MainMenuScene");
    }

    createBackground() {
        this.add.image(640, 360, "main_background").setOrigin(0.5, 0.5).setScale(0.85).setDepth(0);
    }

    createTitle() {
        this.add.image(640, 100, "panel_1").setOrigin(0.5, 0.5).setScale(0.5, 0.1).setDepth(0);

        this.add.text(640, 100, i18n.t("menu.language"), {
                fontSize: "48px",
                color: "#ffffff",
            })
            .setOrigin(0.5)
            .setStroke("#ffffff", 5);
    }

    createButton(x: number, y: number, text: string, isCurrent: boolean): UIButton {

        let button = new UIButton(this, x, y, `${text.toUpperCase()} ${isCurrent ? "✓" : ""}`, "button");

        this.soundScene.createButtonSounds(button.image);

        return button;
    }

    createLanguageButtons() {
        const languages = i18n.getAvailableLanguages();
        const currentLang = i18n.getCurrentLang();

        let y = 200;
        let x = 500;
        let langCounter = 0;
        languages.forEach((langCode) => {
            langCounter++;
            if (langCounter > 8) {
                y = 200;
                x += 300;
                langCounter = 0;
            }

            const isCurrent = langCode === currentLang;

            let button = this.createButton(x, y, langCode, isCurrent);

            button.image.on("pointerup", () => {
                i18n.setLanguage(langCode);
                this.scene.stop();
                this.scene.start();
            });

            y += 60;
        });
    }

    createButtonBack() {
        let buttonBack = this.createButton(1100, 50, i18n.t('back'), false);

        buttonBack.image.on("pointerup", () => {
            this.scene.stop();

            this.scene.start("MainMenuScene");
        });
    }
}
