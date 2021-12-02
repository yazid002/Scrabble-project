import { Dictionary } from '@app/classes/dictionary';
import { WordValidationService } from '@app/services/word-validation.service';
import { expect } from 'chai';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
// disable car on importe une constante du coté client, on doit utiliser un pattern
// eslint-disable-next-line no-restricted-imports
import { RESPONSE_DELAY } from '../../../client/src/app/constants/url';
import { DictionaryService } from './dictionary.service';

describe('WordValidationService', () => {
    let service: WordValidationService;
    let dictionaryService: SinonStubbedInstance<DictionaryService>;
    beforeEach(async () => {
        dictionaryService = createStubInstance(DictionaryService);
        dictionaryService.addDict.resolves(undefined);
        dictionaryService.deleteDictionary.returns('succes');
        dictionaryService.findAllDictionaries.returns([{ title: 'Mon dictionnaire', description: 'Dictionaire par default' }]);
        const dummyDictionary: Dictionary = {
            title: 'Mon dictionnaire',
            description: 'a description',
            words: ['allo', 'bonjour', 'patate'],
        };
        dictionaryService.dictionaries = [dummyDictionary];
        service = new WordValidationService(dictionaryService);
    });

    it('should return an error if at least one word is not found in the french dictionary', (done) => {
        setTimeout(() => {
            const badWord = 'ckjsnkjfdsnc';
            const words: string[] = ['allo', 'bonjour', badWord];
            const expectedResult = { wordExists: false, errorMessage: `le mot ${badWord} n'existe pas dans le dictionnaire` };
            const actualResult = service.validateWord({ words, dict: 'Mon dictionnaire' });
            expect(actualResult.wordExists).equal(expectedResult.wordExists);
            done();
        }, RESPONSE_DELAY);
    });

    it('should return that words exists if they exists in service dictionary', (done) => {
        setTimeout(async () => {

            const words: string[] = ['allo', 'bonjour', 'patate'];
            const expectedResult = { wordExists: true, errorMessage: '' };
            const actualResult = service.validateWord({ words, dict: 'Mon dictionnaire' });
            expect(actualResult.wordExists).equal(expectedResult.wordExists);
            done();
        }, RESPONSE_DELAY);
    });
    it('should return that word is invalid if we provide an invalid dictionary to check', (done) => {
        setTimeout(async () => {
            const words: string[] = ['allo', 'bonjour', 'patate'];
            const expectedResult = { wordExists: false, errorMessage: '' };
            const actualResult = service.validateWord({ words, dict: 'An invalid dictionary' });
            expect(actualResult.wordExists).equal(expectedResult.wordExists);
            done();
        }, RESPONSE_DELAY);
    });
});
