/// <reference path="play.board.ts" />
/// <reference path="play.baseloop.ts" />
/// <reference path="play.train.ts" />
/// <reference path="play.particle.smoke.ts" />
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
        var GameLoop = /** @class */ (function (_super) {
            __extends(GameLoop, _super);
            function GameLoop(board) {
                var _this = _super.call(this) || this;
                _this.board = board;
                _this.gameTimeElapsed = 0;
                _this.targetLoopsPerSecond = 40;
                return _this;
            }
            GameLoop.prototype.loopBody = function () {
                this.gameTimeElapsed += this.loopStartTime - this.lastStartTime;
                var steps = ((this.loopStartTime - this.lastLoopEndTime) / 25);
                if (this.board.trains.length > 0) {
                    this.board.trains.forEach(function (t) { return t.chooChooMotherFucker(steps); });
                }
                //Need to move this to a particle system
                for (var i = 0; i < this.board.smokeParticleSystem.length; i++) {
                    if (this.board.smokeParticleSystem[i].IsDead()) {
                        this.board.smokeParticleSystem.splice(i--, 1);
                    }
                    else {
                        this.board.smokeParticleSystem[i].Update(steps);
                    }
                }
                if (this.board.smokeParticleSystem.length > 0) {
                    this.board.smokeParticleSystem.forEach(function (x) { return x.Update(steps); });
                }
            };
            return GameLoop;
        }(play.Loop));
        play.GameLoop = GameLoop;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
//# sourceMappingURL=play.loop.game.js.map