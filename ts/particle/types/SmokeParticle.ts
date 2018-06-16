/// <reference path="../ParticleBase.ts" />

module trains.play {
    export class SmokeParticle extends ParticleBase {
        public cloudNumber = (Math.random() * 5) + 4;
        public cloudSeed = Math.random() * 10000;

        constructor() {
            super(new ParticlePoint(
                0.5, Math.PI * (1.4 * Math.random()), 0.5,
                new ParticleColor(240, 240, 240, 0.4)
            ), new ParticlePoint(
                1.1 + Math.random(), Math.PI * (1.4 * Math.random()), 0.3,
                new ParticleColor(241, 241, 241, 0)
            ));
        }

        public Update(lifeSteps: number): void {
            super.Update(lifeSteps);
        }

        public Draw(context: CanvasRenderingContext2D): void {
            context.save();
            context.translate(this.x, this.y);
            context.rotate(this.Angle);
            context.scale(this.Scale, this.Scale);
            for (var i = 0; i < (Math.PI * 2); i += ((Math.PI * 2) / this.cloudNumber)) {
                context.beginPath();
                context.fillStyle = this.GetFillStyleAlpha();
                context.arc(5 * Math.cos(i), 5 * Math.sin(i), ((i * this.cloudSeed) % 5) + 3, 0, 2 * Math.PI);
                context.fill();
            }
            context.restore();
        }
    }
}