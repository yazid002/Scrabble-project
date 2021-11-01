/* eslint-disable @typescript-eslint/prefer-for-of */
import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { Vec2 } from '@app/classes/vec2';
import { RACK_SIZE } from '@app/constants/rack-constants';
import { Subscription } from 'rxjs';
import { ExchangeService } from './exchange.service';
import { GameService } from './game.service';
import { PlaceService } from './place.service';
import { PointsCountingService } from './points-counting.service';
import { TimerService } from './timer.service';
import { VerifyService } from './verify.service';
import { PLAYER } from '@app/classes/player';

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
    ) {
        this.alreadyInitialized = false;
        this.initialize();
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
        const TURN_TIME = 3000;
        let skipped = false;
        setTimeout(() => {
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
        }, TURN_TIME);
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
        this.makePossibilities();
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
        try {
            const lettersUsedOnBoard = this.verifyService.validatePlaceFeasibility(word.word, word.coord, word.direction);

            const points = this.pointsCountingService.processWordPoints(word.word, word.coord, word.direction, lettersUsedOnBoard);
            if (points <= pointRange.max && points >= pointRange.min) return true;
        } catch {
            return false;
        }

        return false;
    }
    private bindGridAndRack(rackCombo: string, gridCombo: WordNCoord): WordNCoord[] {
        const combos: WordNCoord[] = [];
        for (let index = 0; index <= rackCombo.length; index++) {
            const before = rackCombo.slice(0, index);
            const after = rackCombo.slice(index, rackCombo.length + 1);
            const word = before + gridCombo.word + after;
            let x = gridCombo.coord.x;
            let y = gridCombo.coord.y;
            if (gridCombo.direction === 'horizontal') {
                x -= index;
            } else {
                y -= index;
            }
            combos.push({ word, coord: { y, x }, direction: gridCombo.direction });
        }
        return combos;
    }
    private tryPossibility(
        rackCombo: string,
        possibilities: WordNCoord[],
        pointRange: { min: number; max: number },
        gridCombo?: WordNCoord,
    ): WordNCoord[] {
        const lin = 7;
        const col = 7;
        const word: WordNCoord = { word: rackCombo, coord: { x: col, y: lin }, direction: 'horizontal' };
        if (gridCombo) {
            word.coord.y = gridCombo.coord.y;
            word.coord.x = gridCombo.coord.x;

            word.word = gridCombo.word;
            word.direction = gridCombo.direction;
        }
        word.word = word.word.toLowerCase();
        let valid = false;
        const hasRightPoints = this.validateWordPoints(word, pointRange);
        if (hasRightPoints) {
            const isWordInDictionary = this.verifyService.isWordInDictionary(word.word);
            if (isWordInDictionary) {
                if (possibilities.length === 0) {
                    try {
                        valid = this.placeService.placeWordInstant(word.word, word.coord, word.direction, true);

                        if (valid) {
                            return [word];
                        }
                        return [];
                    } catch {
                        return [];
                    }
                }
                return [word];
            }
        }
        return [];
    }
    private makePossibilities() {
        const gridCombos = this.getLetterCombosFromGrid();
        let possibilities: WordNCoord[] = [];
        const rackCombos: string[] = this.makeRackCombos();
        const pointRange = this.decidePoints();
        for (const rackCombo of rackCombos) {
            if (this.verifyService.isFirstMove()) {
                const newPossibilities = possibilities.concat(this.tryPossibility(rackCombo, possibilities, pointRange));
                if (newPossibilities.length > 0) {
                    possibilities = possibilities.concat(newPossibilities);
                }
                if (possibilities.length >= 3) return;
            }
            for (const gridCombo of gridCombos) {
                const wordCombos = this.bindGridAndRack(rackCombo, gridCombo);
                for (const wordCombo of wordCombos) {
                    const newPossibilities = possibilities.concat(this.tryPossibility(rackCombo, possibilities, pointRange, wordCombo));
                    if (newPossibilities.length > 0) {
                        possibilities = possibilities.concat(newPossibilities);
                    }
                    if (possibilities.length >= 3) return;
                }
            }
        }
    }
    private makeRackCombos(): string[] {
        let computerRack = '';
        for (const rackLetter of this.gameService.players[PLAYER.otherPlayer].rack) {
            computerRack += rackLetter.name;
        }
        const anagrams = this.generateAnagrams(computerRack);

        return anagrams;
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
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
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

        // get all vertival possibilitier
        for (let col = 0; col < tiles[0].length; col++) {
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
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
    // http://jsfiddle.net/jtodd/U5dcL/
    private generateAnagrams(word: string): string[] {
        if (word.length < 2) {
            return [word];
        } else {
            const anagrams = [];
            let before;
            let focus;
            let after;
            let shortWord;
            let subAnagrams;
            let newEntry;
            for (let i = 0; i < word.length; i++) {
                before = word.slice(0, i);
                focus = word[i];
                after = word.slice(i + 1, word.length + 1);
                shortWord = before + after;
                subAnagrams = this.generateAnagrams(shortWord);
                if (focus) {
                    anagrams.push(focus);
                }
                for (const j of subAnagrams) {
                    newEntry = focus + j;
                    anagrams.push(newEntry);
                }
            }
            return [...new Set(anagrams)];
        }
    }
}
