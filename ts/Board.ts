import BoardRenderer from "./BoardRenderer";
import Cell from "./Cell";
import GameEvent from "./GameEvent";
import GameLoop from "./GameLoop";
import IBoardCells from "./IBoardCells";
import INeighbouringCells from "./INeighbouringCells";
import { IPlayComponents } from "./IPlayComponents";
import SmokeParticle from "./particle/types/SmokeParticle";
import RenderLoop from "./RenderLoop";
import SoundLibrary from "./sound/SoundLibrary";
import SoundPlayer from "./sound/SoundPlayer";
import TrackSpriteCollection from "./sprite/TrackSpriteCollection";
import { Tool } from "./Tool";
import Track from "./track";
import Train from "./Train";
import TrainRenderer from "./TrainRenderer";
import Util from "./util";

export let gridSize: number = 40;
export let gridColour: string = "#eee";

export let trackWidth = 4;
export let trackPadding = 10;
export let firstTrackPosY = trackPadding;
export let secondTrackPosY = gridSize - trackPadding;

export default class Board {

    public trainCanvas: HTMLCanvasElement;
    public trainContext: CanvasRenderingContext2D;
    public trackContext: CanvasRenderingContext2D;
    public trainLogoContext: CanvasRenderingContext2D;
    public lightingBufferCanvas: HTMLCanvasElement;
    public lightingBufferContext: CanvasRenderingContext2D;
    public canvasWidth: number;
    public canvasHeight: number;
    public trains: Train[] = [];
    public smokeParticleSystem = new Array<SmokeParticle>();
    public selectedTrain: Train | undefined;
    public gameLoop: GameLoop;
    public renderLoop: RenderLoop;
    public showDiagnostics = false;
    public CheatAlwaysNight = false;

    private $window: JQuery;
    private trackCanvas: HTMLCanvasElement;
    private gridCanvas: HTMLCanvasElement;
    private gridContext: CanvasRenderingContext2D;
    private trainLogoCanvas: HTMLCanvasElement;
    private maxColumns: number;
    private maxRows: number;
    private cells: IBoardCells = {};
    private tool: Tool = Tool.Pointer;
    private trainIDCounter = 0;
    private player: SoundPlayer;

    private trainRenderer: TrainRenderer;
    private trackSpriteCollection: TrackSpriteCollection;

    constructor(public playComponents: IPlayComponents) {

        this.$window = $(window);

        this.trainCanvas = this.playComponents.$trainCanvas.get(0) as HTMLCanvasElement;
        this.trainContext = this.get2dContextFromCanvas(this.trainCanvas);

        this.trackCanvas = this.playComponents.$trackCanvas.get(0) as HTMLCanvasElement;
        this.trackContext = this.get2dContextFromCanvas(this.trackCanvas);

        this.gridCanvas = this.playComponents.$gridCanvas.get(0) as HTMLCanvasElement;
        this.gridContext = this.get2dContextFromCanvas(this.gridCanvas);

        this.trainLogoCanvas = this.playComponents.$trainLogoCanvas.get(0) as HTMLCanvasElement;
        this.trainLogoContext = this.get2dContextFromCanvas(this.trainLogoCanvas);

        this.playComponents.$trainLogoCanvas.attr("width", gridSize);
        this.playComponents.$trainLogoCanvas.attr("height", gridSize);
        this.playComponents.$trainLogoCanvas.width(gridSize);
        this.playComponents.$trainLogoCanvas.height(gridSize);

        this.canvasWidth = this.roundToNearestGridSize(this.$window.width() - (gridSize * 2));
        this.maxColumns = this.canvasWidth / gridSize;
        this.canvasHeight = this.roundToNearestGridSize(this.$window.height() - gridSize);
        this.maxRows = this.canvasHeight / gridSize;

        this.playComponents.$canvases.attr("width", this.canvasWidth);
        this.playComponents.$canvases.attr("height", this.canvasHeight);
        this.playComponents.$canvases.width(this.canvasWidth);
        this.playComponents.$canvases.css("top", (this.$window.height() - this.canvasHeight) / 2);
        this.playComponents.$canvases.css("left", (this.$window.width() - this.canvasWidth) / 2);

        [this.trackCanvas, this.trainCanvas].forEach((el: HTMLCanvasElement) => {
            el.addEventListener("click", (event: MouseEvent) => this.cellClick(event));
            el.addEventListener("mousemove", (event: MouseEvent) => this.cellMoveOver(event));
            el.addEventListener("touchstart", (_: any) => false);
            el.addEventListener("touchmove", (event: any) => {
                this.cellTouch(event);
                event.preventDefault();
                return false;
            });
            el.addEventListener("contextmenu", (ev) => {
                this.cellRightClick(ev);
                ev.preventDefault();
                return false; }, false);
        });

        this.trainRenderer = new TrainRenderer(gridSize, firstTrackPosY, secondTrackPosY);
        this.trackSpriteCollection = new TrackSpriteCollection(gridSize, trackWidth);

        // Hidden canvas buffer
        this.lightingBufferCanvas = document.createElement("canvas") as HTMLCanvasElement;
        this.lightingBufferCanvas.width = this.canvasWidth;
        this.lightingBufferCanvas.height = this.canvasHeight;
        this.lightingBufferContext = this.get2dContextFromCanvas(this.lightingBufferCanvas);

        this.gameLoop = new GameLoop(this);
        this.renderLoop = new RenderLoop(this);
        BoardRenderer.drawGrid(this.gridContext, this.canvasWidth, this.canvasHeight, gridSize, gridColour);
        this.gameLoop.startLoop();
        this.renderLoop.startLoop();
        this.player = new SoundPlayer();

        this.setMuted(Util.toBoolean(localStorage.getItem("muted") || "false"));
        this.setAutoSave(Util.toBoolean(localStorage.getItem("autosave") || "false"));

        setTimeout(() => {
            this.setTool(Tool.Track);
        }, 100);
    }

    public loadCells(): void {
        const savedCells = JSON.parse(localStorage.getItem("cells") || "");
        if (savedCells !== undefined) {
            for (const id in savedCells) {
                if (savedCells.hasOwnProperty(id)) {
                    const theCell = savedCells[id] as Cell;
                    const newCell = new Track(theCell.id, theCell.column, theCell.row, theCell.cellSize,
                        this.trackSpriteCollection, this);
                    newCell.direction = theCell.direction;
                    newCell.happy = theCell.happy;
                    newCell.switchState = theCell.switchState;
                    this.cells[newCell.id] = newCell;
                }
            }
        }
        this.redraw();
    }

    public redraw(): void {
        BoardRenderer.redrawCells(this.cells, this.trackContext, this.canvasWidth, this.canvasHeight);
    }

    public saveCells(): void {
        if (Util.toBoolean(localStorage.getItem("autosave") || "false")) {
            localStorage.setItem("cells", JSON.stringify(this.cells));
        }
    }

    public getGridCoord(value: number): number {
        return Math.floor(value / gridSize);
    }

    public getCellID(column: number, row: number): string {
        return column.toString() + ":" + row.toString();
    }

    public getCell(column: number, row: number): Cell {
        return this.cells[this.getCellID(column, row)];
    }

    public getNeighbouringCells(column: number, row: number,
                                includeHappyNeighbours: boolean = false): INeighbouringCells {
        let up: Cell|undefined = this.cells[this.getCellID(column, row - 1)];
        let right: Cell|undefined = this.cells[this.getCellID(column + 1, row)];
        let down: Cell|undefined = this.cells[this.getCellID(column, row + 1)];
        let left: Cell|undefined = this.cells[this.getCellID(column - 1, row)];

        // if any of the neighbours are happy, and not happy with us, then we need to ignore them
        if (!includeHappyNeighbours) {
            if (up !== undefined && up.happy && !up.isConnectedDown()) { up = undefined; }
            if (right !== undefined && right.happy && !right.isConnectedLeft()) { right = undefined; }
            if (down !== undefined && down.happy && !down.isConnectedUp()) { down = undefined; }
            if (left !== undefined && left.happy && !left.isConnectedRight()) { left = undefined; }
        }

        const all: Cell[] = [];
        if (up !== undefined) { all.push(up); }
        if (right !== undefined) { all.push(right); }
        if (down !== undefined) { all.push(down); }
        if (left !== undefined) { all.push(left); }

        return {
            up,
            right,
            down,
            left,
            all
        };
    }

    public trackControlClick(option: EventTarget): void {
            const $option = $(option);
            switch ($option.data("action").toLowerCase()) {
                case "pointer": {
                    this.setTool(Tool.Pointer);
                    break;
                }
                case "train": {
                    this.setTool(Tool.Train);
                    break;
                }
                case "pencil": {
                    this.setTool(Tool.Track);
                    break;
                }
                case "eraser": {
                    this.setTool(Tool.Eraser);
                    break;
                }
                case "rotate": {
                    this.setTool(Tool.Rotate);
                    break;
                }
                case "bomb": {
                    const response = confirm("Are you sure buddy?");
                    if (response) {
                        this.destroyTrack();
                        this.setTool(Tool.Track);
                    }
                    break;
                }
            }
    }

    public trainControlClick(option: EventTarget): void {
        if (this.selectedTrain !== undefined) {
            const $option = $(option);
            switch ($option.data("action").toLowerCase()) {
                case "play": {
                    this.selectedTrain.wakeMeUp();
                    break;
                }
                case "pause": {
                    this.selectedTrain.hammerTime();
                    break;
                }
                case "forward": {
                    this.selectedTrain.fasterFasterFaster();
                    break;
                }
                case "backward": {
                    this.selectedTrain.slowYourRoll();
                    break;
                }
                case "delete": {
                    for (let i = 0; i < this.trains.length; i++) {
                        if (this.trains[i].id === this.selectedTrain.id) {
                            this.trains.splice(i, 1);
                            this.hideTrainControls();
                            break;
                        }
                    }
                    break;
                }
                case "spawncarriage": {
                    this.selectedTrain.spawnCarriage();
                    break;
                }
                case "removecarriage": {
                    this.selectedTrain.removeEndCarriage();
                    break;
                }
            }
        } else {
            this.hideTrainControls();
        }
    }

    public globalControlClick(option: EventTarget): void {
        const $option = $(option);
        switch ($option.data("action").toLowerCase()) {
            case "play": {
                this.gameLoop.startLoop();
                break;
            }
            case "pause": {
                this.gameLoop.stopLoop();
                break;
            }
            case "forward": {
                this.trains.forEach((t) => t.fasterFasterFaster());
                break;
            }
            case "backward": {
                this.trains.forEach((t) => t.slowYourRoll());
                break;
            }
        }
    }

    public showTrainControls(train: Train): void {
        this.selectedTrain = train;
        GameEvent.Emit("showtraincontrols", this.selectedTrain);
    }

    public hideTrainControls(): void {
        this.selectedTrain = undefined;
        GameEvent.Emit("hidetraincontrols");
    }

    public setMuted(mute: boolean): void {
        localStorage.setItem("muted", mute.toString());
        if (mute) {
            this.playComponents.$mute.removeClass("fa-volume-up").addClass("fa-volume-off");
        } else {
            this.playComponents.$mute.removeClass("fa-volume-off").addClass("fa-volume-up");
        }
        this.player.setMuted(mute);
    }

    public setAutoSave(autosave: boolean): void {
        localStorage.setItem("autosave", autosave.toString());
        if (autosave) {
            this.playComponents.$autosave.css("color", "green");
        } else {
            localStorage.removeItem("cells");
            this.playComponents.$autosave.css("color", "black");
        }
    }

    private setTool(tool: Tool): void {
        if (tool !== this.tool) {
            this.tool = tool;

            let cursorName;
            let hotspot = "bottom left";
            switch (tool) {
                case Tool.Track: {
                    cursorName = "pencil";
                    break;
                }
                case Tool.Train: {
                    cursorName = "train";
                    hotspot = "center";
                    break;
                }
                case Tool.Eraser: {
                    cursorName = "eraser";
                    break;
                }
                case Tool.Rotate: {
                    cursorName = "refresh";
                    hotspot = "center";
                    break;
                }
                case Tool.Pointer:
                default: {
                    cursorName = "hand-pointer-o";
                    hotspot = "top left";
                    break;
                }
            }

            $("body").css("cursor", "");
            $("body").awesomeCursor(cursorName, {
                hotspot,
                size: 22
            });
        }
    }

    private cellMoveOver(event: MouseEvent): void {
        if (event.buttons === 1 && this.tool !== Tool.Train
            && this.tool !== Tool.Rotate && this.tool !== Tool.Pointer) {
            this.cellClick(event);
        }
    }

    private cellTouch(event: any): void {
        if (this.tool === Tool.Train) { return; }

        const column = this.getGridCoord(event.touches[0].pageX - this.trackCanvas.offsetLeft);
        const row = this.getGridCoord(event.touches[0].pageY - this.trackCanvas.offsetTop);
        this.doTool(column, row, event.shiftKey);
    }

    private cellRightClick(event: MouseEvent): void {
        const column = this.getGridCoord(event.pageX - this.trackCanvas.offsetLeft);
        const row = this.getGridCoord(event.pageY - this.trackCanvas.offsetTop);
        this.eraseTrack(column, row);
    }

    private cellClick(event: MouseEvent): void {
        const column = this.getGridCoord(event.pageX - this.trackCanvas.offsetLeft);
        const row = this.getGridCoord(event.pageY - this.trackCanvas.offsetTop);

        this.doTool(column, row, event.shiftKey);
    }

    private doTool(column: number, row: number, shift: boolean): void {
        if (row >= this.maxRows || column >= this.maxColumns) { return; }

        switch (this.tool) {
            case Tool.Pointer:
            {
                this.pointAtThing(column, row);
                break;
            }
            case Tool.Track:
            {
                if (shift) {
                    this.rotateTrack(column, row);
                } else {
                    this.newTrack(column, row);
                }
                break;
            }
            case Tool.Eraser:
            {
                this.eraseTrack(column, row);
                break;
            }
            case Tool.Rotate:
            {
                this.rotateTrack(column, row);
                break;
            }
            case Tool.Train:
            {
                const cellID = this.getCellID(column, row);

                if (this.cells[cellID] !== undefined) {
                    const t = Train.SpawnNewTrain(this.trainIDCounter++, this.cells[cellID], this.trainRenderer,
                    this, gridSize);
                    // Pre-move train to stop rendering at an odd angle.
                    t.chooChooMotherFucker(0.1, false);
                    this.trains.push(t);
                    this.showTrainControls(t);
                }
                break;
            }
        }
    }

    private destroyTrack(): void {
        this.hideTrainControls();
        this.trains = new Array<Train>();
        const deferreds = new Array<JQueryDeferred<{}>>();
        for (const id in this.cells) {
            if (this.cells.hasOwnProperty(id)) {
                deferreds.push(this.cells[id].destroy());
            }
        }

        $.when.apply($, deferreds).done(() => {
            BoardRenderer.clearCells(this.trackContext, this.canvasWidth, this.canvasHeight);
            BoardRenderer.clearCells(this.trainContext, this.canvasWidth, this.canvasHeight);
            this.cells = {};
            localStorage.removeItem("cells");
        });
    }

    private rotateTrack(column: number, row: number): void {
        const cellID = this.getCellID(column, row);
        const cell: Cell = this.cells[cellID];
        if (cell !== undefined) {
            cell.turnAroundBrightEyes();
        }
        this.saveCells();
    }

    private newTrack(column: number, row: number): void {
        const cellID = this.getCellID(column, row);

        if (this.cells[cellID] === undefined) {
            this.player.playSound(SoundLibrary.ClickSound);
            const newCell = new Track(cellID, column, row, gridSize, this.trackSpriteCollection, this);

            this.cells[newCell.id] = newCell;

            if (!newCell.crossTheRoad()) {
                newCell.checkYourself();
            }
        } else {
            this.cells[cellID].haveAThreeWay();
        }
        this.saveCells();
    }

    private eraseTrack(column: number, row: number): void {
        const cellID = this.getCellID(column, row);

        const cell = this.cells[cellID];
        if (cell !== undefined) {
            delete this.cells[cellID];
            this.saveCells();
            cell.destroy().done(() => {
                const neighbours = this.getNeighbouringCells(column, row, true);

                // some of my neighbours may need to be less happy now
                if (neighbours.up !== undefined && neighbours.up.happy && neighbours.up.isConnectedDown()) {
                    neighbours.up.happy = false;
                }
                if (neighbours.down !== undefined && neighbours.down.happy && neighbours.down.isConnectedUp()) {
                    neighbours.down.happy = false;
                }
                if (neighbours.left !== undefined && neighbours.left.happy && neighbours.left.isConnectedRight()) {
                    neighbours.left.happy = false;
                }
                if (neighbours.right !== undefined && neighbours.right.happy && neighbours.right.isConnectedLeft()) {
                    neighbours.right.happy = false;
                }

                neighbours.all.forEach((n) => n.checkYourself());
            });
        }
    }

    private pointAtThing(column: number, row: number): void {
        if (!this.trains.some((train) => {
            if (train.isTrainHere(column, row)) {
                this.showTrainControls(train);
                return true;
            }
            return false;
        })) {
            // change points?
            const cellID = this.getCellID(column, row);
            const cell = this.cells[cellID];
            if (cell !== undefined) {
                cell.switchTrack();
            }
            this.saveCells();
        }
    }

    private roundToNearestGridSize(value: number): number {
        return Math.floor(value / gridSize) * gridSize;
    }

    private get2dContextFromCanvas(canvas: HTMLCanvasElement) {
        const context = canvas.getContext("2d");

        if (context === null) {
            throw new Error("Unable to get 2d context from canvas");
        }

        return context;
    }
}