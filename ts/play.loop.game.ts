/// <reference path="play.board.ts" />
/// <reference path="engine/loop.ts" />
/// <reference path="play.train.ts" />

module trains.play {
    export class GameLoop extends Loop {
        public gameTimeElapsed = 0;
        constructor(private board: trains.play.Board) {
            super(40);
        }

        loopBody(): void {
            this.gameTimeElapsed += this.ElapsedSinceLastStart();
            var steps = this.ElapsedSinceLastEnd() / 25;
            if (this.board.trains.length > 0) {
                this.board.trains.forEach(t=> t.chooChooMotherFucker(steps));
            }
            //Need to move this to a particle system
            for (var i = 0; i < this.board.smokeParticleSystem.length; i++) {
                if (this.board.smokeParticleSystem[i].IsDead()) {
                    this.board.smokeParticleSystem.splice(i--, 1);
                } else {
                    this.board.smokeParticleSystem[i].Update(steps);
                }
            }
            if (this.board.smokeParticleSystem.length > 0) {
                this.board.smokeParticleSystem.forEach(x=> x.Update(steps));
            }
        }
    }
}