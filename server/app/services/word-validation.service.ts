import { Dictionary } from '@app/classes/dictionary';
import { DictionaryValidationResponse } from '@app/classes/dictionary-validation-response';
import { ReadFileService } from '@app/services/read-file.service';
import { Service } from 'typedi';
import { DictionaryService } from './dictionary.service';
@Service()
export class WordValidationService {
    dictionary: Dictionary;
    constructor(private readFileService: ReadFileService, private dictionaryService: DictionaryService) {
        this.initialize('../client/src/assets/dictionnary.json');
    }

    initialize(dictPath: string) {
        this.importDict(dictPath);
    }

    validateWord(params: { words: string[]; dict: string }): DictionaryValidationResponse {
        console.log('params in service', params);
        for (const word of params.words) {
            if (word.length >= 2 && !this.isWordInDictionary(word, params.dict)) {
                return { wordExists: false, errorMessage: `le mot ${word} n'existe pas dans le dictionnaire` };
            }
        }
        return { wordExists: true, errorMessage: '' };
    }

    private isWordInDictionary(wordToCheck: string, dictTitle: string): boolean {
        // this.dictionary.words.includes(wordToCheck.toLowerCase());
        console.log('validating ', wordToCheck, 'in dictionary ', dictTitle);
        const dictionary = this.dictionaryService.dictionaries.find((dict) => dict.title === dictTitle);
        if (dictionary) return dictionary.words.includes(wordToCheck.toLowerCase());
        return false;
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
