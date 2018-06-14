/// <reference path="play.board.ts" />
/// <reference path="play.cell.renderer.ts" />
var trains;
(function (trains) {
    var play;
    (function (play) {
        var Cell = /** @class */ (function () {
            function Cell(id, column, row) {
                this.id = id;
                this.column = column;
                this.row = row;
                this.happy = false;
                this.x = this.column * trains.play.gridSize;
                this.y = this.row * trains.play.gridSize;
                this.direction = trains.play.Direction.None;
            }
            Cell.prototype.draw = function (context) {
                throw new Error("This method is abstract.. no really.. come on.. just pretend! It will be fun I promise.");
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
                    // if we got here, we should be a cross
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
                // if we got here, we should be a three way
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
                        newDirection = trains.play.Direction.RightDownRightUp; // last one
                    }
                    else {
                        newDirection = trains.play.Direction.RightUp;
                    }
                }
                else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.down !== undefined) {
                    newDirection = trains.play.Direction.RightDown;
                }
                // greedy vertical and horizontal joins    
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
                // now less fussy vertical and horizontal joins    
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
//# sourceMappingURL=play.cell.js.map