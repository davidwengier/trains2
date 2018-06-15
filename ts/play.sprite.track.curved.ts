/// <reference path="play.sprite.track.ts" />

module trains.play {
    export class CurvedTrackSprite extends TrackSprite
    {
        constructor(cellSize:number, drawPlanks:boolean, trackWidth: number)
        {
            super(cellSize);

            this.drawCurvedTrack(this.context, drawPlanks, trackWidth);
        }

        private drawCurvedTrack(context: CanvasRenderingContext2D, drawPlanks: boolean, trackWidth: number): void {

            if (drawPlanks) {
                this.drawCurvedPlank(context, 20 * Math.PI / 180, trackWidth);
                this.drawCurvedPlank(context, 45 * Math.PI / 180, trackWidth);
                this.drawCurvedPlank(context, 70 * Math.PI / 180, trackWidth);
            }
            
            context.lineWidth = 1;
            context.strokeStyle = this.trackColour;
    
            var finishAngle = Math.PI / 2;
    
            context.beginPath();
            context.arc(0, 0, firstTrackPosY, 0, finishAngle, false);
            context.stroke();
    
            context.beginPath();
            context.arc(0, 0, firstTrackPosY + trackWidth, 0, finishAngle, false);
            context.stroke();
    
            context.beginPath();
            context.arc(0, 0, secondTrackPosY - trackWidth, 0, finishAngle, false);
            context.stroke();
    
            context.beginPath();
            context.arc(0, 0, secondTrackPosY, 0, finishAngle, false);
            context.stroke();
    
        }
    
        private drawCurvedPlank(context: CanvasRenderingContext2D, basePos: number, trackWidth: number): void {
    
            var cos = Math.cos(basePos);
            var sin = Math.sin(basePos);
    
            context.lineWidth = trackWidth;
            context.strokeStyle = this.plankColour;
    
            context.beginPath();
    
            context.moveTo((firstTrackPosY - trackWidth) * cos, (firstTrackPosY - trackWidth) * sin);
            context.lineTo((firstTrackPosY) * cos, (firstTrackPosY) * sin);
    
            context.moveTo((firstTrackPosY + trackWidth) * cos, (firstTrackPosY + trackWidth) * sin);
            context.lineTo((secondTrackPosY - trackWidth) * cos, (secondTrackPosY - trackWidth) * sin);
    
            context.moveTo((secondTrackPosY) * cos, (secondTrackPosY) * sin);
            context.lineTo((secondTrackPosY + trackWidth) * cos, (secondTrackPosY + trackWidth) * sin);
            context.stroke();
        }
    }
}