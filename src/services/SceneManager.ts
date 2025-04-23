import { SoundScene } from "../scenes/SoundScene";
import { SceneConstruction } from "../types/SceneConstruction";
import { UIButton } from "../ui/UIButton";
import { i18n } from "./i18nService";

export class SceneManager {
    gameInstance!: Phaser.Game;

    setGame(game: Phaser.Game) {
        this.gameInstance = game;
    }

    getSoundScene(): SoundScene {
        if (!this.gameInstance) {
            throw new Error("Game instance not set in SceneManager");
        }

        return this.gameInstance.scene.getScene("SoundScene") as SoundScene;
    }

    getIntroSceneConstructions(): SceneConstruction[] {
        return [
            new SceneConstruction(
                "intro_old_man",
                i18n.t('intro.old_man')
            ),
            new SceneConstruction(
                "intro_old_man_dead",
                i18n.t('intro.old_man_dead')
            ),
            new SceneConstruction(
                "intro_paper_reading",
                i18n.t('intro.paper_reading'),
                "BaseGameScene"
            ),
        ];
    }

    getText(scene: Phaser.Scene, parameters: {
        x?: number,
        y?: number,
        textKey: string,
        originX?: number,
        originY?: number,
        depth?: number,
        fontSize?: number,
        color?: string,
        stroke?: string,
        strokeThickness?: number,
        align?: string
    }): Phaser.GameObjects.Text {
            
        const {
            x = 0,
            y = 0,
            textKey,
            originX = 0.5,
            originY = 0.5,
            depth = 1,
            fontSize = 50,
            color = "#ffffff",
            stroke = "#000000",
            strokeThickness = 10,
            align = "left"
        } = parameters;

        return scene.add.text(x, y, i18n.t(textKey), {
            fontSize: `${fontSize}px`,
            color: color,
            stroke: stroke,
            strokeThickness: strokeThickness,
            align: align
        }).setOrigin(originX, originY)
            .setDepth(depth)
            .setScrollFactor(0);

    }

    getTextDescription(scene: Phaser.Scene, parameters: {
        x?: number, 
        y?: number,
        textKey: string,
        originX?: number,
        originY?: number,
        depth?: number,
        fontSize?: number,
        color?: string,
        stroke?: string,
        strokeThickness?: number,
        align?: string
    }) {

        const defaults = {
            x: 640,
            y: 700,
            originX: 0.5,
            originY: 1,
            depth: 100,
            fontSize: 50,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 10,
            align: "center"
        };

        const config = Object.assign({}, defaults, parameters);

        return this.getText(scene, config).setWordWrapWidth(1250).setScrollFactor(0);
    }

    getBackButton(scene: Phaser.Scene, returnScene: string = "BaseGameScene"): UIButton {

        let button = new UIButton(scene, 1110, 50, i18n.t("game.back"), "button");

        this.getSoundScene().createButtonSounds(button.image);

        button.image.on("pointerup", () => {
            scene.scene.stop();
            scene.scene.start(returnScene);
        });

        return button;
    }

    getTilePositionByIndex(scene: Phaser.Scene, i: number, totalTiles: number, tileSize: number): {x: number, y: number} {
        const tilesPerRow = Math.ceil(Math.sqrt(totalTiles));
    
        const centerX = scene.cameras.main.centerX;
        const centerY = scene.cameras.main.centerY;
    
        const offsetX = centerX - (tilesPerRow * tileSize) / 2 + tileSize / 2;
        const offsetY = centerY - (tilesPerRow * tileSize) / 2 + tileSize / 2;

        const col = i % tilesPerRow;
        const row = Math.floor(i / tilesPerRow);

        const x = offsetX + col * tileSize;
        const y = offsetY + row * tileSize;

        return {x: x, y: y};
    }

    getTilePositionByRowColumn(scene: Phaser.Scene, row: number, column: number, totalTiles: number, tileSize: number): { x: number, y: number } {
        const tilesPerRow = Math.ceil(Math.sqrt(totalTiles));
    
        const centerX = scene.cameras.main.centerX;
        const centerY = scene.cameras.main.centerY;
    
        const offsetX = centerX - (tilesPerRow * tileSize) / 2 + tileSize / 2;
        const offsetY = centerY - (tilesPerRow * tileSize) / 2 + tileSize / 2;
    
        const x = offsetX + column * tileSize;
        const y = offsetY + row * tileSize;
    
        return { x, y };
    }

    animateGrayTintTransition(
        scene: Phaser.Scene,
        texts: Phaser.GameObjects.Text[],
        duration: number = 1000,
        onComplete?: () => void
    ) {
        let done = 0;
    
        for (let text of texts) {
            // to gray
            scene.tweens.addCounter({
                from: 0,
                to: 1,
                duration: duration / 2,
                onUpdate: (tween) => {
                    const progress = tween.getValue();
                    const gray = Math.floor(255 * (1 - progress));
                    text.setColor(`rgb(${gray},${gray},${gray})`);
                },
                onComplete: () => {
                    // back to color
                    scene.tweens.addCounter({
                        from: 1,
                        to: 0,
                        duration: duration / 2,
                        onUpdate: (tween) => {
                            const progress = tween.getValue();
                            const gray = Math.floor(255 * (1 - progress));
                            text.setColor(`rgb(${gray},${gray},${gray})`);
                        },
                        onComplete: () => {
                            done++;
                            if (done === texts.length && onComplete) {
                                onComplete();
                            }
                        }
                    });
                }
            });
        }
    }
    
    
}

export const sceneManager = new SceneManager();