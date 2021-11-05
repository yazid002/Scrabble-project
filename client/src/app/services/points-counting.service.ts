// Inspiration de https://github.com/russellf9/f9-angular-scrabble/blob/9aff8f156a255a11e4512f2c0e182cbc5e05f7b1/app/js/scrabble/scrabble.service.js
// pour les fonctions getLetterPoints et getWordPoints

import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { ICharacter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { BINGO_BONUS, BINGO_LENGTH } from '@app/constants/board-constants';
import { NOT_FOUND } from '@app/constants/common-constants';
import { ReserveService } from './reserve.service';
import { VerifyService } from './verify.service';

@Injectable({
    providedIn: 'root',
})
export class PointsCountingService {
    letterBonusesMapping: Map<string, (basePoints: number) => number> = new Map([
        [
            'dl',
            (basePoints: number) => {
                return basePoints * 2;
            },
        ],
        [
            'tl',
            (basePoints: number) => {
                return basePoints * 3;
            },
        ],
    ]);

    constructor(private verifyService: VerifyService, public reserveService: ReserveService) {}

    processWordPoints(wordToCheck: string, coord: Vec2, direction: string, lettersUsedOnBoard: { letter: string; coord: Vec2 }[]): number {
        let points = this.applyBoardBonuses(wordToCheck, coord, direction, lettersUsedOnBoard);

        points = this.applyBingo(wordToCheck, points);

        return points;
    }

    private getLetterPoints(letter: string): number {
        const aLetter = this.reserveService.findLetterInReserve(letter);
        if (aLetter !== NOT_FOUND) {
            return (aLetter as ICharacter).points;
        }
        return NOT_FOUND;
    }

    private applyBingo(wordToCheck: string, basePoints: number): number {
        return wordToCheck.length === BINGO_LENGTH ? basePoints + BINGO_BONUS : basePoints;
    }

    private applyBoardBonuses(wordToCheck: string, coord: Vec2, direction: string, lettersUsedOnBoard: { letter: string; coord: Vec2 }[]): number {
        let point = 0;
        let numberOfTW = 0;
        let numberOfDW = 0;
        for (let i = 0; i < wordToCheck.length; i++) {
            const x = this.verifyService.computeCoordByDirection(direction, coord, i).x;
            const y = this.verifyService.computeCoordByDirection(direction, coord, i).y;
            let basePoints = 0;
            const length = lettersUsedOnBoard.filter((letter) => letter.coord.x === x && letter.coord.y === y);
            if (length.length === 0) {
                basePoints = this.getLetterPoints(wordToCheck[i]);
                const letterPoints = this.letterBonusesMapping.get(tiles[y][x].bonus) as (basePoints: number) => number;
                point += letterPoints ? letterPoints(basePoints) : basePoints;

                switch (tiles[y][x].bonus) {
                    case 'tw':
                        numberOfTW++;
                        break;
                    case 'dw':
                        numberOfDW++;
                        break;
                }
            }
        }
        point *= numberOfTW ? numberOfTW * 3 : 1;
        point *= numberOfDW ? numberOfDW * 2 : 1;
        return point;
    }
}
