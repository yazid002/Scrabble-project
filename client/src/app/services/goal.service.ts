import { Injectable } from '@angular/core';
import { Goal } from '@app/classes/goal';

@Injectable({
    providedIn: 'root',
})
export class GoalService {
    usedIndex: number[];
    goalHandler: Goal[];

    constructor() {
        this.usedIndex = [];
        this.goalHandler = [
            {
                description: 'Vous de devez placer un palindrome',
                bonus: 10,
                complete: false,
                command: (word: string): boolean => this.isWordPalindrome(word),
            },
            {
                description: 'Vous de devez placer un mot qui contient la lettre e',
                bonus: 10,
                complete: false,
                command: (word: string): boolean => this.doesWordContainQwithoutU(word),
            },
            {
                description: 'Vous devez former un mot contenant 4 letters',
                bonus: 10,
                complete: false,
                command: (word: string): boolean => this.isWordLengthEqualToFifteen(word),
            },
            // {
            //     description: 'Vous devez placer un mot contenant 3 consomme consecutive',
            //     bonus: 10,
            //     complete: false,
            //     command: (word: string): boolean => this.doesWordContainConsecutiveConsonant(word),
            // },
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
        const index = this.generateUniqueIndex(0, 2);
        return this.goalHandler[index];
    }
}
