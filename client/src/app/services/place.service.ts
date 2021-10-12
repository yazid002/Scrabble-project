import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { ImpossibleCommand } from '@app/classes/command-errors/impossible-command/impossible-command';
import { Vec2 } from '@app/classes/vec2';
import { VerifyService } from '@app/services/verify.service';
import { GridService } from './grid.service';
import { PointsCountingService } from './points-counting.service';
import { RackSelectionService } from './rack-selection.service';
import { RackService } from './rack.service';
import { ReserveService } from './reserve.service';
import { TileSelectionService } from './tile-selection.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceService {
    lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];
    points: number = 0;
    constructor(
        private rackService: RackService,
        private verifyService: VerifyService,
        private gridService: GridService,
        private pointsCountingService: PointsCountingService,
        private reserveService: ReserveService,
        public rackSelectionService: RackSelectionService,
        public tileSelectionService: TileSelectionService,
    ) {
        pointsCountingService.reserve = this.reserveService.alphabets;
    }

    async placeWord(word: string, coord: Vec2, direction: string, isCalledThoughtChat: boolean): Promise<void> {
        word = this.verifyService.normalizeWord(word);

        const promise = new Promise<void>((resolve, reject) => {
            this.lettersUsedOnBoard = this.verifyService.validatePlaceFeasibility(word, coord, direction);
            if (isCalledThoughtChat) {
                this.writeWord(word, coord, direction, isCalledThoughtChat);
            }

            const wordValidationParameters = this.verifyService.checkAllWordsExist(word, coord);
            if (!wordValidationParameters.wordExists) {
                const placementDuration = 3000; // 3000 millisecondes soit 3s;
                for (let i = 0; i < word.length; i++) {
                    const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
                    const x = computingCoord.x;
                    const y = computingCoord.y;
                    console.log('quand je place: ', tiles[x][y]);

                    tiles[x][y].text = tiles[x][y].oldText;
                    tiles[x][y].style.color = tiles[x][y].oldStyle.color;
                    tiles[x][y].style.font = tiles[x][y].oldStyle.font;
                    setTimeout(() => {
                        this.gridService.fillGridPortion({ x, y }, tiles[x][y].text, tiles[x][y].style);
                    }, placementDuration);

                    if (!isCalledThoughtChat) {
                        this.rackSelectionService.cancelPlacement();
                    }
                }

                reject(new ImpossibleCommand(wordValidationParameters.errorMessage));
            } else {
                this.updateTilesLetters(word, coord, direction);
                this.points += this.pointsCountingService.getWordBasePoints(word);
                this.tileSelectionService.selectedIndexesForPlacement = [];
                this.rackSelectionService.selectedIndexesForPlacement = [];
                this.rackSelectionService.wordToVerify = [];
                resolve(this.rackService.replaceWord(word));
                console.log('this.rackSelectionService.selectedIndexesForPlacement : ', this.rackSelectionService.selectedIndexesForPlacement);
                console.log(
                    'this.rackSelectionService.tileSelectionService.selectedIndexesForPlacement : ',
                    this.rackSelectionService.tileSelectionService.selectedIndexesForPlacement,
                );
            }
        });
        return promise;
    }

    updateTilesLetters(word: string, coord: Vec2, direction: string): void {
        for (let i = 0; i < word.length; i++) {
            const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
            const x = computingCoord.x;
            const y = computingCoord.y;
            tiles[x][y].letter = word[i].toLowerCase();
        }
    }

    writeWord(word: string, coord: Vec2, direction: string, isCalledThoughtChat: boolean) {
        for (let i = 0; i < word.length; i++) {
            const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
            this.gridService.writeLetter(word[i], computingCoord, isCalledThoughtChat);
        }
    }
}
