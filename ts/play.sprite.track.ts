/// <reference path="play.sprite.ts" />

module trains.play {
    export class TrackSprite extends Sprite
    {
        public plankColour = "#382E1C";
        public trackColour = "#6E7587";
        constructor(cellSize:number)
        {
            super(cellSize, cellSize);
        }
    }
}