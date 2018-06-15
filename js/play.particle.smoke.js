/// <reference path="play.board.ts" />
/// <reference path="play.particle.base.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var trains;
(function (trains) {
    var play;
    (function (play) {
        var ParticleSmoke = /** @class */ (function (_super) {
            __extends(ParticleSmoke, _super);
            function ParticleSmoke() {
                var _this = _super.call(this, new play.ParticlePoint(0.5, Math.PI * (1.4 * Math.random()), 0.5, new play.ParticleColor(240, 240, 240, 0.4)), new play.ParticlePoint(1.1 + Math.random(), Math.PI * (1.4 * Math.random()), 0.3, new play.ParticleColor(241, 241, 241, 0))) || this;
                _this.cloudNumber = (Math.random() * 5) + 4;
                _this.cloudSeed = Math.random() * 10000;
                return _this;
            }
            ParticleSmoke.prototype.Update = function (lifeSteps) {
                _super.prototype.Update.call(this, lifeSteps);
            };
            ParticleSmoke.prototype.Draw = function (context) {
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
            };
            return ParticleSmoke;
        }(play.ParticleBase));
        play.ParticleSmoke = ParticleSmoke;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
//# sourceMappingURL=play.particle.smoke.js.map