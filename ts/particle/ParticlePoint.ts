import { ParticleColor } from "./ParticleColor";
import { ParticleHelper } from "./ParticleHelper";

export class ParticlePoint {
    public Scale: number;
    public Angle: number;
    public Velocity: number;
    public Color: ParticleColor;

    constructor(scale: number, angle: number, velocity: number, color: ParticleColor) {
        this.Scale = scale;
        this.Angle = angle;
        this.Velocity = velocity;
        this.Color = color;
    }

    public MapByFactor(factor: number, min: ParticlePoint, max: ParticlePoint) {
        this.Scale = ParticleHelper.MapByFactor(factor, min.Scale, max.Scale);
        this.Angle = ParticleHelper.MapByFactor(factor, min.Angle, max.Angle);
        this.Velocity = ParticleHelper.MapByFactor(factor, min.Velocity, max.Velocity);
        this.Color.MapByFactor(factor, min.Color, max.Color);
    }
}