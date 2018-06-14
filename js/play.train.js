/// <reference path="play.board.ts" />
/// <reference path="play.cell.ts" />
/// <reference path="play.board.renderer.ts" />
/// <reference path="play.train.renderer.ts" />
/// <reference path="util.ts" />
/// <reference path="event.ts" />
/// <reference path="play.trainCarriage.ts" />
var trains;
(function (trains) {
    var play;
    (function (play) {
        var Train = /** @class */ (function () {
            function Train(id, cell) {
                this.id = id;
                this.defaultSpeed = 2;
                this.imageReverse = 1;
                this.carriagePadding = 2;
                this.nextSmoke = 0;
                this.setTrainSpeed(this.defaultSpeed);
                if (cell !== undefined) {
                    this.coords = {
                        currentX: cell.x + (trains.play.gridSize / 2),
                        currentY: cell.y + (trains.play.gridSize / 2),
                        previousX: cell.x,
                        previousY: cell.y - 1 //Cos we never want to be the centre of attention
                    };
                    if (Math.floor(Math.random() * 10) === 0) {
                        this.trainColourIndex = -1;
                    }
                    else {
                        this.trainColourIndex = trains.play.TrainRenderer.GetRandomShaftColour();
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
                    this.carriage = new play.TrainCarriage(-1, undefined);
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
                //Super small speeds cause MAJOR problems with the game loop.
                // First occurrence of this bug, speed was 1.13e-14!!!!!
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
                    var p = new play.ParticleSmoke();
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
                //Woo! Corner time!
                //Who decided round corners was a good idea :P
                //Calculate X and Y offset based on cell type.
                // Why is this needed? Well, on different corners, the centre of the circle is moved.
                //  For LeftUp, the centre of the circle is 0,0
                //  For LeftDown, the centre of the circle is 0,gridSize
                //  For RightUp, the centre is gridSize,0
                //  For RightDown, the centre is gridSize,gridSize
                var yOffset = (this.directionToUse === trains.play.Direction.LeftDown || this.directionToUse === trains.play.Direction.RightDown) ? trains.play.gridSize : 0;
                var xOffset = (this.directionToUse === trains.play.Direction.RightUp || this.directionToUse === trains.play.Direction.RightDown) ? trains.play.gridSize : 0;
                //We then calculate the current angle.
                // This is done by firstly finding the distance from center circle (using cell position, current position, and offset)
                // We then call zeroIncrement which adds 0.001 to the value if === 0.
                // Read up on acos/asin/atan and x,y=0, we don't want any infinities here!
                // Finally we cheat and use atan2 to find the angle.
                var angle = Math.atan2(this.zeroIncrement((coords.currentX - cell.x) - xOffset), this.zeroIncrement((coords.currentY - cell.y) - yOffset));
                //Same thing again to find the last angle
                var angleLast = Math.atan2(this.zeroIncrement((coords.previousX - cell.x) - xOffset), this.zeroIncrement((coords.previousY - cell.y) - yOffset));
                //Using magicBullshit we find the direction.
                // We then multiply by -1 if the difference between the 2 angles in greater than Math.PI
                // This fixes a strange bug :)
                var direction = this.magicBullshitCompareTo(angleLast, angle) * ((Math.abs(angleLast - angle) > Math.PI) ? -1 : 1);
                //We can then use the fact that (in radians) angle=lengthOfArc/radius to find what angle is needed
                // To move us 'speed' along the arc
                var newAngle = (angle + ((speed / (trains.play.gridSize / 2)) * direction));
                //Using floor (always round down) and (Math.PI/2) (which is 90 degrees), we can find the limits for this track piece
                var angleSector = Math.floor((angle) / (Math.PI / 2)) * (Math.PI / 2);
                //Check if we have gone outside lower range
                if (newAngle < angleSector) {
                    newAngle = angleSector - 0.001;
                }
                //Check if we have gone outside upper range
                else if (newAngle > (angleSector + (Math.PI / 2))) {
                    newAngle = (angleSector + (Math.PI / 2)) + 0.001;
                }
                //Using the relationship lengthOfArc=angle*radius, we can use the change in angle to calculate speed
                var remainingSpeed = speed + (((speed >= 0) ? -1 : 1) * (Math.abs(angle - newAngle) * (trains.play.gridSize / 2)));
                //Add 90 degrees because I abused atan2 in a bad way
                //TODO: fix this plx. Tried to fix, failed, this caused the infinity angle bug, reverted.
                newAngle = (Math.PI / 2) - newAngle;
                //Finally use the radius, angle, and offset to find the new coords
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
                trains.play.TrainRenderer.DrawChoochoo(context, this.trainColourIndex);
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
                trains.play.TrainRenderer.DrawChoochooLights(context);
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
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
//# sourceMappingURL=play.train.js.map