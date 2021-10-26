import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { ImpossibleCommand } from '@app/classes/command-errors/impossible-command/impossible-command';
import { Vec2 } from '@app/classes/vec2';
import { VerifyService } from '@app/services/verify.service';
import { GridService } from './grid.service';
import { PlaceSelectionService } from './place-selection.service';
import { PointsCountingService } from './points-counting.service';
import { RackService } from './rack.service';
import { TimerService } from './timer.service';

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
        private timerService: TimerService,
        private placeSelectionService: PlaceSelectionService,
    ) {}

    async placeWord(word: string, coord: Vec2, direction: string, isCalledThoughtChat: boolean): Promise<void> {
        word = this.verifyService.normalizeWord(word);

        const promise = new Promise<void>((resolve, reject) => {
            try {
                this.lettersUsedOnBoard = this.verifyService.validatePlaceFeasibility(word, coord, direction);
            } catch (error) {
                if (!isCalledThoughtChat) {
                    this.placeSelectionService.cancelPlacement();
                }
                throw error;
            }

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

                    tiles[x][y].text = tiles[x][y].oldText;
                    tiles[x][y].style.color = tiles[x][y].oldStyle.color;
                    tiles[x][y].style.font = tiles[x][y].oldStyle.font;
                    setTimeout(() => {
                        if (!isCalledThoughtChat) {
                            this.placeSelectionService.cancelPlacement();
                        } else {
                            this.gridService.fillGridPortion({ x, y }, tiles[x][y].text, tiles[x][y].style.color, tiles[x][y].style.font);
                        }
                    }, placementDuration);
                    // if (!isCalledThoughtChat) {
                    //     this.placeSelectionService.cancelPlacement();
                    // }
                }

                reject(new ImpossibleCommand(wordValidationParameters.errorMessage));
            } else {
                this.points += this.pointsCountingService.processWordPoints(word, coord, direction, this.lettersUsedOnBoard);
                this.updateTilesLetters(word, coord, direction);
                // this.placeSelectionService.selectedRackIndexesForPlacement = [];
                this.placeSelectionService.selectedTilesForPlacement = [];
                this.placeSelectionService.wordToVerify = [];
                this.gridService.removeArrow(this.placeSelectionService.selectedCoord);
                this.placeSelectionService.selectedCoord = { x: -1, y: -1 };
                while (this.placeSelectionService.selectedRackIndexesForPlacement.length > 0) {
                    this.placeSelectionService.cancelUniqueSelectionFromRack();
                }

                // if (!isCalledThoughtChat) {
                //     this.placeSelectionService.cancelPlacement();
                // }

                resolve(this.rackService.replaceWord(word));

                this.timerService.resetTimer();
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
            tiles[x][y].bonus = 'x';
        }
    }

    writeWord(word: string, coord: Vec2, direction: string, throughChat: boolean) {
        for (let i = 0; i < word.length; i++) {
            const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
            // const x = computingCoord.x;
            // const y = computingCoord.y;

            // tiles[x][y].oldStyle = tiles[x][y].style;
            // tiles[x][y].style = this.gridService.letterStyle;

            // tiles[x][y].oldText = tiles[x][y].text;
            // tiles[x][y].text = word[i];
            // this.gridService.fillGridPortion({ x, y }, tiles[x][y].text, tiles[x][y].style);
            this.gridService.writeLetter(word[i], computingCoord, throughChat);
        }
    }
}
