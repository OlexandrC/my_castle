export class ImageService {

    applyGrayTint(image: Phaser.GameObjects.Image, amount: number) {
        amount = Phaser.Math.Clamp(amount, 0, 1);
    
        let gray = Math.round(255 * (1 - amount)); // 1 -> 0, 0 -> 255
        let tint = Phaser.Display.Color.GetColor(gray, gray, gray);
    
        image.setTint(tint);
    }

    animateGrayTintTransition(
        scene: Phaser.Scene,
        images: Phaser.GameObjects.Image[],
        duration: number = 1000,
        onComplete?: () => void
    ) {
        let counter = 0;
        let done = 0;
    
        for (let image of images) {
            //to grayscale
            scene.tweens.add({
                targets: { progress: 0 },
                progress: 1,
                duration: duration / 2,
                onUpdate: (tween) => {
                    this.applyGrayTint(image, tween.getValue());
                },
                onComplete: () => {
                    // back to color
                    scene.tweens.add({
                        targets: { progress: 1 },
                        progress: 0,
                        duration: duration / 2,
                        onUpdate: (tween) => {
                            this.applyGrayTint(image, tween.getValue());
                        },
                        onComplete: () => {
                            done++;
                            if (done === images.length && onComplete) {
                                onComplete();
                            }
                        }
                    });
                }
            });
    
            counter++;
        }
    }
}

export const imageService = new ImageService();