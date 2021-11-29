import { Dictionary } from '@app/classes/dictionary';
import { DictionaryValidationResponse } from '@app/classes/dictionary-validation-response';
import { ReadFileService } from '@app/services/read-file.service';
import { Service } from 'typedi';
@Service()
export class WordValidationService {
    dictionary: Dictionary;
    constructor(private readFileService: ReadFileService) {
        this.initialize('../client/src/assets/dictionnary.json');
    }

    initialize(dictPath: string) {
        this.importDict(dictPath);
    }

    validateWord(words: string[]): DictionaryValidationResponse {
        for (const word of words) {
            if (word.length >= 2 && !this.isWordInDictionary(word)) {
                return { wordExists: false, errorMessage: `le mot ${word} n'existe pas dans le dictionnaire` };
            }
        }
        return { wordExists: true, errorMessage: '' };
    }

    private isWordInDictionary(wordToCheck: string): boolean {
        return this.dictionary.words.includes(wordToCheck.toLowerCase());
    }

    private importDict(dictPath: string): void {
        this.readFileService
            .readDictionary(dictPath)
            .then((data) => {
                this.dictionary = JSON.parse(data);
            })
            .catch((err) => {
                throw err;
            });
    }
}
