/// <reference path="play.board.ts" />
/// <reference path="play.cell.renderer.ts" />
/// <reference path="play.cell.ts" />
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
        var Track = /** @class */ (function (_super) {
            __extends(Track, _super);
            function Track() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Track.prototype.draw = function (context) {
                var _this = this;
                context.save();
                context.translate(this.x + 0.5, this.y + 0.5);
                trains.play.CellRenderer.clearCell(context);
                if (play.GameBoard.showDiagnostics) {
                    if (play.GameBoard.trains.some(function (t) { return t.isTrainHere(_this.column, _this.row, true); })) {
                        context.fillStyle = "#0000FF";
                        context.fillRect(0, 0, play.gridSize, play.gridSize);
                    }
                    else if (play.GameBoard.trains.some(function (t) { return t.isTrainHere(_this.column, _this.row); })) {
                        context.fillStyle = "#FF0000";
                        context.fillRect(0, 0, play.gridSize, play.gridSize);
                    }
                }
                switch (this.direction) {
                    case trains.play.Direction.Horizontal: {
                        var neighbours = trains.play.GameBoard.getNeighbouringCells(this.column, this.row);
                        trains.play.CellRenderer.drawStraightTrack(context, neighbours.left === undefined, neighbours.right === undefined);
                        break;
                    }
                    case trains.play.Direction.Vertical: {
                        var neighbours = trains.play.GameBoard.getNeighbouringCells(this.column, this.row);
                        context.translate(trains.play.gridSize, 0);
                        context.rotate(Math.PI / 2);
                        trains.play.CellRenderer.drawStraightTrack(context, neighbours.up === undefined, neighbours.down === undefined);
                        break;
                    }
                    case trains.play.Direction.LeftUp: {
                        this.leftUp(context, true);
                        break;
                    }
                    case trains.play.Direction.LeftDown: {
                        this.leftDown(context, true);
                        break;
                    }
                    case trains.play.Direction.RightUp: {
                        this.rightUp(context, true);
                        break;
                    }
                    case trains.play.Direction.RightDown: {
                        this.rightDown(context, true);
                        break;
                    }
                    case trains.play.Direction.Cross: {
                        trains.play.CellRenderer.drawStraightTrack(context, false, false);
                        context.translate(trains.play.gridSize, 0);
                        context.rotate(Math.PI / 2);
                        trains.play.CellRenderer.drawStraightTrack(context, false, false);
                        break;
                    }
                    case trains.play.Direction.LeftUpLeftDown: {
                        context.save();
                        this.leftUp(context, this.switchState);
                        context.restore();
                        this.leftDown(context, !this.switchState);
                        context.restore();
                        break;
                    }
                    case trains.play.Direction.LeftUpRightUp: {
                        context.save();
                        this.leftUp(context, this.switchState);
                        context.restore();
                        this.rightUp(context, !this.switchState);
                        context.restore();
                        break;
                    }
                    case trains.play.Direction.RightDownRightUp: {
                        context.save();
                        this.rightDown(context, !this.switchState);
                        context.restore();
                        this.rightUp(context, this.switchState);
                        context.restore();
                        break;
                    }
                    case trains.play.Direction.RightDownLeftDown: {
                        context.save();
                        this.rightDown(context, !this.switchState);
                        context.restore();
                        this.leftDown(context, this.switchState);
                        context.restore();
                        break;
                    }
                }
                context.restore();
            };
            Track.prototype.rightDown = function (context, drawPlanks) {
                context.translate(trains.play.gridSize, trains.play.gridSize);
                context.rotate(Math.PI);
                trains.play.CellRenderer.drawCurvedTrack(context, drawPlanks);
            };
            Track.prototype.rightUp = function (context, drawPlanks) {
                context.translate(trains.play.gridSize, 0);
                context.rotate(Math.PI / 2);
                trains.play.CellRenderer.drawCurvedTrack(context, drawPlanks);
            };
            Track.prototype.leftUp = function (context, drawPlanks) {
                trains.play.CellRenderer.drawCurvedTrack(context, drawPlanks);
            };
            Track.prototype.leftDown = function (context, drawPlanks) {
                context.translate(0, trains.play.gridSize);
                context.rotate(Math.PI * 1.5);
                trains.play.CellRenderer.drawCurvedTrack(context, drawPlanks);
            };
            Track.prototype.turnAroundBrightEyes = function () {
                if (this.direction === trains.play.Direction.RightDownLeftDown) {
                    this.direction = trains.play.Direction.Vertical;
                }
                else {
                    this.direction = this.direction + 1;
                }
                this.draw(trains.play.GameBoard.trackContext);
                var neighbours = trains.play.GameBoard.getNeighbouringCells(this.column, this.row, true);
                neighbours.all.forEach(function (neighbour) {
                    neighbour.draw(trains.play.GameBoard.trackContext);
                });
            };
            return Track;
        }(play.Cell));
        play.Track = Track;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
//# sourceMappingURL=track.js.map