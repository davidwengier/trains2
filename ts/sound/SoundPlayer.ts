import ISound from "./ISound";

export default class SoundPlayer {
    private muted: boolean = false;
    private basePath: string = "audio/";

    public setMuted(mute: boolean): void {
        this.muted = mute;
    }

    public playSound(sound: ISound): void {
        if (!this.muted && sound !== undefined) {
            const soundToPlay = new Audio(this.basePath + sound.FileName);
            if (soundToPlay !== undefined) {
                soundToPlay.play();
            }
        }
    }
}