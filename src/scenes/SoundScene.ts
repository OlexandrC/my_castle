import Phaser from "phaser";
import { gameState } from "../core/GameState";

type WebAudioWithSounds = Phaser.Sound.WebAudioSoundManager & {
    sounds: Phaser.Sound.BaseSound[];
};

export class SoundScene extends Phaser.Scene {
    private isUnlocked = false;
    private webAudio!: WebAudioWithSounds;
    private soundsMap: Record<string, Phaser.Sound.WebAudioSound> = {};

    constructor() {
        super("SoundScene");
    }

    create() {
        if (!this.sound.locked) {
            this.isUnlocked = true;
            // this.play("main_menu_01", {}, false);
        } else {
            this.sound.once("unlocked", () => {
                this.isUnlocked = true;
                // this.play("main_menu_01", {}, false);
            });
        }

    }

    getWebAudio(): WebAudioWithSounds {
        if (!this.webAudio) {
            this.webAudio = this.sound as WebAudioWithSounds;
        }

        return this.webAudio;
    }

    play(key: string, config?: Phaser.Types.Sound.SoundConfig, overlap = true, onComplete?: () => void): Phaser.Sound.WebAudioSound|undefined {
        if (!this.isUnlocked) {
            // console.log("Blocked by locked sound");
            return;
        }
    
        let existing = this.soundsMap[key];
    
        if (!existing) {
            existing = (this.sound.add(key, config) as Phaser.Sound.WebAudioSound);
            this.soundsMap[key] = existing;
        }
    
        if (!overlap && existing.isPlaying) {
            // console.log("Already playing:", key);
            return;
        }
    
        existing.play(config);

        if (onComplete) {
            existing.once("complete", onComplete);
        }

        return existing;
    }
    

    // stopAll() {
    //     Object.values(this.soundsMap).forEach(sound => {
    //         if (sound.isPlaying) sound.stop();
    //     });
    // }

    stopAll(fadeOutDuration: number = 0) {
        Object.values(this.soundsMap).forEach(sound => {
            if (sound.isPlaying) {
                if (fadeOutDuration > 0) {
                    this.tweens.add({
                        targets: sound,
                        volume: 0,
                        duration: fadeOutDuration,
                        onComplete: () => {
                            sound.stop();
                            sound.setVolume(gameState.soundVolume);
                        }
                    });
                } else {
                    sound.stop();
                }
            }
        });
    }
    
    
    stopAllExcept(keyToKeep: string) {
        Object.entries(this.soundsMap).forEach(([key, sound]) => {
            if (key !== keyToKeep && sound.isPlaying) {
                sound.stop();
            }
        });
    }
    
    pauseAllExcept(keyToKeep: string) {
        Object.entries(this.soundsMap).forEach(([key, sound]) => {
            if (key !== keyToKeep && sound.isPlaying) {
                sound.pause();
            }
        });
    }
    
    resumeAllExcept(keyToSkip: string) {
        Object.entries(this.soundsMap).forEach(([key, sound]) => {
            if (key !== keyToSkip && sound.isPaused) {
                sound.resume();
            }
        });
    }
    

    setVolume(volume: number) {
        this.sound.volume = volume;
    }

    isReady(): boolean {
        return this.isUnlocked;
    }

    isPlaying(soundKey: string): boolean {
        let existing = this.sound.get(soundKey);

        return existing?.isPlaying;
    }

    clearAllSounds() {
        Object.values(this.soundsMap).forEach(sound => {
            sound.destroy();
        });
        this.soundsMap = {};
    }    

    createButtonSounds(target: Phaser.GameObjects.Image) {
        target.on("pointerover", () => {
            this.play("button_hover", {});
        });

        target.on("pointerup", () => {
            this.play("button_click", {});
        });
    }

    playQueue(audioKeys: Array<string>, config?: Phaser.Types.Sound.SoundConfig) {
        if (!audioKeys.length) return;

        const playNext = (index: number) => {
            if (index >= audioKeys.length) return;
    
            const key = audioKeys[index];

            const sound = this.play(key, config, false);

            if (sound) {
                sound.off("complete");
                sound.once("complete", () => {
                    sound.destroy();
                    delete this.soundsMap[key];
                    playNext(index + 1);
                });
            } else {
                playNext(index + 1);
            }
        };
    
        playNext(0);
    }
    
}