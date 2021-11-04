import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { ImpossibleCommand } from '@app/classes/command-errors/impossible-command/impossible-command';
import { Vec2 } from '@app/classes/vec2';
import { SelectionType } from '@app/enums/selection-enum';
import { VerifyService } from '@app/services/verify.service';
import { GameService } from './game.service';
import { GridService } from './grid.service';
import { PlaceSelectionService } from './place-selection.service';
import { PointsCountingService } from './points-counting.service';
import { RackService } from './rack.service';
import { SelectionManagerService } from './selection-manager.service';
import { TimerService } from './timer.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceService {
    lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];
    constructor(
        private rackService: RackService,
        private verifyService: VerifyService,
        private gridService: GridService,
        private pointsCountingService: PointsCountingService,
        private timerService: TimerService,
        private gameService: GameService,
        private placeSelectionService: PlaceSelectionService,
        private selectionManagerService: SelectionManagerService,
    ) {}
    placeWordInstant(word: string, coord: Vec2, direction: string, isCalledThoughtChat: boolean): boolean {
        word = this.verifyService.normalizeWord(word);

        this.lettersUsedOnBoard = this.verifyService.validatePlaceFeasibility(word, coord, direction);
        this.writeWord(word, coord, direction, isCalledThoughtChat);
        const wordValidationParameters = this.verifyService.checkAllWordsExist(word, coord);
        if (!wordValidationParameters.wordExists) {
            for (let i = 0; i < word.length; i++) {
                const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
                const x = computingCoord.x;
                const y = computingCoord.y;

                tiles[y][x].text = tiles[y][x].oldText;
                tiles[y][x].style.color = tiles[y][x].oldStyle.color;
                tiles[y][x].style.font = tiles[y][x].oldStyle.font;

                this.gridService.fillGridPortion({ y, x }, tiles[y][x].text, tiles[y][x].style.color as string, tiles[y][x].style.font as string);
            }
        } else {
            this.updateTilesLetters(word, coord, direction);
            this.gameService.players[this.gameService.currentTurn].points += this.pointsCountingService.processWordPoints(
                word,
                coord,
                direction,
                this.lettersUsedOnBoard,
            );
            this.rackService.replaceWord(word);

            // this.timerService.resetTimer();
        }

        return wordValidationParameters.wordExists;
    }

    async placeWord(word: string, coord: Vec2, direction: string, isCalledThoughtChat: boolean): Promise<void> {
        word = this.verifyService.normalizeWord(word);
        const promise = new Promise<void>((resolve, reject) => {
            try {
                this.lettersUsedOnBoard = this.verifyService.validatePlaceFeasibility(word, coord, direction);
            } catch (error) {
                if (!isCalledThoughtChat) {
                    this.placeSelectionService.cancelPlacement();
                    this.selectionManagerService.getSelectionType(SelectionType.Rack);
                    this.timerService.resetTimer();
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

                    tiles[y][x].text = tiles[y][x].oldText;
                    tiles[y][x].style.color = tiles[y][x].oldStyle.color;
                    tiles[y][x].style.font = tiles[y][x].oldStyle.font;
                    setTimeout(() => {
                        if (!isCalledThoughtChat) {
                            this.placeSelectionService.cancelPlacement();
                        } else {
                            this.gridService.fillGridPortion(
                                { y, x },
                                tiles[y][x].text,
                                tiles[y][x].style.color as string,
                                tiles[y][x].style.font as string,
                            );
                        }
                        this.selectionManagerService.getSelectionType(SelectionType.Rack);
                        this.timerService.resetTimer();
                    }, placementDuration);
                }

                reject(new ImpossibleCommand(wordValidationParameters.errorMessage));
            } else {
                this.gameService.players[this.gameService.currentTurn].points += this.pointsCountingService.processWordPoints(
                    word,
                    coord,
                    direction,
                    this.lettersUsedOnBoard,
                );
                this.updateTilesLetters(word, coord, direction);
                this.placeSelectionService.selectedTilesForPlacement = [];
                this.placeSelectionService.wordToVerify = [];
                this.gridService.border.squareBorderColor = 'black';
                this.writeWord(word, coord, direction, isCalledThoughtChat);
                this.gridService.removeArrow(this.placeSelectionService.selectedCoord);
                this.placeSelectionService.selectedCoord = { x: -1, y: -1 };
                while (this.placeSelectionService.selectedRackIndexesForPlacement.length > 0) {
                    this.placeSelectionService.cancelUniqueSelectionFromRack();
                }
                this.selectionManagerService.getSelectionType(SelectionType.Rack);

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
            tiles[y][x].letter = word[i].toLowerCase();
            tiles[y][x].bonus = 'x';
        }
    }

    writeWord(word: string, coord: Vec2, direction: string, isCalledThoughtChat: boolean) {
        for (let i = 0; i < word.length; i++) {
            const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
            this.gridService.writeLetter(word[i], computingCoord, isCalledThoughtChat);
        }
    }
}
