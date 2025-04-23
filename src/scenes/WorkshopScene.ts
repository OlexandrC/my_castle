import Phaser from "phaser";
import { sceneManager } from "../services/SceneManager";
import { gameState } from "../core/GameState";
import { i18n } from "../services/i18nService";
import { UIButtonObject } from "../ui/UIButtonObject";
import { ItemService } from "../services/ItemService";
import { SoundScene } from "./SoundScene";
import { messageToPlayer } from "../services/MessageToPlayerService";

export class WorkshopScene extends Phaser.Scene {
    soundScene!: SoundScene;
    itemService!: ItemService;
    statsTexts: Array<Phaser.GameObjects.Text> = [];
    craftButtons: Array<UIButtonObject> = [];
    itemImages: Array<Phaser.GameObjects.Image> = [];

    constructor() {
        super("WorkshopScene");
    }

    create() {
        this.soundScene = sceneManager.getSoundScene();
        this.itemService = new ItemService();

        this.createBackground();

        sceneManager.getBackButton(this);

        this.createStats();
        this.createPanels();
        this.createCraftButtons();
        this.createItemImages();
        
        sceneManager.getTextDescription(this, {textKey: "game.workshop_description"});
    }

    createBackground() {
        this.add.image(640, 360, "workshop_inside" )
            .setDepth(0)
            .setScale(1);
    }

    createStats() {
        let text = 
            i18n.t("game.move_points") + " " + 
            gameState.movePointsCurrent + ", " +
            i18n.t("game.coins") + " " +
            gameState.coins;

        let movePointsText = sceneManager.getText(this, {x: 50, y: 50, textKey: text, originX: 0, originY: 0.5});
        this.statsTexts.push(movePointsText);

    }

    createPanels() {
        this.createPanel(this.itemService.getPanelPosition("item_helmet")); //head
        this.createPanel(this.itemService.getPanelPosition("item_armor")); //chest
        this.createPanel(this.itemService.getPanelPosition("item_boots")); //legs
        this.createPanel(this.itemService.getPanelPosition("item_gloves", "left")); //left hend
        this.createPanel(this.itemService.getPanelPosition("item_gloves", "right")); //left hend
        this.createPanel(this.itemService.getPanelPosition("item_shield"));
        this.createPanel(this.itemService.getPanelPosition("item_sword"));
    }

    createCraftButtons() {

        this.createCraftButton(850, 150, "item_helmet");
        this.createCraftButton(850, 300, "item_armor");
        this.createCraftButton(850, 450, "item_boots");

        this.createCraftButton(700, 400, "item_gloves");

        this.createCraftButton(700, 250, "item_sword");

        this.createCraftButton(1000, 250, "item_shield");

    }

    createItemImages() {
        for(let itemImagekey of gameState.items) {
            let {x, y} = this.itemService.getPanelPosition(itemImagekey, "right");

            let itemImage = this.add.image(x, y, itemImagekey);
            itemImage.setDepth(20);
            itemImage.setScale(1);

            this.itemImages.push(itemImage);

            if (itemImagekey === "item_gloves") {
                let {x, y} = this.itemService.getPanelPosition(itemImagekey, "left");

                let itemImage = this.add.image(x, y, itemImagekey);
                itemImage.setDepth(20);
                itemImage.setScale(-1, 1);
    
                this.itemImages.push(itemImage);
            }
        }
    }

    createCraftButton(x: number, y: number, imageKey: string) {
        let {movePoints, coins} = this.itemService.getCost(imageKey);

        let buttonContainer = new UIButtonObject(this, {
            x: x, 
            y: y, 
            imageKey: imageKey,
            textKey: `${movePoints},${coins}`,
            textRelativeY: 70,
            textFontSize: 35,
            textStrokeThickness: 10
        });

        buttonContainer.image?.postFX.addGlow();
        buttonContainer.image?.setScale(1);

        this.soundScene.createButtonSounds(buttonContainer.image);

        this.craftButtons.push(buttonContainer);

        if (!this.itemService.itemCanBeCrafted(imageKey)) {
            buttonContainer.image.removeInteractive();
            buttonContainer.image.setTint(0x000000, 0x000000, 0x000000, 0x000000);
            return;
        }

        buttonContainer.image.on("pointerup", () => {
            this.onCraftAction(imageKey);
        });
    }

    onCraftAction(imageKey: string) {
        gameState.items.push(imageKey);

        let {movePoints, coins} = this.itemService.getCost(imageKey);

        gameState.coins -= coins;
        gameState.movePointsCurrent -= movePoints;

        gameState.todayWorkshopAlreadyUsed = true;

        messageToPlayer.send(this, "game.item_crafted");

        this.redrawScene();
    }

    createPanel(parameters: {x: number, y: number}) {
        const {x = 0, y = 0} = parameters;

        let panelImageKey = "item_panel";
        this.add.image(x, y, panelImageKey).setDepth(10).setScale(0.75);
    }

    deleteStats() {
        for (let stat of this.statsTexts) {
            stat.destroy();
        }

        this.statsTexts = [];
    }

    deleteCraftButtons() {
        for (let button of this.craftButtons) {
            button.image?.destroy();
            button.label?.destroy();
            button.container.destroy();
        }

        this.craftButtons = [];
    }

    deleteItemImages() {
        for (let itemImage of this.itemImages) {
            itemImage.destroy();
        }
    }

    redrawScene() {
        this.deleteStats();
        this.deleteCraftButtons();
        this.deleteItemImages();

        this.time.delayedCall(10, () => {
            this.createStats();
            this.createCraftButtons();
            this.createItemImages();
        });
    }
}
