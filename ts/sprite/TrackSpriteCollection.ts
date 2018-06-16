/// <reference path="track/CurvedTrackSprite.ts" />
/// <reference path="track/StraightTrackSprite.ts" />

module trains.play {
    export class TrackSpriteCollection {
        public readonly StraightTrackSprite: Sprite;
        public readonly CurvedTrackSprite: Sprite;
        public readonly CurvedTrackNoPlanksSprite: Sprite;

        constructor(cellSize: number) {
            this.StraightTrackSprite = new StraightTrackSprite(cellSize, trackWidth);
            this.CurvedTrackSprite = new CurvedTrackSprite(cellSize, true, trackWidth);
            this.CurvedTrackNoPlanksSprite = new CurvedTrackSprite(cellSize, false, trackWidth);
        }
    }
}