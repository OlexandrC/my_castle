import Phaser from "phaser";
import { i18n } from "../services/i18nService";

export class UIButtonObject {
    container: Phaser.GameObjects.Container;
    image: Phaser.GameObjects.Image;
    label?: Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        parameters: {
            x?: number,
            y?: number,

            imageRelativeX?: number,
            imageRelativeY?: number,
            imageKey: string,
            imageScaleX?: number,
            imageScaleY?: number,
            imageDepth?: number,
            imageOriginX?: number,
            imageOriginY?: number

            textKey?: string,
            textRelativeX?: number,
            textRelativeY?: number,
            textOriginX?: number,
            textOriginY?: number,
            textDepth?: number,
            textFontSize?: number,
            textColor?: string,
            textStroke?: string,
            textStrokeThickness?: number,
        }
    ) {
        const {
            x = 0,
            y = 0,

            imageRelativeX = 0,
            imageRelativeY = 0,
            imageKey,
            imageScaleX = 1,
            imageScaleY = 1,
            imageDepth = 0,
            imageOriginX = 0.5,
            imageOriginY = 0.5,

            textKey,
            textRelativeX = 0,
            textRelativeY = 0,
            textOriginX = 0.5,
            textOriginY = 0.5,
            textDepth = 1,
            textFontSize = 24,
            textColor = "#ffffff",
            textStroke = "#000000",
            textStrokeThickness = 3,
        } = parameters;

        this.image = scene.add
            .image(imageRelativeX, imageRelativeY, imageKey)
            .setOrigin(imageOriginX, imageOriginY)
            .setScale(imageScaleX, imageScaleY)
            .setDepth(imageDepth)
            .setInteractive();

        
        this.image.on("pointerdown", ()=> {
            scene.tweens.add({
                targets: this.image,
                scale: this.image.scale * 1.1,
                yoyo: true,
                duration: 10,
                ease: "Power1"

            });
        });

        const elements: Phaser.GameObjects.GameObject[] = [this.image];

        if (textKey) {
            this.label = scene.add
                .text(textRelativeX, textRelativeY, i18n.t(textKey), {
                    fontSize: `${textFontSize}px`,
                    color: textColor,
                    stroke: textStroke,
                    strokeThickness: textStrokeThickness,
                })
                .setOrigin(textOriginX, textOriginY)
                .setDepth(textDepth);

            elements.push(this.label);
        }

        this.container = scene.add
            .container(x, y, elements)
            .setDepth(Math.max(imageDepth, textDepth)); // контейнер має бути найвище
    }

    setText(newText: string) {
        if (this.label) {
            this.label.setText(newText);
        }
    }

    setVisible(visible: boolean) {
        this.container.setVisible(visible);
    }

    destroy() {
        this.container.destroy();
    }
}
