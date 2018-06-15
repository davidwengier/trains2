/// <reference path="../Sprite.ts" />

module trains.play {
    export class BaseTrackSprite extends Sprite {
        public plankColour = "#382E1C";
        public trackColour = "#6E7587";
        constructor(cellSize: number) {
            super(cellSize, cellSize);
        }
    }
}