import { WordValidationService } from '@app/services/word-validation.service';
import { expect } from 'chai';
const RESPONSE_DELAY = 1000;
describe('Example service', () => {
    let service: WordValidationService;

    beforeEach(async () => {
        service = new WordValidationService();
    });

    it('should return an error if at least one word is not found in the french dictionary', (done) => {
        setTimeout(() => {

            const badWord = 'ckjsnkjfdsnc';
            const words: string[] = ['allo', 'bonjour', badWord];
            const expectedResult = { wordExists: false, errorMessage: `le mot ${badWord} n'existe pas dans le dictionnaire` };
            const actualResult = service.validateWord(words);
            expect(actualResult.wordExists).equal(expectedResult.wordExists);
            done();
        }, RESPONSE_DELAY);
    });

    it('should return that words exists if they exists', (done) => {
        setTimeout(() => {
            const words: string[] = ['allo', 'bonjour', 'patate'];
            const expectedResult = { wordExists: true, errorMessage: '' };
            const actualResult = service.validateWord(words);
            expect(actualResult.wordExists).equal(expectedResult.wordExists);
            done();
        }, RESPONSE_DELAY);
    });
});
