import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { ImpossibleCommand } from '@app/classes/command-errors/impossible-command/impossible-command';
import { Vec2 } from '@app/classes/vec2';
import { VerifyService } from '@app/verify.service';
import { GridService } from './grid.service';
import { PointsCountingService } from './points-counting.service';
import { RackService } from './rack.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceService {
    lettersUsedOnBoard: { letter: string; coord: Vec2 }[];
    constructor(
        private rackService: RackService,
        private verifyService: VerifyService,
        private gridService: GridService,
        public pointsCountingService: PointsCountingService,
    ) {
        this.lettersUsedOnBoard = [];
    }

    async placeWord(word: string, coord: Vec2, direction: string): Promise<void> {
        console.log('mot avant ', word);
        word = this.verifyService.normalizeWord(word);
        console.log('mot apres ', word);

        const promise = new Promise<void>((resolve, reject) => {
            this.lettersUsedOnBoard = this.verifyService.validatePlaceFeasibility(word, coord, direction);
            this.writeWord(word, coord, direction);

            const wordValidationParameters = this.verifyService.checkAllWordsExist(word, coord);
            if (!wordValidationParameters.wordExists) {
                const placementDuration = 3000; // 3000 millisecondes soit 3s;
                for (let i = 0; i < word.length; i++) {
                    const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
                    const x = computingCoord.x;
                    const y = computingCoord.y;

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
        console.log('le mot', word);
        for (let i = 0; i < word.length; i++) {
            const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
            const x = computingCoord.x;
            const y = computingCoord.y;
            tiles[x][y].letter = word[i].toLowerCase();
            console.log('le mot ici', word);
        }
    }

    writeWord(word: string, coord: Vec2, direction: string) {
        console.log('le mot2', word);
        for (let i = 0; i < word.length; i++) {
            const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
            const x = computingCoord.x;
            const y = computingCoord.y;

            tiles[x][y].oldStyle = tiles[x][y].style;
            tiles[x][y].style = this.gridService.letterStyle;

            tiles[x][y].oldText = tiles[x][y].text;
            tiles[x][y].text = word[i];
            console.log('le mot2 entre', word);
            this.gridService.fillGridPortion({ x, y }, tiles[x][y].text, tiles[x][y].style);
            console.log('le mot2 fin', word);
        }
    }

    // calculatePlacementPoints(word: string, lettersUsedOnBoard: { letter: string; coord: Vec2 }[]){

    // }
}
