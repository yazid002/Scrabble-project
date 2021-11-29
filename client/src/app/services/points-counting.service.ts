// Inspiration de https://github.com/russellf9/f9-angular-scrabble/blob/9aff8f156a255a11e4512f2c0e182cbc5e05f7b1/app/js/scrabble/scrabble.service.js
// pour les fonctions getLetterPoints et getWordPoints

import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { Case } from '@app/classes/case';
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
    tiles: Case[][];
    letterBonusesMapping: Map<string, (basePoints: number) => number>;

    constructor(private verifyService: VerifyService, public reserveService: ReserveService) {
        this.tiles = tiles;
        this.letterBonusesMapping = new Map([
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
    }

    processWordPoints(wordToCheck: string, coord: Vec2, direction: string, lettersUsedOnBoard: { letter: string; coord: Vec2 }[]): number {
        let points = this.applyBoardBonuses(wordToCheck, coord, direction, lettersUsedOnBoard);

        points = this.applyBingo(wordToCheck, coord, direction, points, lettersUsedOnBoard);
        return points;
    }

    private getLetterPoints(letter: string): number {
        const aLetter = this.reserveService.findLetterInReserve(letter);
        return aLetter !== NOT_FOUND ? (aLetter as ICharacter).points : NOT_FOUND;
    }

    private applyBingo(
        wordToCheck: string,
        coord: Vec2,
        direction: string,
        basePoints: number,
        lettersUsedOnBoard: { letter: string; coord: Vec2 }[],
    ): number {
        let numberOfLettersFromRack = wordToCheck.length;
        for (let i = 0; i < wordToCheck.length; i++) {
            const x = this.verifyService.computeCoordByDirection(direction, coord, i).x;
            const y = this.verifyService.computeCoordByDirection(direction, coord, i).y;
            const length = lettersUsedOnBoard.filter((letter) => letter.coord.x === x && letter.coord.y === y).length;
            numberOfLettersFromRack -= length;
        }
        return numberOfLettersFromRack === BINGO_LENGTH ? basePoints + BINGO_BONUS : basePoints;
    }

    private applyBoardBonuses(wordToCheck: string, coord: Vec2, direction: string, lettersUsedOnBoard: { letter: string; coord: Vec2 }[]): number {
        let point = 0;
        let numberOfTW = 0;
        let numberOfDW = 0;
        for (let i = 0; i < wordToCheck.length; i++) {
            const x = this.verifyService.computeCoordByDirection(direction, coord, i).x;
            const y = this.verifyService.computeCoordByDirection(direction, coord, i).y;
            const BAD_WORD = -100;
            if (!this.verifyService.areCoordValid({ x, y })) return BAD_WORD;
            let basePoints = 0;
            const length = lettersUsedOnBoard.filter((letter) => letter.coord.x === x && letter.coord.y === y);
            if (length.length === 0) {
                basePoints = this.getLetterPoints(wordToCheck[i]);
                const bonus = this.tiles[y][x].bonus;
                const letterPoints = this.letterBonusesMapping.get(bonus) as (basePoints: number) => number;
                point += letterPoints ? letterPoints(basePoints) : basePoints;

                switch (this.tiles[y][x].bonus) {
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
