import { Board } from "./Board";
import { ITrainCoords } from "./ITrainCoords";
import { Train } from "./Train";
import { TrainRenderer } from "./TrainRenderer";

export class TrainCarriage extends Train {

    constructor(id: number,
                coords: ITrainCoords,
                renderer: TrainRenderer,
                trainColourIndex: number,
                gameBoard: Board,
                cellSize: number) {

        super(id, coords, renderer, trainColourIndex, "carriage", gameBoard, cellSize);
    }

    public draw(context: CanvasRenderingContext2D, translate: boolean = true): void {
        const x = this.coords.currentX;
        const y = this.coords.currentY;
        const angle = Math.atan2(this.coords.previousX - x, this.coords.previousY - y);

        context.save();

        if (translate) {
            context.translate(x, y);
            context.rotate((angle * -1) + ((this.imageReverse < 0) ? Math.PI : 0));
        } else {
            context.translate(this.cellSize / 2, this.cellSize / 2);
        }

        this.Renderer.DrawCarriage(context, this.trainColourIndex);

        context.restore();

        if ((this.carriage !== undefined) && translate) {
            this.carriage.draw(context, translate);
            this.drawLink(context);
        }
    }

    public drawLighting(_: CanvasRenderingContext2D): void {
        // Do nothing
    }
}