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
                var _this = _super.call(this) || this;
                _this.cloudNumber = (Math.random() * 5) + 4;
                _this.cloudSeed = Math.random() * 10000;
                _this.startAlpha = 0.4;
                _this.endAlpha = 0.0;
                _this.startColorRed = 240;
                _this.startColorGreen = 240;
                _this.startColorBlue = 240;
                _this.endColorRed = 241;
                _this.endColorGreen = 241;
                _this.endColorBlue = 241;
                _this.startAngle = Math.PI * (1.4 * Math.random());
                _this.endAngle = Math.PI * (1.4 * Math.random());
                _this.startScale = 0.5;
                _this.endScale = 1.1;
                _this.startVelocity = 0.5;
                _this.endVelocity = 0.3;
                return _this;
            }
            ParticleSmoke.prototype.Update = function (lifeSteps) {
                _super.prototype.Update.call(this, lifeSteps);
            };
            ParticleSmoke.prototype.Draw = function (context) {
                context.save();
                context.translate(this.x, this.y);
                context.rotate(this.angle);
                context.scale(this.scale, this.scale);
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