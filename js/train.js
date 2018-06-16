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
        var Cell = (function () {
            function Cell(id, column, row, cellSize) {
                this.id = id;
                this.column = column;
                this.row = row;
                this.happy = false;
                this.x = this.column * cellSize;
                this.y = this.row * cellSize;
                this.cellSize = cellSize;
                this.direction = trains.play.Direction.None;
            }
            Cell.prototype.draw = function (context) {
                throw new Error("This method is abstract.. no really.. come on.. just pretend! It will be fun I promise.");
            };
            Cell.prototype.clear = function (context) {
                context.clearRect(0, 0, this.cellSize, this.cellSize);
            };
            Cell.prototype.turnAroundBrightEyes = function () {
                throw new Error("abstract");
            };
            Cell.prototype.checkYourself = function () {
                var neighbours = play.GameBoard.getNeighbouringCells(this.column, this.row);
                var changed = this.determineDirection(neighbours);
                this.happy = (neighbours.all.length > 1);
                this.draw(play.GameBoard.trackContext);
                if (changed) {
                    var neighbours = play.GameBoard.getNeighbouringCells(this.column, this.row);
                    neighbours.all.forEach(function (n) { return n.checkYourself(); });
                }
            };
            Cell.prototype.crossTheRoad = function () {
                var neighbours = play.GameBoard.getNeighbouringCells(this.column, this.row, true);
                return neighbours.all.some(function (c) {
                    var myNeighbours = play.GameBoard.getNeighbouringCells(c.column, c.row, true);
                    if (myNeighbours.all.length < 4)
                        return false;
                    if (!myNeighbours.up.isConnectedDown() && myNeighbours.up.happy)
                        return false;
                    if (!myNeighbours.down.isConnectedUp() && myNeighbours.down.happy)
                        return false;
                    if (!myNeighbours.left.isConnectedRight() && myNeighbours.left.happy)
                        return false;
                    if (!myNeighbours.right.isConnectedLeft() && myNeighbours.right.happy)
                        return false;
                    c.direction = play.Direction.Cross;
                    c.happy = true;
                    c.draw(play.GameBoard.trackContext);
                    myNeighbours = play.GameBoard.getNeighbouringCells(c.column, c.row);
                    myNeighbours.all.forEach(function (c2) { return c2.checkYourself(); });
                    return true;
                });
            };
            Cell.prototype.haveAThreeWay = function () {
                var myNeighbours = play.GameBoard.getNeighbouringCells(this.column, this.row, true);
                if (myNeighbours.all.length < 3)
                    return false;
                if ([myNeighbours.up, myNeighbours.right, myNeighbours.down, myNeighbours.left].filter(function (n) { return n !== undefined; }).length === 3) {
                    if (myNeighbours.up !== undefined && !myNeighbours.up.isConnectedDown() && myNeighbours.up.happy)
                        return false;
                    if (myNeighbours.down !== undefined && !myNeighbours.down.isConnectedUp() && myNeighbours.down.happy)
                        return false;
                    if (myNeighbours.left !== undefined && !myNeighbours.left.isConnectedRight() && myNeighbours.left.happy)
                        return false;
                    if (myNeighbours.right !== undefined && !myNeighbours.right.isConnectedLeft() && myNeighbours.right.happy)
                        return false;
                    if (myNeighbours.up === undefined) {
                        this.direction = play.Direction.RightDownLeftDown;
                    }
                    else if (myNeighbours.down === undefined) {
                        this.direction = play.Direction.LeftUpRightUp;
                    }
                    else if (myNeighbours.left === undefined) {
                        this.direction = play.Direction.RightDownRightUp;
                    }
                    else if (myNeighbours.right === undefined) {
                        this.direction = play.Direction.LeftUpLeftDown;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (myNeighbours.up.isConnectedDown() && myNeighbours.down.isConnectedUp() && myNeighbours.right.isConnectedLeft()) {
                        this.direction = play.Direction.RightDownRightUp;
                    }
                    else if (myNeighbours.up.isConnectedDown() && myNeighbours.down.isConnectedUp() && myNeighbours.left.isConnectedRight()) {
                        this.direction = play.Direction.LeftUpLeftDown;
                    }
                    else if (myNeighbours.left.isConnectedRight() && myNeighbours.down.isConnectedUp() && myNeighbours.right.isConnectedLeft()) {
                        this.direction = play.Direction.RightDownLeftDown;
                    }
                    else if (myNeighbours.up.isConnectedDown() && myNeighbours.left.isConnectedRight() && myNeighbours.right.isConnectedLeft()) {
                        this.direction = play.Direction.LeftUpRightUp;
                    }
                    else {
                        return false;
                    }
                }
                this.happy = true;
                this.draw(play.GameBoard.trackContext);
                myNeighbours = play.GameBoard.getNeighbouringCells(this.column, this.row);
                myNeighbours.all.forEach(function (c2) { return c2.checkYourself(); });
                return true;
            };
            Cell.prototype.switchTrack = function () {
                if (this.direction === play.Direction.LeftUpLeftDown || this.direction === play.Direction.LeftUpRightUp ||
                    this.direction === play.Direction.RightDownLeftDown || this.direction === play.Direction.RightDownRightUp) {
                    this.switchState = !this.switchState;
                    this.draw(play.GameBoard.trackContext);
                }
            };
            Cell.prototype.determineDirection = function (neighbours) {
                if (this.happy)
                    return false;
                var newDirection;
                if (neighbours.left !== undefined && neighbours.right !== undefined && neighbours.up !== undefined && neighbours.down !== undefined) {
                    newDirection = trains.play.Direction.Cross;
                }
                else if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.up !== undefined) {
                    if (neighbours.down !== undefined) {
                        newDirection = trains.play.Direction.LeftUpLeftDown;
                    }
                    else {
                        newDirection = trains.play.Direction.LeftUp;
                    }
                }
                else if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.down !== undefined) {
                    newDirection = trains.play.Direction.LeftDown;
                }
                else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.up !== undefined) {
                    if (neighbours.down !== undefined) {
                        newDirection = trains.play.Direction.RightDownRightUp;
                    }
                    else {
                        newDirection = trains.play.Direction.RightUp;
                    }
                }
                else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.down !== undefined) {
                    newDirection = trains.play.Direction.RightDown;
                }
                else if (neighbours.up !== undefined && neighbours.down !== undefined) {
                    newDirection = trains.play.Direction.Vertical;
                }
                else if (neighbours.left !== undefined && neighbours.right !== undefined) {
                    if (neighbours.up !== undefined) {
                        newDirection = trains.play.Direction.LeftUpRightUp;
                    }
                    else if (neighbours.down !== undefined) {
                        newDirection = trains.play.Direction.RightDownLeftDown;
                    }
                    else {
                        newDirection = trains.play.Direction.Horizontal;
                    }
                }
                else if (neighbours.up !== undefined || neighbours.down !== undefined) {
                    newDirection = trains.play.Direction.Vertical;
                }
                else if (neighbours.left !== undefined || neighbours.right !== undefined) {
                    newDirection = trains.play.Direction.Horizontal;
                }
                else {
                    newDirection = trains.play.Direction.Horizontal;
                }
                if (newDirection !== undefined && newDirection !== this.direction) {
                    this.direction = newDirection;
                    return true;
                }
                return false;
            };
            Cell.prototype.isConnectedUp = function () {
                return this.direction === play.Direction.Vertical ||
                    this.direction === play.Direction.LeftUp ||
                    this.direction === play.Direction.RightUp ||
                    this.direction === play.Direction.Cross ||
                    this.direction === play.Direction.LeftUpLeftDown ||
                    this.direction === play.Direction.LeftUpRightUp ||
                    this.direction === play.Direction.RightDownRightUp;
            };
            Cell.prototype.isConnectedDown = function () {
                return this.direction === play.Direction.Vertical ||
                    this.direction === play.Direction.LeftDown ||
                    this.direction === play.Direction.RightDown ||
                    this.direction === play.Direction.Cross ||
                    this.direction === play.Direction.LeftUpLeftDown ||
                    this.direction === play.Direction.RightDownLeftDown ||
                    this.direction === play.Direction.RightDownRightUp;
            };
            Cell.prototype.isConnectedLeft = function () {
                return this.direction === play.Direction.Horizontal ||
                    this.direction === play.Direction.LeftUp ||
                    this.direction === play.Direction.LeftDown ||
                    this.direction === play.Direction.Cross ||
                    this.direction === play.Direction.LeftUpLeftDown ||
                    this.direction === play.Direction.LeftUpRightUp ||
                    this.direction === play.Direction.RightDownLeftDown;
            };
            Cell.prototype.isConnectedRight = function () {
                return this.direction === play.Direction.Horizontal ||
                    this.direction === play.Direction.RightDown ||
                    this.direction === play.Direction.RightUp ||
                    this.direction === play.Direction.Cross ||
                    this.direction === play.Direction.RightDownLeftDown ||
                    this.direction === play.Direction.LeftUpRightUp ||
                    this.direction === play.Direction.RightDownRightUp;
            };
            Cell.prototype.destroy = function () {
                var _this = this;
                var def = $.Deferred();
                this.destroyLoop(def, 0);
                def.done(function () {
                    play.GameBoard.trackContext.clearRect(_this.x, _this.y, trains.play.gridSize, trains.play.gridSize);
                });
                return def;
            };
            Cell.prototype.destroyLoop = function (deferred, counter) {
                var _this = this;
                setTimeout(function () {
                    var x = Math.floor(Math.random() * trains.play.gridSize);
                    var y = Math.floor(Math.random() * trains.play.gridSize);
                    play.GameBoard.trackContext.clearRect(_this.x + x, _this.y + y, 5, 5);
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
                    var neighbours = play.GameBoard.getNeighbouringCells(lastCell.column, lastCell.row);
                    if (this.direction === play.Direction.LeftUpLeftDown) {
                        if (lastCell !== undefined && lastCell.isConnectedDown() && neighbours.down === this) {
                            if (!this.switchState)
                                this.switchTrack();
                        }
                        else if (lastCell !== undefined && lastCell.isConnectedUp() && neighbours.up === this) {
                            if (this.switchState)
                                this.switchTrack();
                        }
                        return this.switchState ? play.Direction.LeftUp : play.Direction.LeftDown;
                    }
                    else if (this.direction === play.Direction.LeftUpRightUp) {
                        if (lastCell !== undefined && lastCell.isConnectedLeft() && neighbours.left === this) {
                            if (this.switchState)
                                this.switchTrack();
                        }
                        else if (lastCell !== undefined && lastCell.isConnectedRight() && neighbours.right === this) {
                            if (!this.switchState)
                                this.switchTrack();
                        }
                        return this.switchState ? play.Direction.LeftUp : play.Direction.RightUp;
                    }
                    else if (this.direction === play.Direction.RightDownLeftDown) {
                        if (lastCell !== undefined && lastCell.isConnectedLeft() && neighbours.left === this) {
                            if (this.switchState)
                                this.switchTrack();
                        }
                        else if (lastCell !== undefined && lastCell.isConnectedRight() && neighbours.right === this) {
                            if (!this.switchState)
                                this.switchTrack();
                        }
                        return this.switchState ? play.Direction.LeftDown : play.Direction.RightDown;
                    }
                    else if (this.direction === play.Direction.RightDownRightUp) {
                        if (lastCell !== undefined && lastCell.isConnectedDown() && neighbours.down === this) {
                            if (!this.switchState)
                                this.switchTrack();
                        }
                        else if (lastCell !== undefined && lastCell.isConnectedUp() && neighbours.up === this) {
                            if (this.switchState)
                                this.switchTrack();
                        }
                        return this.switchState ? play.Direction.RightUp : play.Direction.RightDown;
                    }
                }
                return this.direction;
            };
            return Cell;
        }());
        play.Cell = Cell;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var play;
    (function (play) {
        var BoardRenderer;
        (function (BoardRenderer) {
            function drawGrid(context, canvasWidth, canvasHeight) {
                context.beginPath();
                for (var x = play.gridSize; x < canvasWidth; x += play.gridSize) {
                    context.moveTo(x, 0);
                    context.lineTo(x, canvasHeight);
                }
                for (var y = play.gridSize; y < canvasHeight; y += play.gridSize) {
                    context.moveTo(0, y);
                    context.lineTo(canvasWidth, y);
                }
                context.strokeStyle = play.gridColour;
                context.stroke();
            }
            BoardRenderer.drawGrid = drawGrid;
            function redrawCells(cells, context, canvasWidth, canvasHeight) {
                clearCells(context, canvasWidth, canvasHeight);
                for (var id in cells) {
                    if (cells.hasOwnProperty(id)) {
                        cells[id].draw(context);
                    }
                }
            }
            BoardRenderer.redrawCells = redrawCells;
            function clearCells(context, canvasWidth, canvasHeight) {
                context.beginPath();
                context.clearRect(0, 0, canvasWidth, canvasHeight);
                context.closePath();
            }
            BoardRenderer.clearCells = clearCells;
        })(BoardRenderer = play.BoardRenderer || (play.BoardRenderer = {}));
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var play;
    (function (play) {
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
                leftLightGradient.addColorStop(1, 'rgba(187,187,187,0)');
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
                context.closePath;
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
        play.TrainRenderer = TrainRenderer;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var util;
    (function (util) {
        var adjectives = [
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
        var names = [
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
        function getRandomName() {
            return "The " + getRandomElement(adjectives) + " " + getRandomElement(names);
        }
        util.getRandomName = getRandomName;
        function getRandomElement(items) {
            return items[Math.floor(Math.random() * items.length)];
        }
        function toBoolean(value) {
            if (value === "true")
                return true;
            return false;
        }
        util.toBoolean = toBoolean;
        function selectButton($button) {
            var $parent = $button.closest('ul');
            $parent.find('button.selected').removeClass('selected');
            $button.addClass('selected');
        }
        util.selectButton = selectButton;
    })(util = trains.util || (trains.util = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var event;
    (function (event_1) {
        var globalEventID = 1;
        var globalEvents = {};
        function On(eventName, callback) {
            var id = globalEventID;
            globalEventID++;
            var existingEvents = globalEvents[eventName];
            if (existingEvents === undefined) {
                globalEvents[eventName] = new Array();
                existingEvents = globalEvents[eventName];
            }
            existingEvents.push({
                id: id,
                callback: callback
            });
            return id;
        }
        event_1.On = On;
        function Emit(eventName) {
            var data = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                data[_i - 1] = arguments[_i];
            }
            var existingEvents = globalEvents[eventName];
            if (existingEvents !== undefined) {
                var eventObject = {
                    eventName: eventName,
                    data: data
                };
                var callbackData = [eventObject];
                for (var i = 0; i < data.length; i++) {
                    callbackData.push(data[i]);
                }
                for (var i = 0; i < existingEvents.length; i++) {
                    existingEvents[i].callback.apply(null, callbackData);
                }
            }
        }
        event_1.Emit = Emit;
        function Unsubscribe(eventID) {
            for (var eventName in globalEvents) {
                if (globalEvents.hasOwnProperty(eventName) && globalEvents[eventName] !== undefined) {
                    for (var i = 0; i < globalEvents[eventName].length; i++) {
                        if (globalEvents[eventName][i].id === eventID) {
                            globalEvents[eventName].splice(i, 1);
                            return;
                        }
                    }
                }
            }
        }
        event_1.Unsubscribe = Unsubscribe;
    })(event = trains.event || (trains.event = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var play;
    (function (play) {
        var ParticleHelper = (function () {
            function ParticleHelper() {
            }
            ParticleHelper.MapByFactor = function (factor, min, max) {
                return (factor * (max - min)) + min;
            };
            return ParticleHelper;
        }());
        play.ParticleHelper = ParticleHelper;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var play;
    (function (play) {
        var ParticleColor = (function () {
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
var trains;
(function (trains) {
    var play;
    (function (play) {
        var ParticlePoint = (function () {
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
var trains;
(function (trains) {
    var play;
    (function (play) {
        var ParticleBase = (function (_super) {
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
var trains;
(function (trains) {
    var play;
    (function (play) {
        var SmokeParticle = (function (_super) {
            __extends(SmokeParticle, _super);
            function SmokeParticle() {
                var _this = _super.call(this, new play.ParticlePoint(0.5, Math.PI * (1.4 * Math.random()), 0.5, new play.ParticleColor(240, 240, 240, 0.4)), new play.ParticlePoint(1.1 + Math.random(), Math.PI * (1.4 * Math.random()), 0.3, new play.ParticleColor(241, 241, 241, 0))) || this;
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
        }(play.ParticleBase));
        play.SmokeParticle = SmokeParticle;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var play;
    (function (play) {
        var Train = (function () {
            function Train(id, cell, renderer) {
                this.id = id;
                this.defaultSpeed = 2;
                this.imageReverse = 1;
                this.carriagePadding = 2;
                this.nextSmoke = 0;
                this.Renderer = renderer;
                this.setTrainSpeed(this.defaultSpeed);
                if (cell !== undefined) {
                    this.coords = {
                        currentX: cell.x + (trains.play.gridSize / 2),
                        currentY: cell.y + (trains.play.gridSize / 2),
                        previousX: cell.x,
                        previousY: cell.y - 1
                    };
                    if (Math.floor(Math.random() * 10) === 0) {
                        this.trainColourIndex = -1;
                    }
                    else {
                        this.trainColourIndex = this.Renderer.GetRandomShaftColour();
                    }
                    this.name = trains.util.getRandomName();
                    if (Math.random() < 0.7) {
                        this.spawnCarriage(Math.ceil(Math.random() * 5));
                    }
                    if (Math.random() < 0.7) {
                        this.setTrainSpeed(Math.ceil(Math.random() * 5));
                    }
                }
            }
            Train.prototype.spawnCarriage = function (count) {
                if (count === void 0) { count = 1; }
                if (this.carriage !== undefined) {
                    this.carriage.spawnCarriage(count);
                }
                else {
                    this.carriage = new TrainCarriage(-1, undefined, this.Renderer);
                    this.carriage.coords = {
                        currentX: this.coords.currentX,
                        currentY: this.coords.currentY,
                        previousX: this.coords.currentX + (-10 * this.magicBullshitCompareTo(this.coords.currentX, this.coords.previousX)),
                        previousY: this.coords.currentY + (-10 * this.magicBullshitCompareTo(this.coords.currentY, this.coords.previousY))
                    };
                    this.carriage.trainColourIndex = this.trainColourIndex;
                    this.carriage.chooChooMotherFucker(this.carriagePadding + (trains.play.gridSize / 2), false);
                    this.carriage.coords.previousX = this.carriage.coords.currentX + (-10 * this.magicBullshitCompareTo(this.carriage.coords.currentX, this.carriage.coords.previousX));
                    this.carriage.coords.previousY = this.carriage.coords.currentY + (-10 * this.magicBullshitCompareTo(this.carriage.coords.currentY, this.carriage.coords.previousY));
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
                if (this.trainSpeed === 0 || this.isPaused)
                    return;
                var baseSpeed = speed;
                speed *= this.trainSpeed;
                while (speed > 0.00001) {
                    var column = play.GameBoard.getGridCoord(this.coords.currentX);
                    var row = play.GameBoard.getGridCoord(this.coords.currentY);
                    var cell = play.GameBoard.getCell(column, row);
                    if (cell !== undefined) {
                        var result = this.getNewCoordsForTrain(cell, this.coords, speed);
                        if (checkCollision && this.collidesWith(result.coords)) {
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
            Train.prototype.drawParticles = function () {
                if (this.nextSmoke < play.GameBoard.gameLoop.gameTimeElapsed) {
                    var p = new play.SmokeParticle();
                    p.x = this.coords.currentX;
                    p.y = this.coords.currentY;
                    play.GameBoard.smokeParticleSystem.push(p);
                    this.nextSmoke = play.GameBoard.gameLoop.gameTimeElapsed + (Math.random() * 100) + 325;
                }
            };
            Train.prototype.getTrainSpeed = function () {
                return this.trainSpeed;
            };
            Train.prototype.setTrainSpeed = function (speed) {
                this.trainSpeed = speed;
                trains.event.Emit("speedchanged", this.id, this.trainSpeed);
            };
            Train.prototype.slowYourRoll = function () {
                this.setTrainSpeed(Math.max(this.trainSpeed - 1, 1));
            };
            Train.prototype.fasterFasterFaster = function () {
                this.setTrainSpeed(Math.min(this.trainSpeed + 1, play.gridSize * 2));
            };
            Train.prototype.hammerTime = function () {
                this.setPaused(true);
            };
            Train.prototype.wakeMeUp = function () {
                this.setPaused(false);
            };
            Train.prototype.magicBullshitCompareTo = function (pen, sword) {
                if (pen === sword)
                    return 0;
                if (pen > sword)
                    return -1;
                return 1;
            };
            Train.prototype.straightTrackCalculate = function (cell, coords, speed, swapAxis) {
                if (swapAxis === void 0) { swapAxis = false; }
                var cellX = swapAxis ? cell.y : cell.x;
                var cellY = swapAxis ? cell.x : cell.y;
                var currentY = swapAxis ? coords.currentX : coords.currentY;
                var targetY = currentY + (speed * this.magicBullshitCompareTo((swapAxis ? coords.previousX : coords.previousY), currentY));
                if (targetY < cellY) {
                    targetY = cellY - 0.001;
                }
                else if (targetY > (cellY + trains.play.gridSize)) {
                    targetY = cellY + trains.play.gridSize + 0.001;
                }
                return {
                    coords: {
                        currentX: swapAxis ? targetY : cellX + (trains.play.gridSize / 2),
                        currentY: swapAxis ? cellX + (trains.play.gridSize / 2) : targetY,
                        previousX: coords.currentX,
                        previousY: coords.currentY
                    },
                    remainingSpeed: (speed + (((speed > 0) ? -1 : 1) * Math.abs(currentY - targetY)))
                };
            };
            Train.prototype.getNewCoordsForTrain = function (cell, coords, speed) {
                if (this.lastCell !== cell) {
                    this.directionToUse = cell.getDirectionToUse(this.lastCell);
                    this.lastCell = cell;
                }
                if (this.directionToUse === trains.play.Direction.Vertical) {
                    return this.straightTrackCalculate(cell, coords, speed);
                }
                else if (this.directionToUse === trains.play.Direction.Horizontal) {
                    return this.straightTrackCalculate(cell, coords, speed, true);
                }
                else if (this.directionToUse === trains.play.Direction.Cross) {
                    return this.straightTrackCalculate(cell, coords, speed, (Math.abs(coords.currentX - coords.previousX) > Math.abs(coords.currentY - coords.previousY)));
                }
                var yOffset = (this.directionToUse === trains.play.Direction.LeftDown || this.directionToUse === trains.play.Direction.RightDown) ? trains.play.gridSize : 0;
                var xOffset = (this.directionToUse === trains.play.Direction.RightUp || this.directionToUse === trains.play.Direction.RightDown) ? trains.play.gridSize : 0;
                var angle = Math.atan2(this.zeroIncrement((coords.currentX - cell.x) - xOffset), this.zeroIncrement((coords.currentY - cell.y) - yOffset));
                var angleLast = Math.atan2(this.zeroIncrement((coords.previousX - cell.x) - xOffset), this.zeroIncrement((coords.previousY - cell.y) - yOffset));
                var direction = this.magicBullshitCompareTo(angleLast, angle) * ((Math.abs(angleLast - angle) > Math.PI) ? -1 : 1);
                var newAngle = (angle + ((speed / (trains.play.gridSize / 2)) * direction));
                var angleSector = Math.floor((angle) / (Math.PI / 2)) * (Math.PI / 2);
                if (newAngle < angleSector) {
                    newAngle = angleSector - 0.001;
                }
                else if (newAngle > (angleSector + (Math.PI / 2))) {
                    newAngle = (angleSector + (Math.PI / 2)) + 0.001;
                }
                var remainingSpeed = speed + (((speed >= 0) ? -1 : 1) * (Math.abs(angle - newAngle) * (trains.play.gridSize / 2)));
                newAngle = (Math.PI / 2) - newAngle;
                var xOffsetFromGridNew = ((trains.play.gridSize / 2) * Math.cos(newAngle)) + xOffset;
                var yOffsetFromGridNew = ((trains.play.gridSize / 2) * Math.sin(newAngle)) + yOffset;
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
            Train.prototype.zeroIncrement = function (input) {
                return (input === 0) ? input + 0.001 : input;
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
                    context.translate(play.gridSize / 2, play.gridSize / 2);
                }
                this.Renderer.DrawChoochoo(context, this.trainColourIndex);
                context.restore();
                if (play.GameBoard.showDiagnostics) {
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
                    currentX: this.coords.currentX - Math.sin(angle) * ((play.gridSize / 2) + buffer),
                    currentY: this.coords.currentY - Math.cos(angle) * ((play.gridSize / 2) + buffer),
                    previousX: 0,
                    previousY: 0
                };
            };
            Train.prototype.getTrainAngle = function () {
                return Math.atan2(this.coords.previousX - this.coords.currentX, this.coords.previousY - this.coords.currentY);
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
                var myColumn = play.GameBoard.getGridCoord(cx.currentX);
                var myRow = play.GameBoard.getGridCoord(cx.currentY);
                if (!front && this.carriage !== undefined) {
                    return ((column === myColumn && row === myRow) || this.carriage.isTrainHere(column, row));
                }
                else {
                    return column === myColumn && row === myRow;
                }
            };
            Train.prototype.drawLink = function (context) {
                var sp1 = (trains.play.gridSize / 2) / Math.sqrt(Math.pow(this.coords.currentX - this.coords.previousX, 2) + Math.pow(this.coords.currentY - this.coords.previousY, 2));
                var x1 = this.coords.currentX - ((this.coords.currentX - this.coords.previousX) * sp1 * this.imageReverse);
                var y1 = this.coords.currentY - ((this.coords.currentY - this.coords.previousY) * sp1 * this.imageReverse);
                var sp2 = (trains.play.gridSize / 2) / Math.sqrt(Math.pow(this.carriage.coords.currentX - this.carriage.coords.previousX, 2) + Math.pow(this.carriage.coords.currentY - this.carriage.coords.previousY, 2));
                var x2 = this.carriage.coords.currentX + ((this.carriage.coords.currentX - this.carriage.coords.previousX) * sp2 * this.imageReverse);
                var y2 = this.carriage.coords.currentY + ((this.carriage.coords.currentY - this.carriage.coords.previousY) * sp2 * this.imageReverse);
                context.save();
                context.lineWidth = 3;
                context.strokeStyle = "#454545";
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();
                context.restore();
            };
            Train.prototype.collidesWith = function (coords) {
                var _this = this;
                var frontCoords = this.getFrontOfTrain(10);
                var myColumn = play.GameBoard.getGridCoord(frontCoords.currentX);
                var myRow = play.GameBoard.getGridCoord(frontCoords.currentY);
                return play.GameBoard.trains.some(function (t) {
                    if (t === _this)
                        return false;
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
                    if (!_this.collidesWith(coords)) {
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
        play.Train = Train;
        var TrainCarriage = (function (_super) {
            __extends(TrainCarriage, _super);
            function TrainCarriage(id, cell, renderer) {
                var _this = _super.call(this, id, cell, renderer) || this;
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
                this.Renderer.DrawCarriage(context, this.trainColourIndex);
                context.restore();
                if ((this.carriage !== undefined) && translate) {
                    this.carriage.draw(context, translate);
                    this.drawLink(context);
                }
            };
            TrainCarriage.prototype.drawLighting = function (context) {
            };
            return TrainCarriage;
        }(Train));
        play.TrainCarriage = TrainCarriage;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var play;
    (function (play) {
        var Sprite = (function () {
            function Sprite(width, height) {
                this.restored = false;
                this.canvas = document.createElement("canvas");
                this.canvas.width = width;
                this.canvas.height = height;
                this.context = this.canvas.getContext("2d");
                this.context.save();
                this.context.translate(0.5, 0.5);
            }
            Sprite.prototype.Draw = function (context, x, y) {
                if (!this.restored) {
                    this.context.restore();
                    this.restored = true;
                }
                context.drawImage(this.canvas, x - 0.5, y - 0.5);
            };
            return Sprite;
        }());
        play.Sprite = Sprite;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var play;
    (function (play) {
        var BaseTrackSprite = (function (_super) {
            __extends(BaseTrackSprite, _super);
            function BaseTrackSprite(cellSize) {
                var _this = _super.call(this, cellSize, cellSize) || this;
                _this.plankColour = "#382E1C";
                _this.trackColour = "#6E7587";
                return _this;
            }
            return BaseTrackSprite;
        }(play.Sprite));
        play.BaseTrackSprite = BaseTrackSprite;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var play;
    (function (play) {
        var CurvedTrackSprite = (function (_super) {
            __extends(CurvedTrackSprite, _super);
            function CurvedTrackSprite(cellSize, drawPlanks, trackWidth) {
                var _this = _super.call(this, cellSize) || this;
                _this.drawCurvedTrack(_this.context, drawPlanks, trackWidth);
                return _this;
            }
            CurvedTrackSprite.prototype.drawCurvedTrack = function (context, drawPlanks, trackWidth) {
                if (drawPlanks) {
                    this.drawCurvedPlank(context, 20 * Math.PI / 180, trackWidth);
                    this.drawCurvedPlank(context, 45 * Math.PI / 180, trackWidth);
                    this.drawCurvedPlank(context, 70 * Math.PI / 180, trackWidth);
                }
                context.lineWidth = 1;
                context.strokeStyle = this.trackColour;
                var finishAngle = Math.PI / 2;
                context.beginPath();
                context.arc(0, 0, play.firstTrackPosY, 0, finishAngle, false);
                context.stroke();
                context.beginPath();
                context.arc(0, 0, play.firstTrackPosY + trackWidth, 0, finishAngle, false);
                context.stroke();
                context.beginPath();
                context.arc(0, 0, play.secondTrackPosY - trackWidth, 0, finishAngle, false);
                context.stroke();
                context.beginPath();
                context.arc(0, 0, play.secondTrackPosY, 0, finishAngle, false);
                context.stroke();
            };
            CurvedTrackSprite.prototype.drawCurvedPlank = function (context, basePos, trackWidth) {
                var cos = Math.cos(basePos);
                var sin = Math.sin(basePos);
                context.lineWidth = trackWidth;
                context.strokeStyle = this.plankColour;
                context.beginPath();
                context.moveTo((play.firstTrackPosY - trackWidth) * cos, (play.firstTrackPosY - trackWidth) * sin);
                context.lineTo((play.firstTrackPosY) * cos, (play.firstTrackPosY) * sin);
                context.moveTo((play.firstTrackPosY + trackWidth) * cos, (play.firstTrackPosY + trackWidth) * sin);
                context.lineTo((play.secondTrackPosY - trackWidth) * cos, (play.secondTrackPosY - trackWidth) * sin);
                context.moveTo((play.secondTrackPosY) * cos, (play.secondTrackPosY) * sin);
                context.lineTo((play.secondTrackPosY + trackWidth) * cos, (play.secondTrackPosY + trackWidth) * sin);
                context.stroke();
            };
            return CurvedTrackSprite;
        }(play.BaseTrackSprite));
        play.CurvedTrackSprite = CurvedTrackSprite;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var play;
    (function (play) {
        var StraightTrackSprite = (function (_super) {
            __extends(StraightTrackSprite, _super);
            function StraightTrackSprite(cellSize, trackWidth) {
                var _this = _super.call(this, cellSize) || this;
                var numPlanks = 3;
                var startX = 0;
                var endX = cellSize;
                var thirdGridSize = cellSize / 3;
                _this.context.lineWidth = trackWidth;
                _this.context.strokeStyle = _this.plankColour;
                _this.context.beginPath();
                for (var i = 1; i <= numPlanks; i++) {
                    var xPosition = (thirdGridSize * i) - (thirdGridSize / 2);
                    var yPosition = play.firstTrackPosY - trackWidth;
                    _this.context.moveTo(xPosition, yPosition);
                    _this.context.lineTo(xPosition, play.secondTrackPosY + trackWidth);
                }
                _this.context.stroke();
                var endWidth = endX - startX;
                _this.context.beginPath();
                _this.context.clearRect(startX, play.firstTrackPosY, endWidth, trackWidth);
                _this.context.clearRect(startX, play.secondTrackPosY - trackWidth, endWidth, trackWidth);
                _this.context.lineWidth = 1;
                _this.context.strokeStyle = _this.trackColour;
                _this.context.beginPath();
                _this.context.moveTo(startX, play.firstTrackPosY);
                _this.context.lineTo(endX, play.firstTrackPosY);
                _this.context.moveTo(startX, play.firstTrackPosY + trackWidth);
                _this.context.lineTo(endX, play.firstTrackPosY + trackWidth);
                _this.context.moveTo(startX, play.secondTrackPosY - trackWidth);
                _this.context.lineTo(endX, play.secondTrackPosY - trackWidth);
                _this.context.moveTo(startX, play.secondTrackPosY);
                _this.context.lineTo(endX, play.secondTrackPosY);
                _this.context.stroke();
                return _this;
            }
            return StraightTrackSprite;
        }(play.BaseTrackSprite));
        play.StraightTrackSprite = StraightTrackSprite;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var play;
    (function (play) {
        var TrackSpriteCollection = (function () {
            function TrackSpriteCollection(cellSize) {
                this.StraightTrackSprite = new play.StraightTrackSprite(cellSize, play.trackWidth);
                this.CurvedTrackSprite = new play.CurvedTrackSprite(cellSize, true, play.trackWidth);
                this.CurvedTrackNoPlanksSprite = new play.CurvedTrackSprite(cellSize, false, play.trackWidth);
            }
            return TrackSpriteCollection;
        }());
        play.TrackSpriteCollection = TrackSpriteCollection;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var play;
    (function (play) {
        var Track = (function (_super) {
            __extends(Track, _super);
            function Track(id, column, row, cellSize, spriteCollection) {
                var _this = _super.call(this, id, column, row, cellSize) || this;
                _this.SpriteCollection = spriteCollection;
                return _this;
            }
            Track.prototype.drawStraightTrack = function (context, cutOffTop, cutOffBottom) {
                this.SpriteCollection.StraightTrackSprite.Draw(context, 0, 0);
            };
            Track.prototype.drawCurvedTrack = function (context, drawPlanks) {
                (drawPlanks ? this.SpriteCollection.CurvedTrackSprite : this.SpriteCollection.CurvedTrackNoPlanksSprite).Draw(context, 0, 0);
            };
            Track.prototype.draw = function (context) {
                var _this = this;
                context.save();
                context.translate(this.x + 0.5, this.y + 0.5);
                this.clear(context);
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
                        this.drawStraightTrack(context, neighbours.left === undefined, neighbours.right === undefined);
                        break;
                    }
                    case trains.play.Direction.Vertical: {
                        var neighbours = trains.play.GameBoard.getNeighbouringCells(this.column, this.row);
                        context.translate(trains.play.gridSize, 0);
                        context.rotate(Math.PI / 2);
                        this.drawStraightTrack(context, neighbours.up === undefined, neighbours.down === undefined);
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
                        this.drawStraightTrack(context, false, false);
                        context.translate(trains.play.gridSize, 0);
                        context.rotate(Math.PI / 2);
                        this.drawStraightTrack(context, false, false);
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
                this.drawCurvedTrack(context, drawPlanks);
            };
            Track.prototype.rightUp = function (context, drawPlanks) {
                context.translate(trains.play.gridSize, 0);
                context.rotate(Math.PI / 2);
                this.drawCurvedTrack(context, drawPlanks);
            };
            Track.prototype.leftUp = function (context, drawPlanks) {
                this.drawCurvedTrack(context, drawPlanks);
            };
            Track.prototype.leftDown = function (context, drawPlanks) {
                context.translate(0, trains.play.gridSize);
                context.rotate(Math.PI * 1.5);
                this.drawCurvedTrack(context, drawPlanks);
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
var trains;
(function (trains) {
    var play;
    (function (play) {
        var Loop = (function () {
            function Loop() {
                this.targetLoopsPerSecond = 1;
                this.minimumTimeout = 10;
                this.loopRunning = false;
                this.lastDuration = 0;
                this.lastStartTime = 0;
                this.averageLoopsPerSecond = 1;
                this.averageLoopsPerSecondSampleSize = 5;
            }
            Loop.prototype.startLoop = function () {
                if (this.timeoutId === undefined) {
                    this.loopCallback();
                }
                this.loopRunning = true;
            };
            Loop.prototype.stopLoop = function () {
                this.loopRunning = false;
            };
            Loop.prototype.dispose = function () {
                if (this.timeoutId === undefined) {
                    try {
                        clearTimeout(this.timeoutId);
                    }
                    finally {
                        this.timeoutId = undefined;
                    }
                }
            };
            Loop.prototype.loopCallback = function () {
                var _this = this;
                this.timeoutId = undefined;
                if (this.lastLoopEndTime !== undefined) {
                    this.loopStartTime = new Date().getTime();
                    if (this.lastStartTime === 0) {
                        this.lastStartTime = this.loopStartTime;
                    }
                    if (this.loopRunning) {
                        this.loopBody();
                    }
                    this.lastDuration = new Date().getTime() - this.loopStartTime;
                    if (this.lastStartTime !== undefined) {
                        this.averageLoopsPerSecond = ((this.averageLoopsPerSecond * (this.averageLoopsPerSecondSampleSize - 1)) + (this.loopStartTime - this.lastStartTime)) / this.averageLoopsPerSecondSampleSize;
                    }
                    this.lastStartTime = this.loopStartTime;
                }
                this.lastLoopEndTime = new Date().getTime();
                this.timeoutId = setTimeout(function () { return _this.loopCallback(); }, Math.max((1000 / this.targetLoopsPerSecond) - this.lastDuration, this.minimumTimeout));
            };
            Loop.prototype.loopBody = function () {
                throw new Error("abstract");
            };
            return Loop;
        }());
        play.Loop = Loop;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var play;
    (function (play) {
        var GameLoop = (function (_super) {
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
var trains;
(function (trains) {
    var play;
    (function (play) {
        var RenderLoop = (function (_super) {
            __extends(RenderLoop, _super);
            function RenderLoop(board) {
                var _this = _super.call(this) || this;
                _this.board = board;
                _this.msPerDayCycle = 240;
                _this.dayCycleSpeedModifier = 0.6;
                _this.dayToNightRatio = 5 / 12;
                _this.targetLoopsPerSecond = 30;
                return _this;
            }
            RenderLoop.prototype.loopBody = function () {
                var _this = this;
                if (this.board.showDiagnostics) {
                    trains.play.GameBoard.redraw();
                }
                this.board.trainContext.clearRect(0, 0, this.board.trainCanvas.width, this.board.trainCanvas.height);
                this.board.lightingBufferContext.clearRect(0, 0, this.board.trainCanvas.width, this.board.trainCanvas.height);
                var diff = ((this.board.gameLoop.gameTimeElapsed / (1000 * this.dayCycleSpeedModifier)) + (this.msPerDayCycle / 2)) % this.msPerDayCycle;
                if (this.board.cheat_alwaysNight) {
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
                this.board.lightingBufferContext.fillStyle = this.rgbToHex(r, g, b);
                this.board.lightingBufferContext.fillRect(0, 0, this.board.trainCanvas.width, this.board.trainCanvas.height);
                if (this.board.trains.length > 0) {
                    this.board.trains.forEach(function (t) {
                        t.draw(_this.board.trainContext);
                        if (((diff + (t.id / 2)) < 30) || ((diff - (t.id / 2)) > 210)) {
                            t.drawLighting(_this.board.lightingBufferContext);
                        }
                        if (_this.board.selectedTrain === t) {
                            t.draw(_this.board.trainLogoContext, false);
                        }
                    });
                }
                if (this.board.smokeParticleSystem.length > 0) {
                    this.board.smokeParticleSystem.forEach(function (x) { return x.Draw(_this.board.trainContext); });
                }
                this.board.trainContext.save();
                this.board.trainContext.globalAlpha = alpha;
                this.board.trainContext.drawImage(this.board.lightingBufferCanvas, 0, 0);
                this.board.trainContext.restore();
                if (this.board.showDiagnostics === true) {
                    this.drawDiagnostics(this.board.trainContext);
                }
            };
            RenderLoop.prototype.rgbToHex = function (r, g, b) {
                return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            };
            RenderLoop.prototype.drawDiagnostics = function (targetContext) {
                targetContext.font = "10px Verdana";
                targetContext.fillText("To render: " + (this.lastDuration.toFixed(2)) + "ms (" + (this.averageLoopsPerSecond.toFixed(2)) + "/s)", 10, 10);
                targetContext.fillText("To logic: " + (this.board.gameLoop.lastDuration.toFixed(2)) + "ms (" + (this.board.gameLoop.averageLoopsPerSecond.toFixed(2)) + "/s)", 10, 24);
                if (this.board.trains.length > 0) {
                    targetContext.fillText("Train Count: " + (this.board.trains.length), 10, 38);
                }
            };
            return RenderLoop;
        }(play.Loop));
        play.RenderLoop = RenderLoop;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var audio;
    (function (audio) {
        var Player = (function () {
            function Player() {
                this.muted = false;
                this.basePath = "audio/";
            }
            Player.prototype.setMuted = function (mute) {
                this.muted = mute;
            };
            Player.prototype.playSound = function (sound) {
                if (!this.muted) {
                    var fileName;
                    switch (sound) {
                        case trains.audio.Sound.click: {
                            fileName = "click.mp3";
                            break;
                        }
                    }
                    if (fileName !== undefined) {
                        var soundToPlay = new Audio(this.basePath + fileName);
                        if (soundToPlay !== undefined) {
                            soundToPlay.play();
                        }
                    }
                }
            };
            return Player;
        }());
        audio.Player = Player;
        var Sound;
        (function (Sound) {
            Sound[Sound["click"] = 0] = "click";
        })(Sound = audio.Sound || (audio.Sound = {}));
    })(audio = trains.audio || (trains.audio = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var play;
    (function (play) {
        play.gridSize = 40;
        play.gridColour = "#eee";
        play.trackWidth = 4;
        play.trackPadding = 10;
        play.firstTrackPosY = play.trackPadding;
        play.secondTrackPosY = trains.play.gridSize - play.trackPadding;
        play.animationEndEventString = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd onanimationend animationend";
        var Board = (function () {
            function Board(playComponents) {
                var _this = this;
                this.playComponents = playComponents;
                this.cells = {};
                this.trainIDCounter = 0;
                this.trains = new Array();
                this.smokeParticleSystem = new Array();
                this.gameRunningState = true;
                this.showDiagnostics = false;
                this.cheat_alwaysNight = false;
                this.$window = $(window);
                this.trainCanvas = this.playComponents.$trainCanvas.get(0);
                this.trainContext = this.trainCanvas.getContext("2d");
                this.trackCanvas = this.playComponents.$trackCanvas.get(0);
                this.trackContext = this.trackCanvas.getContext("2d");
                this.gridCanvas = this.playComponents.$gridCanvas.get(0);
                this.gridContext = this.gridCanvas.getContext("2d");
                this.trainLogoCanvas = this.playComponents.$trainLogoCanvas.get(0);
                this.trainLogoContext = this.trainLogoCanvas.getContext("2d");
                this.playComponents.$trainLogoCanvas.attr('width', play.gridSize);
                this.playComponents.$trainLogoCanvas.attr('height', play.gridSize);
                this.playComponents.$trainLogoCanvas.width(play.gridSize);
                this.playComponents.$trainLogoCanvas.height(play.gridSize);
                this.canvasWidth = this.roundToNearestGridSize(this.$window.width() - (play.gridSize * 2));
                this.maxColumns = this.canvasWidth / play.gridSize;
                this.canvasHeight = this.roundToNearestGridSize(this.$window.height() - play.gridSize);
                this.maxRows = this.canvasHeight / play.gridSize;
                this.playComponents.$canvases.attr('width', this.canvasWidth);
                this.playComponents.$canvases.attr('height', this.canvasHeight);
                this.playComponents.$canvases.width(this.canvasWidth);
                this.playComponents.$canvases.css('top', (this.$window.height() - this.canvasHeight) / 2);
                this.playComponents.$canvases.css('left', (this.$window.width() - this.canvasWidth) / 2);
                [this.trackCanvas, this.trainCanvas].forEach(function (el) {
                    el.addEventListener('click', function (event) { return _this.cellClick(event); });
                    el.addEventListener('mousemove', function (event) { return _this.cellMoveOver(event); });
                    el.addEventListener('touchstart', function (event) { return false; });
                    el.addEventListener('touchmove', function (event) {
                        _this.cellTouch(event);
                        event.preventDefault();
                        return false;
                    });
                    el.addEventListener('contextmenu', function (ev) {
                        _this.cellRightClick(ev);
                        ev.preventDefault();
                        return false;
                    }, false);
                });
                this.trainRenderer = new play.TrainRenderer(trains.play.gridSize, trains.play.firstTrackPosY, trains.play.secondTrackPosY);
                this.trackSpriteCollection = new play.TrackSpriteCollection(trains.play.gridSize);
                this.lightingBufferCanvas = document.createElement('canvas');
                this.lightingBufferCanvas.width = this.canvasWidth;
                this.lightingBufferCanvas.height = this.canvasHeight;
                this.lightingBufferContext = this.lightingBufferCanvas.getContext("2d");
                this.gameLoop = new play.GameLoop(this);
                this.renderLoop = new play.RenderLoop(this);
                trains.play.BoardRenderer.drawGrid(this.gridContext, this.canvasWidth, this.canvasHeight);
                this.gameLoop.startLoop();
                this.renderLoop.startLoop();
                this.player = new trains.audio.Player();
                this.setMuted(trains.util.toBoolean(localStorage.getItem("muted")));
                this.setAutoSave(trains.util.toBoolean(localStorage.getItem("autosave")));
                setTimeout(function () {
                    _this.setTool(trains.play.Tool.Track);
                }, 100);
            }
            Board.prototype.loadCells = function () {
                var savedCells = JSON.parse(localStorage.getItem("cells"));
                if (savedCells !== undefined) {
                    for (var id in savedCells) {
                        if (savedCells.hasOwnProperty(id)) {
                            var theCell = savedCells[id];
                            var newCell = new trains.play.Track(theCell.id, theCell.column, theCell.row, trains.play.gridSize, this.trackSpriteCollection);
                            newCell.direction = theCell.direction;
                            newCell.happy = theCell.happy;
                            newCell.switchState = theCell.switchState;
                            this.cells[newCell.id] = newCell;
                        }
                    }
                }
                this.redraw();
            };
            Board.prototype.startGame = function () {
                this.gameRunningState = true;
            };
            Board.prototype.stopGame = function () {
                this.gameRunningState = false;
            };
            Board.prototype.redraw = function () {
                trains.play.BoardRenderer.redrawCells(this.cells, this.trackContext, this.canvasWidth, this.canvasHeight);
            };
            Board.prototype.setTool = function (tool) {
                if (tool !== this.tool) {
                    this.tool = tool;
                    var cursorName;
                    var hotspot = 'bottom left';
                    switch (tool) {
                        case trains.play.Tool.Pointer: {
                            cursorName = "hand-pointer-o";
                            hotspot = 'top left';
                            break;
                        }
                        case trains.play.Tool.Track: {
                            cursorName = "pencil";
                            break;
                        }
                        case trains.play.Tool.Train: {
                            cursorName = "train";
                            hotspot = 'center';
                            break;
                        }
                        case trains.play.Tool.Eraser: {
                            cursorName = "eraser";
                            break;
                        }
                        case trains.play.Tool.Rotate: {
                            cursorName = "refresh";
                            hotspot = 'center';
                            break;
                        }
                    }
                    $('body').css('cursor', '');
                    $('body').awesomeCursor(cursorName, {
                        hotspot: hotspot,
                        size: 22
                    });
                }
            };
            Board.prototype.cellMoveOver = function (event) {
                if (event.buttons === 1 && this.tool !== Tool.Train && this.tool !== Tool.Rotate && this.tool !== Tool.Pointer) {
                    this.cellClick(event);
                }
            };
            Board.prototype.cellTouch = function (event) {
                if (this.tool === Tool.Train)
                    return;
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
                if (row >= this.maxRows || column >= this.maxColumns)
                    return;
                switch (this.tool) {
                    case Tool.Pointer:
                        {
                            this.pointAtThing(column, row);
                            break;
                        }
                    case Tool.Track:
                        {
                            if (shift) {
                                this.rotateTrack(column, row);
                            }
                            else {
                                this.newTrack(column, row);
                            }
                            break;
                        }
                    case Tool.Eraser:
                        {
                            this.eraseTrack(column, row);
                            break;
                        }
                    case Tool.Rotate:
                        {
                            this.rotateTrack(column, row);
                            break;
                        }
                    case Tool.Train:
                        {
                            var cellID = this.getCellID(column, row);
                            if (this.cells[cellID] !== undefined) {
                                var t = new play.Train(this.trainIDCounter++, this.cells[cellID], this.trainRenderer);
                                t.chooChooMotherFucker(0.1);
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
                    trains.play.BoardRenderer.clearCells(_this.trackContext, _this.canvasWidth, _this.canvasHeight);
                    trains.play.BoardRenderer.clearCells(_this.trainContext, _this.canvasWidth, _this.canvasHeight);
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
                    this.player.playSound(trains.audio.Sound.click);
                    var newCell = new trains.play.Track(cellID, column, row, trains.play.gridSize, this.trackSpriteCollection);
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
                        if (neighbours.up !== undefined && neighbours.up.happy && neighbours.up.isConnectedDown())
                            neighbours.up.happy = false;
                        if (neighbours.down !== undefined && neighbours.down.happy && neighbours.down.isConnectedUp())
                            neighbours.down.happy = false;
                        if (neighbours.left !== undefined && neighbours.left.happy && neighbours.left.isConnectedRight())
                            neighbours.left.happy = false;
                        if (neighbours.right !== undefined && neighbours.right.happy && neighbours.right.isConnectedLeft())
                            neighbours.right.happy = false;
                        neighbours.all.forEach(function (n) { return n.checkYourself(); });
                    });
                }
            };
            Board.prototype.saveCells = function () {
                if (trains.util.toBoolean(localStorage.getItem("autosave"))) {
                    localStorage.setItem("cells", JSON.stringify(this.cells));
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
            Board.prototype.showChooChoo = function () {
                this.startGame();
            };
            Board.prototype.stopChooChoo = function () {
                this.stopGame();
            };
            Board.prototype.roundToNearestGridSize = function (value) {
                return Math.floor(value / play.gridSize) * play.gridSize;
            };
            Board.prototype.getGridCoord = function (value) {
                return Math.floor(value / play.gridSize);
            };
            Board.prototype.getCellID = function (column, row) {
                return column.toString() + ':' + row.toString();
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
                    if (up !== undefined && up.happy && !up.isConnectedDown())
                        up = undefined;
                    if (right !== undefined && right.happy && !right.isConnectedLeft())
                        right = undefined;
                    if (down !== undefined && down.happy && !down.isConnectedUp())
                        down = undefined;
                    if (left !== undefined && left.happy && !left.isConnectedRight())
                        left = undefined;
                }
                var all = [up, right, down, left].filter(function (n) { return n !== undefined; });
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
                        this.setTool(trains.play.Tool.Pointer);
                        break;
                    }
                    case "train": {
                        this.setTool(trains.play.Tool.Train);
                        break;
                    }
                    case "pencil": {
                        this.setTool(trains.play.Tool.Track);
                        break;
                    }
                    case "eraser": {
                        this.setTool(trains.play.Tool.Eraser);
                        break;
                    }
                    case "rotate": {
                        this.setTool(trains.play.Tool.Rotate);
                        break;
                    }
                    case "bomb": {
                        var response = confirm("Are you sure buddy?");
                        if (response) {
                            this.destroyTrack();
                            this.setTool(trains.play.Tool.Track);
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
                trains.event.Emit("showtraincontrols", this.selectedTrain);
            };
            Board.prototype.hideTrainControls = function () {
                this.selectedTrain = undefined;
                trains.event.Emit("hidetraincontrols");
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
            return Board;
        }());
        play.Board = Board;
        var Tool;
        (function (Tool) {
            Tool[Tool["Pointer"] = 0] = "Pointer";
            Tool[Tool["Track"] = 1] = "Track";
            Tool[Tool["Eraser"] = 2] = "Eraser";
            Tool[Tool["Rotate"] = 3] = "Rotate";
            Tool[Tool["Train"] = 4] = "Train";
        })(Tool = play.Tool || (play.Tool = {}));
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
        })(Direction = play.Direction || (play.Direction = {}));
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var logo;
    (function (logo) {
        function InitialiseLogo($container) {
            var outClass = 'fadeOutLeft';
            var inClass = 'fadeInRight';
            var $asciiLogo = $container.find('.ui-ascii-logo');
            $asciiLogo.addClass('animated');
            $asciiLogo.on('mouseover', function () {
                if (!$asciiLogo.hasClass(outClass) && !$asciiLogo.hasClass(inClass)) {
                    $asciiLogo.addClass(outClass);
                }
            });
            $asciiLogo.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                if ($asciiLogo.hasClass(outClass)) {
                    $asciiLogo.removeClass(outClass).addClass(inClass);
                }
                else if ($asciiLogo.hasClass(inClass)) {
                    $asciiLogo.removeClass(inClass);
                }
            });
        }
        logo.InitialiseLogo = InitialiseLogo;
    })(logo = trains.logo || (trains.logo = {}));
})(trains || (trains = {}));
var trains;
(function (trains) {
    var play;
    (function (play) {
        function InitialisePlay($container) {
            var manager = new trains.play.PlayManager($container);
        }
        play.InitialisePlay = InitialisePlay;
        var PlayManager = (function () {
            function PlayManager($container) {
                this.$container = $container;
                this.playComponents = GetPlayComponent($container);
                trains.play.GameBoard = new trains.play.Board(this.playComponents);
                var top = ($(window).height() - trains.play.GameBoard.canvasHeight) / 2;
                var left = ($(window).width() - trains.play.GameBoard.canvasWidth) / 2;
                $('body').height($(window).height());
                this.playComponents.$trackButtons.css("top", top);
                this.playComponents.$trainButtons.css("top", 15).css("right", 15);
                this.playComponents.$mute.width(left);
                this.playComponents.$autosave.width(left);
                this.playComponents.$trainButtons.draggable({
                    handle: '.ui-handle',
                    containment: 'body'
                });
                this.AttachEvents();
                play.GameBoard.loadCells();
            }
            PlayManager.prototype.AttachEvents = function () {
                var _this = this;
                this.playComponents.$globalButtons.find('.ui-title').click(function () {
                    _this.playComponents.$globalButtons.toggleClass("minimised");
                });
                this.playComponents.$globalButtons.find('.ui-minimise').click(function () {
                    _this.playComponents.$globalButtons.addClass("minimised");
                });
                this.playComponents.$globalButtons.find('button').click(function (event) {
                    trains.play.GameBoard.globalControlClick(event.currentTarget);
                });
                this.playComponents.$trainButtons.find('.ui-close').click(function () {
                    trains.play.GameBoard.hideTrainControls();
                });
                this.playComponents.$trainButtons.find('button').click(function (event) {
                    trains.play.GameBoard.trainControlClick(event.currentTarget);
                });
                this.playComponents.$trackButtons.find('button').click(function (event) {
                    trains.play.GameBoard.trackControlClick(event.currentTarget);
                    trains.util.selectButton($(event.currentTarget));
                });
                this.playComponents.$mute.click(function () {
                    var $mute = _this.playComponents.$mute;
                    var mute = trains.util.toBoolean($mute.val());
                    if (!mute) {
                        $mute.val("true");
                    }
                    else {
                        $mute.val("false");
                    }
                    trains.play.GameBoard.setMuted(!mute);
                });
                this.playComponents.$autosave.click(function () {
                    var $autosave = _this.playComponents.$autosave;
                    var autosave = trains.util.toBoolean($autosave.val());
                    if (!autosave) {
                        $autosave.val("true");
                    }
                    else {
                        $autosave.val("false");
                    }
                    trains.play.GameBoard.setAutoSave(!autosave);
                    if (!autosave) {
                        trains.play.GameBoard.saveCells();
                    }
                });
                trains.event.On("speedchanged", function (event, trainID, speed) {
                    var setTrainSpeed = false;
                    if (trains.play.GameBoard.selectedTrain !== undefined) {
                        if (trainID === trains.play.GameBoard.selectedTrain.id) {
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
                trains.event.On("showtraincontrols", function (event, train) {
                    _this.playComponents.$trainName.text(train.name);
                    _this.playComponents.$trainButtons.addClass("flipInX").show();
                    _this.playComponents.$trainButtons.one(trains.play.animationEndEventString, function () {
                        _this.playComponents.$trainButtons.removeClass("flipInX");
                    });
                    _this.DisplayTrainSpeed(train.getTrainSpeed());
                });
                trains.event.On("hidetraincontrols", function (event) {
                    _this.playComponents.$trainButtons.addClass("flipOutX");
                    _this.playComponents.$trainButtons.one(trains.play.animationEndEventString, function () {
                        _this.playComponents.$trainButtons.removeClass("flipOutX").hide();
                    });
                });
            };
            PlayManager.prototype.DisplayTrainSpeed = function (speed) {
                this.playComponents.$trainButtons.find('.ui-speed').text((speed * 10).toString() + " kms/h");
            };
            return PlayManager;
        }());
        play.PlayManager = PlayManager;
        function GetPlayComponent($container) {
            var $trainCanvas = $container.find('.ui-train-canvas');
            var $trackCanvas = $container.find('.ui-track-canvas');
            var $gridCanvas = $container.find('.ui-grid-canvas');
            var $trainLogoCanvas = $container.find('.ui-train-logo-canvas');
            return {
                $trainCanvas: $trainCanvas,
                $trackCanvas: $trackCanvas,
                $gridCanvas: $gridCanvas,
                $trainLogoCanvas: $trainLogoCanvas,
                $canvases: $().add($trainCanvas).add($trackCanvas).add($gridCanvas),
                $trackButtons: $container.find('.ui-track-buttons'),
                $trainButtons: $container.find('.ui-train-buttons'),
                $globalButtons: $container.find('.ui-game-buttons'),
                $trainName: $container.find('.ui-train-name'),
                $mute: $container.find('.ui-mute'),
                $autosave: $container.find('.ui-autosave')
            };
        }
        play.GetPlayComponent = GetPlayComponent;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
//# sourceMappingURL=train.js.map