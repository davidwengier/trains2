import { Cell } from "./play.cell";

export interface IBoardCells {
    [position: string]: Cell;
}