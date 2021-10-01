// import { Injectable } from '@angular/core';
// import { Dictionary } from '@app/classes/dictionary';
// import * as dictionary from 'src/assets/dictionnary.json';

// @Injectable({
//     providedIn: 'root',
// })
// export class WordValidationService {
//     dictionary: Dictionary;
//     invalidSymbols: string[];

//     constructor() {
//         this.dictionary = dictionary as Dictionary;
//         this.invalidSymbols = ['-', "'"];
//     }

//     checkWordExists(wordToCheck: string): boolean {
//         return this.dictionary.words.includes(wordToCheck.toLowerCase());
//     }

//     // checkWordMinLength(minLength: number, wordToCheck: string): boolean {
//     //     return wordToCheck.length >= minLength;
//     // }

//     normalizeWord(wordToProcess: string): string {
//         const word = wordToProcess.normalize('NFD').replace(/\p{Diacritic}/gu, '');
//         return word;
//     }

//     checkInvalidSymbols(wordToCheck: string): boolean {
//         return this.invalidSymbols.some((symbol) => wordToCheck.includes(symbol));
//     }
// }
