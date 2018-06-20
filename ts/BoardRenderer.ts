import { IBoardCells } from "./IBoardCells";

export class BoardRenderer {
    public static drawGrid(context: CanvasRenderingContext2D,
                           canvasWidth: number, canvasHeight: number,
                           gridSize: number, gridColour: string): void {

        context.beginPath();

        for (let x = gridSize; x < canvasWidth; x += gridSize) {
            context.moveTo(x, 0);
            context.lineTo(x, canvasHeight);
        }

        for (let y = gridSize; y < canvasHeight; y += gridSize) {
            context.moveTo(0, y);
            context.lineTo(canvasWidth, y);
        }

        context.strokeStyle = gridColour;
        context.stroke();
    }

    public static redrawCells(cells: IBoardCells, context: CanvasRenderingContext2D,
                              canvasWidth: number, canvasHeight: number): void {
        BoardRenderer.clearCells(context, canvasWidth, canvasHeight);

        for (const id in cells) {
            if (cells.hasOwnProperty(id)) {
                cells[id].draw(context);
            }
        }
    }

    public static clearCells(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
        context.beginPath();
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.closePath();
    }

}