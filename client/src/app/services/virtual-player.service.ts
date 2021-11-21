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
import { UserSettingsService } from './user-settings.service';
import { VerifyService } from './verify.service';

type Direction = 'h' | 'v';
interface WordNCoord {
    word: string;
    coord: Vec2;
    direction: Direction;
    points: number;
}
type SortFct = (possibilities: WordNCoord[]) => WordNCoord[];
type VoidFct = (service: VirtualPlayerService) => void;
type NumberFct = () => number;
const MAX_RACK_SIZE = 7;

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerService {
    virtualPlayerSignal: Subscription;
    computerLevel: string;
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
        private userSettingsService: UserSettingsService,
    ) {
        this.alreadyInitialized = false;
        this.initialize();
    }
    initialize() {
        if (this.alreadyInitialized) return;
        this.alreadyInitialized = true;
        this.virtualPlayerSignal = this.gameService.otherPlayerSignal.subscribe((numPlayers: string) => this.reactToSignal(numPlayers));
        this.computerLevel = this.userSettingsService.settings.computerLevel.currentChoiceKey;
    }
    private reactToSignal(numPlayers: string) {
        if (numPlayers !== 'solo') return;
        this.play();
    }
    private play() {
        const playAlgos: Map<string, VoidFct> = new Map([
            ['beginner', this.beginnerPlay as VoidFct],
            ['advanced', this.advancedPlay as VoidFct],
        ]);
        const fctToExecute = playAlgos.get(this.computerLevel) as VoidFct;
        fctToExecute(this);
    }
    private async advancedPlay(service: VirtualPlayerService): Promise<void> {
        const message = await service.place();
        service.addOutputToMessages(message);
    }
    private async beginnerPlay(service: VirtualPlayerService): Promise<void> {
        const oneOfTenProbability = 10;
        const randomNumber = Math.floor(oneOfTenProbability * Math.random());
        let message: IChat;
        if (randomNumber === 0) {
            message = { from: SENDER.computer, body: "L'ordi a passé son tour" };
            const skipTime = 1;
            service.sendSkipMessage();
            service.timerService.resetTimerDelay(skipTime);
        } else if (randomNumber === 1) {
            message = service.exchange();
        } else {
            message = await service.place();
        }
        service.addOutputToMessages(message);
    }
    private addOutputToMessages(message: IChat) {
        if (this.debugExecutionService.state) {
            this.chatService.addMessage(message);
        }
    }
    private selectRandomLetterFromRack(numberOfLetters: number): string[] {
        const lettersToChange: string[] = [];
        const numbersPicked: number[] = [];
        const numbs: number[] = [];
        let numb = 0;

        numberOfLetters = Math.min(this.gameService.players[PLAYER.otherPlayer].rack.length, MAX_RACK_SIZE);
        for (let i = 0; i < this.gameService.players[PLAYER.otherPlayer].rack.length; i++) {
            numbs.push(i);
        }

        for (let i = 0; i < numberOfLetters; i++) {
            numb = Math.floor(Math.random() * numbs.length);
            numbersPicked.push(numbs[numb]);
            numbs.splice(numb, 1);
        }
        for (let i = 0; i < numberOfLetters; i++) {
            lettersToChange.push(this.gameService.players[PLAYER.otherPlayer].rack[numbersPicked[i]].name);
        }

        return lettersToChange;
    }
    private exchange(): IChat {
        const rackInit = this.gameService.players[PLAYER.otherPlayer].rack.reduce(
            (accumulator, currentValue) => (accumulator += currentValue.display),
            '',
        );

        const amoutOfLettersFcts: Map<string, NumberFct> = new Map([
            ['beginner', () => Math.floor(Math.random() * RACK_SIZE + 1)],
            ['advanced', () => MAX_RACK_SIZE],
        ]);
        const amoutOfLettersFct = amoutOfLettersFcts.get(this.computerLevel) as NumberFct;
        const amountToChange = amoutOfLettersFct();
        const lettersToChange = this.selectRandomLetterFromRack(amountToChange);
        this.exchangeService.exchangeLetters(lettersToChange, true);
        this.displayExchangeMessage(lettersToChange);
        const rackEnd = this.gameService.players[PLAYER.otherPlayer].rack.reduce(
            (accumulator, currentValue) => (accumulator += currentValue.display),
            '',
        );

        const message: IChat = {
            from: SENDER.computer,
            body: "L'ordi échange. Son rack était de " + rackInit + ' et est maintenant de ' + rackEnd + 'Il a changé ' + amountToChange + 'Lettres',
        };
        return message;
    }
    private displayExchangeMessage(letters: string[]) {
        const message: IChat = {
            from: SENDER.otherPlayer,
            body: '!echanger ' + letters.join(''),
        };
        this.displayMessage(message);
    }
    private async place(): Promise<IChat> {
        const sortTingAlgos: Map<string, SortFct> = new Map([
            ['beginner', this.sortPossibilitiesBeginner],
            ['advanced', this.sortPossibilitiesAdvanced],
        ]);
        const sortAlgo = sortTingAlgos.get(this.computerLevel) as SortFct;
        let possibilities = sortAlgo(this.makePossibilities());
        possibilities = possibilities.filter((possibility) => possibility.points > 0);
        const rightPoints: WordNCoord[] = [];
        for (const possibility of possibilities) {
            if (rightPoints.length === 0) {
                if (await this.tryPossibility(possibility)) {
                    this.gameService.players[PLAYER.otherPlayer].points += possibility.points ? possibility.points : 0;
                    this.sendPlacementMessage(possibility);
                    rightPoints.push(possibility);
                }
            } else if (rightPoints.length >= 3) break;
            else rightPoints.push(possibility);
        }
        return this.placeDebugOutput(rightPoints);
    }
    private sendSkipMessage() {
        const message: IChat = { from: SENDER.otherPlayer, body: '!passer' };
        this.displayMessage(message);
    }
    private sendPlacementMessage(combination: WordNCoord) {
        const message: IChat = { from: SENDER.otherPlayer, body: '!placer ' };
        const ASCII_A = 96;
        const line = String.fromCharCode(combination.coord.x + ASCII_A + 1);
        const column = combination.coord.y + 1;
        message.body += line + column + combination.direction + ' ' + combination.word;
        this.displayMessage(message);
    }
    private displayMessage(message: IChat) {
        if (this.computerLevel !== 'advanced') return;
        this.chatService.addMessage(message);
    }
    private sortPossibilitiesBeginner(possibilities: WordNCoord[]) {
        // decidePoints
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
        const pointRange = pointMap.get(randomNumber) as { min: number; max: number };
        possibilities = possibilities.sort((possibilityA: WordNCoord, possibilityB: WordNCoord) => {
            const distanceA = Math.min(0, pointRange.min - possibilityA.points) + possibilityA.points - pointRange.max;
            const distanceB = Math.min(0, pointRange.min - possibilityB.points) + possibilityB.points - pointRange.max;
            return distanceA - distanceB;
        });
        return possibilities;
    }
    private sortPossibilitiesAdvanced(possibilities: WordNCoord[]) {
        possibilities = possibilities.sort((possibilityA: WordNCoord, possibilityB: WordNCoord) => {
            return possibilityB.points - possibilityA.points;
        });
        return possibilities;
    }
    private placeDebugOutput(alternativeChoices: WordNCoord[]) {
        const message: IChat = { from: SENDER.computer, body: "L'ordinateur aurait pu placer: " };
        for (let i = 0; i < Math.min(3, alternativeChoices.length); i++) {
            message.body +=
                '<br>' +
                alternativeChoices[i].word +
                ': ' +
                alternativeChoices[i].points +
                ' points x=' +
                alternativeChoices[i].coord.x +
                ', y=' +
                alternativeChoices[i].coord.y;
        }
        if (alternativeChoices.length === 0) {
            message.body = "L'ordi n'a rien pu placer. Elle échange donc à la place<br>";
            message.body += this.exchange().body;
        }
        return message;
    }
    private async tryPossibility(gridCombo: WordNCoord): Promise<boolean> {
        gridCombo.word = gridCombo.word.toLowerCase();
        let valid = false;
        try {
            valid = await this.placeService.placeWordInstant(gridCombo.word, gridCombo.coord, gridCombo.direction);

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
                const gridWord: WordNCoord = { coord: { x: 7, y: 7 }, direction: 'h', word: '', points: 0 };
                gridWord.word = anagram;
                const lettersUsedOnBoard = this.verifyService.getLettersUsedOnBoardFromPlacement(gridWord.coord, gridWord.direction, gridWord.word);
                gridWord.points = this.pointsCountingService.processWordPoints(gridWord.word, gridWord.coord, gridWord.direction, lettersUsedOnBoard);
                possibilities.push(gridWord);
            }
        } else {
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
                    const lettersUsedOnBoard = this.verifyService.getLettersUsedOnBoardFromPlacement(
                        gridWord.coord,
                        gridWord.direction,
                        gridWord.word,
                    );
                    gridWord.points = this.pointsCountingService.processWordPoints(
                        gridWord.word,
                        gridWord.coord,
                        gridWord.direction,
                        lettersUsedOnBoard,
                    );
                    possibilities.push(gridWord);
                }
        }
        let possibilityArray = [...new Set(possibilities)];
        possibilityArray = possibilityArray.filter((item, index) => {
            return possibilityArray.indexOf(item) === index;
        });
        return possibilityArray;
    }
    private findWordPosition(word: string, gridCombo: WordNCoord): WordNCoord {
        const index = word.indexOf(gridCombo.word);
        const result: WordNCoord = { coord: { x: gridCombo.coord.x, y: gridCombo.coord.y }, direction: gridCombo.direction, word, points: 0 };
        if (result.direction === 'h') result.coord.x -= index;
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
                        const temp: WordNCoord = { word: tempWord, coord: { y, x }, direction: 'h', points: 0 };
                        possibilities.push(temp);
                    }
                    tempWord = EMPTY;
                }
            }
        }
        // get all vertical possibilities
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
                        const temp: WordNCoord = { word: tempWord, coord: { y, x }, direction: 'v', points: 0 };
                        possibilities.push(temp);
                    }
                    tempWord = EMPTY;
                }
            }
        }
        return possibilities;
    }
}
