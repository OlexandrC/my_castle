import Phaser from "phaser";
import { generatePerlinTexture } from "../services/PerlinTextureGenerator";
import { SoundScene } from "./SoundScene";
import { sceneManager } from "../services/SceneManager";

export class BootScene extends Phaser.Scene {
    soundScene!: SoundScene;
    loadingText!: Phaser.GameObjects.Text;

    constructor() {
        super("BootScene");
    }

    preload() {
        this.loadingProgress();

        this.preloadAudio();

        this.preloadImages();

        this.preloadImagesNoise();
    }

    loadingProgress() {
        this.loadingText = this.add.text(this.scale.width / 2, this.scale.height / 2, "0%", {
            fontSize: "32px",
            color: "#ffffff",
        }).setOrigin(0.5);

        this.load.on("progress", (value: number) => {
            let percent = Math.round(value * 100);
            this.loadingText.setText(`${percent}%`);
        });

        this.load.on("complete", () => {
            this.loadingText.destroy();
        });
    }

    preloadAudio() {
        this.load.audio("button_hover", [
            "assets/audio/button_hover.ogg",
            "assets/audio/button_hover.mp3",
        ]);
        this.load.audio("button_click", [
            "assets/audio/button_click.ogg",
            "assets/audio/button_click.mp3",
        ]);

        this.load.audio("main_menu_01",[
            "assets/audio/true_love_ost_01.ogg",
            "assets/audio/true_love_ost_01.mp3"
        ]);

        this.load.audio("walk_01",[
            "assets/audio/walk_01.ogg",
            "assets/audio/walk_01.mp3"
        ]);
        this.load.audio("walk_02",[
            "assets/audio/walk_02.ogg",
            "assets/audio/walk_02.mp3"
        ]);
        this.load.audio("walk_03",[
            "assets/audio/walk_03.ogg",
            "assets/audio/walk_03.mp3"
        ]);
        this.load.audio("walk_04",[
            "assets/audio/walk_04.ogg",
            "assets/audio/walk_04.mp3"
        ]);
        this.load.audio("walk_05",[
            "assets/audio/walk_05.ogg",
            "assets/audio/walk_05.mp3"
        ]);

        this.load.audio("no_1", ["assets/audio/no_1.ogg", "assets/audio/no_1.mp3"]);
        this.load.audio("no_2", ["assets/audio/no_2.ogg", "assets/audio/no_2.mp3"]);
        this.load.audio("no_3", ["assets/audio/no_3.ogg", "assets/audio/no_3.mp3"]);

        this.load.audio("day_01", [
            "assets/audio/fragments_of_time.ogg", 
            "assets/audio/fragments_of_time.mp3"]);
            
        this.load.audio("day_02", [
            "assets/audio/painting_room.ogg",
            "assets/audio/painting_room.mp3"]);
        this.load.audio("day_03", [
            "assets/audio/bleu.ogg",
            "assets/audio/bleu.mp3"]);
        this.load.audio("day_04", [
            "assets/audio/nostalgic_piano.ogg",
            "assets/audio/nostalgic_piano.mp3"]);
        this.load.audio("day_05", [
            "assets/audio/piano_magic_motive.ogg",
            "assets/audio/piano_magic_motive.mp3"]);
        this.load.audio("day_06", [
            "assets/audio/a_very_brady_special.ogg",
            "assets/audio/a_very_brady_special.mp3"]);
        this.load.audio("day_07", [
            "assets/audio/tears_of_the_fallen.ogg",
            "assets/audio/tears_of_the_fallen.mp3"]);

        this.load.audio("coin_1", [
            "assets/audio/coin_1.ogg",
            "assets/audio/coin_1.mp3"]);
        this.load.audio("coin_2", [
            "assets/audio/coin_2.ogg",
            "assets/audio/coin_2.mp3"]);

        this.load.audio("sword_battle_start", [
            "assets/audio/sword_battle_start.ogg",
            "assets/audio/sword_battle_start.mp3"]);
        this.load.audio("sword_battle_3", [
            "assets/audio/sword_battle_3.ogg",
            "assets/audio/sword_battle_3.mp3"]);
        this.load.audio("sword_battle_2", [
            "assets/audio/sword_battle_2.ogg",
            "assets/audio/sword_battle_2.mp3"]);
        this.load.audio("sword_battle_1", [
            "assets/audio/sword_battle_1.ogg",
            "assets/audio/sword_battle_1.mp"]);


            
        this.load.audio("fist_battle_4", [
            "assets/audio/fist_battle_4.mp3",
            "assets/audio/fist_battle_4.ogg",
            ]);
        this.load.audio("fist_battle_2", [
            "assets/audio/fist_battle_2.mp3",
            "assets/audio/fist_battle_2.ogg",
            ]);
        this.load.audio("fist_battle_1", [
            "assets/audio/fist_battle_1.ogg",
            "assets/audio/fist_battle_1.mp3"]);

        this.load.audio("game_over_sad", [
            "assets/audio/game_over_sad.ogg",
            "assets/audio/game_over_sad.mp3"]);
        this.load.audio("game_over_happy", [
            "assets/audio/pond.ogg",
            "assets/audio/pond.mp3"]);

        this.load.audio("magic_1", [
            "assets/audio/magical_1.ogg",
            "assets/audio/magical_1.mp3"]);

        this.load.audio("locked_door", [
            "assets/audio/locked_door.ogg",
            "assets/audio/locked_door.mp3"]);
    }

    preloadImages() {
        this.load.image("my_castle_logo", "assets/images/my_castle_logo.png");

        this.load.image("main_background", "assets/images/main_background.jpg");

        this.load.image("button", "assets/images/button.png");

        this.load.image("panel_1", "assets/images/panel_1.png");

        this.load.image("intro_old_man", "assets/images/intro_old_man.jpg");
        this.load.image("intro_old_man_dead", "assets/images/intro_old_man_dead.jpg");
        this.load.image("intro_paper_reading", "assets/images/intro_paper_reading.jpg");

        this.load.image("game_main_background", "assets/images/game_main_background.jpg");
        this.load.image("game_main_background_front", "assets/images/game_main_background_front.png");

        this.load.image("game_castle", "assets/images/game_castle.png");
        this.load.image("game_garden", "assets/images/game_garden.png");
        this.load.image("game_workshop", "assets/images/game_workshop.png");
        this.load.image("game_gym", "assets/images/game_gym.png");
        this.load.image("game_backyard", "assets/images/game_backyard.png");

        this.load.image("game_garden_background", "assets/images/game_garden_background.jpg");
        this.load.image("game_yard_tiles", "assets/images/game_yard_tiles.jpg");

        this.load.image("garden_tile_01", "assets/images/garden_tile_01.jpg");
        this.load.image("garden_tile_02", "assets/images/garden_tile_02.jpg");
        this.load.image("garden_tile_03", "assets/images/garden_tile_03.jpg");
        this.load.image("garden_tile_04", "assets/images/garden_tile_04.jpg");
        this.load.image("garden_tile_05", "assets/images/garden_tile_05.jpg");

        this.load.image("vegetables_on_earth", "assets/images/vegetables_on_earth.png");
        this.load.image("berries_on_earth", "assets/images/berries_on_earth.png");
        this.load.image("trees_on_earth", "assets/images/trees_on_earth.png");

        this.load.image("delete_tile", "assets/images/delete_tile.png");

        this.load.image("gym_inside", "assets/images/gym_inside.jpg");
        this.load.image("workshop_inside", "assets/images/workshop_inside.jpg");

        this.load.image("upgrade_intelligence", "assets/images/upgrade_intelligence.png");
        this.load.image("upgrade_move_points", "assets/images/upgrade_move_points.png");
        this.load.image("upgrade_force", "assets/images/upgrade_force.png");

        this.load.image("item_gloves", "assets/images/item_gloves.png");
        this.load.image("item_boots", "assets/images/item_boots.png");
        this.load.image("item_boots_on", "assets/images/item_boots_on.png");
        this.load.image("item_armor", "assets/images/item_armor.png");
        this.load.image("item_helmet", "assets/images/item_helmet.png");
        this.load.image("item_shield", "assets/images/item_shield.png");
        this.load.image("item_sword", "assets/images/item_sword.png");
        this.load.image("item_panel", "assets/images/item_panel.png");

        this.load.image("item_helmet_on", "assets/images/item_helmet_on.png");
        this.load.image("item_armor_on", "assets/images/item_armor_on.png");
        

        this.load.image("player_100", "assets/images/player_100.png");
        this.load.image("backyard_gate", "assets/images/backyard_gate.png");
        this.load.image("backyard_gate_closed", "assets/images/backyard_gate_closed.png");
        this.load.image("backyard_wall", "assets/images/backyard_wall.png");
        this.load.image("backyard_stone_1", "assets/images/backyard_stone_1.png");
        this.load.image("backyard_stone_2", "assets/images/backyard_stone_2.png");
        this.load.image("backyard_stone_3", "assets/images/backyard_stone_3.png");
        this.load.image("backyard_grass_1", "assets/images/backyard_grass_1.png");
        this.load.image("backyard_grass_2", "assets/images/backyard_grass_2.png");
        this.load.image("backyard_grass_3", "assets/images/backyard_grass_3.png");
        this.load.image("backyard_treasure_1", "assets/images/backyard_treasure_1.png");
        this.load.image("backyard_treasure_2", "assets/images/backyard_treasure_2.png");
        this.load.image("backyard_treasure_3", "assets/images/backyard_treasure_3.png");
        this.load.image("backyard_enemy_1", "assets/images/backyard_enemy_1.png");
        this.load.image("backyard_enemy_2", "assets/images/backyard_enemy_2.png");
        this.load.image("backyard_enemy_3", "assets/images/backyard_enemy_3.png");

        this.load.image("game_over", "assets/images/game_over.png");
        this.load.image("game_over_dani_dead", "assets/images/game_over_dani_dead.jpg");
        this.load.image("game_over_dani_left", "assets/images/game_over_dani_left.jpg");
        this.load.image("game_over_dani_winForceFullOnly", "assets/images/game_over_dani_winForceFullOnly.jpg");
        this.load.image("game_over_dani_winIntelligenceFullOnly", "assets/images/game_over_dani_winIntelligenceFullOnly.jpg");
        this.load.image("game_over_dani_winFull", "assets/images/game_over_dani_winFull.jpg");
        this.load.image("game_over_dani_winSimple", "assets/images/game_over_dani_winSimple.jpg");
        this.load.image("game_over_dani_disappointed", "assets/images/game_over_dani_disappointed.jpg");

        this.load.image("sun", "assets/images/sun.png");
        this.load.image("moon", "assets/images/moon.png");
        this.load.image("star_1", "assets/images/star_1.png");
        this.load.image("star_2", "assets/images/star_2.png");
        this.load.image("star_3", "assets/images/star_3.png");

        this.load.image("coin", "assets/images/coin.png");
        this.load.image("key", "assets/images/key.png");

        this.load.image("chest", "assets/images/chest.png");
        this.load.image("chest_opened", "assets/images/chest_opened.png");
        this.load.image("room", "assets/images/room.jpg");

        this.load.image("paper", "assets/images/paper.png");
    }

    preloadImagesNoise() {
        const canvas = generatePerlinTexture(100, 100, 50, { r: 80, g: 180, b: 80 });

        this.textures.addCanvas('perlin_tile_grass', canvas);
    }

    create() {
        this.scene.launch("SoundScene");
        this.soundScene = sceneManager.getSoundScene();

        this.scene.start("MainMenuScene");
        // this.scene.start("ConfigScene");
        // this.scene.start("BaseGameScene");
        // this.scene.start("BackyardScene");
        // this.scene.start("GameOverScene");

        this.createEvents();
    }

    createEvents() {
        document.addEventListener('visibilitychange', () => {
            console.log('Tab visibility changed:', document.visibilityState);

            if (document.visibilityState === 'visible') {
                console.log("on visible");

                this.soundScene.stopAllExcept("main_menu_01");
            }else {
                console.log("on not visible");
                this.soundScene.play("main_menu_01", {}, false);
            }
        });

        window.addEventListener("focus", () => {
            console.log("on focus");
            this.soundScene.stopAll();
        });
    }

}
