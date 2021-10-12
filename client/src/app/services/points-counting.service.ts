// Inspiration de https://github.com/russellf9/f9-angular-scrabble/blob/9aff8f156a255a11e4512f2c0e182cbc5e05f7b1/app/js/scrabble/scrabble.service.js
// pour les fonctions getLetterPoints et getWordPoints

import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { ICharacter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { BINGO_BONUS, BINGO_LENGTH, INVALID_NUMBER } from '@app/constants/board-constants';
import { ReserveService } from './reserve.service';
import { VerifyService } from './verify.service';

@Injectable({
    providedIn: 'root',
})
export class PointsCountingService {
    reserve: ICharacter[];
    wordIsValid: boolean;
    wordToCheck: string;

    constructor(private verifyService: VerifyService, public reserveService: ReserveService) {}

    getLetterPoints(letter: string): number {
        const aLetter = this.reserveService.findLetterInReserve(letter);
        if (aLetter !== INVALID_NUMBER) {
            return (aLetter as ICharacter).points;
        }
        return INVALID_NUMBER;
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

    applyBoardBonuses(wordToCheck: string, coord: Vec2, direction: string, lettersUsedOnBoard: { letter: string; coord: Vec2 }[]) {
        let point = 0;
        let numberOfTW = 0;
        let numberOfDW = 0;
        for (let i = 0; i < wordToCheck.length; i++) {
            const x = this.verifyService.computeCoordByDirection(direction, coord, i).x;
            const y = this.verifyService.computeCoordByDirection(direction, coord, i).y;
            let basePoints = 0;
            const length = lettersUsedOnBoard.filter((letter) => letter.coord.x === x && letter.coord.y === y);
            console.log(' le tableau et son length : ', length);
            if (length.length === 0) {
                basePoints = this.getLetterPoints(wordToCheck[i]);
            }
            console.log('basePoints : ', basePoints);

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

    processWordPoints(wordToCheck: string, coord: Vec2, direction: string, lettersUsedOnBoard: { letter: string; coord: Vec2 }[]): number {
        let points = this.applyBoardBonuses(wordToCheck, coord, direction, lettersUsedOnBoard);

        points = this.applyBingo(wordToCheck, points);

        return points;
    }
}
