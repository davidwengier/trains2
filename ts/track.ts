import Board from "./Board";
import Cell from "./Cell";
import { Direction } from "./Direction";
import TrackSpriteCollection from "./sprite/TrackSpriteCollection";
import Train from "./Train";

export default class Track extends Cell {
    private SpriteCollection: TrackSpriteCollection;
    constructor(id: string, column: number, row: number, cellSize: number,
                spriteCollection: TrackSpriteCollection, gameBoard: Board) {
        super(id, column, row, cellSize, gameBoard);
        this.SpriteCollection = spriteCollection;
    }

    public drawStraightTrack(context: CanvasRenderingContext2D, cutOffTop: boolean, cutOffBottom: boolean): void {
        if ((cutOffTop || cutOffBottom) && (cutOffTop !== cutOffBottom)) {
            if (cutOffTop) {
                context.translate(this.cellSize, this.cellSize);
                context.rotate(Math.PI);
            }
            this.SpriteCollection.StraightTerminatorTrackSprite.Draw(context, 0, 0);
        } else {
            this.SpriteCollection.StraightTrackSprite.Draw(context, 0, 0);
        }
    }

    public turnAroundBrightEyes(): void {
        if (this.direction === Direction.RightDownLeftDown) {
            this.direction = Direction.Vertical;
        } else {
            this.direction = this.direction + 1;
        }
        this.draw(this.gameBoard.trackContext);
        const neighbours = this.gameBoard.getNeighbouringCells(this.column, this.row, true);
        neighbours.all.forEach((neighbour: Cell) => {
            neighbour.draw(this.gameBoard.trackContext);
        });
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this.x + 0.5, this.y + 0.5);
        this.clear(context);

        if (this.gameBoard.showDiagnostics) {
            if (this.gameBoard.trains.some((t: Train) => t.isTrainHere(this.column, this.row, true))) {
                context.fillStyle = "#0000FF";
                context.fillRect(0, 0, this.cellSize, this.cellSize);
            } else if (this.gameBoard.trains.some((t: Train) => t.isTrainHere(this.column, this.row))) {
                context.fillStyle = "#FF0000";
                context.fillRect(0, 0, this.cellSize, this.cellSize);
            }
        }

        switch (this.direction) {
            case Direction.Horizontal:
                {
                    const neighbours = this.gameBoard.getNeighbouringCells(this.column, this.row);
                    this.drawStraightTrack(context, neighbours.left === undefined, neighbours.right === undefined);
                    break;
                }
            case Direction.Vertical:
                {
                    const neighbours = this.gameBoard.getNeighbouringCells(this.column, this.row);
                    context.translate(this.cellSize, 0);
                    context.rotate(Math.PI / 2);
                    this.drawStraightTrack(context, neighbours.up === undefined, neighbours.down === undefined);
                    break;
                }
            case Direction.LeftUp:
                {
                    this.leftUp(context, true);
                    break;
                }
            case Direction.LeftDown:
                {
                    this.leftDown(context, true);
                    break;
                }
            case Direction.RightUp:
                {
                    this.rightUp(context, true);
                    break;
                }
            case Direction.RightDown:
                {
                    this.rightDown(context, true);
                    break;
                }
            case Direction.Cross:
                {
                    this.drawStraightTrack(context, false, false);
                    context.translate(this.cellSize, 0);
                    context.rotate(Math.PI / 2);
                    this.drawStraightTrack(context, false, false);
                    break;
                }
            case Direction.LeftUpLeftDown:
                {
                    context.save();
                    this.leftUp(context, this.switchState);
                    context.restore();
                    this.leftDown(context, !this.switchState);
                    context.restore();
                    break;
                }
            case Direction.LeftUpRightUp:
                {
                    context.save();
                    this.leftUp(context, this.switchState);
                    context.restore();
                    this.rightUp(context, !this.switchState);
                    context.restore();
                    break;
                }
            case Direction.RightDownRightUp:
                {
                    context.save();
                    this.rightDown(context, !this.switchState);
                    context.restore();
                    this.rightUp(context, this.switchState);
                    context.restore();
                    break;
                }
            case Direction.RightDownLeftDown:
                {
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

    private drawCurvedTrack(context: CanvasRenderingContext2D, drawPlanks: boolean): void {
        (drawPlanks ? this.SpriteCollection.CurvedTrackSprite : this.SpriteCollection.CurvedTrackNoPlanksSprite)
            .Draw(context, 0, 0);
    }

    private rightDown(context: CanvasRenderingContext2D, drawPlanks: boolean): void {
        context.translate(this.cellSize, this.cellSize);
        context.rotate(Math.PI);
        this.drawCurvedTrack(context, drawPlanks);
    }

    private rightUp(context: CanvasRenderingContext2D, drawPlanks: boolean): void {
        context.translate(this.cellSize, 0);
        context.rotate(Math.PI / 2);
        this.drawCurvedTrack(context, drawPlanks);
    }

    private leftUp(context: CanvasRenderingContext2D, drawPlanks: boolean): void {
        this.drawCurvedTrack(context, drawPlanks);
    }

    private leftDown(context: CanvasRenderingContext2D, drawPlanks: boolean): void {
        context.translate(0, this.cellSize);
        context.rotate(Math.PI * 1.5);
        this.drawCurvedTrack(context, drawPlanks);
    }
}