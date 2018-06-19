/// <reference path="BaseTrackSprite.ts" />

module trains.play {
    export class StraightTrackSprite extends BaseTrackSprite {
        constructor(cellSize: number, trackWidth: number, terminator: boolean = false) {
            super(cellSize);

            var numPlanks = 3;
            var startX = -1;
            var endX = cellSize;
            var thirdGridSize = cellSize / 3;

            // draw the track planks
            this.context.lineWidth = trackWidth;
            this.context.strokeStyle = this.plankColour;
            this.context.beginPath();
            for (var i = 1; i <= numPlanks; i++) {
                var xPosition = (thirdGridSize * i) - (thirdGridSize / 2);
                var yPosition = firstTrackPosY - trackWidth;

                this.context.moveTo(xPosition, yPosition);
                this.context.lineTo(xPosition, secondTrackPosY + trackWidth);
                
                if (terminator && i === numPlanks) {
                    endX = xPosition - 1;                       // why -1? cause canvas thats why
                }
            }
            this.context.stroke();

            // draw the white part of the track
            var endWidth = endX - startX;
            this.context.beginPath();
            this.context.clearRect(startX, firstTrackPosY, endWidth, trackWidth);
            this.context.clearRect(startX, secondTrackPosY - trackWidth, endWidth, trackWidth);

            // draw the outline on the track
            this.context.lineWidth = 1;
            this.context.strokeStyle = this.trackColour;
            this.context.beginPath();

            this.context.moveTo(startX, firstTrackPosY);
            this.context.lineTo(endX, firstTrackPosY);
            this.context.moveTo(startX, firstTrackPosY + trackWidth);
            this.context.lineTo(endX, firstTrackPosY + trackWidth);

            this.context.moveTo(startX, secondTrackPosY - trackWidth);
            this.context.lineTo(endX, secondTrackPosY - trackWidth);
            this.context.moveTo(startX, secondTrackPosY);
            this.context.lineTo(endX, secondTrackPosY);

            this.context.stroke();
        }
    }
}