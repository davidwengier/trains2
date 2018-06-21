import Sprite from "Sprite";
import CurvedTrackSprite from "track/CurvedTrackSprite";
import StraightTrackSprite from "track/StraightTrackSprite";

export default class TrackSpriteCollection {
    public readonly StraightTrackSprite: Sprite;
    public readonly StraightTerminatorTrackSprite: Sprite;
    public readonly CurvedTrackSprite: Sprite;
    public readonly CurvedTrackNoPlanksSprite: Sprite;

    constructor(cellSize: number, trackWidth: number) {
        this.StraightTrackSprite = new StraightTrackSprite(cellSize, trackWidth, false);
        this.StraightTerminatorTrackSprite = new StraightTrackSprite(cellSize, trackWidth, true);
        this.CurvedTrackSprite = new CurvedTrackSprite(cellSize, true, trackWidth);
        this.CurvedTrackNoPlanksSprite = new CurvedTrackSprite(cellSize, false, trackWidth);
    }
}