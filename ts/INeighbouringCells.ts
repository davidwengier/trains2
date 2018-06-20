import Cell from "./Cell";

export default interface INeighbouringCells {
    up: Cell | undefined;
    right: Cell | undefined;
    down: Cell | undefined;
    left: Cell | undefined;
    all: Cell[];
}