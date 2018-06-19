/// <reference path="../play.board.ts" />

module trains.play {
    export class Loop {
        //To be extended:
        targetLoopsPerSecond = 1;
        private minimumTimeout = 10;
        //Other:
        //TODO: create getters!
        loopRunning = false;
        lastDuration = 0;
        lastStartTime = 0;
        loopStartTime: number;
        lastLoopEndTime: number;
        averageLoopsPerSecond = 1;
        averageLoopsPerSecondSampleSize = 5;
        private timeoutId: number = -1;
        //TODO: implement strictTiming

        public startLoop(): void {
            if (this.timeoutId < 0) {
                this.loopCallback();
            }
            this.loopRunning = true;
        }

        public stopLoop(): void {
            this.loopRunning = false;
        }

        public dispose(): void {
            if (this.timeoutId === undefined) {
                try {
                    clearTimeout(this.timeoutId);
                } finally {
                    this.timeoutId = -1;
                }
            }
        }

        private loopCallback(): void {
            this.timeoutId = -1;
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
            
            this.timeoutId = setTimeout(() => this.loopCallback(), Math.max((1000 / this.targetLoopsPerSecond) - this.lastDuration, this.minimumTimeout));
        }

        loopBody(): void {
            throw new Error("abstract");
        }
    }
}