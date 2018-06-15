var trains;
(function (trains) {
    var play;
    (function (play) {
        var ParticleHelper = /** @class */ (function () {
            function ParticleHelper() {
            }
            // I'm sure this exists internally :/
            ParticleHelper.MapByFactor = function (factor, min, max) {
                return (factor * (max - min)) + min;
            };
            return ParticleHelper;
        }());
        play.ParticleHelper = ParticleHelper;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
//# sourceMappingURL=play.particle.helper.js.map