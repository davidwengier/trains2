var trains;
(function (trains) {
    var play;
    (function (play) {
        var ParticleColor = /** @class */ (function () {
            function ParticleColor(red, green, blue, alpha) {
                this.Red = red;
                this.Green = green;
                this.Blue = blue;
                this.Alpha = alpha;
            }
            ParticleColor.prototype.ToRGBA = function () {
                return 'rgba(' + Math.round(this.Red) + ',' + Math.round(this.Green) + ',' + Math.round(this.Blue) + ',' + this.Alpha.toFixed(3) + ')';
            };
            ParticleColor.prototype.MapByFactor = function (factor, min, max) {
                this.Red = play.ParticleHelper.MapByFactor(factor, min.Red, max.Red);
                this.Green = play.ParticleHelper.MapByFactor(factor, min.Green, max.Green);
                this.Blue = play.ParticleHelper.MapByFactor(factor, min.Blue, max.Blue);
                this.Alpha = play.ParticleHelper.MapByFactor(factor, min.Alpha, max.Alpha);
            };
            return ParticleColor;
        }());
        play.ParticleColor = ParticleColor;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
//# sourceMappingURL=play.particle.color.js.map