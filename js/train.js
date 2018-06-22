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
define("Direction", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Direction;
    (function (Direction) {
        Direction[Direction["None"] = 0] = "None";
        Direction[Direction["Vertical"] = 1] = "Vertical";
        Direction[Direction["Horizontal"] = 2] = "Horizontal";
        Direction[Direction["RightUp"] = 3] = "RightUp";
        Direction[Direction["RightDown"] = 4] = "RightDown";
        Direction[Direction["LeftDown"] = 5] = "LeftDown";
        Direction[Direction["LeftUp"] = 6] = "LeftUp";
        Direction[Direction["Cross"] = 7] = "Cross";
        Direction[Direction["LeftUpLeftDown"] = 8] = "LeftUpLeftDown";
        Direction[Direction["LeftUpRightUp"] = 9] = "LeftUpRightUp";
        Direction[Direction["RightDownRightUp"] = 10] = "RightDownRightUp";
        Direction[Direction["RightDownLeftDown"] = 11] = "RightDownLeftDown";
    })(Direction = exports.Direction || (exports.Direction = {}));
});
define("INeighbouringCells", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Cell", ["require", "exports", "Direction"], function (require, exports, Direction_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Cell = (function () {
        function Cell(id, column, row, cellSize, gameBoard) {
            this.id = id;
            this.column = column;
            this.row = row;
            this.cellSize = cellSize;
            this.gameBoard = gameBoard;
            this.switchState = false;
            this.happy = false;
            this.x = this.column * cellSize;
            this.y = this.row * cellSize;
            this.direction = Direction_1.Direction.None;
        }
        Cell.prototype.clear = function (context) {
            context.clearRect(0, 0, this.cellSize, this.cellSize);
        };
        Cell.prototype.checkYourself = function () {
            var neighbours = this.gameBoard.getNeighbouringCells(this.column, this.row);
            var changed = this.determineDirection(neighbours);
            this.happy = (neighbours.all.length > 1);
            this.draw(this.gameBoard.trackContext);
            if (changed) {
                var neighboursToCheck = this.gameBoard.getNeighbouringCells(this.column, this.row);
                neighboursToCheck.all.forEach(function (n) { return n.checkYourself(); });
            }
        };
        Cell.prototype.crossTheRoad = function () {
            var _this = this;
            var neighbours = this.gameBoard.getNeighbouringCells(this.column, this.row, true);
            return neighbours.all.some(function (c) {
                var myNeighbours = _this.gameBoard.getNeighbouringCells(c.column, c.row, true);
                if (myNeighbours.all.length < 4) {
                    return false;
                }
                if (myNeighbours.up !== undefined && !myNeighbours.up.isConnectedDown() && myNeighbours.up.happy) {
                    return false;
                }
                if (myNeighbours.down !== undefined && !myNeighbours.down.isConnectedUp() && myNeighbours.down.happy) {
                    return false;
                }
                if (myNeighbours.left !== undefined && !myNeighbours.left.isConnectedRight() && myNeighbours.left.happy) {
                    return false;
                }
                if (myNeighbours.right !== undefined && !myNeighbours.right.isConnectedLeft() && myNeighbours.right.happy) {
                    return false;
                }
                c.direction = Direction_1.Direction.Cross;
                c.happy = true;
                c.draw(_this.gameBoard.trackContext);
                myNeighbours = _this.gameBoard.getNeighbouringCells(c.column, c.row);
                myNeighbours.all.forEach(function (c2) { return c2.checkYourself(); });
                return true;
            });
        };
        Cell.prototype.haveAThreeWay = function () {
            var myNeighbours = this.gameBoard.getNeighbouringCells(this.column, this.row, true);
            if (myNeighbours.all.length < 3) {
                return false;
            }
            if ([myNeighbours.up, myNeighbours.right, myNeighbours.down, myNeighbours.left]
                .filter(function (n) { return n !== undefined; }).length === 3) {
                if (myNeighbours.up !== undefined && !myNeighbours.up.isConnectedDown() && myNeighbours.up.happy) {
                    return false;
                }
                if (myNeighbours.down !== undefined && !myNeighbours.down.isConnectedUp() && myNeighbours.down.happy) {
                    return false;
                }
                if (myNeighbours.left !== undefined && !myNeighbours.left.isConnectedRight() && myNeighbours.left.happy) {
                    return false;
                }
                if (myNeighbours.right !== undefined && !myNeighbours.right.isConnectedLeft() && myNeighbours.right.happy) {
                    return false;
                }
                if (myNeighbours.up === undefined) {
                    this.direction = Direction_1.Direction.RightDownLeftDown;
                }
                else if (myNeighbours.down === undefined) {
                    this.direction = Direction_1.Direction.LeftUpRightUp;
                }
                else if (myNeighbours.left === undefined) {
                    this.direction = Direction_1.Direction.RightDownRightUp;
                }
                else if (myNeighbours.right === undefined) {
                    this.direction = Direction_1.Direction.LeftUpLeftDown;
                }
                else {
                    return false;
                }
            }
            else {
                if (myNeighbours.up !== undefined && myNeighbours.up.isConnectedDown() &&
                    myNeighbours.down !== undefined && myNeighbours.down.isConnectedUp() &&
                    myNeighbours.right !== undefined && myNeighbours.right.isConnectedLeft()) {
                    this.direction = Direction_1.Direction.RightDownRightUp;
                }
                else if (myNeighbours.up !== undefined && myNeighbours.up.isConnectedDown() &&
                    myNeighbours.down !== undefined && myNeighbours.down.isConnectedUp() &&
                    myNeighbours.left !== undefined && myNeighbours.left.isConnectedRight()) {
                    this.direction = Direction_1.Direction.LeftUpLeftDown;
                }
                else if (myNeighbours.left !== undefined && myNeighbours.left.isConnectedRight() &&
                    myNeighbours.down !== undefined && myNeighbours.down.isConnectedUp() &&
                    myNeighbours.right !== undefined && myNeighbours.right.isConnectedLeft()) {
                    this.direction = Direction_1.Direction.RightDownLeftDown;
                }
                else if (myNeighbours.up !== undefined && myNeighbours.up.isConnectedDown() &&
                    myNeighbours.left !== undefined && myNeighbours.left.isConnectedRight() &&
                    myNeighbours.right !== undefined && myNeighbours.right.isConnectedLeft()) {
                    this.direction = Direction_1.Direction.LeftUpRightUp;
                }
                else {
                    return false;
                }
            }
            this.happy = true;
            this.draw(this.gameBoard.trackContext);
            myNeighbours = this.gameBoard.getNeighbouringCells(this.column, this.row);
            myNeighbours.all.forEach(function (c2) { return c2.checkYourself(); });
            return true;
        };
        Cell.prototype.switchTrack = function () {
            if (this.direction === Direction_1.Direction.LeftUpLeftDown || this.direction === Direction_1.Direction.LeftUpRightUp ||
                this.direction === Direction_1.Direction.RightDownLeftDown || this.direction === Direction_1.Direction.RightDownRightUp) {
                this.switchState = !this.switchState;
                this.draw(this.gameBoard.trackContext);
            }
        };
        Cell.prototype.determineDirection = function (neighbours) {
            if (this.happy) {
                return false;
            }
            var newDirection;
            if (neighbours.left !== undefined && neighbours.right !== undefined
                && neighbours.up !== undefined && neighbours.down !== undefined) {
                newDirection = Direction_1.Direction.Cross;
            }
            else if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.up !== undefined) {
                if (neighbours.down !== undefined) {
                    newDirection = Direction_1.Direction.LeftUpLeftDown;
                }
                else {
                    newDirection = Direction_1.Direction.LeftUp;
                }
            }
            else if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.down !== undefined) {
                newDirection = Direction_1.Direction.LeftDown;
            }
            else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.up !== undefined) {
                if (neighbours.down !== undefined) {
                    newDirection = Direction_1.Direction.RightDownRightUp;
                }
                else {
                    newDirection = Direction_1.Direction.RightUp;
                }
            }
            else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.down !== undefined) {
                newDirection = Direction_1.Direction.RightDown;
            }
            else if (neighbours.up !== undefined && neighbours.down !== undefined) {
                newDirection = Direction_1.Direction.Vertical;
            }
            else if (neighbours.left !== undefined && neighbours.right !== undefined) {
                if (neighbours.up !== undefined) {
                    newDirection = Direction_1.Direction.LeftUpRightUp;
                }
                else if (neighbours.down !== undefined) {
                    newDirection = Direction_1.Direction.RightDownLeftDown;
                }
                else {
                    newDirection = Direction_1.Direction.Horizontal;
                }
            }
            else if (neighbours.up !== undefined || neighbours.down !== undefined) {
                newDirection = Direction_1.Direction.Vertical;
            }
            else if (neighbours.left !== undefined || neighbours.right !== undefined) {
                newDirection = Direction_1.Direction.Horizontal;
            }
            else {
                newDirection = Direction_1.Direction.Horizontal;
            }
            if (newDirection !== undefined && newDirection !== this.direction) {
                this.direction = newDirection;
                return true;
            }
            return false;
        };
        Cell.prototype.isConnectedUp = function () {
            return this.direction === Direction_1.Direction.Vertical ||
                this.direction === Direction_1.Direction.LeftUp ||
                this.direction === Direction_1.Direction.RightUp ||
                this.direction === Direction_1.Direction.Cross ||
                this.direction === Direction_1.Direction.LeftUpLeftDown ||
                this.direction === Direction_1.Direction.LeftUpRightUp ||
                this.direction === Direction_1.Direction.RightDownRightUp;
        };
        Cell.prototype.isConnectedDown = function () {
            return this.direction === Direction_1.Direction.Vertical ||
                this.direction === Direction_1.Direction.LeftDown ||
                this.direction === Direction_1.Direction.RightDown ||
                this.direction === Direction_1.Direction.Cross ||
                this.direction === Direction_1.Direction.LeftUpLeftDown ||
                this.direction === Direction_1.Direction.RightDownLeftDown ||
                this.direction === Direction_1.Direction.RightDownRightUp;
        };
        Cell.prototype.isConnectedLeft = function () {
            return this.direction === Direction_1.Direction.Horizontal ||
                this.direction === Direction_1.Direction.LeftUp ||
                this.direction === Direction_1.Direction.LeftDown ||
                this.direction === Direction_1.Direction.Cross ||
                this.direction === Direction_1.Direction.LeftUpLeftDown ||
                this.direction === Direction_1.Direction.LeftUpRightUp ||
                this.direction === Direction_1.Direction.RightDownLeftDown;
        };
        Cell.prototype.isConnectedRight = function () {
            return this.direction === Direction_1.Direction.Horizontal ||
                this.direction === Direction_1.Direction.RightDown ||
                this.direction === Direction_1.Direction.RightUp ||
                this.direction === Direction_1.Direction.Cross ||
                this.direction === Direction_1.Direction.RightDownLeftDown ||
                this.direction === Direction_1.Direction.LeftUpRightUp ||
                this.direction === Direction_1.Direction.RightDownRightUp;
        };
        Cell.prototype.destroy = function () {
            var _this = this;
            var def = $.Deferred();
            this.destroyLoop(def, 0);
            def.done(function () {
                _this.gameBoard.trackContext.clearRect(_this.x, _this.y, _this.cellSize, _this.cellSize);
            });
            return def;
        };
        Cell.prototype.destroyLoop = function (deferred, counter) {
            var _this = this;
            setTimeout(function () {
                var x = Math.floor(Math.random() * _this.cellSize);
                var y = Math.floor(Math.random() * _this.cellSize);
                _this.gameBoard.trackContext.clearRect(_this.x + x, _this.y + y, 5, 5);
                counter++;
                if (counter < 40) {
                    _this.destroyLoop(deferred, counter);
                }
                else {
                    deferred.resolve();
                }
            }, 10);
        };
        Cell.prototype.getDirectionToUse = function (lastCell) {
            if (lastCell !== undefined) {
                var neighbours = this.gameBoard.getNeighbouringCells(lastCell.column, lastCell.row);
                if (this.direction === Direction_1.Direction.LeftUpLeftDown) {
                    if (lastCell !== undefined && lastCell.isConnectedDown() && neighbours.down === this) {
                        if (!this.switchState) {
                            this.switchTrack();
                        }
                    }
                    else if (lastCell !== undefined && lastCell.isConnectedUp() && neighbours.up === this) {
                        if (this.switchState) {
                            this.switchTrack();
                        }
                    }
                    return this.switchState ? Direction_1.Direction.LeftUp : Direction_1.Direction.LeftDown;
                }
                else if (this.direction === Direction_1.Direction.LeftUpRightUp) {
                    if (lastCell !== undefined && lastCell.isConnectedLeft() && neighbours.left === this) {
                        if (this.switchState) {
                            this.switchTrack();
                        }
                    }
                    else if (lastCell !== undefined && lastCell.isConnectedRight() && neighbours.right === this) {
                        if (!this.switchState) {
                            this.switchTrack();
                        }
                    }
                    return this.switchState ? Direction_1.Direction.LeftUp : Direction_1.Direction.RightUp;
                }
                else if (this.direction === Direction_1.Direction.RightDownLeftDown) {
                    if (lastCell !== undefined && lastCell.isConnectedLeft() && neighbours.left === this) {
                        if (this.switchState) {
                            this.switchTrack();
                        }
                    }
                    else if (lastCell !== undefined && lastCell.isConnectedRight() && neighbours.right === this) {
                        if (!this.switchState) {
                            this.switchTrack();
                        }
                    }
                    return this.switchState ? Direction_1.Direction.LeftDown : Direction_1.Direction.RightDown;
                }
                else if (this.direction === Direction_1.Direction.RightDownRightUp) {
                    if (lastCell !== undefined && lastCell.isConnectedDown() && neighbours.down === this) {
                        if (!this.switchState) {
                            this.switchTrack();
                        }
                    }
                    else if (lastCell !== undefined && lastCell.isConnectedUp() && neighbours.up === this) {
                        if (this.switchState) {
                            this.switchTrack();
                        }
                    }
                    return this.switchState ? Direction_1.Direction.RightUp : Direction_1.Direction.RightDown;
                }
            }
            return this.direction;
        };
        return Cell;
    }());
    exports.default = Cell;
});
define("IBoardCells", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("BoardRenderer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BoardRenderer = (function () {
        function BoardRenderer() {
        }
        BoardRenderer.drawGrid = function (context, canvasWidth, canvasHeight, gridSize, gridColour) {
            context.beginPath();
            for (var x = gridSize; x < canvasWidth; x += gridSize) {
                context.moveTo(x, 0);
                context.lineTo(x, canvasHeight);
            }
            for (var y = gridSize; y < canvasHeight; y += gridSize) {
                context.moveTo(0, y);
                context.lineTo(canvasWidth, y);
            }
            context.strokeStyle = gridColour;
            context.stroke();
        };
        BoardRenderer.redrawCells = function (cells, context, canvasWidth, canvasHeight) {
            BoardRenderer.clearCells(context, canvasWidth, canvasHeight);
            for (var id in cells) {
                if (cells.hasOwnProperty(id)) {
                    cells[id].draw(context);
                }
            }
        };
        BoardRenderer.clearCells = function (context, canvasWidth, canvasHeight) {
            context.beginPath();
            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.closePath();
        };
        return BoardRenderer;
    }());
    exports.default = BoardRenderer;
});
define("GameEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameEvent = (function () {
        function GameEvent() {
        }
        GameEvent.On = function (eventName, callback) {
            var id = GameEvent.globalEventID;
            GameEvent.globalEventID++;
            var existingEvents = GameEvent.globalEvents[eventName];
            if (existingEvents === undefined) {
                GameEvent.globalEvents[eventName] = new Array();
                existingEvents = GameEvent.globalEvents[eventName];
            }
            existingEvents.push({
                callback: callback,
                id: id
            });
            return id;
        };
        GameEvent.Emit = function (eventName) {
            var data = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                data[_i - 1] = arguments[_i];
            }
            var existingEvents = GameEvent.globalEvents[eventName];
            if (existingEvents !== undefined) {
                var eventObject = {
                    data: data,
                    eventName: eventName
                };
                var callbackData = [eventObject];
                for (var _a = 0, data_1 = data; _a < data_1.length; _a++) {
                    var item = data_1[_a];
                    callbackData.push(item);
                }
                for (var _b = 0, existingEvents_1 = existingEvents; _b < existingEvents_1.length; _b++) {
                    var event_1 = existingEvents_1[_b];
                    event_1.callback.apply(null, callbackData);
                }
            }
        };
        GameEvent.Unsubscribe = function (eventID) {
            for (var eventName in GameEvent.globalEvents) {
                if (GameEvent.globalEvents.hasOwnProperty(eventName) && GameEvent.globalEvents[eventName] !== undefined) {
                    for (var i = 0; i < GameEvent.globalEvents[eventName].length; i++) {
                        if (GameEvent.globalEvents[eventName][i].id === eventID) {
                            GameEvent.globalEvents[eventName].splice(i, 1);
                            return;
                        }
                    }
                }
            }
        };
        GameEvent.globalEventID = 1;
        GameEvent.globalEvents = {};
        return GameEvent;
    }());
    exports.default = GameEvent;
});
define("engine/Loop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Loop = (function () {
        function Loop(targetLoopsPerSecond, minimumTimeout) {
            if (minimumTimeout === void 0) { minimumTimeout = 10; }
            this.targetLoopsPerSecond = targetLoopsPerSecond;
            this.minimumTimeout = minimumTimeout;
            this.loopRunning = false;
            this.lastDuration = 0;
            this.lastStartTime = 0;
            this.loopStartTime = -1;
            this.lastLoopEndTime = -1;
            this.averageLoopsPerSecond = 1;
            this.averageLoopsPerSecondSampleSize = 5;
            this.timeoutId = -1;
        }
        Loop.prototype.startLoop = function () {
            if (this.timeoutId < 0) {
                this.loopCallback();
            }
            this.loopRunning = true;
        };
        Loop.prototype.stopLoop = function () {
            this.loopRunning = false;
        };
        Loop.prototype.dispose = function () {
            if (this.timeoutId !== undefined && this.timeoutId > 0) {
                try {
                    clearTimeout(this.timeoutId);
                }
                finally {
                    this.timeoutId = -1;
                }
            }
        };
        Loop.prototype.ElapsedSinceLastStart = function () {
            return this.loopStartTime - this.lastStartTime;
        };
        Loop.prototype.ElapsedSinceLastEnd = function () {
            return this.loopStartTime - this.lastLoopEndTime;
        };
        Loop.prototype.GetPerformanceString = function () {
            return this.lastDuration.toFixed(2) + "ms (" + this.averageLoopsPerSecond.toFixed(2) + "/s)";
        };
        Loop.prototype.loopCallback = function () {
            var _this = this;
            this.timeoutId = -1;
            if (this.lastLoopEndTime > 0) {
                this.loopStartTime = new Date().getTime();
                if (this.lastStartTime === 0) {
                    this.lastStartTime = this.loopStartTime;
                }
                if (this.loopRunning) {
                    this.loopBody();
                }
                this.lastDuration = new Date().getTime() - this.loopStartTime;
                if (this.lastStartTime > 0) {
                    this.averageLoopsPerSecond = ((this.averageLoopsPerSecond * (this.averageLoopsPerSecondSampleSize - 1))
                        + (this.loopStartTime - this.lastStartTime)) / this.averageLoopsPerSecondSampleSize;
                }
                this.lastStartTime = this.loopStartTime;
            }
            this.lastLoopEndTime = new Date().getTime();
            this.timeoutId = setTimeout(function () { return _this.loopCallback(); }, Math.max((1000 / this.targetLoopsPerSecond) - this.lastDuration, this.minimumTimeout));
        };
        return Loop;
    }());
    exports.default = Loop;
});
define("particle/ParticleHelper", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ParticleHelper = (function () {
        function ParticleHelper() {
        }
        ParticleHelper.MapByFactor = function (factor, min, max) {
            return (factor * (max - min)) + min;
        };
        return ParticleHelper;
    }());
    exports.default = ParticleHelper;
});
define("particle/ParticleColor", ["require", "exports", "particle/ParticleHelper"], function (require, exports, ParticleHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ParticleColor = (function () {
        function ParticleColor(red, green, blue, alpha) {
            this.Red = red;
            this.Green = green;
            this.Blue = blue;
            this.Alpha = alpha;
        }
        ParticleColor.prototype.ToRGBA = function () {
            return "rgba(" + Math.round(this.Red) +
                "," + Math.round(this.Green) +
                "," + Math.round(this.Blue) +
                "," + this.Alpha.toFixed(3) + ")";
        };
        ParticleColor.prototype.MapByFactor = function (factor, min, max) {
            this.Red = ParticleHelper_1.default.MapByFactor(factor, min.Red, max.Red);
            this.Green = ParticleHelper_1.default.MapByFactor(factor, min.Green, max.Green);
            this.Blue = ParticleHelper_1.default.MapByFactor(factor, min.Blue, max.Blue);
            this.Alpha = ParticleHelper_1.default.MapByFactor(factor, min.Alpha, max.Alpha);
        };
        return ParticleColor;
    }());
    exports.default = ParticleColor;
});
define("particle/ParticlePoint", ["require", "exports", "particle/ParticleHelper"], function (require, exports, ParticleHelper_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ParticlePoint = (function () {
        function ParticlePoint(scale, angle, velocity, color) {
            this.Scale = scale;
            this.Angle = angle;
            this.Velocity = velocity;
            this.Color = color;
        }
        ParticlePoint.prototype.MapByFactor = function (factor, min, max) {
            this.Scale = ParticleHelper_2.default.MapByFactor(factor, min.Scale, max.Scale);
            this.Angle = ParticleHelper_2.default.MapByFactor(factor, min.Angle, max.Angle);
            this.Velocity = ParticleHelper_2.default.MapByFactor(factor, min.Velocity, max.Velocity);
            this.Color.MapByFactor(factor, min.Color, max.Color);
        };
        return ParticlePoint;
    }());
    exports.default = ParticlePoint;
});
define("particle/ParticleBase", ["require", "exports", "particle/ParticleColor", "particle/ParticlePoint"], function (require, exports, ParticleColor_1, ParticlePoint_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ParticleBase = (function (_super) {
        __extends(ParticleBase, _super);
        function ParticleBase(startPoint, endPoint) {
            var _this = _super.call(this, 1, 0, 0, new ParticleColor_1.default(0, 0, 0, 1)) || this;
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
        ParticleBase.prototype.GetFillStyleAlpha = function () {
            return this.Color.ToRGBA();
        };
        return ParticleBase;
    }(ParticlePoint_1.default));
    exports.default = ParticleBase;
});
define("particle/types/SmokeParticle", ["require", "exports", "particle/ParticleBase", "particle/ParticleColor", "particle/ParticlePoint"], function (require, exports, ParticleBase_1, ParticleColor_2, ParticlePoint_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SmokeParticle = (function (_super) {
        __extends(SmokeParticle, _super);
        function SmokeParticle() {
            var _this = _super.call(this, new ParticlePoint_2.default(0.5, Math.PI * (1.4 * Math.random()), 0.5, new ParticleColor_2.default(240, 240, 240, 0.4)), new ParticlePoint_2.default(1.1 + Math.random(), Math.PI * (1.4 * Math.random()), 0.3, new ParticleColor_2.default(241, 241, 241, 0))) || this;
            _this.cloudNumber = (Math.random() * 5) + 4;
            _this.cloudSeed = Math.random() * 10000;
            return _this;
        }
        SmokeParticle.prototype.Update = function (lifeSteps) {
            _super.prototype.Update.call(this, lifeSteps);
        };
        SmokeParticle.prototype.Draw = function (context) {
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
        return SmokeParticle;
    }(ParticleBase_1.default));
    exports.default = SmokeParticle;
});
define("ITrainCoords", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("ITrainCoordsResult", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("TrainRenderer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TrainRenderer = (function () {
        function TrainRenderer(gridSize, firstTackPosY, secondTrackPosY) {
            this.trainColours = [
                ["#7A040B", "#DD2C3E"],
                ["#4272DC", "#759cef"],
                ["#2e9b3d", "#66d174"],
                ["#44096d", "#8644b5"],
                ["#8644b5", "#f4ef53"]
            ];
            this.baseColour = "#111111";
            this.halfGridSize = gridSize / 2;
            this.trainWidth = secondTrackPosY - firstTackPosY;
            this.trainLength = gridSize;
            this.leftX = firstTackPosY * -1;
            this.rightX = this.leftX + this.trainWidth;
            this.frontY = this.halfGridSize * -1;
            this.backY = this.halfGridSize;
            this.roofPoke = 2;
            this.roofWidth = this.trainWidth + this.roofPoke * 2;
            this.roofLength = 12;
            this.roofX = this.leftX - this.roofPoke;
            this.roofY = this.backY - this.roofLength;
            this.shaftPadding = 4;
            this.shaftWidth = this.trainWidth - this.shaftPadding * 2;
            this.shaftLength = this.trainLength - this.shaftPadding;
            this.shaftX = this.leftX + this.shaftPadding;
            this.shaftY = this.frontY + this.shaftPadding;
            this.bumperPoke = 2;
            this.bumperWidth = 1;
            this.bumperLength = 3;
            this.bumperOffset = 3;
            this.lightAngleInDegrees = 60;
            this.lightDistance = 80;
            this.lightFalloffDistance = 30;
        }
        TrainRenderer.prototype.GetRandomShaftColour = function () {
            return Math.floor(Math.random() * this.trainColours.length);
        };
        TrainRenderer.prototype.DrawChoochooLights = function (context) {
            var xOffset = this.lightDistance * Math.tan(this.lightAngleInDegrees * (180 / Math.PI)) / 2;
            context.beginPath();
            var leftLightGradient = context.createRadialGradient(this.leftX, this.frontY - this.bumperPoke, this.lightFalloffDistance, this.leftX, this.frontY - this.bumperPoke, this.lightDistance);
            leftLightGradient.addColorStop(0, "#BBBBBB");
            leftLightGradient.addColorStop(1, "rgba(187,187,187,0)");
            context.fillStyle = leftLightGradient;
            context.moveTo(0, this.frontY - this.bumperPoke);
            context.lineTo(0 - xOffset, (this.frontY - this.bumperPoke) - this.lightDistance);
            context.lineTo(0 + xOffset, (this.frontY - this.bumperPoke) - this.lightDistance);
            context.lineTo(0, this.frontY - this.bumperPoke);
            context.fill();
        };
        TrainRenderer.prototype.DrawChoochoo = function (context, shaftColourIndex) {
            var shaftColour = this.trainColours[shaftColourIndex];
            if (shaftColourIndex === -1) {
                shaftColour = this.trainColours[this.GetRandomShaftColour()];
            }
            context.fillStyle = this.baseColour;
            context.fillRect(this.leftX, this.frontY, this.trainWidth, this.trainLength);
            context.fillStyle = this.GetShaftFillStyle(context, shaftColour[0], shaftColour[1]);
            context.fillRect(this.shaftX, this.shaftY, this.shaftWidth, this.shaftLength);
            context.fillStyle = this.GetRoofFillStyle(context, this.baseColour, "#5d5d5d");
            context.fillRect(this.roofX, this.roofY, this.roofWidth, this.roofLength);
            context.strokeRect(this.roofX, this.roofY, this.roofWidth, this.roofLength);
            context.fillStyle = this.baseColour;
            context.beginPath();
            context.arc(this.shaftX + (this.shaftWidth / 2), this.shaftY + 6, 2, 0, 2 * Math.PI);
            context.stroke();
            context.closePath();
            context.fill();
            this.DrawBumpers(context, true);
            this.DrawBumpers(context, false);
        };
        TrainRenderer.prototype.DrawCarriage = function (context, shaftColourIndex) {
            var shaftColour = this.trainColours[shaftColourIndex];
            if (shaftColourIndex === -1) {
                shaftColour = this.trainColours[this.GetRandomShaftColour()];
            }
            context.fillStyle = this.baseColour;
            context.fillRect(this.leftX, this.frontY, this.trainWidth, this.trainLength);
            context.fillStyle = this.GetShaftFillStyle(context, shaftColour[0], shaftColour[1]);
            context.fillRect(this.shaftX, this.shaftY, this.shaftWidth, this.shaftLength - this.shaftPadding);
        };
        TrainRenderer.prototype.GetRoofFillStyle = function (context, firstColour, secondColour) {
            var x2 = this.roofX + this.roofWidth;
            var grd = context.createLinearGradient(this.roofX, this.roofY, x2, this.roofY);
            grd.addColorStop(0, firstColour);
            grd.addColorStop(0.5, secondColour);
            grd.addColorStop(1, firstColour);
            return grd;
        };
        TrainRenderer.prototype.GetShaftFillStyle = function (context, firstColour, secondColour) {
            var x2 = this.shaftX + this.shaftWidth;
            var grd = context.createLinearGradient(this.shaftX, this.shaftY, x2, this.shaftY);
            grd.addColorStop(0, firstColour);
            grd.addColorStop(0.5, secondColour);
            grd.addColorStop(1, firstColour);
            return grd;
        };
        TrainRenderer.prototype.DrawBumpers = function (context, upFront) {
            var y;
            var bumperY;
            if (upFront) {
                y = this.frontY;
                bumperY = this.frontY - this.bumperPoke;
            }
            else {
                y = this.backY;
                bumperY = this.backY + this.bumperPoke;
            }
            context.beginPath();
            context.lineWidth = this.bumperWidth;
            context.strokeStyle = this.baseColour;
            context.moveTo(this.leftX + this.bumperOffset, bumperY);
            context.lineTo(this.leftX + this.bumperOffset, y);
            context.moveTo(this.leftX + this.bumperOffset - (this.bumperLength / 2), bumperY);
            context.lineTo(this.leftX + this.bumperOffset + (this.bumperLength / 2), bumperY);
            context.moveTo(this.rightX - this.bumperOffset, bumperY);
            context.lineTo(this.rightX - this.bumperOffset, y);
            context.moveTo(this.rightX - this.bumperOffset - (this.bumperLength / 2), bumperY);
            context.lineTo(this.rightX - this.bumperOffset + (this.bumperLength / 2), bumperY);
            context.stroke();
        };
        return TrainRenderer;
    }());
    exports.default = TrainRenderer;
});
define("util", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Util = (function () {
        function Util() {
        }
        Util.getRandomName = function () {
            return "The " + this.getRandomElement(this.adjectives) + " " + this.getRandomElement(this.names);
        };
        Util.toBoolean = function (value) {
            return value === "true";
        };
        Util.selectButton = function ($button) {
            var $parent = $button.closest("ul");
            $parent.find("button.selected").removeClass("selected");
            $button.addClass("selected");
        };
        Util.getRandomElement = function (items) {
            return items[Math.floor(Math.random() * items.length)];
        };
        Util.adjectives = [
            "Flying",
            "Haunted",
            "Heavy",
            "Electric",
            "Diesel",
            "Daylight",
            "Outback",
            "Overland",
            "Underground",
            "Western",
            "Golden",
            "Awkward",
            "Livid",
            "Courageous",
            "Timid",
            "Nervous",
            "Emotional",
            "Ferocious",
            "Moronic",
            "Cynical",
            "Sassy",
            "Reluctant",
            "Majestic"
        ];
        Util.names = [
            "Gary",
            "Steve",
            "Paul",
            "George",
            "Scotsman",
            "Express",
            "Wanderer",
            "Locomotive",
            "Warrior",
            "Alfonse"
        ];
        return Util;
    }());
    exports.default = Util;
});
define("Train", ["require", "exports", "Direction", "GameEvent", "particle/types/SmokeParticle", "util"], function (require, exports, Direction_2, GameEvent_1, SmokeParticle_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Train = (function () {
        function Train(id, coords, Renderer, trainColourIndex, name, GameBoard, cellSize) {
            this.id = id;
            this.coords = coords;
            this.Renderer = Renderer;
            this.trainColourIndex = trainColourIndex;
            this.name = name;
            this.GameBoard = GameBoard;
            this.cellSize = cellSize;
            this.imageReverse = 1;
            this.carriagePadding = 2;
            this.nextSmoke = 0;
            this.isPaused = false;
            this.trainSpeed = 2;
            this.setTrainSpeed(this.trainSpeed);
        }
        Train.SpawnNewTrain = function (id, cell, renderer, gameBoard, cellSize) {
            var coords = this.GenerateSpawnCoords(cell, cellSize);
            var trainColourIndex = Math.floor(Math.random() * 10) === 0 ? -1 : renderer.GetRandomShaftColour();
            var trainName = util_1.default.getRandomName();
            var train = new Train(id, coords, renderer, trainColourIndex, trainName, gameBoard, cellSize);
            if (Math.random() < 0.7) {
                train.spawnCarriage(Math.ceil(Math.random() * 5));
            }
            if (Math.random() < 0.7) {
                train.setTrainSpeed(Math.ceil(Math.random() * 5));
            }
            return train;
        };
        Train.GenerateSpawnCoords = function (cell, gridSize) {
            if (cell.direction === undefined) {
                throw new Error("Cell needs direction to generate");
            }
            var halfGridSize = gridSize / 2;
            var cx = cell.x + halfGridSize;
            var cy = cell.y + halfGridSize;
            switch (cell.direction) {
                case (Direction_2.Direction.Horizontal):
                case (Direction_2.Direction.Cross):
                case (Direction_2.Direction.RightDown):
                case (Direction_2.Direction.RightDownRightUp):
                    cx = cell.x + gridSize;
                    break;
                case (Direction_2.Direction.Vertical):
                case (Direction_2.Direction.LeftDown):
                case (Direction_2.Direction.RightDownLeftDown):
                    cy = cell.y + gridSize;
                    break;
                case (Direction_2.Direction.LeftUp):
                case (Direction_2.Direction.LeftUpLeftDown):
                    cx = cell.x;
                    break;
                case (Direction_2.Direction.RightUp):
                case (Direction_2.Direction.LeftUpRightUp):
                    cy = cell.y;
            }
            return {
                currentX: cx,
                currentY: cy,
                previousX: ((cell.x + halfGridSize) + 9 * cx) / 10,
                previousY: ((cell.y + halfGridSize) + 9 * cy) / 10
            };
        };
        Train.prototype.spawnCarriage = function (count) {
            if (count === void 0) { count = 1; }
            if (this.carriage !== undefined) {
                this.carriage.spawnCarriage(count);
            }
            else {
                var coords = {
                    currentX: this.coords.currentX,
                    currentY: this.coords.currentY,
                    previousX: this.coords.currentX
                        + (-10 * this.magicBullshitCompareTo(this.coords.currentX, this.coords.previousX)),
                    previousY: this.coords.currentY
                        + (-10 * this.magicBullshitCompareTo(this.coords.currentY, this.coords.previousY))
                };
                var stagedCarriage = new TrainCarriage(-1, coords, this.Renderer, this.trainColourIndex, this.GameBoard, this.cellSize);
                var distToMove = this.cellSize / 2;
                stagedCarriage.chooChooMotherFucker(this.carriagePadding + (distToMove), false);
                stagedCarriage.coords.previousX = stagedCarriage.coords.currentX
                    + (-10 * this.magicBullshitCompareTo(stagedCarriage.coords.currentX, stagedCarriage.coords.previousX));
                stagedCarriage.coords.previousY = stagedCarriage.coords.currentY
                    + (-10 * this.magicBullshitCompareTo(stagedCarriage.coords.currentY, stagedCarriage.coords.previousY));
                if (this.GameBoard.getCell(this.GameBoard.getGridCoord(stagedCarriage.coords.currentX), this.GameBoard.getGridCoord(stagedCarriage.coords.currentY)) === undefined) {
                    return;
                }
                this.carriage = stagedCarriage;
                if ((--count) > 0) {
                    this.carriage.spawnCarriage(count);
                }
            }
        };
        Train.prototype.removeEndCarriage = function (parent) {
            if (this.carriage !== undefined) {
                return this.carriage.removeEndCarriage(this);
            }
            else {
                parent.carriage = undefined;
            }
        };
        Train.prototype.chooChooMotherFucker = function (speed, checkCollision) {
            if (checkCollision === void 0) { checkCollision = true; }
            if (checkCollision) {
                this.drawParticles();
            }
            if (this.trainSpeed === 0 || this.isPaused) {
                return;
            }
            var baseSpeed = speed;
            speed *= this.trainSpeed;
            var speedDeadlockCounter = 0;
            while (speed > 0.00001) {
                if (speedDeadlockCounter++ > 10) {
                    console.log("SpeedDeadlock");
                    this.hammerTime();
                    break;
                }
                var column = this.GameBoard.getGridCoord(this.coords.currentX);
                var row = this.GameBoard.getGridCoord(this.coords.currentY);
                var cell = this.GameBoard.getCell(column, row);
                if (cell !== undefined) {
                    var result = this.getNewCoordsForTrain(cell, this.coords, speed);
                    if (checkCollision && this.willNotHaveAFunTimeAt(result.coords)) {
                        this.waitForTrafficToClear(result.coords);
                        return;
                    }
                    this.coords = result.coords;
                    speed = result.remainingSpeed;
                }
                else {
                    break;
                }
            }
            if (this.carriage !== undefined) {
                this.carriage.trainSpeed = this.trainSpeed;
                this.carriage.chooChooMotherFucker(baseSpeed, false);
            }
        };
        Train.prototype.getTrainSpeed = function () {
            return this.trainSpeed;
        };
        Train.prototype.setTrainSpeed = function (speed) {
            this.trainSpeed = speed;
            GameEvent_1.default.Emit("speedchanged", this.id, this.trainSpeed);
        };
        Train.prototype.slowYourRoll = function () {
            this.setTrainSpeed(Math.max(this.trainSpeed - 1, 1));
        };
        Train.prototype.fasterFasterFaster = function () {
            this.setTrainSpeed(Math.min(this.trainSpeed + 1, this.cellSize * 2));
        };
        Train.prototype.hammerTime = function () {
            this.setPaused(true);
        };
        Train.prototype.wakeMeUp = function () {
            this.setPaused(false);
        };
        Train.prototype.magicBullshitCompareTo = function (pen, sword) {
            if (pen === sword) {
                return 0;
            }
            if (pen > sword) {
                return -1;
            }
            return 1;
        };
        Train.prototype.straightTrackCalculate = function (cell, coords, speed, swapAxis) {
            if (swapAxis === void 0) { swapAxis = false; }
            var cellX = swapAxis ? cell.y : cell.x;
            var cellY = swapAxis ? cell.x : cell.y;
            var currentY = swapAxis ? coords.currentX : coords.currentY;
            var targetY = currentY
                + (speed * this.magicBullshitCompareTo((swapAxis ? coords.previousX : coords.previousY), currentY));
            if (targetY < cellY) {
                targetY = cellY - 0.001;
            }
            else if (targetY > (cellY + this.cellSize)) {
                targetY = cellY + this.cellSize + 0.001;
            }
            return {
                coords: {
                    currentX: swapAxis ? targetY : cellX + (this.cellSize / 2),
                    currentY: swapAxis ? cellX + (this.cellSize / 2) : targetY,
                    previousX: coords.currentX,
                    previousY: coords.currentY
                },
                remainingSpeed: (speed + (((speed > 0) ? -1 : 1) * Math.abs(currentY - targetY)))
            };
        };
        Train.prototype.getNewCoordsForTrain = function (cell, coords, speed) {
            if (this.lastCell === undefined || this.lastCell !== cell) {
                this.directionToUse = cell.getDirectionToUse(this.lastCell);
                this.lastCell = cell;
            }
            if (this.directionToUse === undefined) {
                throw new Error("Direction to use was undefined, was a last cell set?");
            }
            if (this.directionToUse === Direction_2.Direction.Vertical) {
                return this.straightTrackCalculate(cell, coords, speed);
            }
            else if (this.directionToUse === Direction_2.Direction.Horizontal) {
                return this.straightTrackCalculate(cell, coords, speed, true);
            }
            else if (this.directionToUse === Direction_2.Direction.Cross) {
                return this.straightTrackCalculate(cell, coords, speed, (Math.abs(coords.currentX - coords.previousX) > Math.abs(coords.currentY - coords.previousY)));
            }
            var yOffset = (this.directionToUse === Direction_2.Direction.LeftDown || this.directionToUse === Direction_2.Direction.RightDown)
                ? this.cellSize : 0;
            var xOffset = (this.directionToUse === Direction_2.Direction.RightUp || this.directionToUse === Direction_2.Direction.RightDown)
                ? this.cellSize : 0;
            var currentXOffset = this.zeroIncrement((coords.currentX - cell.x) - xOffset);
            var currentYOffset = this.zeroIncrement((coords.currentY - cell.y) - yOffset);
            var angle = Math.atan2(currentXOffset, currentYOffset);
            var lastXOffset = this.zeroIncrement((coords.previousX - cell.x) - xOffset);
            var lastYOffset = this.zeroIncrement((coords.previousY - cell.y) - yOffset);
            var angleLast = Math.atan2(lastXOffset, lastYOffset);
            var direction = this.magicBullshitCompareTo(angleLast, angle)
                * ((Math.abs(angleLast - angle) > Math.PI) ? -1 : 1);
            if (direction === 0) {
                direction = -1;
            }
            var newAngle = (angle + ((speed / (this.cellSize / 2)) * direction));
            var angleSector = Math.floor((angle) / (Math.PI / 2)) * (Math.PI / 2);
            if (newAngle < angleSector) {
                newAngle = angleSector - 0.001;
            }
            else if (newAngle > (angleSector + (Math.PI / 2))) {
                newAngle = (angleSector + (Math.PI / 2)) + 0.001;
            }
            var remainingSpeed = speed
                + (((speed >= 0) ? -1 : 1) * (Math.abs(angle - newAngle) * (this.cellSize / 2)));
            newAngle = (Math.PI / 2) - newAngle;
            var xOffsetFromGridNew = ((this.cellSize / 2) * Math.cos(newAngle)) + xOffset;
            var yOffsetFromGridNew = ((this.cellSize / 2) * Math.sin(newAngle)) + yOffset;
            return {
                coords: {
                    currentX: cell.x + xOffsetFromGridNew,
                    currentY: cell.y + yOffsetFromGridNew,
                    previousX: coords.currentX,
                    previousY: coords.currentY
                },
                remainingSpeed: remainingSpeed
            };
        };
        Train.prototype.draw = function (context, translate) {
            if (translate === void 0) { translate = true; }
            var angle = this.getTrainAngle();
            var x = this.coords.currentX;
            var y = this.coords.currentY;
            context.save();
            if (translate) {
                context.translate(x, y);
                context.rotate((angle * -1) + ((this.imageReverse < 0) ? Math.PI : 0));
            }
            else {
                context.translate(this.cellSize / 2, this.cellSize / 2);
            }
            this.Renderer.DrawChoochoo(context, this.trainColourIndex);
            context.restore();
            if (this.GameBoard.showDiagnostics) {
                var front = this.getFrontOfTrain();
                context.fillStyle = "#00FF00";
                context.fillRect(front.currentX - 2, front.currentY - 2, 4, 4);
            }
            if ((this.carriage !== undefined) && translate) {
                this.carriage.draw(context, translate);
                this.drawLink(context);
            }
        };
        Train.prototype.getFrontOfTrain = function (buffer) {
            if (buffer === void 0) { buffer = 0; }
            var angle = this.getTrainAngle();
            return {
                currentX: this.coords.currentX - Math.sin(angle) * ((this.cellSize / 2) + buffer),
                currentY: this.coords.currentY - Math.cos(angle) * ((this.cellSize / 2) + buffer),
                previousX: 0,
                previousY: 0
            };
        };
        Train.prototype.drawLighting = function (context) {
            var angle = this.getTrainAngle();
            context.save();
            context.translate(this.coords.currentX, this.coords.currentY);
            context.rotate((angle * -1) + ((this.imageReverse < 0) ? Math.PI : 0));
            this.Renderer.DrawChoochooLights(context);
            context.restore();
        };
        Train.prototype.isTrainHere = function (column, row, front) {
            if (front === void 0) { front = false; }
            var cx = front ? this.getFrontOfTrain() : this.coords;
            var myColumn = this.GameBoard.getGridCoord(cx.currentX);
            var myRow = this.GameBoard.getGridCoord(cx.currentY);
            if (!front && this.carriage !== undefined) {
                return ((column === myColumn && row === myRow) || this.carriage.isTrainHere(column, row));
            }
            else {
                return column === myColumn && row === myRow;
            }
        };
        Train.prototype.drawLink = function (context) {
            if (this.carriage === undefined) {
                return;
            }
            var sp1 = (this.cellSize / 2)
                / Math.sqrt(Math.pow(this.coords.currentX - this.coords.previousX, 2)
                    + Math.pow(this.coords.currentY - this.coords.previousY, 2));
            var x1 = this.coords.currentX - ((this.coords.currentX - this.coords.previousX) * sp1 * this.imageReverse);
            var y1 = this.coords.currentY - ((this.coords.currentY - this.coords.previousY) * sp1 * this.imageReverse);
            var sp2 = (this.cellSize / 2)
                / Math.sqrt(Math.pow(this.carriage.coords.currentX - this.carriage.coords.previousX, 2)
                    + Math.pow(this.carriage.coords.currentY - this.carriage.coords.previousY, 2));
            var x2 = this.carriage.coords.currentX
                + ((this.carriage.coords.currentX - this.carriage.coords.previousX) * sp2 * this.imageReverse);
            var y2 = this.carriage.coords.currentY
                + ((this.carriage.coords.currentY - this.carriage.coords.previousY) * sp2 * this.imageReverse);
            context.save();
            context.lineWidth = 3;
            context.strokeStyle = "#454545";
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
            context.restore();
        };
        Train.prototype.drawParticles = function () {
            if (this.nextSmoke < this.GameBoard.gameLoop.gameTimeElapsed) {
                var p = new SmokeParticle_1.default();
                p.x = this.coords.currentX;
                p.y = this.coords.currentY;
                this.GameBoard.smokeParticleSystem.push(p);
                this.nextSmoke = this.GameBoard.gameLoop.gameTimeElapsed + (Math.random() * 100) + 325;
            }
        };
        Train.prototype.getTrainAngle = function () {
            return Math.atan2(this.coords.previousX - this.coords.currentX, this.coords.previousY - this.coords.currentY);
        };
        Train.prototype.zeroIncrement = function (input) {
            return (input === 0) ? input + 0.001 : input;
        };
        Train.prototype.willNotHaveAFunTimeAt = function (_) {
            var _this = this;
            var frontCoords = this.getFrontOfTrain(1);
            var myColumn = this.GameBoard.getGridCoord(frontCoords.currentX);
            var myRow = this.GameBoard.getGridCoord(frontCoords.currentY);
            if (this.GameBoard.getCell(myColumn, myRow) === undefined) {
                return true;
            }
            return this.GameBoard.trains.some(function (t) {
                if (t === _this) {
                    return false;
                }
                if (t.isTrainHere(myColumn, myRow)) {
                    return true;
                }
                return false;
            });
        };
        Train.prototype.waitForTrafficToClear = function (coords) {
            var _this = this;
            this.setPaused(true);
            var interval = setInterval(function () {
                if (!_this.willNotHaveAFunTimeAt(coords)) {
                    clearInterval(interval);
                    _this.setPaused(false);
                }
            }, 500);
        };
        Train.prototype.setPaused = function (paused) {
            this.isPaused = paused;
            if (this.carriage !== undefined) {
                this.carriage.setPaused(paused);
            }
        };
        return Train;
    }());
    exports.default = Train;
    var TrainCarriage = (function (_super) {
        __extends(TrainCarriage, _super);
        function TrainCarriage(id, coords, renderer, trainColourIndex, gameBoard, cellSize) {
            return _super.call(this, id, coords, renderer, trainColourIndex, "carriage", gameBoard, cellSize) || this;
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
                context.translate(this.cellSize / 2, this.cellSize / 2);
            }
            this.Renderer.DrawCarriage(context, this.trainColourIndex);
            context.restore();
            if ((this.carriage !== undefined) && translate) {
                this.carriage.draw(context, translate);
                this.drawLink(context);
            }
        };
        TrainCarriage.prototype.drawLighting = function (_) {
        };
        return TrainCarriage;
    }(Train));
});
define("GameLoop", ["require", "exports", "engine/Loop"], function (require, exports, Loop_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameLoop = (function (_super) {
        __extends(GameLoop, _super);
        function GameLoop(board) {
            var _this = _super.call(this, 40) || this;
            _this.board = board;
            _this.gameTimeElapsed = 0;
            return _this;
        }
        GameLoop.prototype.loopBody = function () {
            this.gameTimeElapsed += this.ElapsedSinceLastStart();
            var steps = this.ElapsedSinceLastEnd() / 25;
            if (this.board.trains.length > 0) {
                this.board.trains.forEach(function (t) { return t.chooChooMotherFucker(steps); });
            }
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
    }(Loop_1.default));
    exports.default = GameLoop;
});
define("IPlayComponents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("RenderLoop", ["require", "exports", "engine/Loop"], function (require, exports, Loop_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RenderLoop = (function (_super) {
        __extends(RenderLoop, _super);
        function RenderLoop(gameBoard) {
            var _this = _super.call(this, 30) || this;
            _this.gameBoard = gameBoard;
            _this.msPerDayCycle = 240;
            _this.dayCycleSpeedModifier = 0.6;
            _this.dayToNightRatio = 5 / 12;
            return _this;
        }
        RenderLoop.prototype.loopBody = function () {
            var _this = this;
            if (this.gameBoard.showDiagnostics) {
                this.gameBoard.redraw();
            }
            this.gameBoard.trainContext.clearRect(0, 0, this.gameBoard.trainCanvas.width, this.gameBoard.trainCanvas.height);
            this.gameBoard.lightingBufferContext.clearRect(0, 0, this.gameBoard.trainCanvas.width, this.gameBoard.trainCanvas.height);
            var diff = ((this.gameBoard.gameLoop.gameTimeElapsed / (1000 * this.dayCycleSpeedModifier)) + (this.msPerDayCycle / 2)) % this.msPerDayCycle;
            if (this.gameBoard.CheatAlwaysNight) {
                diff = 0;
            }
            var r = (diff >= (this.msPerDayCycle / 2)) ? ((this.msPerDayCycle / 2) - diff) : 0;
            var g = (diff >= (this.msPerDayCycle / 2)) ? ((r / 135) * 100) : 0;
            var b = (diff < (this.msPerDayCycle / 2)) ? diff : 0;
            var alpha = 0;
            if (diff < ((this.dayToNightRatio * this.msPerDayCycle) / 2)) {
                alpha = ((((this.dayToNightRatio * this.msPerDayCycle) / 2) - diff) / 100);
            }
            else if ((diff > (this.msPerDayCycle - ((this.dayToNightRatio * this.msPerDayCycle) / 2)))) {
                alpha = ((diff - (this.msPerDayCycle - ((this.dayToNightRatio * this.msPerDayCycle) / 2))) / 100);
            }
            this.gameBoard.lightingBufferContext.fillStyle = this.rgbToHex(r, g, b);
            this.gameBoard.lightingBufferContext.fillRect(0, 0, this.gameBoard.trainCanvas.width, this.gameBoard.trainCanvas.height);
            if (this.gameBoard.trains.length > 0) {
                this.gameBoard.trains.forEach(function (t) {
                    t.draw(_this.gameBoard.trainContext);
                    if (((diff + (t.id / 2)) < 30) || ((diff - (t.id / 2)) > 210)) {
                        t.drawLighting(_this.gameBoard.lightingBufferContext);
                    }
                    if (_this.gameBoard.selectedTrain === t) {
                        t.draw(_this.gameBoard.trainLogoContext, false);
                    }
                });
            }
            if (this.gameBoard.smokeParticleSystem.length > 0) {
                this.gameBoard.smokeParticleSystem.forEach(function (x) { return x.Draw(_this.gameBoard.trainContext); });
            }
            this.gameBoard.trainContext.save();
            this.gameBoard.trainContext.globalAlpha = alpha;
            this.gameBoard.trainContext.drawImage(this.gameBoard.lightingBufferCanvas, 0, 0);
            this.gameBoard.trainContext.restore();
            if (this.gameBoard.showDiagnostics === true) {
                this.drawDiagnostics(this.gameBoard.trainContext);
            }
        };
        RenderLoop.prototype.rgbToHex = function (r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        };
        RenderLoop.prototype.drawDiagnostics = function (targetContext) {
            targetContext.font = "10px Verdana";
            targetContext.fillText("To render: " + this.GetPerformanceString(), 10, 10);
            targetContext.fillText("To logic: " + this.gameBoard.gameLoop.GetPerformanceString(), 10, 24);
            if (this.gameBoard.trains.length > 0) {
                targetContext.fillText("Train Count: " + (this.gameBoard.trains.length), 10, 38);
            }
        };
        return RenderLoop;
    }(Loop_2.default));
    exports.default = RenderLoop;
});
define("sound/ISound", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("sound/SoundLibrary", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SoundLibrary = (function () {
        function SoundLibrary() {
        }
        SoundLibrary.ClickSound = {
            FileName: "click.mp3"
        };
        return SoundLibrary;
    }());
    exports.default = SoundLibrary;
});
define("sound/SoundPlayer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SoundPlayer = (function () {
        function SoundPlayer() {
            this.muted = false;
            this.basePath = "audio/";
        }
        SoundPlayer.prototype.setMuted = function (mute) {
            this.muted = mute;
        };
        SoundPlayer.prototype.playSound = function (sound) {
            if (!this.muted && sound !== undefined) {
                var soundToPlay = new Audio(this.basePath + sound.FileName);
                if (soundToPlay !== undefined) {
                    soundToPlay.play();
                }
            }
        };
        return SoundPlayer;
    }());
    exports.default = SoundPlayer;
});
define("sprite/Sprite", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sprite = (function () {
        function Sprite(width, height) {
            this.width = width;
            this.height = height;
            this.restored = false;
            this.canvas = document.createElement("canvas");
            this.canvas.width = this.width + 1;
            this.canvas.height = this.height + 1;
            var context = this.canvas.getContext("2d");
            if (context === null) {
                throw new Error("Unable to get 2d context from canvas");
            }
            this.context = context;
            this.context.save();
            this.context.translate(0.5, 0.5);
        }
        Sprite.prototype.Draw = function (context, x, y) {
            if (!this.restored) {
                this.context.restore();
                this.restored = true;
            }
            context.drawImage(this.canvas, 0, 0, this.width, this.height, x - 0.5, y - 0.5, this.width, this.height);
        };
        return Sprite;
    }());
    exports.default = Sprite;
});
define("sprite/track/BaseTrackSprite", ["require", "exports", "sprite/Sprite"], function (require, exports, Sprite_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseTrackSprite = (function (_super) {
        __extends(BaseTrackSprite, _super);
        function BaseTrackSprite(cellSize) {
            var _this = _super.call(this, cellSize, cellSize) || this;
            _this.plankColour = "#382E1C";
            _this.trackColour = "#6E7587";
            _this.trackPadding = 10;
            return _this;
        }
        return BaseTrackSprite;
    }(Sprite_1.default));
    exports.default = BaseTrackSprite;
});
define("sprite/track/CurvedTrackSprite", ["require", "exports", "sprite/track/BaseTrackSprite"], function (require, exports, BaseTrackSprite_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CurvedTrackSprite = (function (_super) {
        __extends(CurvedTrackSprite, _super);
        function CurvedTrackSprite(cellSize, drawPlanks, trackWidth) {
            var _this = _super.call(this, cellSize) || this;
            _this.drawCurvedTrack(_this.context, drawPlanks, trackWidth, cellSize);
            return _this;
        }
        CurvedTrackSprite.prototype.drawCurvedTrack = function (context, drawPlanks, trackWidth, cellSize) {
            var firstTrackPosY = this.trackPadding;
            var secondTrackPosY = cellSize - this.trackPadding;
            if (drawPlanks) {
                context.lineWidth = trackWidth;
                context.strokeStyle = this.plankColour;
                context.beginPath();
                this.drawCurvedPlankPath(context, 20 * Math.PI / 180, trackWidth, firstTrackPosY, secondTrackPosY);
                this.drawCurvedPlankPath(context, 45 * Math.PI / 180, trackWidth, firstTrackPosY, secondTrackPosY);
                this.drawCurvedPlankPath(context, 70 * Math.PI / 180, trackWidth, firstTrackPosY, secondTrackPosY);
                context.stroke();
            }
            context.lineWidth = 1;
            context.strokeStyle = this.trackColour;
            var finishAngle = Math.PI / 2;
            context.beginPath();
            context.arc(0, 0, firstTrackPosY, 0, finishAngle, false);
            context.moveTo(firstTrackPosY + trackWidth, 0);
            context.arc(0, 0, firstTrackPosY + trackWidth, 0, finishAngle, false);
            context.moveTo(secondTrackPosY - trackWidth, 0);
            context.arc(0, 0, secondTrackPosY - trackWidth, 0, finishAngle, false);
            context.moveTo(secondTrackPosY, 0);
            context.arc(0, 0, secondTrackPosY, 0, finishAngle, false);
            context.stroke();
        };
        CurvedTrackSprite.prototype.drawCurvedPlankPath = function (context, basePos, trackWidth, firstTrackPosY, secondTrackPosY) {
            var cos = Math.cos(basePos);
            var sin = Math.sin(basePos);
            context.moveTo((firstTrackPosY - trackWidth) * cos, (firstTrackPosY - trackWidth) * sin);
            context.lineTo((firstTrackPosY) * cos, (firstTrackPosY) * sin);
            context.moveTo((firstTrackPosY + trackWidth) * cos, (firstTrackPosY + trackWidth) * sin);
            context.lineTo((secondTrackPosY - trackWidth) * cos, (secondTrackPosY - trackWidth) * sin);
            context.moveTo((secondTrackPosY) * cos, (secondTrackPosY) * sin);
            context.lineTo((secondTrackPosY + trackWidth) * cos, (secondTrackPosY + trackWidth) * sin);
        };
        return CurvedTrackSprite;
    }(BaseTrackSprite_1.default));
    exports.default = CurvedTrackSprite;
});
define("sprite/track/StraightTrackSprite", ["require", "exports", "sprite/track/BaseTrackSprite"], function (require, exports, BaseTrackSprite_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StraightTrackSprite = (function (_super) {
        __extends(StraightTrackSprite, _super);
        function StraightTrackSprite(cellSize, trackWidth, terminator) {
            if (terminator === void 0) { terminator = false; }
            var _this = _super.call(this, cellSize) || this;
            var firstTrackPosY = _this.trackPadding;
            var secondTrackPosY = cellSize - _this.trackPadding;
            var numPlanks = 3;
            var startX = -1;
            var endX = cellSize;
            var thirdGridSize = cellSize / 3;
            _this.context.lineWidth = trackWidth;
            _this.context.strokeStyle = _this.plankColour;
            _this.context.beginPath();
            for (var i = 1; i <= numPlanks; i++) {
                var xPosition = (thirdGridSize * i) - (thirdGridSize / 2);
                var yPosition = firstTrackPosY - trackWidth;
                _this.context.moveTo(xPosition, yPosition);
                _this.context.lineTo(xPosition, secondTrackPosY + trackWidth);
                if (terminator && i === numPlanks) {
                    endX = xPosition - 1;
                }
            }
            _this.context.stroke();
            var endWidth = endX - startX;
            _this.context.beginPath();
            _this.context.clearRect(startX, firstTrackPosY, endWidth, trackWidth);
            _this.context.clearRect(startX, secondTrackPosY - trackWidth, endWidth, trackWidth);
            _this.context.lineWidth = 1;
            _this.context.strokeStyle = _this.trackColour;
            _this.context.beginPath();
            _this.context.moveTo(startX, firstTrackPosY);
            _this.context.lineTo(endX, firstTrackPosY);
            _this.context.moveTo(startX, firstTrackPosY + trackWidth);
            _this.context.lineTo(endX, firstTrackPosY + trackWidth);
            _this.context.moveTo(startX, secondTrackPosY - trackWidth);
            _this.context.lineTo(endX, secondTrackPosY - trackWidth);
            _this.context.moveTo(startX, secondTrackPosY);
            _this.context.lineTo(endX, secondTrackPosY);
            _this.context.stroke();
            return _this;
        }
        return StraightTrackSprite;
    }(BaseTrackSprite_2.default));
    exports.default = StraightTrackSprite;
});
define("sprite/TrackSpriteCollection", ["require", "exports", "sprite/track/CurvedTrackSprite", "sprite/track/StraightTrackSprite"], function (require, exports, CurvedTrackSprite_1, StraightTrackSprite_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TrackSpriteCollection = (function () {
        function TrackSpriteCollection(cellSize, trackWidth) {
            this.StraightTrackSprite = new StraightTrackSprite_1.default(cellSize, trackWidth, false);
            this.StraightTerminatorTrackSprite = new StraightTrackSprite_1.default(cellSize, trackWidth, true);
            this.CurvedTrackSprite = new CurvedTrackSprite_1.default(cellSize, true, trackWidth);
            this.CurvedTrackNoPlanksSprite = new CurvedTrackSprite_1.default(cellSize, false, trackWidth);
        }
        return TrackSpriteCollection;
    }());
    exports.default = TrackSpriteCollection;
});
define("Tool", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tool;
    (function (Tool) {
        Tool[Tool["Pointer"] = 0] = "Pointer";
        Tool[Tool["Track"] = 1] = "Track";
        Tool[Tool["Eraser"] = 2] = "Eraser";
        Tool[Tool["Rotate"] = 3] = "Rotate";
        Tool[Tool["Train"] = 4] = "Train";
    })(Tool = exports.Tool || (exports.Tool = {}));
});
define("track", ["require", "exports", "Cell", "Direction"], function (require, exports, Cell_1, Direction_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Track = (function (_super) {
        __extends(Track, _super);
        function Track(id, column, row, cellSize, spriteCollection, gameBoard) {
            var _this = _super.call(this, id, column, row, cellSize, gameBoard) || this;
            _this.SpriteCollection = spriteCollection;
            return _this;
        }
        Track.prototype.drawStraightTrack = function (context, cutOffTop, cutOffBottom) {
            if ((cutOffTop || cutOffBottom) && (cutOffTop !== cutOffBottom)) {
                if (cutOffTop) {
                    context.translate(this.cellSize, this.cellSize);
                    context.rotate(Math.PI);
                }
                this.SpriteCollection.StraightTerminatorTrackSprite.Draw(context, 0, 0);
            }
            else {
                this.SpriteCollection.StraightTrackSprite.Draw(context, 0, 0);
            }
        };
        Track.prototype.turnAroundBrightEyes = function () {
            var _this = this;
            if (this.direction === Direction_3.Direction.RightDownLeftDown) {
                this.direction = Direction_3.Direction.Vertical;
            }
            else {
                this.direction = this.direction + 1;
            }
            this.draw(this.gameBoard.trackContext);
            var neighbours = this.gameBoard.getNeighbouringCells(this.column, this.row, true);
            neighbours.all.forEach(function (neighbour) {
                neighbour.draw(_this.gameBoard.trackContext);
            });
        };
        Track.prototype.draw = function (context) {
            var _this = this;
            context.save();
            context.translate(this.x + 0.5, this.y + 0.5);
            this.clear(context);
            if (this.gameBoard.showDiagnostics) {
                if (this.gameBoard.trains.some(function (t) { return t.isTrainHere(_this.column, _this.row, true); })) {
                    context.fillStyle = "#0000FF";
                    context.fillRect(0, 0, this.cellSize, this.cellSize);
                }
                else if (this.gameBoard.trains.some(function (t) { return t.isTrainHere(_this.column, _this.row); })) {
                    context.fillStyle = "#FF0000";
                    context.fillRect(0, 0, this.cellSize, this.cellSize);
                }
            }
            switch (this.direction) {
                case Direction_3.Direction.Horizontal:
                    {
                        var neighbours = this.gameBoard.getNeighbouringCells(this.column, this.row);
                        this.drawStraightTrack(context, neighbours.left === undefined, neighbours.right === undefined);
                        break;
                    }
                case Direction_3.Direction.Vertical:
                    {
                        var neighbours = this.gameBoard.getNeighbouringCells(this.column, this.row);
                        context.translate(this.cellSize, 0);
                        context.rotate(Math.PI / 2);
                        this.drawStraightTrack(context, neighbours.up === undefined, neighbours.down === undefined);
                        break;
                    }
                case Direction_3.Direction.LeftUp:
                    {
                        this.leftUp(context, true);
                        break;
                    }
                case Direction_3.Direction.LeftDown:
                    {
                        this.leftDown(context, true);
                        break;
                    }
                case Direction_3.Direction.RightUp:
                    {
                        this.rightUp(context, true);
                        break;
                    }
                case Direction_3.Direction.RightDown:
                    {
                        this.rightDown(context, true);
                        break;
                    }
                case Direction_3.Direction.Cross:
                    {
                        this.drawStraightTrack(context, false, false);
                        context.translate(this.cellSize, 0);
                        context.rotate(Math.PI / 2);
                        this.drawStraightTrack(context, false, false);
                        break;
                    }
                case Direction_3.Direction.LeftUpLeftDown:
                    {
                        context.save();
                        this.leftUp(context, this.switchState);
                        context.restore();
                        this.leftDown(context, !this.switchState);
                        context.restore();
                        break;
                    }
                case Direction_3.Direction.LeftUpRightUp:
                    {
                        context.save();
                        this.leftUp(context, this.switchState);
                        context.restore();
                        this.rightUp(context, !this.switchState);
                        context.restore();
                        break;
                    }
                case Direction_3.Direction.RightDownRightUp:
                    {
                        context.save();
                        this.rightDown(context, !this.switchState);
                        context.restore();
                        this.rightUp(context, this.switchState);
                        context.restore();
                        break;
                    }
                case Direction_3.Direction.RightDownLeftDown:
                    {
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
        Track.prototype.drawCurvedTrack = function (context, drawPlanks) {
            (drawPlanks ? this.SpriteCollection.CurvedTrackSprite : this.SpriteCollection.CurvedTrackNoPlanksSprite)
                .Draw(context, 0, 0);
        };
        Track.prototype.rightDown = function (context, drawPlanks) {
            context.translate(this.cellSize, this.cellSize);
            context.rotate(Math.PI);
            this.drawCurvedTrack(context, drawPlanks);
        };
        Track.prototype.rightUp = function (context, drawPlanks) {
            context.translate(this.cellSize, 0);
            context.rotate(Math.PI / 2);
            this.drawCurvedTrack(context, drawPlanks);
        };
        Track.prototype.leftUp = function (context, drawPlanks) {
            this.drawCurvedTrack(context, drawPlanks);
        };
        Track.prototype.leftDown = function (context, drawPlanks) {
            context.translate(0, this.cellSize);
            context.rotate(Math.PI * 1.5);
            this.drawCurvedTrack(context, drawPlanks);
        };
        return Track;
    }(Cell_1.default));
    exports.default = Track;
});
define("Board", ["require", "exports", "BoardRenderer", "GameEvent", "GameLoop", "RenderLoop", "sound/SoundLibrary", "sound/SoundPlayer", "sprite/TrackSpriteCollection", "Tool", "track", "Train", "TrainRenderer", "util"], function (require, exports, BoardRenderer_1, GameEvent_2, GameLoop_1, RenderLoop_1, SoundLibrary_1, SoundPlayer_1, TrackSpriteCollection_1, Tool_1, track_1, Train_1, TrainRenderer_1, util_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.gridSize = 40;
    exports.gridColour = "#eee";
    exports.trackWidth = 4;
    exports.trackPadding = 10;
    exports.firstTrackPosY = exports.trackPadding;
    exports.secondTrackPosY = exports.gridSize - exports.trackPadding;
    var Board = (function () {
        function Board(playComponents) {
            var _this = this;
            this.playComponents = playComponents;
            this.trains = [];
            this.smokeParticleSystem = new Array();
            this.showDiagnostics = false;
            this.CheatAlwaysNight = false;
            this.cells = {};
            this.tool = Tool_1.Tool.Pointer;
            this.trainIDCounter = 0;
            this.$window = $(window);
            this.trainCanvas = this.playComponents.$trainCanvas.get(0);
            this.trainContext = this.get2dContextFromCanvas(this.trainCanvas);
            this.trackCanvas = this.playComponents.$trackCanvas.get(0);
            this.trackContext = this.get2dContextFromCanvas(this.trackCanvas);
            this.gridCanvas = this.playComponents.$gridCanvas.get(0);
            this.gridContext = this.get2dContextFromCanvas(this.gridCanvas);
            this.trainLogoCanvas = this.playComponents.$trainLogoCanvas.get(0);
            this.trainLogoContext = this.get2dContextFromCanvas(this.trainLogoCanvas);
            this.playComponents.$trainLogoCanvas.attr("width", exports.gridSize);
            this.playComponents.$trainLogoCanvas.attr("height", exports.gridSize);
            this.playComponents.$trainLogoCanvas.width(exports.gridSize);
            this.playComponents.$trainLogoCanvas.height(exports.gridSize);
            this.canvasWidth = this.roundToNearestGridSize(this.$window.width() - (exports.gridSize * 2));
            this.maxColumns = this.canvasWidth / exports.gridSize;
            this.canvasHeight = this.roundToNearestGridSize(this.$window.height() - exports.gridSize);
            this.maxRows = this.canvasHeight / exports.gridSize;
            this.playComponents.$canvases.attr("width", this.canvasWidth);
            this.playComponents.$canvases.attr("height", this.canvasHeight);
            this.playComponents.$canvases.width(this.canvasWidth);
            this.playComponents.$canvases.css("top", (this.$window.height() - this.canvasHeight) / 2);
            this.playComponents.$canvases.css("left", (this.$window.width() - this.canvasWidth) / 2);
            [this.trackCanvas, this.trainCanvas].forEach(function (el) {
                el.addEventListener("click", function (event) { return _this.cellClick(event); });
                el.addEventListener("mousemove", function (event) { return _this.cellMoveOver(event); });
                el.addEventListener("touchstart", function (_) { return false; });
                el.addEventListener("touchmove", function (event) {
                    _this.cellTouch(event);
                    event.preventDefault();
                    return false;
                });
                el.addEventListener("contextmenu", function (ev) {
                    _this.cellRightClick(ev);
                    ev.preventDefault();
                    return false;
                }, false);
            });
            this.trainRenderer = new TrainRenderer_1.default(exports.gridSize, exports.firstTrackPosY, exports.secondTrackPosY);
            this.trackSpriteCollection = new TrackSpriteCollection_1.default(exports.gridSize, exports.trackWidth);
            this.lightingBufferCanvas = document.createElement("canvas");
            this.lightingBufferCanvas.width = this.canvasWidth;
            this.lightingBufferCanvas.height = this.canvasHeight;
            this.lightingBufferContext = this.get2dContextFromCanvas(this.lightingBufferCanvas);
            this.gameLoop = new GameLoop_1.default(this);
            this.renderLoop = new RenderLoop_1.default(this);
            BoardRenderer_1.default.drawGrid(this.gridContext, this.canvasWidth, this.canvasHeight, exports.gridSize, exports.gridColour);
            this.gameLoop.startLoop();
            this.renderLoop.startLoop();
            this.player = new SoundPlayer_1.default();
            this.setMuted(util_2.default.toBoolean(localStorage.getItem("muted") || "false"));
            this.setAutoSave(util_2.default.toBoolean(localStorage.getItem("autosave") || "false"));
            setTimeout(function () {
                _this.setTool(Tool_1.Tool.Track);
            }, 100);
        }
        Board.prototype.loadCells = function () {
            var savedCells = JSON.parse(localStorage.getItem("cells") || "");
            if (savedCells !== undefined) {
                for (var id in savedCells) {
                    if (savedCells.hasOwnProperty(id)) {
                        var theCell = savedCells[id];
                        var newCell = new track_1.default(theCell.id, theCell.column, theCell.row, theCell.cellSize, this.trackSpriteCollection, this);
                        newCell.direction = theCell.direction;
                        newCell.happy = theCell.happy;
                        newCell.switchState = theCell.switchState;
                        this.cells[newCell.id] = newCell;
                    }
                }
            }
            this.redraw();
        };
        Board.prototype.redraw = function () {
            BoardRenderer_1.default.redrawCells(this.cells, this.trackContext, this.canvasWidth, this.canvasHeight);
        };
        Board.prototype.saveCells = function () {
            if (util_2.default.toBoolean(localStorage.getItem("autosave") || "false")) {
                localStorage.setItem("cells", JSON.stringify(this.cells));
            }
        };
        Board.prototype.getGridCoord = function (value) {
            return Math.floor(value / exports.gridSize);
        };
        Board.prototype.getCellID = function (column, row) {
            return column.toString() + ":" + row.toString();
        };
        Board.prototype.getCell = function (column, row) {
            return this.cells[this.getCellID(column, row)];
        };
        Board.prototype.getNeighbouringCells = function (column, row, includeHappyNeighbours) {
            if (includeHappyNeighbours === void 0) { includeHappyNeighbours = false; }
            var up = this.cells[this.getCellID(column, row - 1)];
            var right = this.cells[this.getCellID(column + 1, row)];
            var down = this.cells[this.getCellID(column, row + 1)];
            var left = this.cells[this.getCellID(column - 1, row)];
            if (!includeHappyNeighbours) {
                if (up !== undefined && up.happy && !up.isConnectedDown()) {
                    up = undefined;
                }
                if (right !== undefined && right.happy && !right.isConnectedLeft()) {
                    right = undefined;
                }
                if (down !== undefined && down.happy && !down.isConnectedUp()) {
                    down = undefined;
                }
                if (left !== undefined && left.happy && !left.isConnectedRight()) {
                    left = undefined;
                }
            }
            var all = [];
            if (up !== undefined) {
                all.push(up);
            }
            if (right !== undefined) {
                all.push(right);
            }
            if (down !== undefined) {
                all.push(down);
            }
            if (left !== undefined) {
                all.push(left);
            }
            return {
                up: up,
                right: right,
                down: down,
                left: left,
                all: all
            };
        };
        Board.prototype.trackControlClick = function (option) {
            var $option = $(option);
            switch ($option.data("action").toLowerCase()) {
                case "pointer": {
                    this.setTool(Tool_1.Tool.Pointer);
                    break;
                }
                case "train": {
                    this.setTool(Tool_1.Tool.Train);
                    break;
                }
                case "pencil": {
                    this.setTool(Tool_1.Tool.Track);
                    break;
                }
                case "eraser": {
                    this.setTool(Tool_1.Tool.Eraser);
                    break;
                }
                case "rotate": {
                    this.setTool(Tool_1.Tool.Rotate);
                    break;
                }
                case "bomb": {
                    var response = confirm("Are you sure buddy?");
                    if (response) {
                        this.destroyTrack();
                        this.setTool(Tool_1.Tool.Track);
                    }
                    break;
                }
            }
        };
        Board.prototype.trainControlClick = function (option) {
            if (this.selectedTrain !== undefined) {
                var $option = $(option);
                switch ($option.data("action").toLowerCase()) {
                    case "play": {
                        this.selectedTrain.wakeMeUp();
                        break;
                    }
                    case "pause": {
                        this.selectedTrain.hammerTime();
                        break;
                    }
                    case "forward": {
                        this.selectedTrain.fasterFasterFaster();
                        break;
                    }
                    case "backward": {
                        this.selectedTrain.slowYourRoll();
                        break;
                    }
                    case "delete": {
                        for (var i = 0; i < this.trains.length; i++) {
                            if (this.trains[i].id === this.selectedTrain.id) {
                                this.trains.splice(i, 1);
                                this.hideTrainControls();
                                break;
                            }
                        }
                        break;
                    }
                    case "spawncarriage": {
                        this.selectedTrain.spawnCarriage();
                        break;
                    }
                    case "removecarriage": {
                        this.selectedTrain.removeEndCarriage(this.selectedTrain);
                        break;
                    }
                }
            }
            else {
                this.hideTrainControls();
            }
        };
        Board.prototype.globalControlClick = function (option) {
            var $option = $(option);
            switch ($option.data("action").toLowerCase()) {
                case "play": {
                    this.gameLoop.startLoop();
                    break;
                }
                case "pause": {
                    this.gameLoop.stopLoop();
                    break;
                }
                case "forward": {
                    this.trains.forEach(function (t) { return t.fasterFasterFaster(); });
                    break;
                }
                case "backward": {
                    this.trains.forEach(function (t) { return t.slowYourRoll(); });
                    break;
                }
            }
        };
        Board.prototype.showTrainControls = function (train) {
            this.selectedTrain = train;
            GameEvent_2.default.Emit("showtraincontrols", this.selectedTrain);
        };
        Board.prototype.hideTrainControls = function () {
            this.selectedTrain = undefined;
            GameEvent_2.default.Emit("hidetraincontrols");
        };
        Board.prototype.setMuted = function (mute) {
            localStorage.setItem("muted", mute.toString());
            if (mute) {
                this.playComponents.$mute.removeClass("fa-volume-up").addClass("fa-volume-off");
            }
            else {
                this.playComponents.$mute.removeClass("fa-volume-off").addClass("fa-volume-up");
            }
            this.player.setMuted(mute);
        };
        Board.prototype.setAutoSave = function (autosave) {
            localStorage.setItem("autosave", autosave.toString());
            if (autosave) {
                this.playComponents.$autosave.css("color", "green");
            }
            else {
                localStorage.removeItem("cells");
                this.playComponents.$autosave.css("color", "black");
            }
        };
        Board.prototype.setTool = function (tool) {
            if (tool !== this.tool) {
                this.tool = tool;
                var cursorName = void 0;
                var hotspot = "bottom left";
                switch (tool) {
                    case Tool_1.Tool.Track: {
                        cursorName = "pencil";
                        break;
                    }
                    case Tool_1.Tool.Train: {
                        cursorName = "train";
                        hotspot = "center";
                        break;
                    }
                    case Tool_1.Tool.Eraser: {
                        cursorName = "eraser";
                        break;
                    }
                    case Tool_1.Tool.Rotate: {
                        cursorName = "refresh";
                        hotspot = "center";
                        break;
                    }
                    case Tool_1.Tool.Pointer:
                    default: {
                        cursorName = "hand-pointer-o";
                        hotspot = "top left";
                        break;
                    }
                }
                $("body").css("cursor", "");
                $("body").awesomeCursor(cursorName, {
                    hotspot: hotspot,
                    size: 22
                });
            }
        };
        Board.prototype.cellMoveOver = function (event) {
            if (event.buttons === 1 && this.tool !== Tool_1.Tool.Train
                && this.tool !== Tool_1.Tool.Rotate && this.tool !== Tool_1.Tool.Pointer) {
                this.cellClick(event);
            }
        };
        Board.prototype.cellTouch = function (event) {
            if (this.tool === Tool_1.Tool.Train) {
                return;
            }
            var column = this.getGridCoord(event.touches[0].pageX - this.trackCanvas.offsetLeft);
            var row = this.getGridCoord(event.touches[0].pageY - this.trackCanvas.offsetTop);
            this.doTool(column, row, event.shiftKey);
        };
        Board.prototype.cellRightClick = function (event) {
            var column = this.getGridCoord(event.pageX - this.trackCanvas.offsetLeft);
            var row = this.getGridCoord(event.pageY - this.trackCanvas.offsetTop);
            this.eraseTrack(column, row);
        };
        Board.prototype.cellClick = function (event) {
            var column = this.getGridCoord(event.pageX - this.trackCanvas.offsetLeft);
            var row = this.getGridCoord(event.pageY - this.trackCanvas.offsetTop);
            this.doTool(column, row, event.shiftKey);
        };
        Board.prototype.doTool = function (column, row, shift) {
            if (row >= this.maxRows || column >= this.maxColumns) {
                return;
            }
            switch (this.tool) {
                case Tool_1.Tool.Pointer:
                    {
                        this.pointAtThing(column, row);
                        break;
                    }
                case Tool_1.Tool.Track:
                    {
                        if (shift) {
                            this.rotateTrack(column, row);
                        }
                        else {
                            this.newTrack(column, row);
                        }
                        break;
                    }
                case Tool_1.Tool.Eraser:
                    {
                        this.eraseTrack(column, row);
                        break;
                    }
                case Tool_1.Tool.Rotate:
                    {
                        this.rotateTrack(column, row);
                        break;
                    }
                case Tool_1.Tool.Train:
                    {
                        var cellID = this.getCellID(column, row);
                        if (this.cells[cellID] !== undefined) {
                            var t = Train_1.default.SpawnNewTrain(this.trainIDCounter++, this.cells[cellID], this.trainRenderer, this, exports.gridSize);
                            t.chooChooMotherFucker(0.1, false);
                            this.trains.push(t);
                            this.showTrainControls(t);
                        }
                        break;
                    }
            }
        };
        Board.prototype.destroyTrack = function () {
            var _this = this;
            this.hideTrainControls();
            this.trains = new Array();
            var deferreds = new Array();
            for (var id in this.cells) {
                if (this.cells.hasOwnProperty(id)) {
                    deferreds.push(this.cells[id].destroy());
                }
            }
            $.when.apply($, deferreds).done(function () {
                BoardRenderer_1.default.clearCells(_this.trackContext, _this.canvasWidth, _this.canvasHeight);
                BoardRenderer_1.default.clearCells(_this.trainContext, _this.canvasWidth, _this.canvasHeight);
                _this.cells = {};
                localStorage.removeItem("cells");
            });
        };
        Board.prototype.rotateTrack = function (column, row) {
            var cellID = this.getCellID(column, row);
            var cell = this.cells[cellID];
            if (cell !== undefined) {
                cell.turnAroundBrightEyes();
            }
            this.saveCells();
        };
        Board.prototype.newTrack = function (column, row) {
            var cellID = this.getCellID(column, row);
            if (this.cells[cellID] === undefined) {
                this.player.playSound(SoundLibrary_1.default.ClickSound);
                var newCell = new track_1.default(cellID, column, row, exports.gridSize, this.trackSpriteCollection, this);
                this.cells[newCell.id] = newCell;
                if (!newCell.crossTheRoad()) {
                    newCell.checkYourself();
                }
            }
            else {
                this.cells[cellID].haveAThreeWay();
            }
            this.saveCells();
        };
        Board.prototype.eraseTrack = function (column, row) {
            var _this = this;
            var cellID = this.getCellID(column, row);
            var cell = this.cells[cellID];
            if (cell !== undefined) {
                delete this.cells[cellID];
                this.saveCells();
                cell.destroy().done(function () {
                    var neighbours = _this.getNeighbouringCells(column, row, true);
                    if (neighbours.up !== undefined && neighbours.up.happy && neighbours.up.isConnectedDown()) {
                        neighbours.up.happy = false;
                    }
                    if (neighbours.down !== undefined && neighbours.down.happy && neighbours.down.isConnectedUp()) {
                        neighbours.down.happy = false;
                    }
                    if (neighbours.left !== undefined && neighbours.left.happy && neighbours.left.isConnectedRight()) {
                        neighbours.left.happy = false;
                    }
                    if (neighbours.right !== undefined && neighbours.right.happy && neighbours.right.isConnectedLeft()) {
                        neighbours.right.happy = false;
                    }
                    neighbours.all.forEach(function (n) { return n.checkYourself(); });
                });
            }
        };
        Board.prototype.pointAtThing = function (column, row) {
            var _this = this;
            if (!this.trains.some(function (train) {
                if (train.isTrainHere(column, row)) {
                    _this.showTrainControls(train);
                    return true;
                }
                return false;
            })) {
                var cellID = this.getCellID(column, row);
                var cell = this.cells[cellID];
                if (cell !== undefined) {
                    cell.switchTrack();
                }
                this.saveCells();
            }
        };
        Board.prototype.roundToNearestGridSize = function (value) {
            return Math.floor(value / exports.gridSize) * exports.gridSize;
        };
        Board.prototype.get2dContextFromCanvas = function (canvas) {
            var context = canvas.getContext("2d");
            if (context === null) {
                throw new Error("Unable to get 2d context from canvas");
            }
            return context;
        };
        return Board;
    }());
    exports.default = Board;
});
define("PlayManager", ["require", "exports", "Board", "GameEvent", "util"], function (require, exports, Board_1, GameEvent_3, util_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlayManager = (function () {
        function PlayManager($container) {
            this.animationEndEventString = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd onanimationend animationend";
            this.playComponents = this.GetPlayComponent($container);
            this.gameBoard = new Board_1.default(this.playComponents);
            var top = ($(window).height() - this.gameBoard.canvasHeight) / 2;
            var left = ($(window).width() - this.gameBoard.canvasWidth) / 2;
            $("body").height($(window).height());
            this.playComponents.$trackButtons.css("top", top);
            this.playComponents.$trainButtons.css("top", 15).css("right", 15);
            this.playComponents.$mute.width(left);
            this.playComponents.$autosave.width(left);
            this.playComponents.$trainButtons.draggable({
                containment: "body",
                handle: ".ui-handle"
            });
            this.AttachEvents();
            this.gameBoard.loadCells();
        }
        PlayManager.prototype.DisplayTrainSpeed = function (speed) {
            this.playComponents.$trainButtons.find(".ui-speed").text((speed * 10).toString() + " kms/h");
        };
        PlayManager.prototype.AttachEvents = function () {
            var _this = this;
            this.playComponents.$globalButtons.find(".ui-title").click(function () {
                _this.playComponents.$globalButtons.toggleClass("minimised");
            });
            this.playComponents.$globalButtons.find(".ui-minimise").click(function () {
                _this.playComponents.$globalButtons.addClass("minimised");
            });
            this.playComponents.$globalButtons.find("button").click(function (event) {
                if (event.currentTarget !== null) {
                    _this.gameBoard.globalControlClick(event.currentTarget);
                }
            });
            this.playComponents.$trainButtons.find(".ui-close").click(function () {
                _this.gameBoard.hideTrainControls();
            });
            this.playComponents.$trainButtons.find("button").click(function (event) {
                if (event.currentTarget !== null) {
                    _this.gameBoard.trainControlClick(event.currentTarget);
                }
            });
            this.playComponents.$trackButtons.find("button").click(function (event) {
                if (event.currentTarget !== null) {
                    _this.gameBoard.trackControlClick(event.currentTarget);
                    util_3.default.selectButton($(event.currentTarget));
                }
            });
            this.playComponents.$mute.click(function () {
                var $mute = _this.playComponents.$mute;
                var mute = util_3.default.toBoolean($mute.val());
                if (!mute) {
                    $mute.val("true");
                }
                else {
                    $mute.val("false");
                }
                _this.gameBoard.setMuted(!mute);
            });
            this.playComponents.$autosave.click(function () {
                var $autosave = _this.playComponents.$autosave;
                var autosave = util_3.default.toBoolean($autosave.val());
                if (!autosave) {
                    $autosave.val("true");
                }
                else {
                    $autosave.val("false");
                }
                _this.gameBoard.setAutoSave(!autosave);
                if (!autosave) {
                    _this.gameBoard.saveCells();
                }
            });
            GameEvent_3.default.On("speedchanged", function (_, trainID, speed) {
                var setTrainSpeed = false;
                if (_this.gameBoard.selectedTrain !== undefined) {
                    if (trainID === _this.gameBoard.selectedTrain.id) {
                        setTrainSpeed = true;
                    }
                }
                else {
                    setTrainSpeed = true;
                }
                if (setTrainSpeed) {
                    _this.DisplayTrainSpeed(speed);
                }
            });
            GameEvent_3.default.On("showtraincontrols", function (_, train) {
                _this.playComponents.$trainName.text(train.name);
                _this.playComponents.$trainButtons.addClass("flipInX").show();
                _this.playComponents.$trainButtons.one(_this.animationEndEventString, function () {
                    _this.playComponents.$trainButtons.removeClass("flipInX");
                });
                _this.DisplayTrainSpeed(train.getTrainSpeed());
            });
            GameEvent_3.default.On("hidetraincontrols", function (_) {
                _this.playComponents.$trainButtons.addClass("flipOutX");
                _this.playComponents.$trainButtons.one(_this.animationEndEventString, function () {
                    _this.playComponents.$trainButtons.removeClass("flipOutX").hide();
                });
            });
        };
        PlayManager.prototype.GetPlayComponent = function ($container) {
            var $trainCanvas = $container.find(".ui-train-canvas");
            var $trackCanvas = $container.find(".ui-track-canvas");
            var $gridCanvas = $container.find(".ui-grid-canvas");
            var $trainLogoCanvas = $container.find(".ui-train-logo-canvas");
            return {
                $trackCanvas: $trackCanvas,
                $trainCanvas: $trainCanvas,
                $gridCanvas: $gridCanvas,
                $trainLogoCanvas: $trainLogoCanvas,
                $canvases: $().add($trainCanvas).add($trackCanvas).add($gridCanvas),
                $trackButtons: $container.find(".ui-track-buttons"),
                $trainButtons: $container.find(".ui-train-buttons"),
                $globalButtons: $container.find(".ui-game-buttons"),
                $trainName: $container.find(".ui-train-name"),
                $mute: $container.find(".ui-mute"),
                $autosave: $container.find(".ui-autosave")
            };
        };
        return PlayManager;
    }());
    exports.default = PlayManager;
});
