/// <reference path="play.board.ts" />
/// <reference path="play.cell.ts" />
/// <reference path="sprite/TrackSpriteCollection.ts" />

module trains.play {

    export class Track extends Cell {

        private SpriteCollection:TrackSpriteCollection;
        constructor(id: string, column: number, row: number, cellSize:number, spriteCollection:TrackSpriteCollection)
        {
            super(id, column, row, cellSize);
            this.SpriteCollection = spriteCollection;
        }

        public drawStraightTrack(context: CanvasRenderingContext2D, cutOffTop: boolean, cutOffBottom: boolean): void {
            if((cutOffTop || cutOffBottom) && (cutOffTop != cutOffBottom))
            {
                if(cutOffTop)
                {
                    context.translate(trains.play.gridSize, trains.play.gridSize);
                    context.rotate(Math.PI);
                }
                this.SpriteCollection.StraightTerminatorTrackSprite.Draw(context, 0, 0);
            }
            else
            {
                this.SpriteCollection.StraightTrackSprite.Draw(context, 0, 0);
            }
        }

        private drawCurvedTrack(context: CanvasRenderingContext2D, drawPlanks: boolean): void {
            (drawPlanks?this.SpriteCollection.CurvedTrackSprite:this.SpriteCollection.CurvedTrackNoPlanksSprite).Draw(context, 0, 0);
        }

        public draw(context: CanvasRenderingContext2D): void {
            context.save();
            context.translate(this.x + 0.5, this.y + 0.5);
            this.clear(context);

            if (GameBoard.showDiagnostics) {
                if (GameBoard.trains.some(t => t.isTrainHere(this.column, this.row, true))) {
                    context.fillStyle = "#0000FF";
                    context.fillRect(0, 0, play.gridSize, play.gridSize);
                } else if (GameBoard.trains.some(t => t.isTrainHere(this.column, this.row))) {
                    context.fillStyle = "#FF0000";
                    context.fillRect(0, 0, play.gridSize, play.gridSize);
                }
            }    

            switch (this.direction) {
                case trains.play.Direction.Horizontal: {
                    var neighbours = trains.play.GameBoard.getNeighbouringCells(this.column, this.row);
                    this.drawStraightTrack(context, neighbours.left === undefined, neighbours.right === undefined);
                    break;
                }
                case trains.play.Direction.Vertical: {
                    var neighbours = trains.play.GameBoard.getNeighbouringCells(this.column, this.row);
                    context.translate(trains.play.gridSize, 0);
                    context.rotate(Math.PI / 2);
                    this.drawStraightTrack(context, neighbours.up === undefined, neighbours.down === undefined);
                    break;
                }
                case trains.play.Direction.LeftUp: {
                    this.leftUp(context, true);
                    break;
                }
                case trains.play.Direction.LeftDown: {
                    this.leftDown(context, true);
                    break;
                }
                case trains.play.Direction.RightUp: {
                    this.rightUp(context, true);
                    break;
                }
                case trains.play.Direction.RightDown: {
                    this.rightDown(context, true);
                    break;
                }
                case trains.play.Direction.Cross: {
                    this.drawStraightTrack(context, false, false);
                    context.translate(trains.play.gridSize, 0);
                    context.rotate(Math.PI / 2);
                    this.drawStraightTrack(context, false, false);
                    break;
                }
                case trains.play.Direction.LeftUpLeftDown: {
                    context.save();
                    this.leftUp(context, this.switchState);
                    context.restore();
                    this.leftDown(context, !this.switchState);
                    context.restore();
                    break;
                }
                case trains.play.Direction.LeftUpRightUp: {
                    context.save();
                    this.leftUp(context, this.switchState);
                    context.restore();
                    this.rightUp(context, !this.switchState);
                    context.restore();
                    break;   
                }
                case trains.play.Direction.RightDownRightUp: {
                    context.save();
                    this.rightDown(context, !this.switchState);
                    context.restore();
                    this.rightUp(context, this.switchState);
                    context.restore();
                    break;
                }
                case trains.play.Direction.RightDownLeftDown: {
                    context.save();
                    this.rightDown(context, !this.switchState);
                    context.restore();
                    this.leftDown(context, this.switchState);
                    context.restore();
                    break;
                }
            }
            context.restore();
        }
        
        rightDown(context: CanvasRenderingContext2D, drawPlanks: boolean): void{
            context.translate(trains.play.gridSize, trains.play.gridSize);
            context.rotate(Math.PI);
            this.drawCurvedTrack(context, drawPlanks);
        }
        
        rightUp(context: CanvasRenderingContext2D, drawPlanks: boolean): void{
            context.translate(trains.play.gridSize, 0);
            context.rotate(Math.PI / 2);
            this.drawCurvedTrack(context, drawPlanks);
        }
        
        leftUp(context: CanvasRenderingContext2D, drawPlanks: boolean): void{
            this.drawCurvedTrack(context, drawPlanks);
        }
        
        leftDown(context: CanvasRenderingContext2D, drawPlanks: boolean): void{
            context.translate(0, trains.play.gridSize);
            context.rotate(Math.PI * 1.5);
            this.drawCurvedTrack(context, drawPlanks);
        }
        

        turnAroundBrightEyes(): void {
            if (this.direction === trains.play.Direction.RightDownLeftDown) {
                this.direction = trains.play.Direction.Vertical;
            } else {
                this.direction = this.direction + 1;
            }
            this.draw(trains.play.GameBoard.trackContext);
            var neighbours = trains.play.GameBoard.getNeighbouringCells(this.column, this.row, true);
            neighbours.all.forEach((neighbour) => {
                neighbour.draw(trains.play.GameBoard.trackContext);
            });
        }
    }
}