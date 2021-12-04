import { Injectable } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';
import { Goal } from '@app/classes/goal';
import { Player } from '@app/classes/player';
import { GoalType } from '@app/enums/goals-enum';
import { BehaviorSubject } from 'rxjs';
import { DictionaryService } from './admin/dictionary.service';
import { SoundManagerService } from './sound-manager.service';
import { TimerService } from './timer.service';
import { UserSettingsService } from './user-settings.service';

@Injectable({
    providedIn: 'root',
})
export class GoalService {
    initializedSignal: BehaviorSubject<boolean>;
    isEnabled: boolean;
    goalHandler: Goal[];
    publicGoals: Goal[];
    privateGoals: Goal[];
    goalsFunctions: ((wordOrPlayer: string | Player) => boolean)[];
    goalsProgresses: ((goal: Goal, player: Player) => number)[];
    private usedIndex: number[];
    private randomWord: string;

    constructor(
        private timerService: TimerService,
        private soundManagerService: SoundManagerService,
        private dictionaryService: DictionaryService,
        private userSettingsService: UserSettingsService,
    ) {
        this.initializedSignal = new BehaviorSubject<boolean>(false);
        this.isEnabled = false;
        const dictionaryName = this.userSettingsService.selectedDictionary.title;
        this.dictionaryService.fetchDictionary(dictionaryName).subscribe((dict) => {
            this.initialize(dict);
        });
    }
    initialize(dict: Dictionary) {
        this.usedIndex = [];
        this.randomWord = this.generateRandomWord(dict);

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
                description: 'Former un palindrome',
                bonus: 10,
                complete: false,
                goalType: GoalType.WritePalindromeWord,
                usesWord: true,
            },
            {
                description: 'Former un mot qui contient des "q" sans "u" consécutif',
                bonus: 10,
                complete: false,
                goalType: GoalType.WriteWordContainingQwithoutU,
                usesWord: true,
            },
            {
                description: 'Former un mot contenant 15 lettres',
                bonus: 10,
                complete: false,
                goalType: GoalType.WriteWordLengthEqualToFifteen,
                usesWord: true,
            },
            {
                description: 'Placer un mot contenant 3 consonnes consécutives',
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

        this.publicGoals = [this.getAUniqueGoal(), this.getAUniqueGoal()];
        this.privateGoals = [this.getAUniqueGoal(), this.getAUniqueGoal()];

        this.goalsProgresses = [
            (goal: Goal, player: Player): number => this.getGoalUsingWordProgress(goal, player),
            (goal: Goal, player: Player): number => this.getGoalUsingWordProgress(goal, player),
            (goal: Goal, player: Player): number => this.getGoalUsingWordProgress(goal, player),
            (goal: Goal, player: Player): number => this.getGoalUsingWordProgress(goal, player),
            (goal: Goal, player: Player): number => this.getPlayInTenSecondsGoalProgress(goal, player),
            (goal: Goal, player: Player): number => this.getPlayFiveTimesWithoutSkipAndExchange(goal, player),
            (goal: Goal, player: Player): number => this.getPlayTheSameWordThreeTimesProgress(goal, player),
            (goal: Goal, player: Player): number => this.getGoalUsingWordProgress(goal, player),
        ];
        this.initializedSignal.next(true);
    }

    getAUniqueGoal(): Goal {
        const index = this.generateUniqueIndex(0, this.goalsFunctions.length - 1);
        return this.goalHandler[index];
    }

    completeGoalSound(): void {
        this.soundManagerService.playGoalAchievementAudio();
    }

    incrementPlayerCounters(player: Player): void {
        this.incrementTurnWithoutSkipAndExchangeCounter(player);
        this.setPlaceInTenSecondsGoalCounter(player);
    }
    getProgress(goal: Goal, player: Player): number {
        return this.goalsProgresses[goal.goalType](goal, player);
    }

    processWordsArrayInMap(words: string[]): Map<string, number> {
        const wordsMapping = new Map<string, number>();
        for (const word of words) {
            if (wordsMapping.has(word.toLowerCase())) {
                const numberOfWord = wordsMapping.get(word.toLowerCase()) as number;
                wordsMapping.set(word.toLowerCase(), numberOfWord + 1);
            } else {
                wordsMapping.set(word.toLowerCase(), 1);
            }
        }
        return wordsMapping;
    }
    private getPlayTheSameWordThreeTimesProgress(goal: Goal, player: Player): number {
        const maxPlaceTimes = 3.0;
        const twoPlaceTimes = 2;
        const onePlaceTimes = 1.0;

        if (goal.completedBy?.id === player.id) {
            return 1;
        }
        if (!(player.wordsMapping instanceof Map)) {
            player.wordsMapping = this.processWordsArrayInMap(player.words);
        }
        if (player.wordsMapping.size === 0) {
            return 0;
        }

        for (const wordValue of player.wordsMapping.values()) {
            if (wordValue === twoPlaceTimes) {
                return twoPlaceTimes / maxPlaceTimes;
            }
        }
        return onePlaceTimes / maxPlaceTimes;
    }

    private getPlayFiveTimesWithoutSkipAndExchange(goal: Goal, player: Player): number {
        const maxTurnValue = 5.0;
        return goal.completedBy?.id === player.id ? 1 : player.turnWithoutSkipAndExchangeCounter / maxTurnValue;
    }

    private getGoalUsingWordProgress(goal: Goal, player: Player): number {
        return goal.completedBy?.id === player.id ? 1 : 0;
    }

    private getPlayInTenSecondsGoalProgress(goal: Goal, player: Player): number {
        const maxPlaceTimes = 3.0;
        return goal.completedBy?.id === player.id ? 1 : player.placeInTenSecondsGoalCounter / maxPlaceTimes;
    }

    private setPlaceInTenSecondsGoalCounter(player: Player): void {
        const tenSecondGoalLimitTime = 10;

        if (this.timerService.counter.totalTimer <= tenSecondGoalLimitTime) {
            player.placeInTenSecondsGoalCounter += 1;
        } else {
            player.placeInTenSecondsGoalCounter = 0;
        }
    }

    private incrementTurnWithoutSkipAndExchangeCounter(player: Player): void {
        player.turnWithoutSkipAndExchangeCounter += 1;
    }

    private isWordPalindrome(word: string): boolean {
        const length = word.length;
        for (let i = 0; i < length / 2; i++) {
            if (word[i].toLowerCase() !== word[length - 1 - i].toLowerCase()) {
                return false;
            }
        }
        return true;
    }

    private doesWordContainQWithoutU(word: string): boolean {
        let wordContainsQ = false;
        for (let i = 0; i < word.length - 1; i++) {
            if (word[i].toLowerCase() === 'q') {
                wordContainsQ = true;
                if (word[i + 1].toLowerCase() === 'u') {
                    return false;
                }
            }
        }
        return wordContainsQ || word[word.length - 1].toLowerCase() === 'q';
    }

    private isWordLengthEqualToFifteen(word: string): boolean {
        const length = 15;
        return word.length === length;
    }

    private doesWordContainConsecutiveConsonant(word: string): boolean {
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

    private generateNumber(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private generateUniqueIndex(min: number, max: number): number {
        let index = this.generateNumber(min, max);
        while (this.usedIndex.includes(index)) {
            index = this.generateNumber(min, max);
        }

        this.usedIndex.push(index);

        return index;
    }

    private placeInTenSecondsGoal(player: Player): boolean {
        const numberOfTurnsToWin = 3;
        if (player.placeInTenSecondsGoalCounter === numberOfTurnsToWin) {
            player.placeInTenSecondsGoalCounter = 0;
            return true;
        }
        return false;
    }

    private playFiveTimesWithoutSkipAndExchange(player: Player): boolean {
        const numberOfTurnsToWin = 5;
        return player.turnWithoutSkipAndExchangeCounter === numberOfTurnsToWin;
    }

    private playTheSameWordThreeTimes(player: Player): boolean {
        for (const value of player.wordsMapping.values()) {
            if (value === 3) {
                return true;
            }
        }
        return false;
    }

    private playTheRandomWord(player: Player): boolean {
        for (const key of player.wordsMapping.keys()) {
            if (key.toLowerCase() === this.randomWord.toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    private generateRandomWord(dict: Dictionary): string {
        const maxLength = 7;
        const minLength = 5;
        let randomIndex = this.generateNumber(0, dict.words.length - 1);
        while (dict.words[randomIndex].length < minLength || dict.words[randomIndex].length > maxLength) {
            randomIndex = this.generateNumber(0, dict.words.length - 1);
        }

        return dict.words[randomIndex];
    }
}
