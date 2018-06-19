import { Sprite } from "Sprite";

export class BaseTrackSprite extends Sprite {
    public plankColour = "#382E1C";
    public trackColour = "#6E7587";
    public trackPadding = 10;
    constructor(cellSize: number) {
        super(cellSize, cellSize);
    }
}
