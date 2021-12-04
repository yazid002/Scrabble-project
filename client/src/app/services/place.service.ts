import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { Case } from '@app/classes/case';
import { IChat, SENDER } from '@app/classes/chat';
import { Vec2 } from '@app/classes/vec2';
import { SelectionType } from '@app/enums/selection-enum';
import { VerifyService } from '@app/services/verify.service';
import { GameService } from './game.service';
import { GoalsManagerService } from './goals-manager.service';
import { GridService } from './grid.service';
import { PlaceSelectionService } from './place-selection.service';
import { PointsCountingService } from './points-counting.service';
import { RackService } from './rack.service';
import { SelectionManagerService } from './selection-manager.service';
import { SoundManagerService } from './sound-manager.service';
import { TimerService } from './timer.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceService {
    lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];
    tiles: Case[][];
    constructor(
        private rackService: RackService,
        private verifyService: VerifyService,
        private gridService: GridService,
        private pointsCountingService: PointsCountingService,
        private timerService: TimerService,
        private gameService: GameService,
        private placeSelectionService: PlaceSelectionService,
        private selectionManagerService: SelectionManagerService,
        private goalManagerService: GoalsManagerService,
        private soundManagerService: SoundManagerService,
    ) {
        this.tiles = tiles;
    }
    async placeWordInstant(word: string, coord: Vec2, direction: string): Promise<boolean> {
        word = this.verifyService.normalizeWord(word);
        const isPlacementFeasible = this.verifyService.validatePlaceFeasibility(word, coord, direction);
        if (isPlacementFeasible.error) {
            return !isPlacementFeasible.error;
        }
        this.writeWord(word, coord, direction);
        const wordValidationParameters = await this.verifyService.checkAllWordsExist(word, coord);
        if (!wordValidationParameters.wordExists) {
            this.restoreGrid(word, direction, coord, true, true);
        } else {
            this.restoreAfterPlacement(word, direction, coord, true);
            this.timerService.resetTimer();
        }
        return wordValidationParameters.wordExists;
    }

    async placeWord(word: string, coord: Vec2, direction: string, isCalledThoughtChat: boolean): Promise<{ error: boolean; message: IChat }> {
        word = this.verifyService.normalizeWord(word);
        const result: IChat = { from: SENDER.computer, body: '' };
        const response = { error: false, message: result };

        const promise = new Promise<{ error: boolean; message: IChat }>((resolve, reject) => {
            const isPlacementFeasible = this.verifyService.validatePlaceFeasibility(word, coord, direction);
            if (isPlacementFeasible.error) {
                if (!isCalledThoughtChat) {
                    this.placeSelectionService.cancelPlacement();
                    this.selectionManagerService.updateSelectionType(SelectionType.Rack);
                    this.soundManagerService.playNonValidPlacementAudio();
                }
                this.timerService.resetTurnCounter.next(true);
                this.timerService.resetTimer();
                reject(isPlacementFeasible);
            } else {
                this.lettersUsedOnBoard = this.verifyService.lettersUsedOnBoard;

                if (isCalledThoughtChat) {
                    this.writeWord(word, coord, direction);
                }

                this.verifyService.checkAllWordsExist(word, coord).then((wordValidationParameters) => {
                    if (!wordValidationParameters.wordExists) {
                        this.restoreGrid(word, direction, coord, false, isCalledThoughtChat);
                        localStorage.setItem('bonusGrid', JSON.stringify(tiles));
                        this.timerService.resetTurnCounter.next(true);
                        response.error = true;
                        response.message.body = 'Commande impossible à réaliser : ' + wordValidationParameters.errorMessage;
                        reject(response);
                        this.soundManagerService.playNonValidPlacementAudio();
                    } else {
                        this.restoreAfterPlacement(word, direction, coord, false);
                        resolve(response);
                        this.timerService.resetTimer();
                        this.soundManagerService.playPlacementAudio();
                    }
                });
            }
        });

        return promise;
    }
    updateTilesLetters(word: string, coord: Vec2, direction: string): void {
        for (let i = 0; i < word.length; i++) {
            const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
            const x = computingCoord.x;
            const y = computingCoord.y;
            if (this.tiles[y][x].letter === '') {
                this.tiles[y][x].letter = word[i];
            }
            this.tiles[y][x].bonus = 'x';
        }
    }

    writeWord(word: string, coord: Vec2, direction: string) {
        for (let i = 0; i < word.length; i++) {
            const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
            this.gridService.writeLetter(word[i], computingCoord);
        }
    }

    private restoreAfterPlacement(word: string, direction: string, coord: Vec2, instant: boolean): void {
        this.goalManagerService.setWordsFormedNumber(this.gameService.players[this.gameService.currentTurn], [...this.verifyService.formedWords]);

        if (!instant) {
            this.gameService.players[this.gameService.currentTurn].points += this.pointsCountingService.processWordPoints(
                word,
                coord,
                direction,
                this.lettersUsedOnBoard,
            );
            this.goalManagerService.applyAllGoalsBonus(this.verifyService.formedWords, this.gameService.players[this.gameService.currentTurn]);
            this.gridService.border.squareBorderColor = 'black';
            this.writeWord(word, coord, direction);
            this.gridService.removeArrow(this.placeSelectionService.selectedCoord);
            this.placeSelectionService.selectedCoord = { x: -1, y: -1 };

            this.placeSelectionService.selectedTilesForPlacement = [];
            this.placeSelectionService.wordToVerify = [];
            while (this.placeSelectionService.selectedRackIndexesForPlacement.length > 0) {
                this.placeSelectionService.cancelUniqueSelectionFromRack();
            }

            this.selectionManagerService.updateSelectionType(SelectionType.Rack);
        }
        this.updateTilesLetters(word, coord, direction);
        this.rackService.replaceWord(word);
    }

    private restoreGrid(word: string, direction: string, coord: Vec2, instant: boolean, isCalledThoughtChat: boolean): void {
        for (let i = 0; i < word.length; i++) {
            const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
            const x = computingCoord.x;
            const y = computingCoord.y;

            this.tiles[y][x].text = this.tiles[y][x].oldText;
            this.tiles[y][x].style.color = this.tiles[y][x].oldStyle.color;
            this.tiles[y][x].style.font = this.tiles[y][x].oldStyle.font;

            if (instant) {
                this.gridService.fillGridPortion(
                    { y, x },
                    this.tiles[y][x].text,
                    this.tiles[y][x].style.color as string,
                    this.tiles[y][x].style.font as string,
                );
            } else {
                const placementDuration = 3000; // 3000 millisecondes soit 3s;
                setTimeout(() => {
                    if (!isCalledThoughtChat) {
                        this.placeSelectionService.cancelPlacement();
                    } else {
                        this.gridService.fillGridPortion(
                            { y, x },
                            this.tiles[y][x].text,
                            this.tiles[y][x].style.color as string,
                            this.tiles[y][x].style.font as string,
                        );
                    }
                    this.selectionManagerService.updateSelectionType(SelectionType.Rack);
                    this.timerService.resetTimer();
                }, placementDuration);
            }
        }
    }
}
