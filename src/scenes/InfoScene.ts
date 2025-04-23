import Phaser from "phaser";
import { i18n } from "../services/i18nService";
import { UIButton } from "../ui/UIButton";
import { sceneManager } from "../services/SceneManager";

export class InfoScene extends Phaser.Scene {

    private textIndex: number = 1;
    private textIndexMax: number = 6;

    private text?: Phaser.GameObjects.Text;
    private indexText?: Phaser.GameObjects.Text;

    constructor() {
        super("InfoScene");
    }

    create() {
        this.textIndexMax = i18n.getInfoKeysAmount();

        sceneManager.getBackButton(this, "MainMenuScene");

        this.add.image(640, 360, "main_background").setOrigin(0.5, 0.5).setScale(0.85).setDepth(0);

        this.setText();
        this.setIndexText();
        this.cretateButtons();

        this.events.on("shutdown", () => {
            this.textIndex = 1;
            this.text = undefined;
            this.indexText = undefined;
        });
    }
    
    setText() {
        if (this.text) {
            this.text.setText(i18n.t("info.text_" + this.textIndex));
        }else{
            this.text = sceneManager.getText(this, {x: 640, y: 100, textKey: "info.text_" + this.textIndex, originX: 0.5, originY: 0, fontSize: 30}).setDepth(100).setWordWrapWidth(1150).setAlign("center");

            this.add.image(640, 350, "panel_1").setScale(1.3, 0.8).setOrigin(0.5, 0.5).setDepth(10);
        }
    }

    cretateButtons() {
        let buttonNext = new UIButton(this, 1125, 675, i18n.t("menu.next"), "button");
        buttonNext.image.setDepth(50);
        buttonNext.image.on("pointerup", () => {
            this.showNextText();
        });
        sceneManager.getSoundScene().createButtonSounds(buttonNext.image);

        let buttonPrevious = new UIButton(this, 155, 675, i18n.t("menu.previous"), "button");
        buttonPrevious.image.setDepth(50);
        buttonPrevious.image.on("pointerup", () => {
            this.showPreviousText();
        });
        sceneManager.getSoundScene().createButtonSounds(buttonPrevious.image);
    }

    setIndexText() {
        if (this.indexText) {
            this.indexText.setText(this.textIndex + "/" + this.textIndexMax);
        }else{
            this.indexText = sceneManager.getText(this, {x: 640, y: 690, textKey: this.textIndex + "/" + this.textIndexMax, originX: 0.5, originY: 0.5}).setDepth(100);
        }
    }

    showNextText() {
        this.textIndex++;
        if (this.textIndex > this.textIndexMax) {
            this.textIndex = 1;
        }

        this.setText();
        this.setIndexText();
    }

    showPreviousText() {
        this.textIndex--;
        if (this.textIndex < 1) {
            this.textIndex = this.textIndexMax;
        }

        this.setText();
        this.setIndexText();
    }
}
