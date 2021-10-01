import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { ImpossibleCommand } from '@app/classes/command-errors/impossible-command/impossible-command';
import { ICharacter } from '@app/classes/letter';
import { Point } from '@app/classes/point';
import { PosChars } from '@app/classes/pos-chars';
import { Vec2 } from '@app/classes/vec2';
import { VerifyService } from '@app/verify.service';
import { GridService } from './grid.service';
import { PointsCountingService } from './points-counting.service';
import { RackService } from './rack.service';
import { ReserveService } from './reserve.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceService {
    lettersUsedOnBoard: { letter: string; coord: Vec2 }[];
    constructor(
        public reserveService: ReserveService,
        private rackService: RackService,
        private verifyService: VerifyService,
        private gridService: GridService,
        public pointsCountingService: PointsCountingService,
    ) {
        this.lettersUsedOnBoard = [];
    }

    async placeWord(word: string, coord: Vec2, direction: string): Promise<void> {
        word = this.verifyService.normalizeWord(word);

        const promise = new Promise<void>((resolve, reject) => {
            const posWord = new PosChars(word, new Point(coord.x, coord.y));

            this.lettersUsedOnBoard = this.verifyService.validatePlaceFeasibility(posWord, direction);
            this.writeWord(word, coord, direction);

            const wordValidationParameters = this.verifyService.checkAllWordsExist(word, coord);
            if (!wordValidationParameters.wordExists) {
                const placementDuration = 3000; // 3000 millisecondes soit 3s;
                for (let i = 0; i < word.length; i++) {
                    const x = this.verifyService.computeCoordByDirection(direction, coord, i).x;
                    const y = this.verifyService.computeCoordByDirection(direction, coord, i).y;

                    tiles[x][y].text = tiles[x][y].oldText;
                    tiles[x][y].style = tiles[x][y].oldStyle;
                    setTimeout(() => {
                        this.gridService.fillGridPortion({ x, y }, tiles[x][y].text, tiles[x][y].style);
                    }, placementDuration);
                }

                reject(new ImpossibleCommand(wordValidationParameters.errorMessage));
            } else {
                this.updateTilesLetters(word, coord, direction);
                resolve(this.rackService.replaceWord(word));
                
                
            }
        });
        return promise;
    }

    updateTilesLetters(word: string, coord: Vec2, direction: string): void {
        for (let i = 0; i < word.length; i++) {
            const x = this.verifyService.computeCoordByDirection(direction, coord, i).x;
            const y = this.verifyService.computeCoordByDirection(direction, coord, i).y;
            tiles[x][y].letter = word[i].toLowerCase();
        }
    }

    writeWord(word: string, coord: Vec2, direction: string) {
        for (let i = 0; i < word.length; i++) {
            const x = this.verifyService.computeCoordByDirection(direction, coord, i).x;
            const y = this.verifyService.computeCoordByDirection(direction, coord, i).y;
            const character = this.reserveService.findLetterInReserve(word[i]) as ICharacter;

            if (word[i] === word[i].toUpperCase()) {
                if (character.name === '*') {
                    character.affiche = word[i];
                }
            }

            tiles[x][y].oldStyle = tiles[x][y].style;
            tiles[x][y].style = this.gridService.letterStyle;

            tiles[x][y].oldText = tiles[x][y].text;
            tiles[x][y].text = word[i];

            this.gridService.fillGridPortion({ x, y }, tiles[x][y].text, tiles[x][y].style);
        }
    }

    // calculatePlacementPoints(word: string, lettersUsedOnBoard: { letter: string; coord: Vec2 }[]){

    // }
}
