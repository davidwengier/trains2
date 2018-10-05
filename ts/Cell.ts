import Board from "./Board";
import { Direction } from "./Direction";
import INeighbouringCells from "./INeighbouringCells";

export default abstract class Cell {

    public switchState: boolean = false;
    public happy: boolean;
    public x: number;
    public y: number;
    public direction: Direction;

    constructor(public id: string, public column: number, public row: number,
                public cellSize: number, public gameBoard: Board) {
        this.happy = false;
        this.x = this.column * cellSize;
        this.y = this.row * cellSize;
        this.direction = Direction.None;
    }

    public abstract draw(_: CanvasRenderingContext2D): void;

    public clear(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.cellSize, this.cellSize);
    }

    public abstract turnAroundBrightEyes(): void;

    public checkYourself(): void {
        const neighbours = this.gameBoard.getNeighbouringCells(this.column, this.row);

        const changed = this.determineDirection(neighbours);
        this.happy = (neighbours.all.length > 1);
        this.draw(this.gameBoard.trackContext);

        if (changed) {
            const neighboursToCheck = this.gameBoard.getNeighbouringCells(this.column, this.row);
            neighboursToCheck.all.forEach((n: Cell) => n.checkYourself());
        }
    }

    public crossTheRoad(): boolean {
        const neighbours = this.gameBoard.getNeighbouringCells(this.column, this.row, true);
        return neighbours.all.some((c: Cell) => {
            let myNeighbours = this.gameBoard.getNeighbouringCells(c.column, c.row, true);
            if (myNeighbours.all.length < 4) { return false; }

            if (myNeighbours.up !== undefined && !myNeighbours.up.isConnectedDown() && myNeighbours.up.happy) {
                return false;
            }
            if (myNeighbours.down !== undefined && !myNeighbours.down.isConnectedUp() && myNeighbours.down.happy) {
                return false;
            }
            if (myNeighbours.left !== undefined && !myNeighbours.left.isConnectedRight() && myNeighbours.left.happy) {
                return false;
            }
            if (myNeighbours.right !== undefined && !myNeighbours.right.isConnectedLeft() && myNeighbours.right.happy) {
                return false;
            }

            // if we got here, we should be a cross
            c.direction = Direction.Cross;
            c.happy = true;
            c.draw(this.gameBoard.trackContext);
            myNeighbours = this.gameBoard.getNeighbouringCells(c.column, c.row);
            myNeighbours.all.forEach((c2: Cell) => c2.checkYourself());

            return true;
        });
    }

    public haveAThreeWay(): boolean {
        let myNeighbours = this.gameBoard.getNeighbouringCells(this.column, this.row, true);
        if (myNeighbours.all.length < 3) { return false; }

        if ([myNeighbours.up, myNeighbours.right, myNeighbours.down, myNeighbours.left]
            .filter((n: Cell | undefined) => n !== undefined).length === 3) {
            if (myNeighbours.up !== undefined && !myNeighbours.up.isConnectedDown() && myNeighbours.up.happy) {
                return false;
            }
            if (myNeighbours.down !== undefined && !myNeighbours.down.isConnectedUp() && myNeighbours.down.happy) {
                return false;
            }
            if (myNeighbours.left !== undefined && !myNeighbours.left.isConnectedRight() && myNeighbours.left.happy) {
                return false;
            }
            if (myNeighbours.right !== undefined && !myNeighbours.right.isConnectedLeft() && myNeighbours.right.happy) {
                return false;
            }

            if (myNeighbours.up === undefined) {
                this.direction = Direction.RightDownLeftDown;
            } else if (myNeighbours.down === undefined) {
                this.direction = Direction.LeftUpRightUp;
            } else if (myNeighbours.left === undefined) {
                this.direction = Direction.RightDownRightUp;
            } else if (myNeighbours.right === undefined) {
                this.direction = Direction.LeftUpLeftDown;
            } else {
                return false;
            }
        } else {
            if (myNeighbours.up !== undefined && myNeighbours.up.isConnectedDown() &&
                myNeighbours.down !== undefined && myNeighbours.down.isConnectedUp() &&
                myNeighbours.right !== undefined && myNeighbours.right.isConnectedLeft()) {
                this.direction = Direction.RightDownRightUp;
            } else if (myNeighbours.up !== undefined && myNeighbours.up.isConnectedDown() &&
                myNeighbours.down !== undefined && myNeighbours.down.isConnectedUp() &&
                myNeighbours.left !== undefined && myNeighbours.left.isConnectedRight()) {
                this.direction = Direction.LeftUpLeftDown;
            } else if (myNeighbours.left !== undefined && myNeighbours.left.isConnectedRight() &&
                myNeighbours.down !== undefined && myNeighbours.down.isConnectedUp() &&
                myNeighbours.right !== undefined && myNeighbours.right.isConnectedLeft()) {
                this.direction = Direction.RightDownLeftDown;
            } else if (myNeighbours.up !== undefined && myNeighbours.up.isConnectedDown() &&
                myNeighbours.left !== undefined && myNeighbours.left.isConnectedRight() &&
                myNeighbours.right !== undefined && myNeighbours.right.isConnectedLeft()) {
                this.direction = Direction.LeftUpRightUp;
            } else {
                return false;
            }
        }

        // if we got here, we should be a three way
        this.happy = true;
        this.draw(this.gameBoard.trackContext);
        myNeighbours = this.gameBoard.getNeighbouringCells(this.column, this.row);
        myNeighbours.all.forEach((c2: Cell) => c2.checkYourself());
        return true;
    }

    public switchTrack(): void {
        if (this.direction === Direction.LeftUpLeftDown || this.direction === Direction.LeftUpRightUp ||
            this.direction === Direction.RightDownLeftDown || this.direction === Direction.RightDownRightUp) {
            this.switchState = !this.switchState;
            this.draw(this.gameBoard.trackContext);
        }
    }

    public determineDirection(neighbours: INeighbouringCells): boolean {
        if (this.happy) { return false; }

        let newDirection: Direction;
        if (neighbours.left !== undefined && neighbours.right !== undefined
            && neighbours.up !== undefined && neighbours.down !== undefined) {
            newDirection = Direction.Cross;
        } else if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.up !== undefined) {
            if (neighbours.down !== undefined) {
                newDirection = Direction.LeftUpLeftDown;
            } else {
                newDirection = Direction.LeftUp;
            }
        } else if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.down !== undefined) {
            newDirection = Direction.LeftDown;
        } else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.up !== undefined) {
            if (neighbours.down !== undefined) {
                newDirection = Direction.RightDownRightUp; // last one
            } else {
                newDirection = Direction.RightUp;
            }
        } else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.down !== undefined) {
            newDirection = Direction.RightDown;
        } else if (neighbours.up !== undefined && neighbours.down !== undefined) {
            // greedy vertical and horizontal joins
            newDirection = Direction.Vertical;
        } else if (neighbours.left !== undefined && neighbours.right !== undefined) {
            if (neighbours.up !== undefined) {
                newDirection = Direction.LeftUpRightUp;
            } else if (neighbours.down !== undefined) {
                newDirection = Direction.RightDownLeftDown;
            } else {
                newDirection = Direction.Horizontal;
            }
        } else if (neighbours.up !== undefined || neighbours.down !== undefined) {
            // now less fussy vertical and horizontal joins
            newDirection = Direction.Vertical;
        } else if (neighbours.left !== undefined || neighbours.right !== undefined) {
            newDirection = Direction.Horizontal;
        } else {
            newDirection = Direction.Horizontal;
        }

        if (newDirection !== undefined && newDirection !== this.direction) {
            this.direction = newDirection;
            return true;
        }

        return false;
    }

    public isConnectedUp(): boolean {
        return this.direction === Direction.Vertical ||
            this.direction === Direction.LeftUp ||
            this.direction === Direction.RightUp ||
            this.direction === Direction.Cross ||
            this.direction === Direction.LeftUpLeftDown ||
            this.direction === Direction.LeftUpRightUp ||
            this.direction === Direction.RightDownRightUp;
    }

    public isConnectedDown(): boolean {
        return this.direction === Direction.Vertical ||
            this.direction === Direction.LeftDown ||
            this.direction === Direction.RightDown ||
            this.direction === Direction.Cross ||
            this.direction === Direction.LeftUpLeftDown ||
            this.direction === Direction.RightDownLeftDown ||
            this.direction === Direction.RightDownRightUp;
    }

    public isConnectedLeft(): boolean {
        return this.direction === Direction.Horizontal ||
            this.direction === Direction.LeftUp ||
            this.direction === Direction.LeftDown ||
            this.direction === Direction.Cross ||
            this.direction === Direction.LeftUpLeftDown ||
            this.direction === Direction.LeftUpRightUp ||
            this.direction === Direction.RightDownLeftDown;
    }

    public isConnectedRight(): boolean {
        return this.direction === Direction.Horizontal ||
            this.direction === Direction.RightDown ||
            this.direction === Direction.RightUp ||
            this.direction === Direction.Cross ||
            this.direction === Direction.RightDownLeftDown ||
            this.direction === Direction.LeftUpRightUp ||
            this.direction === Direction.RightDownRightUp;
    }

    public destroy(): JQueryDeferred<{}> {
        const def = $.Deferred();
        this.destroyLoop(def, 0);

        def.done(() => {
            this.gameBoard.trackContext.clearRect(this.x, this.y, this.cellSize, this.cellSize);
        });

        return def;
    }

    public destroyLoop(deferred: JQueryDeferred<{}> , counter: number): void {
        setTimeout(() => {
            const x = Math.floor(Math.random() * this.cellSize);
            const y = Math.floor(Math.random() * this.cellSize);

            this.gameBoard.trackContext.clearRect(this.x + x, this.y + y, 5, 5);
            counter++;
            if (counter < 40) {
                this.destroyLoop(deferred, counter);
            } else {
                deferred.resolve();
            }
        }, 10);
    }

    public getDirectionToUse(lastCell: Cell | undefined): Direction {
        var sw = this.switchState;
        if (lastCell !== undefined) {
            const neighbours = this.gameBoard.getNeighbouringCells(lastCell.column, lastCell.row);
            if (this.direction === Direction.LeftUpLeftDown) {
                if (lastCell !== undefined && lastCell.isConnectedDown() && neighbours.down === this) {
                    if (!this.switchState) { sw = !sw; }
                } else if (lastCell !== undefined && lastCell.isConnectedUp() && neighbours.up === this) {
                    if (this.switchState) { sw = !sw; }
                }
                return sw ? Direction.LeftUp : Direction.LeftDown;
            } else if (this.direction === Direction.LeftUpRightUp) {
                if (lastCell !== undefined && lastCell.isConnectedLeft() && neighbours.left === this) {
                    if (this.switchState) { sw = !sw; }
                } else if (lastCell !== undefined && lastCell.isConnectedRight() && neighbours.right === this) {
                    if (!this.switchState) { sw = !sw; }
                }
                return sw ? Direction.LeftUp : Direction.RightUp;
            } else if (this.direction === Direction.RightDownLeftDown) {
                if (lastCell !== undefined && lastCell.isConnectedLeft() && neighbours.left === this) {
                    if (this.switchState) { sw = !sw; }
                } else if (lastCell !== undefined && lastCell.isConnectedRight() && neighbours.right === this) {
                    if (!this.switchState) { sw = !sw; }
                }
                return sw ? Direction.LeftDown : Direction.RightDown;
            } else if (this.direction === Direction.RightDownRightUp) {
                if (lastCell !== undefined && lastCell.isConnectedDown() && neighbours.down === this) {
                    if (!this.switchState) { sw = !sw; }
                } else if (lastCell !== undefined && lastCell.isConnectedUp() && neighbours.up === this) {
                    if (this.switchState) { sw = !sw; }
                }
                return sw ? Direction.RightUp : Direction.RightDown;
            }
        }
        return this.direction;
    }
}