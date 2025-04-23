// src/ui/UIButton.ts
import Phaser from "phaser";

export class UIButton {
    container: Phaser.GameObjects.Container;
    image: Phaser.GameObjects.Image;
    label: Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        text: string,
        bgKey: string
    ) {
        this.image = scene.add
            .image(0, 0, bgKey)
            .setOrigin(0.5)
            .setScale(0.3, 0.12)
            .setDepth(1)
            .setInteractive()
            .setScrollFactor(0);
            
        this.image.on("pointerdown", ()=> {
            scene.tweens.add({
                targets: this.image,
                scaleX: this.image.scaleX * 1.1,
                scaleY: this.image.scaleY * 1.1,
                yoyo: true,
                duration: 10,
                ease: "Power1"

            });
        });

        this.label = scene.add
            .text(0, 0, text, {
                fontSize: "50px",
                color: "#ffffff",
                stroke: "#ffffff",
                strokeThickness: 5,
            })
            .setOrigin(0.5)
            .setScrollFactor(0);

        this.container = scene.add
            .container(x, y, [this.image, this.label])
            .setDepth(100);
    }

    setText(newText: string) {
        this.label.setText(newText);
    }

    setVisible(visible: boolean) {
        this.container.setVisible(visible);
    }

    destroy() {
        this.container.destroy();
    }

}
