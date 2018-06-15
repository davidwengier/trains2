/// <reference path="ParticlePoint.ts" />
/// <reference path="ParticleColor.ts" />

module trains.play {
    export class ParticleBase extends ParticlePoint {
        public life: number = 0;
        public lifetime: number = 100;

        public x: number = 0;
        public y: number = 0;

        public readonly StartPoint: ParticlePoint;
        public readonly EndPoint: ParticlePoint;

        constructor(startPoint: ParticlePoint, endPoint: ParticlePoint) {
            super(1, 0, 0, new ParticleColor(0, 0, 0, 1));
            this.life = 0;
            this.StartPoint = startPoint;
            this.EndPoint = endPoint;
        }

        public Update(lifeSteps: number): void {
            if (this.IsDead()) {
                return;
            }

            this.life = Math.min(this.life + lifeSteps, this.lifetime);

            this.MapByFactor(this.life / this.lifetime, this.StartPoint, this.EndPoint);

            this.x += this.Velocity * Math.cos(this.Angle);
            this.y += this.Velocity * Math.sin(this.Angle);
        }

        public IsDead(): boolean {
            return (this.life >= this.lifetime);
        }

        public Draw(context: CanvasRenderingContext2D): void {
            throw new Error("abstract, not the art kind, but the extends kind");
        }

        public GetFillStyleAlpha(): string {
            return this.Color.ToRGBA();
        }
    }
}