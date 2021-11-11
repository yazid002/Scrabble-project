import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { IChat, SENDER } from '@app/classes/chat';
import { generateAnagrams } from '@app/classes/chunk-node';
import { PLAYER } from '@app/classes/player';
import { Vec2 } from '@app/classes/vec2';
import { RACK_SIZE } from '@app/constants/rack-constants';
import { Subscription } from 'rxjs';
import { ChatService } from './chat.service';
import { DebugExecutionService } from './command-execution/debug-execution.service';
import { ExchangeService } from './exchange.service';
import { GameService } from './game.service';
import { PlaceService } from './place.service';
import { PointsCountingService } from './points-counting.service';
import { TimerService } from './timer.service';
import { VerifyService } from './verify.service';

type Direction = 'horizontal' | 'vertical';
interface WordNCoord {
    word: string;
    coord: Vec2;
    direction: Direction;
}

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerService {
    virtualPlayerSignal: Subscription;
    private alreadyInitialized: boolean;
    constructor(
        private gameService: GameService,
        private exchangeService: ExchangeService,
        private placeService: PlaceService,
        private verifyService: VerifyService,
        private timerService: TimerService,
        private pointsCountingService: PointsCountingService,
        private debugExecutionService: DebugExecutionService,
        private chatService: ChatService,
    ) {
        this.alreadyInitialized = false;
        this.initialize();
        const time = 0;
        const wordToTest = 'laqxtci';
        console.log('starting');
        const anagrams = generateAnagrams(wordToTest.split(''), 'la');
        console.log(anagrams);
        console.log('time', time);
    }

    initialize() {
        if (this.alreadyInitialized) return;
        this.alreadyInitialized = true;
        this.virtualPlayerSignal = this.gameService.otherPlayerSignal.subscribe((numPlayers: string) => {
            if (numPlayers !== 'solo') return;
            this.play();
        });
    }
    private play() {
        let skipped = false;

        const oneOfTenProbability = 10;
        const randomNumber = Math.floor(oneOfTenProbability * Math.random());
        if (randomNumber === 0) {
            skipped = true;
        } else if (randomNumber === 1) {
            this.exchange();
        } else {
            this.place();
        }
        this.timerService.resetTimer(skipped);
    }

    private selectRandomLetterFromRack(numberOfLetters: number): string[] {
        const lettersToChange: string[] = [];
        const numbersPicked: number[] = [];
        const numbs: number[] = [];
        let numb = 0;

        for (let i = 0; i < this.gameService.players[PLAYER.otherPlayer].rack.length; i++) {
            numbs.push(i);
        }

        if (numberOfLetters <= this.gameService.players[PLAYER.otherPlayer].rack.length) {
            for (let i = 0; i < numberOfLetters; i++) {
                numb = Math.floor(Math.random() * numbs.length);
                numbersPicked.push(numbs[numb]);
                numbs.splice(numb, 1);
            }
            for (let i = 0; i < numberOfLetters; i++) {
                lettersToChange.push(this.gameService.players[PLAYER.otherPlayer].rack[numbersPicked[i]].name);
            }
        }
        return lettersToChange;
    }
    private exchange() {
        const numberToChange = Math.floor(Math.random() * RACK_SIZE + 1);
        const lettersToChange = this.selectRandomLetterFromRack(numberToChange);
        this.exchangeService.exchangeLetters(lettersToChange, true);
    }
    private place() {
        const possibilities = this.makePossibilities();
        if (this.debugExecutionService.state) {
            const message: IChat = { from: SENDER.computer, body: "L'ordinateur aurait pu placer: " };
            for (const possibility of possibilities) {
                message.body += '<br>' + possibility.word;
            }
            this.chatService.addMessage(message);
        }
    }
    private decidePoints(): { min: number; max: number } {
        const pointMap: Map<number, { min: number; max: number }> = new Map();
        let i = 0;
        const SMALL_WORD_PROPORTION = 4;
        const MEDIUM_WORD_PROPORTION = 3;
        const BIG_WORD_PROPORTION = 3;

        for (i; i < SMALL_WORD_PROPORTION; i++) {
            pointMap.set(i, { min: 0, max: 6 });
        }
        for (i; i < SMALL_WORD_PROPORTION + MEDIUM_WORD_PROPORTION; i++) {
            pointMap.set(i, { min: 7, max: 12 });
        }
        for (i; i < SMALL_WORD_PROPORTION + MEDIUM_WORD_PROPORTION + BIG_WORD_PROPORTION; i++) {
            pointMap.set(i, { min: 13, max: 18 });
        }
        const randomNumber = Math.floor((SMALL_WORD_PROPORTION + MEDIUM_WORD_PROPORTION + BIG_WORD_PROPORTION) * Math.random());
        return pointMap.get(randomNumber) as { min: number; max: number };
    }
    private validateWordPoints(word: WordNCoord, pointRange: { min: number; max: number }): boolean {
        const isPlacementFeasible = this.verifyService.validatePlaceFeasibility(word.word, word.coord, word.direction);
        if (isPlacementFeasible.error) {
            return false;
        }
        const lettersUsedOnBoard = this.verifyService.lettersUsedOnBoard;
        const points = this.pointsCountingService.processWordPoints(word.word, word.coord, word.direction, lettersUsedOnBoard);
        if (points <= pointRange.max && points >= pointRange.min) return true;

        return false;
    }
    private tryPossibility(possibilities: WordNCoord[], pointRange: { min: number; max: number }, gridCombo: WordNCoord): WordNCoord[] {
        gridCombo.word = gridCombo.word.toLowerCase();
        let valid = false;
        const hasRightPoints = this.validateWordPoints(gridCombo, pointRange);
        if (hasRightPoints) {
            const isWordInDictionary = this.verifyService.isWordInDictionary(gridCombo.word);
            if (isWordInDictionary) {
                if (possibilities.length === 0) {
                    try {
                        valid = this.placeService.placeWordInstant(gridCombo.word, gridCombo.coord, gridCombo.direction);

                        if (valid) {
                            return [gridCombo];
                        }
                        return [];
                    } catch {
                        return [];
                    }
                }
                return [gridCombo];
            }
        }
        return [];
    }
    private makePossibilities(): WordNCoord[] {
        const rack = this.gameService.players[PLAYER.otherPlayer].rack.map((rackLetter) => rackLetter.name.toLowerCase());
        const gridCombos = this.getLetterCombosFromGrid();

        let possibilities: WordNCoord[] = [];
        const pointRange = this.decidePoints();
        if (this.verifyService.isFirstMove()) {
            const gridWord: WordNCoord = { coord: { x: 7, y: 7 }, direction: 'horizontal', word: '' };
            const anagrams = generateAnagrams(rack, '');
            for (const anagram of anagrams) {
                gridWord.word = anagram;
                const newPossibilities = possibilities.concat(this.tryPossibility(possibilities, pointRange, gridWord));
                if (newPossibilities.length > 0) {
                    possibilities = possibilities.concat(newPossibilities);
                }
                if (possibilities.length >= 3) return possibilities;
            }
        }

        const wordCoordNAnagrams: Map<WordNCoord, string[]> = new Map([]);
        gridCombos.forEach((gridCombo) => {
            const anagrams = generateAnagrams(rack, gridCombo.word);
            wordCoordNAnagrams.set(gridCombo, anagrams);
        });
        for (const [gridCombo, anagrams] of wordCoordNAnagrams.entries())
            for (const anagram of anagrams) {
                // const wordCombos = this.bindGridAndRack(anagram, gridPattern);
                const possibility = this.findWordPosition(anagram, gridCombo);
                const newPossibilities = possibilities.concat(this.tryPossibility(possibilities, pointRange, possibility));
                if (newPossibilities.length > 0) {
                    possibilities = possibilities.concat(newPossibilities);
                }
                if (possibilities.length >= 3) return possibilities;
            }
        return possibilities;
    }
    private findWordPosition(word: string, gridCombo: WordNCoord): WordNCoord {
        const index = word.indexOf(gridCombo.word);
        const result: WordNCoord = { coord: { x: gridCombo.coord.x, y: gridCombo.coord.y }, direction: gridCombo.direction, word };
        if (result.direction === 'horizontal') result.coord.x -= index;
        else result.coord.y -= index;
        return result;
    }
    private getLetterCombosFromGrid(): WordNCoord[] {
        /**
         * Get all letters on grid that are touching. They will be considered as a chunk later since we can't shuffle them
         */
        const EMPTY = '';
        let tempWord = EMPTY;
        let x = 0;
        let y = 0;
        const possibilities: WordNCoord[] = [];
        // get all horizontal possibilities
        for (let line = 0; line < tiles.length; line++) {
            for (let col = 0; col < tiles[line].length; col++) {
                if (tiles[line][col].letter !== EMPTY) {
                    if (tempWord === EMPTY) {
                        x = col;
                        y = line;
                    }
                    tempWord += tiles[line][col].letter;
                } else {
                    if (tempWord !== EMPTY) {
                        const temp: WordNCoord = { word: tempWord, coord: { y, x }, direction: 'horizontal' };
                        possibilities.push(temp);
                    }
                    tempWord = EMPTY;
                }
            }
        }

        // get all vertival possibilities
        for (let col = 0; col < tiles[0].length; col++) {
            for (let line = 0; line < tiles.length; line++) {
                if (tiles[line][col].letter !== EMPTY) {
                    if (tempWord === EMPTY) {
                        x = col;
                        y = line;
                    }
                    tempWord += tiles[line][col].letter;
                } else {
                    if (tempWord !== EMPTY) {
                        const temp: WordNCoord = { word: tempWord, coord: { y, x }, direction: 'vertical' };
                        possibilities.push(temp);
                    }
                    tempWord = EMPTY;
                }
            }
        }

        return possibilities;
    }
}
