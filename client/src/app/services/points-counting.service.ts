// Inspiration de https://github.com/russellf9/f9-angular-scrabble/blob/9aff8f156a255a11e4512f2c0e182cbc5e05f7b1/app/js/scrabble/scrabble.service.js
// pour les fonctions getLetterPoints et getWordPoints

import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { Vec2 } from '@app/classes/vec2';
import { BINGO_BONUS, BINGO_LENGTH, INVALID_NUMBER } from '@app/constants/board-constants';
import { VerifyService } from '@app/services/verify.service';
import { ReserveService } from './reserve.service';

@Injectable({
    providedIn: 'root',
})
export class PointsCountingService {
    reserve: { name: string; params: { quantity: number; points: number; display: string } }[];
    wordIsValid: boolean;
    wordToCheck: string;

    constructor(private verifyService: VerifyService, public reserveService: ReserveService) {}

    getLetterPoints(letter: string): number {
        const aLetter = this.reserve.find((element) => element.name === letter.toUpperCase());
        return aLetter?.params.points || INVALID_NUMBER;
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

    processWordPoints(wordToCheck: string, coord: Vec2, direction: string): number {
        let points = this.applyBoardBonuses(wordToCheck, coord, direction);

        points = this.applyBingo(wordToCheck, points);

        return points;
    }

    applyBoardBonuses(wordToCheck: string, coord: Vec2, direction: string) {
        let point = 0;
        let numberOfTW = 0;
        let numberOfDW = 0;
        for (let i = 0; i < wordToCheck.length; i++) {
            const x = this.verifyService.computeCoordByDirection(direction, coord, i).x;
            const y = this.verifyService.computeCoordByDirection(direction, coord, i).y;
            let basePoints = this.getLetterPoints(wordToCheck[i]);
            switch (tiles[x][y].bonus) {
                case 'tl':
                    basePoints *= 3;
                    break;
                case 'dl':
                    basePoints *= 2;
                    break;
                case 'tw':
                    numberOfTW++;
                    break;
                case 'dw':
                    numberOfDW++;
                    break;
            }
            point += basePoints;
        }
        if (numberOfTW > 0) {
            point *= numberOfTW * 3;
        }
        if (numberOfDW > 0) {
            point *= numberOfDW * 2;
        }
        return point;
    }
}
