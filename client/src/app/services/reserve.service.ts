/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Injectable } from '@angular/core';
import { ICaracter } from '@app/models/lettre.model';

@Injectable({
    // eslint-disable-next-line prettier/prettier
    providedIn: 'root',
})
export class ReserveService {
    alphabets: ICaracter[] = [
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
        { name: '*', quantity: 2, points: 0, affiche: '' },
    ];

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    getNbreOfAvailableLetter() {
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        const nbTotal = this.alphabets.reduce(function (acc, obj) {
            return acc + obj.quantity;
        }, 0);
        return nbTotal;
    }

    getReserve(requestedQuantity: number) {
        // eslint-disable-next-line no-console
        console.log('totaux = ' + this.getNbreOfAvailableLetter());
        const totalAvailableLetters = this.getNbreOfAvailableLetter();
        const filterByQuantity = (letters: ICaracter[]) => letters.filter((letter) => letter.quantity > 0);
        let availableLetters = filterByQuantity(this.alphabets);
        const reserve: ICaracter[] = [];
        if (totalAvailableLetters < requestedQuantity) {
            //return null; 
            console.log('bug');
        }
        let i = 0;
        while (i < requestedQuantity) {
            const index = Math.floor(Math.random() * availableLetters.length);
            reserve[i] = availableLetters[index];
            const pos = this.alphabets.findIndex((char) => char?.name + '' === reserve[i]?.name + '');
            this.alphabets[pos].quantity -= 1;
            if (this.alphabets[pos].quantity == 0) {
                availableLetters = availableLetters.filter((elem) => elem.name != this.alphabets[pos].name);
                // eslint-disable-next-line no-console
                console.log('taille de available = ' + availableLetters.length);
            }
            i++;
        }
        return reserve;
    }

    findLetterPosition(letterToCheck: string): number {
        return this.alphabets?.findIndex((letter) => letter.name === letterToCheck.toUpperCase()) as number;
    }

    replaceLetter(letterToReplace: string): void {
        const notFound = -1;
        const indexInReserve = this.findLetterPosition(letterToReplace);
        if (indexInReserve !== notFound) {
            this.alphabets[indexInReserve].quantity++;
        }
        console.log('totaux: ', this.getNbreOfAvailableLetter());
    }
}
