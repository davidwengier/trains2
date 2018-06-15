var trains;
(function (trains) {
    var play;
    (function (play) {
        var ParticlePoint = /** @class */ (function () {
            function ParticlePoint(scale, angle, velocity, color) {
                this.Scale = scale;
                this.Angle = angle;
                this.Velocity = velocity;
                this.Color = color;
            }
            ParticlePoint.prototype.MapByFactor = function (factor, min, max) {
                this.Scale = play.ParticleHelper.MapByFactor(factor, min.Scale, max.Scale);
                this.Angle = play.ParticleHelper.MapByFactor(factor, min.Angle, max.Angle);
                this.Velocity = play.ParticleHelper.MapByFactor(factor, min.Velocity, max.Velocity);
                this.Color.MapByFactor(factor, min.Color, max.Color);
            };
            return ParticlePoint;
        }());
        play.ParticlePoint = ParticlePoint;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
//# sourceMappingURL=play.particle.point.js.map