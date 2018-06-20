import { Cell } from "./play.cell";

export interface INeighbouringCells {
    up: Cell | undefined;
    right: Cell | undefined;
    down: Cell | undefined;
    left: Cell | undefined;
    all: Cell[];
}