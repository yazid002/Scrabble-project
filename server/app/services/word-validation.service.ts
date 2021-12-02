import { DictionaryValidationResponse } from '@app/classes/dictionary-validation-response';
import { Service } from 'typedi';
import { DictionaryService } from './dictionary.service';
@Service()
export class WordValidationService {
    constructor(private dictionaryService: DictionaryService) {}

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
}
