import { WordValidationService } from '@app/services/word-validation.service';
import { expect } from 'chai';

describe('Example service', () => {
    let service: WordValidationService;

    beforeEach(async () => {
        service = new WordValidationService();
    });

    it.only('should return an error if at least one word is not found in the french dictionary', (done) => {
        setTimeout(() => {

            const badWord = 'ckjsnkjfdsnc';
            const words: string[] = ['allo', 'bonjour', badWord];
            const expectedResult = { wordExists: false, errorMessage: `le mot ${badWord} n'existe pas dans le dictionnaire` };
            const actualResult = service.validateWord(words);
            expect(actualResult.wordExists).equal(expectedResult.wordExists);
            done();
        }, 1000);
    });
});
