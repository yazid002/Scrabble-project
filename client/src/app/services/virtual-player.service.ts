/* eslint-disable @typescript-eslint/prefer-for-of */
import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { Vec2 } from '@app/classes/vec2';
import { RACK_SIZE } from '@app/constants/rack-constants';
import { Subscription } from 'rxjs';
import { ExchangeService } from './exchange.service';
import { COMPUTER, GameService } from './game.service';
import { PlaceService } from './place.service';
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
            const oneOfTenProbability = 100; // TODO should be 10, but peut to 100 to easely test place
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

        for (let i = 0; i < this.gameService.players[COMPUTER].rack.length; i++) {
            numbs.push(i);
        }

        if (numberOfLetters <= this.gameService.players[COMPUTER].rack.length) {
            for (let i = 0; i < numberOfLetters; i++) {
                numb = Math.floor(Math.random() * numbs.length);
                numbersPicked.push(numbs[numb]);
                numbs.splice(numb, 1);
            }
            for (let i = 0; i < numberOfLetters; i++) {
                lettersToChange.push(this.gameService.players[COMPUTER].rack[numbersPicked[i]].name);
            }
        }
        return lettersToChange;
    }
    private exchange() {
        const numberToChange = Math.floor(Math.random() * RACK_SIZE + 1);
        const lettersToChange = this.selectRandomLetterFromRack(numberToChange);
        this.exchangeService.exchangeLetters(lettersToChange);
    }
    private place() {
        console.log('virtual player place');

        this.makePossibilities();
    }
    private makePossibilities() {
        const gridCombos = this.getLetterCombosFromGrid();
        const possibilities: WordNCoord[] = [];
        const rackCombos: string[] = this.makeRackCombos();
        // console.log('grid', gridCombos);
        // console.log('rackCombos', rackCombos);
        // Add 1 or more letters from the rack to the begining and end of every grid 'chuncks'
        for (const rackCombo of rackCombos) {
            for (const gridCombo of gridCombos) {
                let lin = 0;
                let col = 0;
                if (gridCombo.direction === 'vertical') {
                    lin = gridCombo.coord.y - rackCombo.length;
                    col = gridCombo.coord.x;
                } else {
                    lin = gridCombo.coord.y;
                    col = gridCombo.coord.x - rackCombo.length;
                }
                const word: WordNCoord = { word: `${rackCombo}${gridCombo.word}`, coord: { x: col, y: lin }, direction: gridCombo.direction };
                word.word = word.word.toLowerCase();
                let valid = false;
                if (this.verifyService.isWordInDictionary(word.word)) {
                    console.log(word);
                    try {
                        valid = this.placeService.placeWordInstant(word.word, word.coord, word.direction);

                        if (valid) {
                            possibilities.push(word);

                            console.log('possibilities', possibilities);
                            return;
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }
    }
    private makeRackCombos(): string[] {
        const combos: string[] = [];
        const computerRack: string[] = [];
        for (const rackLetter of this.gameService.players[COMPUTER].rack) {
            computerRack.push(rackLetter.name);
        }
        // console.log('rack', computerRack);
        const numPossibilites = Math.pow(2, computerRack.length);
        for (let counter = 1; counter < numPossibilites; counter++) {
            let temp = '';
            let tempCounter = counter;
            for (let index = computerRack.length - 1; index >= 0; index--) {
                if (tempCounter >= Math.pow(2, index)) {
                    temp += computerRack[index];
                    tempCounter -= Math.pow(2, index);
                }
            }
            combos.push(temp);
        }

        return combos;
    }
    private getLetterCombosFromGrid(): WordNCoord[] {
        /**
         * Get all letters on grid that are touching. They will be considered as a chunk later since we can't shuffle them
         */
        // console.log(tiles);
        const EMPTY = '';
        let tempWord = EMPTY;
        let x = 0;
        let y = 0;
        const possibilities: WordNCoord[] = [];
        // get all horizontal possibilities
        for (let line = 0; line < tiles.length; line++) {
            for (let col = 0; col < tiles[line].length; col++) {
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                if (tiles[line][col].letter !== EMPTY) {
                    if (tempWord === EMPTY) {
                        x = col;
                        y = line;
                    }
                    tempWord += tiles[line][col].letter;
                } else {
                    if (tempWord !== EMPTY) {
                        const temp: WordNCoord = { word: tempWord, coord: { y, x }, direction: 'horizontal' };
                        // console.log('letter do add', temp);
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
                        console.log('letter do add', temp);
                        possibilities.push(temp);
                    }
                    tempWord = EMPTY;
                }
            }
        }

        // console.log(possibilities);
        return possibilities;
    }
}
