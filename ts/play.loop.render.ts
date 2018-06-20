import {Loop} from "engine/loop";
import { SmokeParticle } from "./particle/types/SmokeParticle";
import { Board } from "./play.board";
import { Train } from "./play.train";

export class RenderLoop extends Loop {

    // DO NOT CHANGE FROM 240!!!!!!!!
    private msPerDayCycle = 240;
    private dayCycleSpeedModifier = 0.6;
    private dayToNightRatio = 5 / 12; // 5 of 12 are night

    constructor(private gameBoard: Board) {
        super(30);
    }

    public loopBody(): void {
        if (this.gameBoard.showDiagnostics) {
            this.gameBoard.redraw();
        }
        this.gameBoard.trainContext.clearRect(0, 0,
            this.gameBoard.trainCanvas.width, this.gameBoard.trainCanvas.height);
        this.gameBoard.lightingBufferContext.clearRect(0, 0,
            this.gameBoard.trainCanvas.width, this.gameBoard.trainCanvas.height);

        // Nighttime Daytime
        let diff = (
            (this.gameBoard.gameLoop.gameTimeElapsed / (1000 * this.dayCycleSpeedModifier)) + (this.msPerDayCycle / 2)
        ) % this.msPerDayCycle;
        if (this.gameBoard.CheatAlwaysNight) {
            diff = 0;
        }
        const r = (diff >= (this.msPerDayCycle / 2)) ? ((this.msPerDayCycle / 2) - diff) : 0;
        const g = (diff >= (this.msPerDayCycle / 2)) ? ((r / 135) * 100) : 0; // 135 is magic!
        const b = (diff < (this.msPerDayCycle / 2)) ? diff : 0;
        let alpha = 0;
        if (diff < ((this.dayToNightRatio * this.msPerDayCycle) / 2)) {
            alpha = ((((this.dayToNightRatio * this.msPerDayCycle) / 2) - diff) / 100);
        } else if ((diff > (this.msPerDayCycle - ((this.dayToNightRatio * this.msPerDayCycle) / 2)))) {
            alpha = ((diff - (this.msPerDayCycle - ((this.dayToNightRatio * this.msPerDayCycle) / 2))) / 100);
        }
        this.gameBoard.lightingBufferContext.fillStyle = this.rgbToHex(r, g, b);
        this.gameBoard.lightingBufferContext.fillRect(0, 0,
            this.gameBoard.trainCanvas.width, this.gameBoard.trainCanvas.height);

        if (this.gameBoard.trains.length > 0) {
            this.gameBoard.trains.forEach((t: Train) => {
                t.draw(this.gameBoard.trainContext);
                if (((diff + (t.id / 2)) < 30) || ((diff - (t.id / 2)) > 210)) {
                    t.drawLighting(this.gameBoard.lightingBufferContext);
                }
                if (this.gameBoard.selectedTrain === t) {
                    t.draw(this.gameBoard.trainLogoContext, false);
                }
            });
        }
        if (this.gameBoard.smokeParticleSystem.length > 0) {
            this.gameBoard.smokeParticleSystem.forEach((x: SmokeParticle) => x.Draw(this.gameBoard.trainContext));
        }

        this.gameBoard.trainContext.save();
        this.gameBoard.trainContext.globalAlpha = alpha;
        this.gameBoard.trainContext.drawImage(this.gameBoard.lightingBufferCanvas, 0, 0);
        this.gameBoard.trainContext.restore();
        if (this.gameBoard.showDiagnostics === true) {
            this.drawDiagnostics(this.gameBoard.trainContext);
        }
    }

    private rgbToHex(r: number, g: number, b: number): string {
        // tslint:disable-next-line:no-bitwise
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    private drawDiagnostics(targetContext: CanvasRenderingContext2D): void {
        targetContext.font = "10px Verdana";
        targetContext.fillText("To render: " + this.GetPerformanceString(), 10, 10);
        targetContext.fillText("To logic: " + this.gameBoard.gameLoop.GetPerformanceString(), 10, 24);
        if (this.gameBoard.trains.length > 0) {
            targetContext.fillText("Train Count: " + (this.gameBoard.trains.length), 10, 38);
        }
    }
}