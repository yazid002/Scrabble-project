import { Injectable } from '@angular/core';
import { ICharacter } from '@app/classes/letter';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';
import { ReserveService } from '@app/services/reserve.service';

@Injectable({
    providedIn: 'root',
})
export class RackService {
    rackContext: CanvasRenderingContext2D;

    rackLetters: ICharacter[] = [
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
        this.rackLetters = this.reserveService.getLettersFromReserve(RACK_SIZE);

        for (let x = 0; x < RACK_SIZE; x++) {
            this.fillRackPortion(x, 'NavajoWhite');
        }
    }

    replaceLetter(letterToReplace: string, onRackOnly: boolean, index?: number): void {
        const notFound = -1;
        const color = 'NavajoWhite';
        const indexOnRack = index ? index : this.findLetterPosition(letterToReplace);
        if (indexOnRack !== notFound) {
            const newCharacters = this.reserveService.getLettersFromReserve(1);
            console.log('last character ', this.rackLetters[indexOnRack]);
            console.log('newCharacters ', newCharacters);
            if (newCharacters.length !== 0) {
                if (!onRackOnly) {
                    this.reserveService.addLetterInReserve(this.rackLetters[indexOnRack].name);
                }
                console.log('indexOnRack ', indexOnRack);
                this.rackLetters[indexOnRack] = newCharacters[0];
                this.fillRackPortion(indexOnRack, color);
            }
        }
    }

    replaceWord(word: string) {
        for (let letter of word) {
            if (letter === letter.toUpperCase()) {
                letter = '*';
            }
            this.replaceLetter(letter, true);
        }
    }

    checkLettersAvailability(limit: number): boolean {
        return this.reserveService.getQuantityOfAvailableLetters() > limit;
    }

    countLetterOccurrences(letterToCheck: string, letters: string[]): number {
        const count = letters.reduce((n, letter) => n + Number(letter.toUpperCase() === letterToCheck.toUpperCase()), 0);
        return count;
    }

    findJokersNumberOnRack(): number {
        const jokers = this.rackLetters.filter((letter) => letter.name === '*');
        return jokers.length;
    }

    findInexistentLettersOnRack(lettersToChange: string[]): string[] {
        return [...new Set(lettersToChange.filter((letter: string) => this.isLetterOnRack(letter) === false))];
    }

    isLetterOnRack(letterToCheck: string): boolean {
        const notFound = -1;
        return this.findLetterPosition(letterToCheck) !== notFound;
    }

    fillRackPortion(index: number, color: string) {
        const LETTERS_PIXELS_WIDTH_ADJUSTMENT = 6;
        const LETTERS_PIXELS_HEIGH_ADJUSTMENT = 8;
        const POINTS_PIXELS_WIDTH_ADJUSTMENT = 25;
        const POINTS_PIXELS_HEIGH_ADJUSTMENT = 1;

        this.rackContext.clearRect((DEFAULT_WIDTH / RACK_SIZE) * index, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT);
        this.rackContext.rect((DEFAULT_WIDTH / RACK_SIZE) * index, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT);
        this.rackContext.stroke();
        this.rackContext.fillStyle = color;
        this.rackContext.fillRect((DEFAULT_WIDTH / RACK_SIZE) * index, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT);
        this.rackContext.fillStyle = 'rgb(0,0,0)';
        this.rackContext.font = '30px serif';
        if (this.rackLetters[index]) {
            this.rackContext.fillText(
                this.rackLetters[index].affiche,
                (DEFAULT_WIDTH / RACK_SIZE) * index + LETTERS_PIXELS_WIDTH_ADJUSTMENT,
                DEFAULT_HEIGHT - LETTERS_PIXELS_HEIGH_ADJUSTMENT,
            );

            this.rackContext.font = '10px serif';
            this.rackContext.fillText(
                this.rackLetters[index].points.toString(),
                (DEFAULT_WIDTH / RACK_SIZE) * index + POINTS_PIXELS_WIDTH_ADJUSTMENT,
                DEFAULT_HEIGHT - POINTS_PIXELS_HEIGH_ADJUSTMENT,
            );
        }
    }

    findLetterPosition(letterToCheck: string): number {
        return this.rackLetters.findIndex((letter) => letter.name === letterToCheck.toUpperCase()) as number;
    }

    // TODO: ENLEVER SI ON EN A PAS BESOIN
    // private findWordOnRack(word: string[]): boolean {
    //     for (const w of word) {
    //         if (!this.isLetterOnRack(w)) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }

    // findLetter(letterToCheck: string): ICaracter | void {
    //     let letter = letterToCheck;
    //     if (letterToCheck === letterToCheck.toUpperCase()) {
    //         letter = '*';
    //     }
    //     const index = this.findLetterPosition(letter);
    //     const notFound = -1;
    //     if (index !== notFound) {
    //         return this.rackLetters[index];
    //     }
    // }

    // private findLetterOccurrence(letterToCheck: string): ICaracter[] {
    //     return this.rackLetters?.filter((letter) => letter.name === letterToCheck.toUpperCase()) as ICaracter[];
    // }
}
