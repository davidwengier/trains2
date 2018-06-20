import { Board } from "./Board";
import { Loop } from "./engine/Loop";
import { SmokeParticle } from "./particle/types/SmokeParticle";
import { Train } from "./Train";

export class GameLoop extends Loop {
    public gameTimeElapsed = 0;
    constructor(private board: Board) {
        super(40);
    }

    public loopBody(): void {
        this.gameTimeElapsed += this.ElapsedSinceLastStart();
        const steps = this.ElapsedSinceLastEnd() / 25;
        if (this.board.trains.length > 0) {
            this.board.trains.forEach((t: Train) => t.chooChooMotherFucker(steps));
        }
        // Need to move this to a particle system
        for (let i = 0; i < this.board.smokeParticleSystem.length; i++) {
            if (this.board.smokeParticleSystem[i].IsDead()) {
                this.board.smokeParticleSystem.splice(i--, 1);
            } else {
                this.board.smokeParticleSystem[i].Update(steps);
            }
        }
        if (this.board.smokeParticleSystem.length > 0) {
            this.board.smokeParticleSystem.forEach((x: SmokeParticle) => x.Update(steps));
        }
    }
}