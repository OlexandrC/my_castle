import Phaser from "phaser";
import { i18n } from "../services/i18nService";
import { UIButtonObject } from "../ui/UIButtonObject";
import { UIButton } from "../ui/UIButton";
import { SoundScene } from "./SoundScene";
import { sceneManager } from "../services/SceneManager";
import { gameState } from "../core/GameState";
import { imageService } from "../services/ImageService";
import { messageToPlayer } from "../services/MessageToPlayerService";

export class BaseGameScene extends Phaser.Scene {
    soundScene!: SoundScene;

    uiButtons: Array<UIButtonObject> = [];
    uiLocations: Array<UIButtonObject> = [];
    uiBackground!: Phaser.GameObjects.Image;
    uiBackgroundFront!: Phaser.GameObjects.Image;

    imagesStars: Array<Phaser.GameObjects.Image> = [];
    imageSun?: Phaser.GameObjects.Image;
    imageMoon?: Phaser.GameObjects.Image;
    orbitContainer?: Phaser.GameObjects.Container;

    uiTexts: Array<Phaser.GameObjects.Text> = [];

    constructor() {
        super("BaseGameScene");
    }

    create() {
        this.soundScene = sceneManager.getSoundScene();

        this.createImages();

        this.createLocations();

        this.createButtons();

        this.createUIText();

        this.events.on("shutdown", () => {
            this.uiLocations = [];
            this.uiButtons = [];
            this.uiTexts = [];
        });
    }

    createImages() {
        this.createImageBackground();

        this.orbitContainer = this.add.container(640, 360).setDepth(5);
        this.createImageSun();
        this.createImageMoon();
        this.createImageStars();
    }

    createImageBackground() {
        let main = this.add.image(640, 360, "game_main_background" )
            .setScale(0.85)
            .setDepth(0);

        let main_front = this.add.image(640, 360, "game_main_background_front" )
            .setScale(0.85)
            .setDepth(10);

        this.uiBackground = main;
        this.uiBackgroundFront = main_front;
    }

    createImageSun() {
        this.imageSun = this.add.image(0, -400, "sun");
        this.orbitContainer?.add(this.imageSun);
    }

    createImageMoon() {
        this.imageMoon = this.add.image(0, 400, "moon").setAlpha(1);
        this.orbitContainer?.add(this.imageMoon);
    }

    createImageStars() {
        for (let i = 0; i < 30; i++) {
            let y = Phaser.Math.Between(10, 200);
            let scale = Math.min(0.75, 50 / y);

            let x = Phaser.Math.Between(50, 1230);

            let imageKey = Phaser.Utils.Array.GetRandom(["star_1", "star_2", "star_3"]);
            this.imagesStars.push(this.add.image(x, y, imageKey).setScale(scale).setDepth(3).setAlpha(0));
        }
    }

    createLocations() {
        let castleButton = new UIButtonObject(this, {x: 640, y: 250, imageKey: "game_castle", imageScaleX: 1, imageScaleY: 1, imageDepth: 20});
        this.soundScene.createButtonSounds(castleButton.image);
        this.addGlow(castleButton.image);
        castleButton.image.on("pointerup", () => {
            this.scene.stop();
            this.scene.start("CastleGameScene");
        });
        this.uiLocations.push(castleButton);

        let gardenButton = new UIButtonObject(this, {x: 640, y: 530, imageKey: "game_garden", imageScaleX: 0.7, imageScaleY: 0.7, imageDepth: 20});
        this.soundScene.createButtonSounds(gardenButton.image);
        this.addGlow(gardenButton.image);
        gardenButton.image.on("pointerup", ()=> {
            this.scene.stop();
            this.scene.start("GardenGameScene");
        });
        this.uiLocations.push(gardenButton);

        let gymButton = new UIButtonObject(this, {x: 300, y: 530, imageKey: "game_gym", imageScaleX: 0.5, imageScaleY: 0.5, imageDepth: 20});
        this.soundScene.createButtonSounds(gymButton.image);
        this.addGlow(gymButton.image);
        gymButton.image.on("pointerup", () => {
            this.scene.stop();
            this.scene.start("GymScene");
        });
        this.uiLocations.push(gymButton);

        let workshopButton = new UIButtonObject(this, {x: 300, y: 350, imageKey: "game_workshop", imageScaleX: 0.5, imageScaleY: 0.5, imageRelativeY: 0.5, imageDepth: 20});
        this.soundScene.createButtonSounds(workshopButton.image);
        this.addGlow(workshopButton.image);
        workshopButton.image.on("pointerup", () => {
            this.scene.stop();
            this.scene.start("WorkshopScene");
        });
        this.uiLocations.push(workshopButton);

        let backyardButton = new UIButtonObject(this, {x: 1000, y: 480, imageKey: "game_backyard", imageScaleX: 1, imageScaleY: 1, imageDepth: 20});
        this.soundScene.createButtonSounds(backyardButton.image);
        this.addGlow(backyardButton.image);
        backyardButton.image.on("pointerup", () => {
            this.scene.stop();
            this.scene.start("BackyardScene");
        });
        this.uiLocations.push(backyardButton);
    }

    addGlow(image: Phaser.GameObjects.Image): Phaser.FX.Glow | undefined {
        return image.preFX?.addGlow();
    }
    
    createButtons() {

        let nexDayButton = new UIButton(this, 200, 50, i18n.t("game.nextDay"), "button");
        this.soundScene.createButtonSounds(nexDayButton.image);
        nexDayButton.image.on("pointerdown", () => {
            sceneManager.getSoundScene().stopAll();

            gameState.day++;

            let daySounds = ["day_01", "day_02", "day_03", "day_04", "day_05", "day_06", "day_07"];
            let soundIndex = (gameState.day - 1) % daySounds.length;
            sceneManager.getSoundScene().stopAll(1000);
            sceneManager.getSoundScene().play(daySounds[soundIndex], {}, false);
            
            this.animateDay();

            this.calculateDay();
        });
        this.uiButtons.push(nexDayButton);

        let saveButton = new UIButton(this, 200, 110, i18n.t("menu.settings"), "button");
        this.soundScene.createButtonSounds(saveButton.image);
        saveButton.image.on("pointerdown", () => {
            this.scene.stop();
            this.scene.start("ConfigScene", {backScene: "BaseGameScene"});
        });
        this.uiButtons.push(saveButton);

        let exitButton = new UIButton(this, 200, 170, i18n.t("game.exit"), "button");
        this.soundScene.createButtonSounds(exitButton.image);
        exitButton.image.on("pointerdown", () => {
            this.scene.stop();
            this.scene.start("GameOverScene");
        });
        this.uiButtons.push(exitButton);

    }

    createUIText() {

        let textBalance = sceneManager.getText(this, {x: 1240, y: 50, originX: 1, originY: 0.5, textKey: i18n.t("game.balance") + ": " + gameState.coins});

        let textDaylyTax = sceneManager.getText(this, {x: 1240, y: 100, originX: 1, originY: 0.5, textKey: i18n.t("game.dayly_tax") + ": " + gameState.taxDay()});

        let textDay = sceneManager.getText(this, {x: 1240, y: 150, originX: 1, originY: 0.5, textKey: i18n.t("game.day") + ": " + gameState.day});

        let textMoves = sceneManager.getText(this, {x: 1240, y: 200, originX: 1, originY: 0.5, textKey: i18n.t("game.move_points") + ": " + gameState.movePointsCurrent, depth: 50});

        let textDescription = sceneManager.getTextDescription(this, {textKey: i18n.t("game.base_scene_description") + gameState.taxWin});
        

        this.uiTexts.push(textBalance);
        this.uiTexts.push(textDaylyTax);
        this.uiTexts.push(textDay);
        this.uiTexts.push(textMoves);

        this.uiTexts.push(textDescription);

        for(let text of this.uiTexts) {
            text.setDepth(100);
        }
    }

    deleteButtons() {
        for(let button of this.uiButtons) {
            button.container.destroy();
        }

        this.uiButtons = [];
    }

    blockLocations() {
        for(let location of this.uiLocations) {
            location.image.removeInteractive();
        }
    }

    animateDay() {
        //animate grayscale images
        this.deleteButtons();
        this.blockLocations();
        this.deleteUIText();

        let imagesButtons = this.uiButtons.map((button) => {
            return button.image;
        });
        let imagesLocations = this.uiLocations.map((button) => {
            return button.image;
        });
        let images = imagesButtons.concat(imagesLocations, [this.uiBackground, this.uiBackgroundFront]);

        imageService.animateGrayTintTransition(this, images, gameState.dayChangeAnimationDuration, () => {
            this.createButtons();
            this.unblockLocations();
            this.createUIText();
            this.gameOver();
        });

        let texts = this.uiButtons.map((button) => {return button.label;}).filter(button => button != null);
        this.tweens.add({
            targets: texts,
            alpha: 0,
            yoyo: true,
            repeat: 0,
            duration: gameState.dayChangeAnimationDuration/2
        })
        sceneManager.animateGrayTintTransition(this, texts, gameState.dayChangeAnimationDuration);

        //animate sun, moon, stars

        // orbital rotation of sun and moon
        this.tweens.add({
            targets: this.orbitContainer,
            angle: 360,
            duration: gameState.dayChangeAnimationDuration,
            ease: "Sine.easeInOut",
            repeat: 0
        });

        // sun alpha
        // this.tweens.add({
        //     targets: this.imageSun,
        //     alpha: 0,
        //     duration: gameState.dayChangeAnimationDuration/2,
        //     ease: "Sine.easeInOut",
        //     repeat: 0,
        //     onComplete: () => {
        //         this.tweens.add({
        //             targets: this.imageSun,
        //             alpha: 1,
        //             duration: gameState.dayChangeAnimationDuration/2,
        //             ease: "Sine.easeInOut",
        //             repeat: 0,
        //         });
        //     }
        // });

        //moon alpha
        // this.tweens.add({
        //     targets: this.imageMoon,
        //     alpha: 1,
        //     duration: gameState.dayChangeAnimationDuration/2,
        //     ease: "Sine.easeInOut",
        //     repeat: 0,
        //     onComplete: () => {
        //         this.tweens.add({
        //             targets: this.imageMoon,
        //             alpha: 0,
        //             duration: gameState.dayChangeAnimationDuration/2,
        //             ease: "Sine.easeInOut",
        //             repeat: 0,
        //         });
        //     }
        // });

        //stars alpha
        this.tweens.add({
            targets: this.imagesStars,
            alpha: 1,
            repeat: 0,
            duration: gameState.dayChangeAnimationDuration/2,
            onComplete: () => {
                this.tweens.add({
                    targets: this.imagesStars,
                    alpha: 0,
                    repeat: 0,
                    duration: gameState.dayChangeAnimationDuration/2,
                });
            }
        });

    }

    calculateDay() {
        // dayly tax
        gameState.coins -= gameState.taxDay();

        // incoming from garden
        let gardenIncoming = 0;
        for (let gardenCell of gameState.gardenCells) {
            if (gardenCell.includes("vegetables_on_earth")) {
                gardenIncoming += Phaser.Utils.Array.GetRandom([1, 1, 1, 2, 2, 3]);
            }
            if (gardenCell.includes("berries_on_earth")) {
                gardenIncoming += 2;
            }
            if (gardenCell.includes("trees_on_earth")) {
                gardenIncoming += Phaser.Utils.Array.GetRandom([1, 2, 2, 3, 3, 3]);
            }
        }
        if (gardenIncoming > 0) {
            gameState.coins += gardenIncoming;
            messageToPlayer.send(this, i18n.t("game.got_from_garden") + ": " + gardenIncoming);
        }
        
        //reset abilities
        gameState.todayGardenAlreadyUsed = false;
        gameState.todayGymAlreadyUsed = false;
        gameState.todayWorkshopAlreadyUsed = false;
        gameState.movePointsCurrent = gameState.movePointsMax;
        gameState.playerHealt = Math.min(gameState.playerHealtMax, gameState.playerHealt + 10);

    }

    gameOver() {
        if (gameState.coins < 0 ||
            gameState.coins > gameState.taxWin) {
            this.scene.stop();
            this.scene.start("GameOverScene");
        }
    }

    deleteUIText() {
        for(let text of this.uiTexts) {
            text.destroy();
        }

        this.uiTexts = [];
    }
    
    unblockLocations() {
        for(let location of this.uiLocations) {
            location.image.setInteractive();
        }
    }
}