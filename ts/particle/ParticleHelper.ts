module trains.play {
    export class ParticleHelper {
        // I'm sure this exists internally :/
        public static MapByFactor(factor: number, min: number, max: number) {
            return (factor * (max - min)) + min;
        }
    }
}