import { Injectable } from '@angular/core';
import { ICaracter } from '@app/models/lettre.model';
import { ReserveService } from '@app/services/reserve.service';

const RACK_SIZE = 7;
const DEFAULT_WIDTH = 245;
const DEFAULT_HEIGHT = 35;

@Injectable({
    providedIn: 'root',
})
export class RackService extends ReserveService {
    rackContext: CanvasRenderingContext2D;

    rackLetters: ICaracter[] | null = [
        { name: ' ', params: { quantity: 0, points: 0, affiche: ' ' } },
        { name: ' ', params: { quantity: 0, points: 0, affiche: ' ' } },
        { name: ' ', params: { quantity: 0, points: 0, affiche: ' ' } },
        { name: ' ', params: { quantity: 0, points: 0, affiche: ' ' } },
        { name: ' ', params: { quantity: 0, points: 0, affiche: ' ' } },
        { name: ' ', params: { quantity: 0, points: 0, affiche: ' ' } },
        { name: ' ', params: { quantity: 0, points: 0, affiche: ' ' } },
    ];

    constructor(private reserveService: ReserveService) {
        super();
    }
    fillRack() {
        this.rackLetters = this.reserveService.getReserve(RACK_SIZE);

        for (let x = 0; x < RACK_SIZE; x++) {
            this.rackContext.rect((DEFAULT_WIDTH / RACK_SIZE) * x, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT);
            this.rackContext.stroke();
            this.rackContext.fillStyle = 'rgb(0,0,0)';
            this.rackContext.font = '30px serif';
            if (this.rackLetters != null) {
                this.rackContext.fillText(this.rackLetters[x].params.affiche, (DEFAULT_WIDTH / RACK_SIZE) * x + 10, DEFAULT_HEIGHT - 10);
            }
        }
    }

    // constructor() {}
}
