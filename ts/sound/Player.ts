/// <reference path="ISound.ts" />

module trains.audio {
	export class Player {
		private muted: boolean = false;
		private basePath: string = "audio/";

		constructor() {
		}

		setMuted(mute: boolean): void {
			this.muted = mute;
		}

		playSound(sound: trains.audio.ISound): void {
			if (!this.muted && sound !== undefined) {
				var soundToPlay = new Audio(this.basePath + sound.FileName);
				if (soundToPlay !== undefined) {
					soundToPlay.play();
				}
			}
		}

	}
}