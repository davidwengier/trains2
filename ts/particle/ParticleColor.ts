import { ParticleHelper } from "ParticleHelper";

export class ParticleColor {
    public Red: number;
    public Green: number;
    public Blue: number;
    public Alpha: number;

    constructor(red: number, green: number, blue: number, alpha: number) {
        this.Red = red;
        this.Green = green;
        this.Blue = blue;
        this.Alpha = alpha;
    }

    public ToRGBA(): string {
        return "rgba(" + Math.round(this.Red) +
                "," + Math.round(this.Green) +
                "," + Math.round(this.Blue) +
                "," + this.Alpha.toFixed(3) + ")";
    }

    public MapByFactor(factor: number, min: ParticleColor, max: ParticleColor) {
        this.Red = ParticleHelper.MapByFactor(factor, min.Red, max.Red);
        this.Green = ParticleHelper.MapByFactor(factor, min.Green, max.Green);
        this.Blue = ParticleHelper.MapByFactor(factor, min.Blue, max.Blue);
        this.Alpha = ParticleHelper.MapByFactor(factor, min.Alpha, max.Alpha);
    }
}
