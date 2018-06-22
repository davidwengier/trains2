export default class Sprite {
    public readonly context: CanvasRenderingContext2D;
    private readonly canvas: HTMLCanvasElement;
    private restored: boolean = false;
    constructor(private width: number, private height: number) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width + 1;
        this.canvas.height = this.height + 1;

        const context = this.canvas.getContext("2d");

        if (context === null) {
            throw new Error("Unable to get 2d context from canvas");
        }

        this.context = context;

        // Blurry drawing fix
        this.context.save();
        this.context.translate(0.5, 0.5);
    }
    public Draw(context: CanvasRenderingContext2D, x: number, y: number) {
        if (!this.restored) {
            this.context.restore();
            this.restored = true;
        }
        context.drawImage(this.canvas, 0, 0, this.width, this.height, x - 0.5, y - 0.5, this.width, this.height);
    }
}