/// <reference path="ISound.ts" />
module trains.audio {
    export class ClickSound implements ISound
	{
        public static readonly Instance:ISound = new ClickSound();
		public readonly FileName:string = "click.mp3";
    }
}