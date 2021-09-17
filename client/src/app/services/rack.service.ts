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
        { name: 'A', params: { quantity: 0, points: 0, affiche: ' ' } },
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
            this.fillRackPortion(x);
        }
    }

    fillRackPortion(index: number) {
        this.rackContext.clearRect((DEFAULT_WIDTH / RACK_SIZE) * index, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT);
        this.rackContext.rect((DEFAULT_WIDTH / RACK_SIZE) * index, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT);
        this.rackContext.stroke();
        this.rackContext.fillStyle = 'rgb(0,0,0)';
        this.rackContext.font = '30px serif';
        if (this.rackLetters != null) {
            this.rackContext.fillStyle = 'rgb(0,0,0)';
            this.rackContext.font = '30px serif';
            this.rackContext.fillText(this.rackLetters[index].params.affiche, (DEFAULT_WIDTH / RACK_SIZE) * index + 6, DEFAULT_HEIGHT - 8);

            this.rackContext.font = '10px serif';
            this.rackContext.fillText(this.rackLetters[index].params.points.toString(), (DEFAULT_WIDTH / RACK_SIZE) * index + 25, DEFAULT_HEIGHT - 1);
        }
    }

    findLetterOccurrence(letterToCheck: string): ICaracter[] {
        return this.rackLetters?.filter((letter) => letter.name === letterToCheck.toUpperCase()) as ICaracter[];
    }

    findLetterPosition(letterToCheck: string): number {
        return this.rackLetters?.findIndex((letter) => letter.name === letterToCheck.toUpperCase()) as number;
    }

    findOccurrences(letterToCheck: string, letters: ICaracter[]): number {
        const count = letters.reduce((n, letter) => n + Number(letter.name === letterToCheck.toUpperCase()), 0);
        return count;
    }

    replaceLetter(letterToReplace: string): void {
        if (this.rackLetters != null) {
            const index = this.findLetterPosition(letterToReplace);
            if (index !== -1) {
                const newCaracterS = this.reserveService.getReserve(1);
                if (newCaracterS !== null) {
                    this.rackLetters[index] = newCaracterS[0];
                }
                this.fillRackPortion(index);
            }
            console.log(this.rackLetters);
        }
    }

    // constructor() {}
}
