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
        console.log('totaux: ', this.reserveService.getNbreOfAvailableLetter());

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
            this.rackContext.fillText(this.rackLetters[index].affiche, (DEFAULT_WIDTH / RACK_SIZE) * index + 6, DEFAULT_HEIGHT - 8);

            this.rackContext.font = '10px serif';
            this.rackContext.fillText(this.rackLetters[index].points.toString(), (DEFAULT_WIDTH / RACK_SIZE) * index + 25, DEFAULT_HEIGHT - 1);
        }
    }

    replaceLetter(letterToReplace: string): void {
        const notFound = -1;
        if (this.rackLetters != null) {
            const indexOnRack = this.findLetterPosition(letterToReplace);
            if (indexOnRack !== notFound) {
                const newCharacters = this.reserveService.getReserve(1);
                if (newCharacters !== null) {
                    this.reserveService.replaceLetter(this.rackLetters[indexOnRack].name);
                    this.rackLetters[indexOnRack] = newCharacters[0];
                }
                this.fillRackPortion(indexOnRack);
            }
        }
    }

    findLetter(letterToCheck: string): ICaracter | void {
        const index = this.findLetterPosition(letterToCheck);
        if (index != -1) {
            return this.rackLetters[index];
        }
    }
    countLetterOccurrences(letterToCheck: string, letters: string[]): number {
        const count = letters.reduce((n, letter) => n + Number(letter.toUpperCase() === letterToCheck.toUpperCase()), 0);
        return count;
    }

    findLetterPosition(letterToCheck: string): number {
        return this.rackLetters?.findIndex((letter) => letter.name === letterToCheck.toUpperCase()) as number;
    }

    checkLettersAvailability(limit: number): boolean {
        return this.reserveService.getNbreOfAvailableLetter() > limit;
    }

    // private findLetterOccurrence(letterToCheck: string): ICaracter[] {
    //     return this.rackLetters?.filter((letter) => letter.name === letterToCheck.toUpperCase()) as ICaracter[];
    // }

    // constructor() {}

    isLetterOnRack(letterToCheck: string): boolean {
        const notFound = -1;
        return this.findLetterPosition(letterToCheck) !== notFound;
    }

    replaceWord(word: string) {
        for (let i = 0; i < word.length; i++) {
            this.replaceLetter(word[i]);
        }
    }
}
