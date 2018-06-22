import Cell from "./Cell";

export default interface IBoardCells {
    [position: string]: Cell;
}