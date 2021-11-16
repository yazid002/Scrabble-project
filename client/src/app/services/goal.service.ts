import { Injectable } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';
import { Goal } from '@app/classes/goal';
import * as dictionary from 'src/assets/dictionnary.json';
import { GameService } from './game.service';
import { TimerService } from './timer.service';

@Injectable({
    providedIn: 'root',
})
export class GoalService {
    usedIndex: number[];
    goalHandler: Goal[];
    dictionary: Dictionary;
    randomWord: string;
    publicGoals: Goal[];
    constructor(private timerService: TimerService, private gameService: GameService) {
        this.dictionary = dictionary as Dictionary;
        this.usedIndex = [];
        this.randomWord = this.generateRandomWord();

        this.goalHandler = [
            {
                description: 'Vous devez placer un palindrome',
                bonus: 10,
                complete: false,
                command: (word?: string): boolean => this.isWordPalindrome(word as string),
            },
            {
                description: 'Vous devez placer un mot qui contient la lettre e',
                bonus: 10,
                complete: false,
                command: (word?: string): boolean => this.doesWordContainQwithoutU(word as string),
            },
            {
                description: 'Vous devez former un mot contenant 4 letters',
                bonus: 10,
                complete: false,
                command: (word?: string): boolean => this.isWordLengthEqualToFifteen(word as string),
            },
            // {
            //     description: 'Vous devez placer un mot contenant 3 consomme consecutive',
            //     bonus: 10,
            //     complete: false,
            //     command: (word?: string): boolean => this.doesWordContainConsecutiveConsonant(word as string),
            // },
            {
                description: 'Pour 3 tours de suite, vous devez placer en moins de 10 secondes',
                bonus: 70,
                complete: false,
                command: (): boolean => this.placeInTenSecondsGoal(),
            },
            {
                description: 'Vous devez jouer 5 tours de suite sans passer ou échanger',
                bonus: 40,
                complete: false,
                command: (): boolean => this.playFiveTimesWithoutSkipAndExchange(),
            },
            {
                description: 'Vous devez former le même mot 3 fois dans une même partie',
                bonus: 30,
                complete: false,
                command: (): boolean => this.playTheSameWordThreeTimes(),
            },
            {
                description: `Vous devez former le mot ${this.randomWord}`,
                bonus: 10,
                complete: false,
                command: (): boolean => this.playTheRandomWord(),
            },
        ];
        // this.generateUniqueIndex(0, 2);
    }

    // constructor() {}

    isWordPalindrome(word: string) {
        console.log('inside 0');
        //    // const re = /[^A-Za-z0-9]/g;
        //  word = word.toLowerCase().replace(re, '');
        const length = word.length;
        for (let i = 0; i < length / 2; i++) {
            if (word[i] !== word[length - 1 - i]) {
                return false;
            }
        }
        return true;
    }

    doesWordContainQwithoutU(word: string) {
        console.log('inside1');
        for (let i = 0; word.length; i++) {
            if (word[i].toLowerCase() === 'e') {
                console.log('inside obj');
                return true;
            }
        }

        return false;
    }

    isWordLengthEqualToFifteen(word: string) {
        console.log('inside2');
        const length = 4;
        return word.length === length;
    }

    doesWordContainConsecutiveConsonant(word: string) {
        console.log('inside3');
        const consonant: string[] = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'x', 'z'];
        const secondPosition = 2;
        const thirdPosition = 3;

        for (let i = 0; word.length; i++) {
            if (consonant.includes(word[i]) && consonant.includes(word[i + secondPosition]) && consonant.includes(word[i + thirdPosition])) {
                return true;
            }
        }
        return false;
    }
    generateNumber(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateUniqueIndex(min: number, max: number): number {
        let index = this.generateNumber(min, max);
        while (this.usedIndex.includes(index)) {
            index = this.generateNumber(min, max);
        }

        this.usedIndex.push(index);

        console.log(index);

        return index;
    }

    displayGoals(): Goal {
        const index = this.generateUniqueIndex(0, 6);
        console.log(index);
        return this.goalHandler[index];
    }

    placeInTenSecondsGoal(): boolean {
        if (this.timerService.counter.totalTimer <= 10) {
            this.gameService.players[this.gameService.currentTurn].placeInTenSecondsGoalCounter += 1;
        } else {
            this.gameService.players[this.gameService.currentTurn].placeInTenSecondsGoalCounter = 0;
        }

        if (this.gameService.players[this.gameService.currentTurn].placeInTenSecondsGoalCounter === 3) {
            this.gameService.players[this.gameService.currentTurn].placeInTenSecondsGoalCounter = 0;
            return true;
        }
        return false;
    }

    playFiveTimesWithoutSkipAndExchange(): boolean {
        console.log('counter ', this.gameService.players[this.gameService.currentTurn].turnWithoutSkipAndExchangeCounter);
        if (this.gameService.players[this.gameService.currentTurn].turnWithoutSkipAndExchangeCounter === 5) {
            return true;
        }
        return false;
    }

    playTheSameWordThreeTimes(): boolean {
        const wordsFormedMapping = new Map<string, number>();
        for (const w of this.gameService.players[this.gameService.currentTurn].words) {
            if (wordsFormedMapping.has(w.toLowerCase())) {
                const numberOfW = wordsFormedMapping.get(w.toLowerCase()) as number;
                wordsFormedMapping.set(w.toLowerCase(), numberOfW + 1);
                if (numberOfW + 1 === 3) {
                    return true;
                }
            } else {
                wordsFormedMapping.set(w.toLowerCase(), 1);
            }
            console.log(wordsFormedMapping);
        }
        return false;
    }

    playTheRandomWord(): boolean {
        for (const word of this.gameService.players[this.gameService.currentTurn].words) {
            if (word === this.randomWord) {
                return true;
            }
        }
        return false;
    }

    generateRandomWord(): string {
        let randomIndex = this.generateNumber(0, this.dictionary.words.length - 1);
        while (this.dictionary.words[randomIndex].length < 5 || this.dictionary.words[randomIndex].length > 7) {
            randomIndex = this.generateNumber(0, this.dictionary.words.length - 1);
        }

        return this.dictionary.words[randomIndex];
    }
}
