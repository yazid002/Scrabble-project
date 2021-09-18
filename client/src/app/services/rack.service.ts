import { Injectable } from '@angular/core';
import { ICaracter } from '@app/models/lettre.model';
import { ReserveService } from '@app/services/reserve.service';

const RACK_SIZE = 7;
const DEFAULT_WIDTH = 245;
const DEFAULT_HEIGHT = 35;

@Injectable({
    providedIn: 'root',
})
export class RackService {
    rackContext: CanvasRenderingContext2D;

    rackLetters: ICaracter[] = [
        { name: ' ', quantity: 0, points: 0, affiche: ' ' },
        { name: ' ', quantity: 0, points: 0, affiche: ' ' },
        { name: ' ', quantity: 0, points: 0, affiche: ' ' },
        { name: ' ', quantity: 0, points: 0, affiche: ' ' },
        { name: ' ', quantity: 0, points: 0, affiche: ' ' },
        { name: ' ', quantity: 0, points: 0, affiche: ' ' },
        { name: ' ', quantity: 0, points: 0, affiche: ' ' },
    ];

    constructor(private reserveService: ReserveService) {}

    fillRack() {
        this.rackLetters = this.reserveService.getReserve(RACK_SIZE);

        for (let x = 0; x < RACK_SIZE; x++) {
            this.rackContext.rect((DEFAULT_WIDTH / RACK_SIZE) * x, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT);
            this.rackContext.stroke();
            this.rackContext.fillStyle = 'rgb(0,0,0)';
            this.rackContext.font = '30px serif';
            if (this.rackLetters != null) {
                this.rackContext.fillStyle = 'rgb(0,0,0)';
                this.rackContext.font = '30px serif';
                this.rackContext.fillText(this.rackLetters[x].affiche, (DEFAULT_WIDTH / RACK_SIZE) * x + 6, DEFAULT_HEIGHT - 8);

                this.rackContext.font = '10px serif';
                this.rackContext.fillText(this.rackLetters[x].points.toString(), (DEFAULT_WIDTH / RACK_SIZE) * x + 25, DEFAULT_HEIGHT - 1);
            }
        }
    }

    findLetter(letterToCheck: string): ICaracter {
        const index = this.rackLetters?.findIndex((letter) => letter.name === letterToCheck.toUpperCase()) as number;

        if (this.rackLetters[index].affiche === letterToCheck) {
            return this.rackLetters[index];
        }

        return this.rackLetters[index];
    }
}
