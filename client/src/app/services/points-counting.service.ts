// Inspiration de https://github.com/russellf9/f9-angular-scrabble/blob/9aff8f156a255a11e4512f2c0e182cbc5e05f7b1/app/js/scrabble/scrabble.service.js
// pour les fonctions getLetterPoints et getWordPoints

import { Injectable } from '@angular/core';

// A placer dans un fichier de constantes
export const INVALID_NUMBER = -1;

@Injectable({
    providedIn: 'root',
})
export class PointsCountingService {
    // mot placé = combinaison de lettre et leur position
    reserve: { name: string; params: { quantity: number; points: number; display: string } }[];
    wordIsValid: boolean;
    wordToCheck: string;

    // constructor() {}

    getLetterPoints(letter: string): number {
        const aLetter = this.reserve.find((element) => element.name === letter.toUpperCase());
        return aLetter?.params.points || INVALID_NUMBER;
    }

    getWordPoints(word: string): number {
        if (this.wordIsValid) {
            return word
                .split('')
                .map((letter) => {
                    return this.getLetterPoints(letter);
                })
                .reduce((firstPoint: number, secondPoint: number) => {
                    return firstPoint + secondPoint;
                });
        }
        return INVALID_NUMBER;
    }
}
