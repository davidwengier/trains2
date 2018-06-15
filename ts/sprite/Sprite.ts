module trains.play {
    export class Sprite {
        private readonly canvas;
        public readonly context: CanvasRenderingContext2D;
        private restored: boolean = false;
        constructor(width: number, height: number) {
            this.canvas = document.createElement("canvas");
            this.canvas.width = width;
            this.canvas.height = height;
            this.context = this.canvas.getContext("2d");

            // Blurry drawing fix
            this.context.save();
            this.context.translate(0.5, 0.5);
        }
        public Draw(context: CanvasRenderingContext2D, x: number, y: number) {
            if (!this.restored) {
                this.context.restore();
                this.restored = true;
            }
            context.drawImage(this.canvas, x - 0.5, y - 0.5);
        }
    }
}