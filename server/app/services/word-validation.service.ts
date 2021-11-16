import { Dictionary } from '@app/classes/dictionary';
import * as fs from 'fs';
import { Service } from 'typedi';
@Service()
export class WordValidationService {
    // rawDictionary = fs.readFileSync('../../../client/src/assets/dictionnary.json');
    dictionary: Dictionary;
    constructor() {
        fs.readFile('../client/src/assets/dictionnary.json', (err, data) => {
            if (err) throw err;
            this.dictionary = JSON.parse(data.toString());
            console.log(this.dictionary.title);
        });
    }

    validateWord(words: string[]): { wordExists: boolean; errorMessage: string } {
        for (const word of words) {
            if (word.length >= 2) {
                if (!this.isWordInDictionary(word)) {
                    return { wordExists: false, errorMessage: `le mot ${word} n'existe pas dans le dictionnaire` };
                }
            }
        }
        return { wordExists: true, errorMessage: '' };
    }

    isWordInDictionary(wordToCheck: string): boolean {
        return this.dictionary.words.includes(wordToCheck.toLowerCase());
    }
}
