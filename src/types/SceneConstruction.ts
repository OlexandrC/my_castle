export class SceneConstruction {

    constructor(
        public backgroundImage: string,
        public text: string,
        public nextSceneOnFinish?: string,
        public timer?: number,
        public sound?: string
    ) {
        this.backgroundImage = backgroundImage;
        this.text = text;
        this.nextSceneOnFinish = nextSceneOnFinish;
        this.timer = timer;
        this.sound = sound;
    }

}
