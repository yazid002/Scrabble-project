import { Injectable } from '@angular/core';
import { ICharacter } from '@app/classes/letter';
import { NOT_FOUND } from '@app/constants/common-constants';

@Injectable({
    providedIn: 'root',
})
export class ReserveService {
    alphabets: ICharacter[];
    nbLettersInReserve: number;
    constructor() {
        this.alphabets = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 2, points: 3, display: 'B' },
            { name: 'C', quantity: 2, points: 3, display: 'C' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'F', quantity: 2, points: 4, display: 'F' },
            { name: 'G', quantity: 2, points: 4, display: 'G' },
            { name: 'H', quantity: 2, points: 4, display: 'H' },
            { name: 'I', quantity: 8, points: 1, display: 'I' },
            { name: 'J', quantity: 1, points: 8, display: 'J' },
            { name: 'K', quantity: 1, points: 10, display: 'K' },
            { name: 'L', quantity: 5, points: 1, display: 'L' },
            { name: 'M', quantity: 3, points: 2, display: 'M' },
            { name: 'N', quantity: 6, points: 1, display: 'N' },
            { name: 'O', quantity: 6, points: 1, display: 'O' },
            { name: 'P', quantity: 2, points: 3, display: 'P' },
            { name: 'Q', quantity: 1, points: 8, display: 'Q' },
            { name: 'R', quantity: 6, points: 1, display: 'R' },
            { name: 'S', quantity: 6, points: 1, display: 'S' },
            { name: 'T', quantity: 6, points: 1, display: 'T' },
            { name: 'U', quantity: 6, points: 1, display: 'U' },
            { name: 'V', quantity: 2, points: 4, display: 'V' },
            { name: 'W', quantity: 1, points: 10, display: 'W' },
            { name: 'X', quantity: 1, points: 10, display: 'X' },
            { name: 'Y', quantity: 1, points: 10, display: 'Y' },
            { name: 'Z', quantity: 1, points: 10, display: 'Z' },
            { name: '*', quantity: 2, points: 0, display: '*' },
        ];
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
        const indexInReserve = this.findLetterPosition(letterToReplace, this.alphabets);
        if (indexInReserve !== NOT_FOUND) {
            this.alphabets[indexInReserve].quantity++;
        }
    }

    findLetterInReserve(letterToCheck: string): ICharacter | number {
        if (letterToCheck === letterToCheck.toUpperCase()) {
            letterToCheck = '*';
        }
        const index = this.findLetterPosition(letterToCheck, this.alphabets);
        return index !== NOT_FOUND ? this.alphabets[index] : NOT_FOUND;
    }

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
