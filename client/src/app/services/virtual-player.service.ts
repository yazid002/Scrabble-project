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
    points?: number;
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
        const oneOfTenProbability = 10;
        const randomNumber = Math.floor(oneOfTenProbability * Math.random());
        let message: IChat;
        if (randomNumber === 0) {
            message = { from: SENDER.computer, body: "L'ordi a passé son tour" };
            const skipTime = 20;

            this.timerService.resetTimerDelay(skipTime);
        } else if (randomNumber === 1) {
            message = this.exchange();
        } else {
            message = this.place();
        }
        if (this.debugExecutionService.state) {
            this.chatService.addMessage(message);
        }
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
    private exchange(): IChat {
        const rackInit = this.gameService.players[PLAYER.otherPlayer].rack.reduce(
            (accumulator, currentValue) => (accumulator += currentValue.display),
            '',
        );
        const numberToChange = Math.floor(Math.random() * RACK_SIZE + 1);
        const lettersToChange = this.selectRandomLetterFromRack(numberToChange);
        this.exchangeService.exchangeLetters(lettersToChange, true);

        const rackEnd = this.gameService.players[PLAYER.otherPlayer].rack.reduce(
            (accumulator, currentValue) => (accumulator += currentValue.display),
            '',
        );

        const message: IChat = { from: SENDER.computer, body: "L'ordi échange. Son rack était de " + rackInit + ' et est maintenant de ' + rackEnd };
        return message;
    }
    private place(): IChat {
        const rack = this.gameService.players[PLAYER.otherPlayer].rack.reduce(
            (accumulator, currentValue) => (accumulator += currentValue.display),
            '',
        );
        const possibilities = this.makePossibilities();
        const pointRange = this.decidePoints();
        let rightPoints: WordNCoord[] = [];
        let sucess = false;
        do {
            rightPoints = possibilities.filter((possibility) => {
                if (possibility.points) {
                    if (possibility.points < pointRange.max && possibility.points >= pointRange.min) {
                        return true;
                    }
                }
                return false;
            });
            if (!sucess) {
                for (const possibility of rightPoints) {
                    if (this.tryPossibility(possibility)) {
                        this.gameService.players[PLAYER.otherPlayer].points += possibility.points ? possibility.points : 0;
                        sucess = true;
                        break;
                    }
                }
            }
            pointRange.min--;
            pointRange.max++;
        } while (pointRange.min && (rightPoints.length < 3 || !sucess));

        const message: IChat = { from: SENDER.computer, body: 'rack de lordi: ' + rack + "<br>L'ordinateur aurait pu placer: " };
        for (let i = 0; i < Math.min(3, rightPoints.length); i++) {
            message.body +=
                '<br>' + rightPoints[i].word + ': ' + rightPoints[i].points + ' points x=' + rightPoints[i].coord.x + ', y=' + rightPoints[i].coord.y;
        }
        if (!sucess) {
            message.body = "L'ordi n'a rien pu placer. Elle échange donc à la place<br>";
            message.body += this.exchange().body;
        }
        return message;
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
    private tryPossibility(gridCombo: WordNCoord): boolean {
        gridCombo.word = gridCombo.word.toLowerCase();
        let valid = false;

        try {
            valid = this.placeService.placeWordInstant(gridCombo.word, gridCombo.coord, gridCombo.direction);

            if (valid) {
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }
    private makePossibilities(): WordNCoord[] {
        const rack = this.gameService.players[PLAYER.otherPlayer].rack.map((rackLetter) => rackLetter.name.toLowerCase());
        const gridCombos = this.getLetterCombosFromGrid();

        const possibilities: WordNCoord[] = [];
        if (this.verifyService.isFirstMove()) {
            const anagrams = generateAnagrams(rack, '');
            for (const anagram of anagrams) {
                const gridWord: WordNCoord = { coord: { x: 7, y: 7 }, direction: 'horizontal', word: '' };
                gridWord.word = anagram;
                const lettersUsedOnBoard = this.verifyService.lettersUsedOnBoard;
                gridWord.points = this.pointsCountingService.processWordPoints(gridWord.word, gridWord.coord, gridWord.direction, lettersUsedOnBoard);
                possibilities.push(gridWord);
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
                const gridWord = this.findWordPosition(anagram, gridCombo);
                gridWord.word = anagram;
                const lettersUsedOnBoard = this.verifyService.lettersUsedOnBoard;
                gridWord.points = this.pointsCountingService.processWordPoints(gridWord.word, gridWord.coord, gridWord.direction, lettersUsedOnBoard);
                possibilities.push(gridWord);
            }

        let possibilityArray = [...new Set(possibilities)];
        possibilityArray = possibilityArray.filter((item, index) => {
            return possibilityArray.indexOf(item) === index;
        });
        return possibilityArray;
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
