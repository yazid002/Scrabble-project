// Inspiration de https://github.com/russellf9/f9-angular-scrabble/blob/9aff8f156a255a11e4512f2c0e182cbc5e05f7b1/app/js/scrabble/scrabble.service.js
// pour les fonctions getLetterPoints et getWordPoints

import { Injectable } from '@angular/core';
import { ICharacter } from '@app/classes/letter';
import { BINGO_BONUS, BINGO_LENGTH, INVALID_NUMBER } from '@app/constants/board-constants';
import { ReserveService } from './reserve.service';

@Injectable({
    providedIn: 'root',
})
export class PointsCountingService {
    reserve: ICharacter[];
    wordIsValid: boolean;
    wordToCheck: string;

    constructor(public reserveService: ReserveService) {}

    getLetterPoints(letter: string): number {
        const aLetter = this.reserve.find((element) => element.name === letter.toUpperCase());
        return aLetter?.points || INVALID_NUMBER;
    }

    getWordBasePoints(word: string): number {
        return word
            .split('')
            .map((letter) => {
                return this.getLetterPoints(letter);
            })
            .reduce((firstPoint: number, secondPoint: number) => {
                return firstPoint + secondPoint;
            });
    }

    applyBingo(wordToCheck: string, basePoints: number): number {
        return wordToCheck.length === BINGO_LENGTH ? basePoints + BINGO_BONUS : basePoints;
    }
}
