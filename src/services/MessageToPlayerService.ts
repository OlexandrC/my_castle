import { SceneManager } from "./SceneManager";

export class MessageToPlayerService {
    send(scene: Phaser.Scene, textKey: string) {
        let sceneManager = new SceneManager();

        let text = sceneManager.getText(scene, {x: 50, y: 670, textKey: textKey, originX: 0, depth: 1000});
        text.setWordWrapWidth(1000);
        
        scene.tweens.add({
            targets: text,
            y: 500,
            alpha: 0,
            repeat: 0,
            duration: 5000,
            onComplete: () => {
                text.destroy();
            }
        });
        
    }
}

export const messageToPlayer = new MessageToPlayerService();