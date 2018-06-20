export default class TrainRenderer {

    // dark then light
    public readonly trainColours: string[][] = [
        ["#7A040B", "#DD2C3E"], // red
        ["#4272DC", "#759cef"], // blue
        ["#2e9b3d", "#66d174"], // green
        ["#44096d", "#8644b5"], // purple
        ["#8644b5", "#f4ef53"] // yellow
    ];

    private baseColour: string;

    private halfGridSize: number;

    private trainWidth: number;
    private trainLength: number;

    private leftX: number;
    private rightX: number;

    private frontY: number;
    private backY: number;

    private roofPoke: number;
    private roofWidth: number;
    private roofLength: number;
    private roofX: number;
    private roofY: number;

    private shaftPadding: number;
    private shaftWidth: number;
    private shaftLength: number;
    private shaftX: number;
    private shaftY: number;

    private bumperPoke: number;
    private bumperWidth: number;
    private bumperLength: number;
    private bumperOffset: number;

    private lightAngleInDegrees: number;
    private lightDistance: number;
    private lightFalloffDistance: number;

    constructor(gridSize: number, firstTackPosY: number, secondTrackPosY: number) {
        // DRAW ASSUMING TRAIN FACING UP
        this.baseColour = "#111111";

        this.halfGridSize = gridSize / 2;

        this.trainWidth = secondTrackPosY - firstTackPosY;
        this.trainLength = gridSize;

        this.leftX = firstTackPosY * -1;
        this.rightX = this.leftX + this.trainWidth;

        this.frontY = this.halfGridSize * -1;
        this.backY = this.halfGridSize;

        this.roofPoke = 2;
        this.roofWidth = this.trainWidth + this.roofPoke * 2;
        this.roofLength = 12;
        this.roofX = this.leftX - this.roofPoke;
        this.roofY = this.backY - this.roofLength;

        this.shaftPadding = 4;
        this.shaftWidth = this.trainWidth - this.shaftPadding * 2;
        this.shaftLength = this.trainLength - this.shaftPadding;
        this.shaftX = this.leftX + this.shaftPadding;
        this.shaftY = this.frontY + this.shaftPadding;

        this.bumperPoke = 2;
        this.bumperWidth = 1;
        this.bumperLength = 3;
        this.bumperOffset = 3;

        this.lightAngleInDegrees = 60;
        this.lightDistance = 80;
        this.lightFalloffDistance = 30;
    }

    public GetRandomShaftColour(): number {
        return Math.floor(Math.random() * this.trainColours.length);
    }

    public DrawChoochooLights(context: CanvasRenderingContext2D): void {
        const xOffset = this.lightDistance * Math.tan(this.lightAngleInDegrees * (180 / Math.PI)) / 2;

        context.beginPath();
        const leftLightGradient = context.createRadialGradient(
            this.leftX, this.frontY - this.bumperPoke, this.lightFalloffDistance,
            this.leftX, this.frontY - this.bumperPoke, this.lightDistance);
        leftLightGradient.addColorStop(0, "#BBBBBB");
        leftLightGradient.addColorStop(1, "rgba(187,187,187,0)");
        context.fillStyle = leftLightGradient;
        context.moveTo(0, this.frontY - this.bumperPoke);
        context.lineTo(0 - xOffset, (this.frontY - this.bumperPoke) - this.lightDistance);
        // Need to implement circle tip here instead of flat
        context.lineTo(0 + xOffset, (this.frontY - this.bumperPoke) - this.lightDistance);
        context.lineTo(0, this.frontY - this.bumperPoke);
        context.fill();
    }

    public DrawChoochoo(context: CanvasRenderingContext2D, shaftColourIndex: number): void {

        let shaftColour = this.trainColours[shaftColourIndex];
        if (shaftColourIndex === -1) {
            shaftColour = this.trainColours[this.GetRandomShaftColour()];
        }

        context.fillStyle = this.baseColour;
        context.fillRect(this.leftX, this.frontY, this.trainWidth, this.trainLength);

        context.fillStyle = this.GetShaftFillStyle(context, shaftColour[0], shaftColour[1]);
        context.fillRect(this.shaftX, this.shaftY, this.shaftWidth, this.shaftLength);

        context.fillStyle = this.GetRoofFillStyle(context, this.baseColour, "#5d5d5d");
        context.fillRect(this.roofX, this.roofY, this.roofWidth, this.roofLength);
        context.strokeRect(this.roofX, this.roofY, this.roofWidth, this.roofLength);

        context.fillStyle = this.baseColour;
        context.beginPath();
        context.arc(this.shaftX + (this.shaftWidth / 2), this.shaftY + 6, 2, 0, 2 * Math.PI);
        context.stroke();
        context.closePath();
        context.fill();

        this.DrawBumpers(context, true);
        this.DrawBumpers(context, false);
    }

    public DrawCarriage(context: CanvasRenderingContext2D, shaftColourIndex: number): void {

        let shaftColour = this.trainColours[shaftColourIndex];
        if (shaftColourIndex === -1) {
            shaftColour = this.trainColours[this.GetRandomShaftColour()];
        }
        context.fillStyle = this.baseColour;
        context.fillRect(this.leftX, this.frontY, this.trainWidth, this.trainLength);

        context.fillStyle = this.GetShaftFillStyle(context, shaftColour[0], shaftColour[1]);
        context.fillRect(this.shaftX, this.shaftY, this.shaftWidth, this.shaftLength - this.shaftPadding);
    }

    public GetRoofFillStyle(context: CanvasRenderingContext2D,
                            firstColour: string, secondColour: string): CanvasGradient {
        const x2 = this.roofX + this.roofWidth;

        const grd = context.createLinearGradient(this.roofX, this.roofY, x2, this.roofY);
        grd.addColorStop(0, firstColour);
        grd.addColorStop(0.5, secondColour);
        grd.addColorStop(1, firstColour);
        return grd;
    }

    public GetShaftFillStyle(context: CanvasRenderingContext2D,
                             firstColour: string, secondColour: string): CanvasGradient {
        const x2 = this.shaftX + this.shaftWidth;

        const grd = context.createLinearGradient(this.shaftX, this.shaftY, x2, this.shaftY);
        grd.addColorStop(0, firstColour);
        grd.addColorStop(0.5, secondColour);
        grd.addColorStop(1, firstColour);
        return grd;
    }

    public DrawBumpers(context: CanvasRenderingContext2D, upFront: boolean): void {
        let y: number;
        let bumperY: number;
        if (upFront) {
            y = this.frontY;
            bumperY = this.frontY - this.bumperPoke;
        } else {
            y = this.backY;
            bumperY = this.backY + this.bumperPoke;
        }

        context.beginPath();
        context.lineWidth = this.bumperWidth;
        context.strokeStyle = this.baseColour;

        context.moveTo(this.leftX + this.bumperOffset, bumperY);
        context.lineTo(this.leftX + this.bumperOffset, y);
        context.moveTo(this.leftX + this.bumperOffset - (this.bumperLength / 2), bumperY);
        context.lineTo(this.leftX + this.bumperOffset + (this.bumperLength / 2), bumperY);

        context.moveTo(this.rightX - this.bumperOffset, bumperY);
        context.lineTo(this.rightX - this.bumperOffset, y);
        context.moveTo(this.rightX - this.bumperOffset - (this.bumperLength / 2), bumperY);
        context.lineTo(this.rightX - this.bumperOffset + (this.bumperLength / 2), bumperY);

        context.stroke();
    }
}