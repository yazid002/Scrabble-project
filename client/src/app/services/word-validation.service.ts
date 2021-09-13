import { Injectable } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';
import * as dictionary from 'src/assets/dictionnary.json';

@Injectable({
    providedIn: 'root',
})
export class WordValidationService {
    dictionary: Dictionary;
    invalidSymbols: string[];

    constructor() {
        // private readonly dictionary: object
        this.dictionary = dictionary as Dictionary;
        this.invalidSymbols = ['-', "'"];
        // // eslint-disable-next-line no-console
        // console.log('words', this.dictionary.words);
    }

    validateWord(minLength: number, wordToCheck: string): string | boolean {
        const word = this.processWord(wordToCheck);
        const wordIsInvalid = this.checkInvalidSymbols(word);
        if (!wordIsInvalid) {
            return this.checkWordMinLength(minLength, wordToCheck) && this.checkWordExists(word);
        } else return !wordIsInvalid;
    }

    private checkWordMinLength(minLength: number, wordToCheck: string): boolean {
        return wordToCheck.length >= minLength;
    }

    private checkWordExists(wordToCheck: string): boolean {
        return this.dictionary.words.includes(wordToCheck.toLowerCase());
    }

    private processWord(wordToProcess: string): string {
        const word = wordToProcess
            .toLocaleLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '');
        return word;
    }

    private checkInvalidSymbols(wordToCheck: string): boolean {
        return this.invalidSymbols.some((symbol) => wordToCheck.includes(symbol));
    }
}
