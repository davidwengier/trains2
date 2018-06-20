import Board from "./Board";
import Cell from "./Cell";
import { Direction } from "./Direction";
import GameEvent from "./GameEvent";
import ITrainCoords from "./ITrainCoords";
import ITrainCoordsResult from "./ITrainCoordsResult";
import SmokeParticle from "./particle/types/SmokeParticle";
import TrainRenderer from "./TrainRenderer";
import Util from "./util";

export default class Train {
    public static SpawnNewTrain(id: number, cell: Cell, renderer: TrainRenderer,
                                gameBoard: Board, cellSize: number): Train {
        const coords = this.GenerateSpawnCoords(cell, cellSize);

        const trainColourIndex = Math.floor(Math.random() * 10) === 0 ? -1 : renderer.GetRandomShaftColour();
        const trainName = Util.getRandomName();

        const train = new Train(id, coords, renderer, trainColourIndex, trainName, gameBoard, cellSize);

        if (Math.random() < 0.7) {
            train.spawnCarriage(Math.ceil(Math.random() * 5));
        }
        if (Math.random() < 0.7) {
            train.setTrainSpeed(Math.ceil(Math.random() * 5));
        }
        return train;
    }

    private static GenerateSpawnCoords(cell: Cell, gridSize: number): ITrainCoords {
        if (cell.direction === undefined) {
            throw new Error("Cell needs direction to generate");
        }

        const halfGridSize = gridSize / 2;

        let cx = cell.x + halfGridSize;
        let cy = cell.y + halfGridSize;

        switch (cell.direction) {
            case (Direction.Horizontal):
            case (Direction.Cross):
            case (Direction.RightDown):
            case (Direction.RightDownRightUp):
                cx = cell.x + gridSize; // Train pointing to the right
                break;
            case (Direction.Vertical):
            case (Direction.LeftDown):
            case (Direction.RightDownLeftDown):
                cy = cell.y + gridSize; // Train pointing down
                break;
            case (Direction.LeftUp):
            case (Direction.LeftUpLeftDown):
                cx = cell.x; // Train pointing left
                break;
            case (Direction.RightUp):
            case (Direction.LeftUpRightUp):
                cy = cell.y; // Train pointing up
        }

        return {
            currentX: cx,
            currentY: cy,
            // Normalise position from middle towards target position
            previousX: ((cell.x + halfGridSize) + 9 * cx) / 10,
            previousY: ((cell.y + halfGridSize) + 9 * cy) / 10
        };
    }

    public imageReverse: number = 1;
    public carriage: TrainCarriage | undefined;
    public carriagePadding: number = 2;
    public nextSmoke = 0;

    private lastCell: Cell | undefined;
    private directionToUse: Direction | undefined;
    private isPaused: boolean = false;
    private trainSpeed: number = 2;

    constructor(public id: number,
                public coords: ITrainCoords,
                public Renderer: TrainRenderer,
                public trainColourIndex: number,
                public name: string,
                private GameBoard: Board,
                public cellSize: number) {

        this.setTrainSpeed(this.trainSpeed);
    }

    public spawnCarriage(count: number = 1): void {
        if (this.carriage !== undefined) {
            this.carriage.spawnCarriage(count);
        } else {
            const coords = {
                currentX: this.coords.currentX,
                currentY: this.coords.currentY,
                previousX: this.coords.currentX
                    + (-10 * this.magicBullshitCompareTo(this.coords.currentX, this.coords.previousX)),
                previousY: this.coords.currentY
                    + (-10 * this.magicBullshitCompareTo(this.coords.currentY, this.coords.previousY))
            };

            const stagedCarriage = new TrainCarriage(-1, coords, this.Renderer, this.trainColourIndex,
                                                     this.GameBoard, this.cellSize);

            // TODO: Fix this!
            // This should be ~cellSize
            const distToMove = this.cellSize / 2;

            stagedCarriage.chooChooMotherFucker(this.carriagePadding + (distToMove), false);
            stagedCarriage.coords.previousX = stagedCarriage.coords.currentX
                + (-10 * this.magicBullshitCompareTo(stagedCarriage.coords.currentX, stagedCarriage.coords.previousX));
            stagedCarriage.coords.previousY = stagedCarriage.coords.currentY
                + (-10 * this.magicBullshitCompareTo(stagedCarriage.coords.currentY, stagedCarriage.coords.previousY));

            // can only place something down if there is a track there to place it on
            if (this.GameBoard.getCell(
                this.GameBoard.getGridCoord(stagedCarriage.coords.currentX),
                this.GameBoard.getGridCoord(stagedCarriage.coords.currentY)) === undefined) {
                return;
            }

            this.carriage = stagedCarriage;

            if ((--count) > 0) {
                this.carriage.spawnCarriage(count);
            }
        }
    }

    public removeEndCarriage(parent: Train): void {
        if (this.carriage !== undefined) {
            return this.carriage.removeEndCarriage(this);
        } else {
            parent.carriage = undefined;
        }
    }

    public chooChooMotherFucker(speed: number, checkCollision: boolean = true): void {
        if (checkCollision) {
            this.drawParticles();
        }
        if (this.trainSpeed === 0 || this.isPaused) {
            return;
        }
        const baseSpeed = speed;
        speed *= this.trainSpeed;
        // Super small speeds cause MAJOR problems with the game loop.
        // First occurrence of this bug, speed was 1.13e-14!!!!!
        let speedDeadlockCounter = 0;
        while (speed > 0.00001) {
            if (speedDeadlockCounter++ > 10) {
                // This needs to be cleaned up/fixed now that we can detect it!
                // tslint:disable-next-line:no-console
                console.log("SpeedDeadlock");
                this.hammerTime();
                break;
            }

            const column = this.GameBoard.getGridCoord(this.coords.currentX);
            const row = this.GameBoard.getGridCoord(this.coords.currentY);
            const cell = this.GameBoard.getCell(column, row);
            if (cell !== undefined) {
                const result = this.getNewCoordsForTrain(cell, this.coords, speed);
                if (checkCollision && this.willNotHaveAFunTimeAt(result.coords)) {
                    this.waitForTrafficToClear(result.coords);
                    return;
                }

                this.coords = result.coords;
                speed = result.remainingSpeed;
            } else {
                break;
            }
        }
        if (this.carriage !== undefined) {
            this.carriage.trainSpeed = this.trainSpeed;
            this.carriage.chooChooMotherFucker(baseSpeed, false);
        }
    }

    public getTrainSpeed(): number {
        return this.trainSpeed;
    }

    public setTrainSpeed(speed: number) {
        this.trainSpeed = speed;
        GameEvent.Emit("speedchanged", this.id, this.trainSpeed);
    }

    public slowYourRoll(): void {
        this.setTrainSpeed(Math.max(this.trainSpeed - 1, 1));
    }

    public fasterFasterFaster(): void {
        this.setTrainSpeed(Math.min(this.trainSpeed + 1, this.cellSize * 2));
    }

    public hammerTime(): void {
        this.setPaused(true);
    }

    public wakeMeUp(): void {
        this.setPaused(false);
    }

    public magicBullshitCompareTo(pen: number, sword: number): number {
        if (pen === sword) { return 0; }
        if (pen > sword) { return -1; }
        return 1;
    }

    public straightTrackCalculate(cell: Cell, coords: ITrainCoords, speed: number,
                                  swapAxis: boolean = false): ITrainCoordsResult {
        const cellX = swapAxis ? cell.y : cell.x;
        const cellY = swapAxis ? cell.x : cell.y;
        const currentY = swapAxis ? coords.currentX : coords.currentY;
        let targetY = currentY
            + (speed * this.magicBullshitCompareTo((swapAxis ? coords.previousX : coords.previousY), currentY));
        if (targetY < cellY) {
            targetY = cellY - 0.001;
        } else if (targetY > (cellY + this.cellSize)) {
            targetY = cellY + this.cellSize + 0.001;
        }
        return {
            coords: {
                currentX: swapAxis ? targetY : cellX + (this.cellSize / 2),
                currentY: swapAxis ? cellX + (this.cellSize / 2) : targetY,
                previousX: coords.currentX,
                previousY: coords.currentY
            },
            remainingSpeed: (speed + (((speed > 0) ? -1 : 1) * Math.abs(currentY - targetY)))
        };
    }

    public getNewCoordsForTrain(cell: Cell, coords: ITrainCoords, speed: number): ITrainCoordsResult {
        if (this.lastCell === undefined || this.lastCell !== cell) {
            this.directionToUse = cell.getDirectionToUse(this.lastCell);
            this.lastCell = cell;
        }

        if (this.directionToUse === undefined) {
            throw new Error("Direction to use was undefined, was a last cell set?");
        }

        if (this.directionToUse === Direction.Vertical) {
            return this.straightTrackCalculate(cell, coords, speed);
        } else if (this.directionToUse === Direction.Horizontal) {
            return this.straightTrackCalculate(cell, coords, speed, true);
        } else if (this.directionToUse === Direction.Cross) {
            return this.straightTrackCalculate(cell, coords, speed,
                (Math.abs(coords.currentX - coords.previousX) > Math.abs(coords.currentY - coords.previousY)));
        }

        // Woo! Corner time!
        // Who decided round corners was a good idea :P

        // Calculate X and Y offset based on cell type.
        // Why is this needed? Well, on different corners, the centre of the circle is moved.
        //  For LeftUp, the centre of the circle is 0,0
        //  For LeftDown, the centre of the circle is 0,gridSize
        //  For RightUp, the centre is gridSize,0
        //  For RightDown, the centre is gridSize,gridSize
        const yOffset =
            (this.directionToUse === Direction.LeftDown || this.directionToUse === Direction.RightDown)
            ? this.cellSize : 0;
        const xOffset =
            (this.directionToUse === Direction.RightUp || this.directionToUse === Direction.RightDown)
            ? this.cellSize : 0;

        // We then calculate the current angle.
        // This is done by firstly finding the distance from center circle
        // (using cell position, current position, and offset)
        // We then call zeroIncrement which adds 0.001 to the value if === 0.
        // Read up on acos/asin/atan and x,y=0, we don't want any infinities here!
        // Finally we cheat and use atan2 to find the angle.
        const currentXOffset = this.zeroIncrement((coords.currentX - cell.x) - xOffset);
        const currentYOffset = this.zeroIncrement((coords.currentY - cell.y) - yOffset);
        const angle = Math.atan2(currentXOffset, currentYOffset);

        // Same thing again to find the last angle
        const lastXOffset = this.zeroIncrement((coords.previousX - cell.x) - xOffset);
        const lastYOffset = this.zeroIncrement((coords.previousY - cell.y) - yOffset);
        const angleLast = Math.atan2(lastXOffset, lastYOffset);

        // Using magicBullshit we find the direction.
        // We then multiply by -1 if the difference between the 2 angles in greater than Math.PI
        // This fixes a strange bug :)
        let direction = this.magicBullshitCompareTo(angleLast, angle)
                        * ((Math.abs(angleLast - angle) > Math.PI) ? -1 : 1);

        // If we end up with a direction of 0, it means we are stuck!
        if (direction === 0) {
            direction = -1;
        }

        // We can then use the fact that (in radians) angle=lengthOfArc/radius to find what angle is needed
        // To move us 'speed' along the arc
        let newAngle = (angle + ((speed / (this.cellSize / 2)) * direction));

        // Using floor (always round down) and (Math.PI/2) (which is 90 degrees),
        // we can find the limits for this track piece
        const angleSector = Math.floor((angle) / (Math.PI / 2)) * (Math.PI / 2);

        // Check if we have gone outside lower range
        if (newAngle < angleSector) {
            newAngle = angleSector - 0.001;
        } else if (newAngle > (angleSector + (Math.PI / 2))) {
            // Check if we have gone outside upper range
            newAngle = (angleSector + (Math.PI / 2)) + 0.001;
        }
        // Using the relationship lengthOfArc=angle*radius, we can use the change in angle to calculate speed
        const remainingSpeed = speed
            + (((speed >= 0) ? -1 : 1) * (Math.abs(angle - newAngle) * (this.cellSize / 2)));

        // Add 90 degrees because I abused atan2 in a bad way
        // TODO: fix this plx. Tried to fix, failed, this caused the infinity angle bug, reverted.
        newAngle = (Math.PI / 2) - newAngle;

        // Finally use the radius, angle, and offset to find the new coords
        const xOffsetFromGridNew = ((this.cellSize / 2) * Math.cos(newAngle)) + xOffset;
        const yOffsetFromGridNew = ((this.cellSize / 2) * Math.sin(newAngle)) + yOffset;

        return {
            coords: {
                currentX: cell.x + xOffsetFromGridNew,
                currentY: cell.y + yOffsetFromGridNew,
                previousX: coords.currentX,
                previousY: coords.currentY
            },
            remainingSpeed
        };
    }

    public draw(context: CanvasRenderingContext2D, translate: boolean = true): void {
        const angle = this.getTrainAngle();
        const x = this.coords.currentX;
        const y = this.coords.currentY;

        context.save();

        if (translate) {
            context.translate(x, y);
            context.rotate((angle * -1) + ((this.imageReverse < 0) ? Math.PI : 0));
        } else {
            context.translate(this.cellSize / 2, this.cellSize / 2);
        }

        this.Renderer.DrawChoochoo(context, this.trainColourIndex);

        context.restore();

        if (this.GameBoard.showDiagnostics) {
            const front = this.getFrontOfTrain();
            context.fillStyle = "#00FF00";
            context.fillRect(front.currentX - 2, front.currentY - 2, 4, 4);
        }

        if ((this.carriage !== undefined) && translate) {
            this.carriage.draw(context, translate);
            this.drawLink(context);
        }
    }

    public getFrontOfTrain(buffer: number = 0): ITrainCoords {
        const angle = this.getTrainAngle();
        return {
            currentX: this.coords.currentX - Math.sin(angle) * ((this.cellSize / 2) + buffer),
            currentY: this.coords.currentY - Math.cos(angle) * ((this.cellSize / 2) + buffer),
            previousX: 0,
            previousY: 0
        };
    }

    public drawLighting(context: CanvasRenderingContext2D): void {
        const angle = this.getTrainAngle();
        context.save();
        context.translate(this.coords.currentX, this.coords.currentY);
        context.rotate((angle * -1) + ((this.imageReverse < 0) ? Math.PI : 0));
        this.Renderer.DrawChoochooLights(context);
        context.restore();
    }

    public isTrainHere(column: number, row: number, front: boolean = false): boolean {
        const cx = front ? this.getFrontOfTrain() : this.coords;
        const myColumn = this.GameBoard.getGridCoord(cx.currentX);
        const myRow = this.GameBoard.getGridCoord(cx.currentY);
        if (!front && this.carriage !== undefined) {
            return ((column === myColumn && row === myRow) || this.carriage.isTrainHere(column, row));
        } else {
            return column === myColumn && row === myRow;
        }
    }

    public drawLink(context: CanvasRenderingContext2D): void {
        if (this.carriage === undefined) { return; }

        const sp1 = (this.cellSize / 2)
                    / Math.sqrt(Math.pow(this.coords.currentX - this.coords.previousX, 2)
                    + Math.pow(this.coords.currentY - this.coords.previousY, 2));
        const x1 = this.coords.currentX - ((this.coords.currentX - this.coords.previousX) * sp1 * this.imageReverse);
        const y1 = this.coords.currentY - ((this.coords.currentY - this.coords.previousY) * sp1 * this.imageReverse);

        const sp2 = (this.cellSize / 2)
                    / Math.sqrt(Math.pow(this.carriage.coords.currentX - this.carriage.coords.previousX, 2)
                    + Math.pow(this.carriage.coords.currentY - this.carriage.coords.previousY, 2));
        const x2 = this.carriage.coords.currentX
                    + ((this.carriage.coords.currentX - this.carriage.coords.previousX) * sp2 * this.imageReverse);
        const y2 = this.carriage.coords.currentY
                    + ((this.carriage.coords.currentY - this.carriage.coords.previousY) * sp2 * this.imageReverse);

        context.save();
        context.lineWidth = 3;
        context.strokeStyle = "#454545";
        context.beginPath();

        context.moveTo(x1, y1);
        context.lineTo(x2, y2);

        context.stroke();
        context.restore();
    }

    private drawParticles() {
        if (this.nextSmoke < this.GameBoard.gameLoop.gameTimeElapsed) {
            const p = new SmokeParticle();
            p.x = this.coords.currentX;
            p.y = this.coords.currentY;
            this.GameBoard.smokeParticleSystem.push(p);
            this.nextSmoke = this.GameBoard.gameLoop.gameTimeElapsed + (Math.random() * 100) + 325;
        }
    }

    private getTrainAngle(): number {
        return Math.atan2(this.coords.previousX - this.coords.currentX, this.coords.previousY - this.coords.currentY);
    }

    private zeroIncrement(input: number): number {
        return (input === 0) ? input + 0.001 : input;
    }

    private willNotHaveAFunTimeAt(_: ITrainCoords): boolean {
        const frontCoords = this.getFrontOfTrain(1);
        const myColumn = this.GameBoard.getGridCoord(frontCoords.currentX);
        const myRow = this.GameBoard.getGridCoord(frontCoords.currentY);
        if (this.GameBoard.getCell(myColumn, myRow) === undefined) { return true; }
        return this.GameBoard.trains.some((t: Train) => {
            if (t === this) { return false; }
            if (t.isTrainHere(myColumn, myRow)) {
                return true;
            }
            return false;
        });
    }

    private waitForTrafficToClear(coords: ITrainCoords) {
        this.setPaused(true);
        const interval = setInterval(() => {
            if (!this.willNotHaveAFunTimeAt(coords)) {
                clearInterval(interval);
                this.setPaused(false);
            }
        }, 500);
    }

    private setPaused(paused: boolean): void {
        this.isPaused = paused;
        if (this.carriage !== undefined) {
            this.carriage.setPaused(paused);
        }
    }
}

// tslint:disable-next-line:max-classes-per-file
class TrainCarriage extends Train {

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