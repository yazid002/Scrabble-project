import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { IChat, SENDER } from '@app/classes/chat';
import { Goal } from '@app/classes/goal';
import { Vec2 } from '@app/classes/vec2';
import { SelectionType } from '@app/enums/selection-enum';
import { VerifyService } from '@app/services/verify.service';
import { GameService } from './game.service';
import { GoalService } from './goal.service';
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
        private goalService: GoalService,
    ) {}
    placeWordInstant(word: string, coord: Vec2, direction: string): boolean {
        word = this.verifyService.normalizeWord(word);
        const isPlacementFeasible = this.verifyService.validatePlaceFeasibility(word, coord, direction);
        if (isPlacementFeasible.error) {
            return !isPlacementFeasible.error;
        }
        this.lettersUsedOnBoard = this.verifyService.lettersUsedOnBoard;
        this.writeWord(word, coord, direction);
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
            this.gameService.players[this.gameService.currentTurn].turnWithoutSkipAndExchangeCounter = 0;
        } else {
            this.updateTilesLetters(word, coord, direction);

            this.gameService.players[this.gameService.currentTurn].points += this.pointsCountingService.processWordPoints(
                word,
                coord,
                direction,
                this.lettersUsedOnBoard,
            );
            this.gameService.players[this.gameService.currentTurn].turnWithoutSkipAndExchangeCounter += 1;
            this.applyPrivateGoalsBonus(this.verifyService.formedWords);
            this.applyPublicGoalsBonus(this.verifyService.formedWords);
            this.rackService.replaceWord(word);
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
                }
                this.timerService.resetTimer();
                reject(isPlacementFeasible);
            } else {
                this.lettersUsedOnBoard = this.verifyService.lettersUsedOnBoard;

                if (isCalledThoughtChat) {
                    this.writeWord(word, coord, direction);
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
                            this.selectionManagerService.updateSelectionType(SelectionType.Rack);
                            this.timerService.resetTimer();
                        }, placementDuration);

                        localStorage.setItem('bonusGrid', JSON.stringify(tiles));
                    }
                    this.gameService.players[this.gameService.currentTurn].turnWithoutSkipAndExchangeCounter = 0;
                    response.error = true;
                    response.message.body = 'Commande impossible à réaliser : ' + wordValidationParameters.errorMessage;
                    reject(response);
                } else {
                    this.gameService.players[this.gameService.currentTurn].points += this.pointsCountingService.processWordPoints(
                        word,
                        coord,
                        direction,
                        this.lettersUsedOnBoard,
                    );

                    console.log('Currunt', this.gameService.players[this.gameService.currentTurn]);
                    console.log(this.verifyService.formedWords);
                    this.gameService.players[this.gameService.currentTurn].words.push(...this.verifyService.formedWords);
                    console.log('words du player ', this.gameService.players[this.gameService.currentTurn].words);
                    this.gameService.players[this.gameService.currentTurn].turnWithoutSkipAndExchangeCounter += 1;
                    this.applyPrivateGoalsBonus(this.verifyService.formedWords);
                    this.applyPublicGoalsBonus(this.verifyService.formedWords);
                    this.updateTilesLetters(word, coord, direction);

                    this.placeSelectionService.selectedTilesForPlacement = [];
                    this.placeSelectionService.wordToVerify = [];
                    this.gridService.border.squareBorderColor = 'black';

                    this.writeWord(word, coord, direction);
                    this.gridService.removeArrow(this.placeSelectionService.selectedCoord);

                    this.placeSelectionService.selectedCoord = { x: -1, y: -1 };
                    while (this.placeSelectionService.selectedRackIndexesForPlacement.length > 0) {
                        this.placeSelectionService.cancelUniqueSelectionFromRack();
                    }

                    this.selectionManagerService.updateSelectionType(SelectionType.Rack);

                    this.rackService.replaceWord(word);
                    resolve(response);
                    this.timerService.resetTimer();
                }
            }
        });
        return promise;
    }

    checkFormedWordRespectGoals(wordsFormed: string[], goal: Goal): boolean {
        console.log('goal complete ', goal.complete);
        if (goal.complete) {
            return false;
        }
        for (const word of wordsFormed) {
            const isGoalRespected = goal.command(word);
            console.log('word ', word, isGoalRespected, goal.description);
            if (isGoalRespected) {
                goal.complete = true;
                goal.completeBy = this.gameService.players[this.gameService.currentTurn];
                return true;
            }
        }
        return false;
    }

    applyPrivateGoalsBonus(wordsFormed: string[]): void {
        for (const goal of this.gameService.players[this.gameService.currentTurn].privateGoals) {
            console.log('apply bonus, ', goal.description, goal.bonus);
            const check = this.checkFormedWordRespectGoals(wordsFormed, goal);
            console.log('check ', check);
            if (check) {
                this.gameService.players[this.gameService.currentTurn].points += goal.bonus;
            }
        }
    }

    applyPublicGoalsBonus(wordsFormed: string[]): void {
        for (const goal of this.goalService.publicGoals) {
            console.log('apply bonus, ', goal.description, goal.bonus);
            const check = this.checkFormedWordRespectGoals(wordsFormed, goal);
            console.log('check ', check);
            if (check) {
                this.gameService.players[this.gameService.currentTurn].points += goal.bonus;
            }
        }
    }
    updateTilesLetters(word: string, coord: Vec2, direction: string): void {
        for (let i = 0; i < word.length; i++) {
            const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
            const x = computingCoord.x;
            const y = computingCoord.y;
            if (tiles[y][x].letter === '') {
                tiles[y][x].letter = word[i];
            }
            tiles[y][x].bonus = 'x';
        }
    }

    writeWord(word: string, coord: Vec2, direction: string) {
        for (let i = 0; i < word.length; i++) {
            const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
            this.gridService.writeLetter(word[i], computingCoord);
        }
    }
}
