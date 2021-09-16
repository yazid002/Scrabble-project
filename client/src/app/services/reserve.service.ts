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
        { name: 'A', params: { quantity: 9, points: 1, affiche: 'A' } },
        { name: 'B', params: { quantity: 2, points: 3, affiche: 'B' } },
        { name: 'C', params: { quantity: 2, points: 3, affiche: 'C' } },
        { name: 'D', params: { quantity: 3, points: 2, affiche: 'D' } },
        { name: 'E', params: { quantity: 15, points: 1, affiche: 'E' } },
        { name: 'F', params: { quantity: 2, points: 4, affiche: 'F' } },
        { name: 'G', params: { quantity: 2, points: 4, affiche: 'G' } },
        { name: 'H', params: { quantity: 2, points: 4, affiche: 'H' } },
        { name: 'I', params: { quantity: 8, points: 1, affiche: 'I' } },
        { name: 'J', params: { quantity: 1, points: 8, affiche: 'J' } },
        { name: 'K', params: { quantity: 1, points: 10, affiche: 'K' } },
        { name: 'L', params: { quantity: 5, points: 1, affiche: 'L' } },
        { name: 'M', params: { quantity: 3, points: 2, affiche: 'M' } },
        { name: 'N', params: { quantity: 6, points: 1, affiche: 'N' } },
        { name: 'O', params: { quantity: 6, points: 1, affiche: 'O' } },
        { name: 'P', params: { quantity: 2, points: 3, affiche: 'P' } },
        { name: 'Q', params: { quantity: 1, points: 8, affiche: 'Q' } },
        { name: 'R', params: { quantity: 6, points: 1, affiche: 'R' } },
        { name: 'S', params: { quantity: 6, points: 1, affiche: 'S' } },
        { name: 'T', params: { quantity: 6, points: 1, affiche: 'T' } },
        { name: 'U', params: { quantity: 6, points: 1, affiche: 'U' } },
        { name: 'V', params: { quantity: 2, points: 4, affiche: 'V' } },
        { name: 'W', params: { quantity: 1, points: 10, affiche: 'W' } },
        { name: 'X', params: { quantity: 1, points: 10, affiche: 'X' } },
        { name: 'Y', params: { quantity: 1, points: 10, affiche: 'Y' } },
        { name: 'Z', params: { quantity: 1, points: 10, affiche: 'Z' } },
        { name: '*', params: { quantity: 2, points: 0, affiche: '' } },
    ];

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    getNbreOfAvailableLetter() {
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        const nbTotal = this.alphabets.reduce(function (acc, obj) {
            return acc + obj.params.quantity;
        }, 0);
        return nbTotal;
    }

    getReserve(requestedQuantity: number) {
        // eslint-disable-next-line no-console
        console.log('totaux = ' + this.getNbreOfAvailableLetter());
        const totalAvailableLetters = this.getNbreOfAvailableLetter();
        const filterByQuantity = (letters: ICaracter[]) => letters.filter((letter) => letter.params.quantity > 0);
        let availableLetters = filterByQuantity(this.alphabets);
        const reserve: ICaracter[] = [];
        if (totalAvailableLetters < requestedQuantity) {
            return null;
        }
        let i = 0;
        while (i < requestedQuantity) {
            const index = Math.round(Math.random() * availableLetters.length);
            reserve[i] = availableLetters[index];
            const pos = this.alphabets.findIndex((char) => char?.name + '' === reserve[i]?.name + '');
            ((this.alphabets[pos] || null).params || null).quantity -= 1;
            if (this.alphabets[pos].params.quantity == 0) {
                availableLetters = availableLetters.filter((elem) => elem.name != this.alphabets[pos].name);
                // eslint-disable-next-line no-console
                console.log('taille de available = ' + availableLetters.length);
            }
            i++;
        }
        return reserve;
    }
}
