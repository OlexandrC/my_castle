import Phaser from "phaser";
import { i18n } from "../services/i18nService";
import { UIButton } from "../ui/UIButton";
import { SceneConstruction } from "../types/SceneConstruction";
import { SoundScene } from "./SoundScene";
import { sceneManager } from "../services/SceneManager";

export class IntroScene extends Phaser.Scene {
    soundScene!: SoundScene;
    sceneConstructions: SceneConstruction[] = [];
    currentSceneConstruction?: SceneConstruction;
    currentSceneConstructionIndex: number = 0;
    buttonNext?: UIButton;

    constructor() {
        super("IntroScene");
    }

    init(data: { sceneConstructions: SceneConstruction[] }) {
        this.sceneConstructions = data.sceneConstructions;
        this.currentSceneConstructionIndex = 0;
        this.currentSceneConstruction = this.sceneConstructions[this.currentSceneConstructionIndex];
    }

    create() {
        this.soundScene = sceneManager.getSoundScene();

        this.createButtonNext();

        this.loadNextSceneConstruction();
    }

    createButtonNext() {
        let button = new UIButton(this, 1125, 675, i18n.t("menu.next"), "button");

        button.image.setDepth(50);

        this.soundScene.createButtonSounds(button.image);

        button.image.on("pointerup", () => {
            this.loadNextSceneConstruction();
        });
    }
    
    loadNextSceneConstruction() {
        if (this.currentSceneConstructionIndex >= this.sceneConstructions.length) {
            this.scene.start(this.currentSceneConstruction?.nextSceneOnFinish);
            return;
        }

        this.children.removeAll();
        this.createButtonNext();

        this.currentSceneConstruction = this.sceneConstructions[this.currentSceneConstructionIndex];
        
        this.currentSceneConstructionIndex++;

        this.add.image(640, 360, this.currentSceneConstruction.backgroundImage)
            .setOrigin(0.5)
            .setScale(1)
            .setDepth(0);

        if (this.currentSceneConstruction.text) {
            this.add.text(640, 550, this.currentSceneConstruction.text, {
                fontSize: "48px",
                color: "#ffffff",
                wordWrap: { width: 1000 },
                align: "center"
            })
                .setOrigin(0.5)
                .setStroke("#000", 25)
                .setDepth(50);
        }

        if (this.currentSceneConstruction.sound) {
            this.soundScene.play(this.currentSceneConstruction.sound);
        }
    }
}
