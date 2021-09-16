import { Injectable } from '@angular/core';

const RACK_SIZE = 7;
const DEFAULT_WIDTH = 245;
const DEFAULT_HEIGHT = 35;

@Injectable({
    providedIn: 'root',
})
export class RackService {
    rackContext: CanvasRenderingContext2D;

    rackLetters: string[] = ['a', 'b', 'a', 'b', 'a', 'b', 'a'];

    fillRack() {
        for (let x = 0; x < RACK_SIZE; x++) {
            this.rackContext.fillStyle = 'rgb(0,0,0)';
            this.rackContext.font = '30px serif';
            this.rackContext.fillText(this.rackLetters[x], (DEFAULT_WIDTH / RACK_SIZE) * x + 10, DEFAULT_HEIGHT - 10);
        }
    }

    // constructor() {}
}
