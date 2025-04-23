import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { LanguageSelectScene } from "./scenes/LanguageSelectScene";
import { BaseGameScene } from "./scenes/BaseGameScene";
import { IntroScene } from "./scenes/StoryScene";
import { GardenGameScene } from "./scenes/GardenGameScene";
import { GymScene } from "./scenes/GymScene";
import { WorkshopScene } from "./scenes/WorkshopScene";
import { BackyardScene } from "./scenes/BackyardScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { ConfigScene } from "./scenes/ConfigScene";
import { SoundScene } from "./scenes/SoundScene";
import { sceneManager } from "./services/SceneManager";
import { CastleGameScene } from "./scenes/CastleGameScene";
import { InfoScene } from "./scenes/InfoScene";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: "#000",
    scene: [
        BootScene,
        MainMenuScene,
        LanguageSelectScene,
        BaseGameScene,
        IntroScene,
        GardenGameScene,
        GymScene,
        WorkshopScene,
        BackyardScene,
        GameOverScene,
        ConfigScene,
        SoundScene,
        CastleGameScene,
        InfoScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

const game = new Phaser.Game(config);
sceneManager.setGame(game);