/// <reference path="play.board.ts" />
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
        var ParticleBase = /** @class */ (function (_super) {
            __extends(ParticleBase, _super);
            function ParticleBase(startPoint, endPoint) {
                var _this = _super.call(this, 1, 0, 0, new play.ParticleColor(0, 0, 0, 1)) || this;
                _this.life = 0;
                _this.lifetime = 100;
                _this.x = 0;
                _this.y = 0;
                _this.life = 0;
                _this.StartPoint = startPoint;
                _this.EndPoint = endPoint;
                return _this;
            }
            ParticleBase.prototype.Update = function (lifeSteps) {
                if (this.IsDead()) {
                    return;
                }
                this.life = Math.min(this.life + lifeSteps, this.lifetime);
                this.MapByFactor(this.life / this.lifetime, this.StartPoint, this.EndPoint);
                this.x += this.Velocity * Math.cos(this.Angle);
                this.y += this.Velocity * Math.sin(this.Angle);
            };
            ParticleBase.prototype.IsDead = function () {
                return (this.life >= this.lifetime);
            };
            ParticleBase.prototype.Draw = function (context) {
                throw new Error("abstract, not the art kind, but the extends kind");
            };
            ParticleBase.prototype.GetFillStyleAlpha = function () {
                return this.Color.ToRGBA();
            };
            return ParticleBase;
        }(play.ParticlePoint));
        play.ParticleBase = ParticleBase;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
//# sourceMappingURL=play.particle.base.js.map