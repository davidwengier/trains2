module trains.play {
    export class Sprite
    {
        private readonly canvas;
        public readonly context: CanvasRenderingContext2D; 
        constructor(width:number, height:number)
        {
            this.canvas = document.createElement("canvas");
            this.canvas.width = width;
            this.canvas.height = height;
            this.context = this.canvas.getContext("2d");
            // Blurry drawing fix
            //this.context.translate(-0.5, -0.5);
        }
        public Draw(context: CanvasRenderingContext2D, x:number, y:number)
        {
            context.drawImage(this.canvas, x, y);
        }
    }
}