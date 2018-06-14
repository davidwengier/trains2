/// <reference path="play.board.ts" />
/// <reference path="play.cell.ts" />
/// <reference path="play.board.renderer.ts" />
/// <reference path="play.train.renderer.ts" />
/// <reference path="play.train.ts" />
/// <reference path="util.ts" />
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
        var TrainCarriage = /** @class */ (function (_super) {
            __extends(TrainCarriage, _super);
            function TrainCarriage(id, cell) {
                var _this = _super.call(this, id, cell) || this;
                _this.id = id;
                return _this;
            }
            TrainCarriage.prototype.draw = function (context, translate) {
                if (translate === void 0) { translate = true; }
                var x = this.coords.currentX;
                var y = this.coords.currentY;
                var angle = Math.atan2(this.coords.previousX - x, this.coords.previousY - y);
                context.save();
                if (translate) {
                    context.translate(x, y);
                    context.rotate((angle * -1) + ((this.imageReverse < 0) ? Math.PI : 0));
                }
                else {
                    context.translate(play.gridSize / 2, play.gridSize / 2);
                }
                trains.play.TrainRenderer.DrawCarriage(context, this.trainColourIndex);
                context.restore();
                if ((this.carriage !== undefined) && translate) {
                    this.carriage.draw(context, translate);
                    this.drawLink(context);
                }
            };
            TrainCarriage.prototype.drawLighting = function (context) {
                //Do nothing
            };
            return TrainCarriage;
        }(play.Train));
        play.TrainCarriage = TrainCarriage;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
//# sourceMappingURL=play.trainCarriage.js.map