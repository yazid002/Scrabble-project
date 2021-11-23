/* eslint-disable no-console */
/* eslint-disable import/no-deprecated */
import { Dictionary } from '@app/classes/dictionary.model';
import * as fs from 'fs';
import { Service } from 'typedi';
@Service()
export class WordValidationService {
    // rawDictionary = fs.readFileSync('../../../client/src/assets/dictionnary.json');
    dictionary: Dictionary;
    constructor() {
        this.initialize('../client/src/assets/dictionnary.json');
    }
    initialize(dictPath: string) {
        this.importDict(dictPath);
    }

    validateWord(words: string[]): { wordExists: boolean; errorMessage: string } {
        for (const word of words) {
            if (word.length >= 2 && !this.isWordInDictionary(word)) {
                return { wordExists: false, errorMessage: `le mot ${word} n'existe pas dans le dictionnaire` };
            }
        }
        return { wordExists: true, errorMessage: '' };
    }

    isWordInDictionary(wordToCheck: string): boolean {
        return this.dictionary.words.includes(wordToCheck.toLowerCase());
    }
    private importDict(dictPath: string) {
        fs.readFile(dictPath, (err, data) => {
            if (err) throw err;
            this.dictionary = JSON.parse(data.toString());
            console.log(this.dictionary.title);
        });
    }
}
