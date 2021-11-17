import { Injectable } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';
import { Goal } from '@app/classes/goal';
import { Player } from '@app/classes/player';
import { GoalType } from '@app/enums/goals-enum';
import * as dictionary from 'src/assets/dictionnary.json';
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
    goalsFunctions: ((wordOrPlayer: string | Player) => boolean)[];
    constructor(private timerService: TimerService) {
        this.dictionary = dictionary as Dictionary;
        this.usedIndex = [];
        this.randomWord = this.generateRandomWord();

        this.goalsFunctions = [
            (wordOrPlayer: string | Player): boolean => this.isWordPalindrome(wordOrPlayer as string),
            (wordOrPlayer: string | Player): boolean => this.doesWordContainQWithoutU(wordOrPlayer as string),
            (wordOrPlayer: string | Player): boolean => this.isWordLengthEqualToFifteen(wordOrPlayer as string),
            (wordOrPlayer: string | Player): boolean => this.doesWordContainConsecutiveConsonant(wordOrPlayer as string),
            (wordOrPlayer: string | Player): boolean => this.placeInTenSecondsGoal(wordOrPlayer as Player),
            (wordOrPlayer: string | Player): boolean => this.playFiveTimesWithoutSkipAndExchange(wordOrPlayer as Player),
            (wordOrPlayer: string | Player): boolean => this.playTheSameWordThreeTimes(wordOrPlayer as Player),
            (wordOrPlayer: string | Player): boolean => this.playTheRandomWord(wordOrPlayer as Player),
        ];

        this.goalHandler = [
            {
                description: 'Placer un palindrome',
                bonus: 10,
                complete: false,
                goalType: GoalType.WritePalindromeWord,
                usesWord: true,
            },
            {
                description: 'Placer un mot qui contient la lettre e',
                bonus: 10,
                complete: false,
                goalType: GoalType.WriteWordContainingQwithoutU,
                usesWord: true,
            },
            {
                description: 'Former un mot contenant 4 letters',
                bonus: 10,
                complete: false,
                goalType: GoalType.WriteWordLengthEqualToFifteen,
                usesWord: true,
            },
            {
                description: 'Placer un mot contenant 3 consonnes consecutives',
                bonus: 10,
                complete: false,
                goalType: GoalType.WriteWordContainingConsecutiveConsonants,
                usesWord: true,
            },
            {
                description: 'Pour 3 tours de suite, placer en moins de 10 secondes',
                bonus: 70,
                complete: false,
                goalType: GoalType.PlayInTenSeconds,
                usesWord: false,
            },
            {
                description: 'Jouer 5 tours de suite sans passer ou échanger',
                bonus: 40,
                complete: false,
                goalType: GoalType.PlayFiveTimesWithoutSkipAndExchange,
                usesWord: false,
            },
            {
                description: 'Former le même mot 3 fois dans une même partie',
                bonus: 30,
                complete: false,
                goalType: GoalType.PlayTheSameWordThreeTimes,
                usesWord: false,
            },
            {
                description: `Former le mot ${this.randomWord}`,
                bonus: 10,
                complete: false,
                goalType: GoalType.PlayTheRandomWord,
                usesWord: false,
            },
        ];
    }

    isWordPalindrome(word: string): boolean {
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

    doesWordContainQWithoutU(word: string): boolean {
        console.log('inside1');
        for (let i = 0; word.length; i++) {
            if (word[i].toLowerCase() === 'e') {
                console.log('inside obj');
                return true;
            }
        }

        return false;
    }

    isWordLengthEqualToFifteen(word: string): boolean {
        console.log('inside2');
        const length = 4;
        return word.length === length;
    }

    doesWordContainConsecutiveConsonant(word: string): boolean {
        console.log('inside3');
        const consonant: string[] = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'x', 'z'];
        const secondPosition = 1;
        const thirdPosition = 2;

        for (let i = 0; i < word.length - thirdPosition; i++) {
            if (
                consonant.includes(word[i].toLowerCase()) &&
                consonant.includes(word[i + secondPosition].toLowerCase()) &&
                consonant.includes(word[i + thirdPosition].toLowerCase())
            ) {
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
        const index = this.generateUniqueIndex(0, this.goalsFunctions.length - 1);
        console.log(index);
        return this.goalHandler[index];
    }

    placeInTenSecondsGoal(player: Player): boolean {
        console.log('placeInTenSecondsGoal');

        if (this.timerService.counter.totalTimer <= 10) {
            player.placeInTenSecondsGoalCounter += 1;
        } else {
            player.placeInTenSecondsGoalCounter = 0;
        }

        if (player.placeInTenSecondsGoalCounter === 3) {
            player.placeInTenSecondsGoalCounter = 0;
            return true;
        }
        return false;
    }

    playFiveTimesWithoutSkipAndExchange(player: Player): boolean {
        console.log('playFiveTimesWithoutSkipAndExchange');
        console.log('counter ', player.turnWithoutSkipAndExchangeCounter);
        if (player.turnWithoutSkipAndExchangeCounter === 5) {
            return true;
        }
        return false;
    }

    playTheSameWordThreeTimes(player: Player): boolean {
        console.log('playTheSameWordThreeTimes');
        const wordsFormedMapping = new Map<string, number>();
        for (const w of player.words) {
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

    playTheRandomWord(player: Player): boolean {
        console.log('playTheRandomWord');
        for (const word of player.words) {
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

    completedGoalStyle(goal: Goal): string {
        return goal.complete ? 'color:green' : 'color:black';
    }

    completeGoalSound(): void {
        const audio = new Audio();
        audio.src = 'assets/sounds/bonus.wav';
        audio.load();
        audio.play();
    }
}
