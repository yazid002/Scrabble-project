import { Injectable } from '@angular/core';
import { ICharacter } from '@app/classes/letter';

@Injectable({
    providedIn: 'root',
})
export class ReserveService {
    alphabets: ICharacter[] = [
        { name: 'A', quantity: 9, points: 1, affiche: 'A' },
        { name: 'B', quantity: 2, points: 3, affiche: 'B' },
        { name: 'C', quantity: 2, points: 3, affiche: 'C' },
        { name: 'D', quantity: 3, points: 2, affiche: 'D' },
        { name: 'E', quantity: 15, points: 1, affiche: 'E' },
        { name: 'F', quantity: 2, points: 4, affiche: 'F' },
        { name: 'G', quantity: 2, points: 4, affiche: 'G' },
        { name: 'H', quantity: 2, points: 4, affiche: 'H' },
        { name: 'I', quantity: 8, points: 1, affiche: 'I' },
        { name: 'J', quantity: 1, points: 8, affiche: 'J' },
        { name: 'K', quantity: 1, points: 10, affiche: 'K' },
        { name: 'L', quantity: 5, points: 1, affiche: 'L' },
        { name: 'M', quantity: 3, points: 2, affiche: 'M' },
        { name: 'N', quantity: 6, points: 1, affiche: 'N' },
        { name: 'O', quantity: 6, points: 1, affiche: 'O' },
        { name: 'P', quantity: 2, points: 3, affiche: 'P' },
        { name: 'Q', quantity: 1, points: 8, affiche: 'Q' },
        { name: 'R', quantity: 6, points: 1, affiche: 'R' },
        { name: 'S', quantity: 6, points: 1, affiche: 'S' },
        { name: 'T', quantity: 6, points: 1, affiche: 'T' },
        { name: 'U', quantity: 6, points: 1, affiche: 'U' },
        { name: 'V', quantity: 2, points: 4, affiche: 'V' },
        { name: 'W', quantity: 1, points: 10, affiche: 'W' },
        { name: 'X', quantity: 1, points: 10, affiche: 'X' },
        { name: 'Y', quantity: 1, points: 10, affiche: 'Y' },
        { name: 'Z', quantity: 1, points: 10, affiche: 'Z' },
        { name: '*', quantity: 2, points: 0, affiche: '*' },
    ];
    nbLettersInReserve: number;
    constructor() {
        this.getQuantityOfAvailableLetters();
        this.getInitialReserve();
    }

    getQuantityOfAvailableLetters() {
        this.nbLettersInReserve = this.alphabets.reduce((total, letter) => total + letter.quantity, 0);
        return this.nbLettersInReserve;
    }

    getLettersFromReserve(requestedQuantity: number): ICharacter[] {
        this.nbLettersInReserve = this.getQuantityOfAvailableLetters();

        const filterByQuantity = (letters: ICharacter[]) => letters.filter((letter) => letter.quantity > 0);
        let availableLetters = filterByQuantity(this.alphabets);
        const reserve: ICharacter[] = [];
        if (this.nbLettersInReserve < requestedQuantity) {
            return reserve;
        }
        let i = 0;
        while (i < requestedQuantity) {
            const index = Math.floor(Math.random() * availableLetters.length);
            reserve[i] = availableLetters[index];
            const pos = this.findLetterPosition(reserve[i].name, this.alphabets);
            this.alphabets[pos].quantity -= 1;
            if (this.alphabets[pos].quantity === 0) {
                availableLetters = availableLetters.filter((elem) => elem.name !== this.alphabets[pos].name);
            }
            i++;
        }
        this.getQuantityOfAvailableLetters();
        return reserve;
    }

    addLetterInReserve(letterToReplace: string): void {
        const notFound = -1;
        const indexInReserve = this.findLetterPosition(letterToReplace, this.alphabets);
        if (indexInReserve !== notFound) {
            this.alphabets[indexInReserve].quantity++;
        }
    }

    findLetterInReserve(letterToCheck: string): ICharacter | number {
        if (letterToCheck === letterToCheck.toUpperCase()) {
            letterToCheck = '*';
        }
        const index = this.findLetterPosition(letterToCheck, this.alphabets);
        const notFound = -1;
        if (index !== notFound) {
            return this.alphabets[index];
        }

        return notFound;
    }

    // TODO: ENLEVER SI ON UTILISE PAS
    getInitialReserve() {
        const reserve: ICharacter[] = [];

        for (let i = 0; i < this.alphabets.length; i++) {
            reserve[i] = this.alphabets[i];
        }

        return reserve;
    }

    private findLetterPosition(letterToCheck: string, letters: ICharacter[]): number {
        return letters.findIndex((letter) => letter.name === letterToCheck.toUpperCase()) as number;
    }
}
