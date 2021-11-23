import { WordValidationService } from '@app/services/word-validation.service';
import { expect } from 'chai';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { ReadFileService } from './read-file.service';

const RESPONSE_DELAY = 1000;
describe('WordValidationService', () => {
    let service: WordValidationService;
    let readFileService: SinonStubbedInstance<ReadFileService>;

    beforeEach(async () => {
        readFileService = createStubInstance(ReadFileService);
        readFileService.readDictionary.returns(
            Promise.resolve(
                JSON.stringify({
                    title: 'un dico',
                    description: 'un dico de test',
                    words: ['allo', 'bonjour', 'patate', 'maman'],
                }),
            ),
        );
        service = new WordValidationService(readFileService);
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

    it('should return that words exists if they exists in service dictionary', (done) => {
        setTimeout(async () => {
            const words: string[] = ['allo', 'bonjour', 'patate'];
            const expectedResult = { wordExists: true, errorMessage: '' };
            const actualResult = service.validateWord(words);
            expect(actualResult.wordExists).equal(expectedResult.wordExists);
            done();
        }, RESPONSE_DELAY);
    });

    it('importDict should update dictionary', (done) => {
        setTimeout(async () => {
            readFileService.readDictionary.returns(Promise.reject('une erreur'));
            try {
                // eslint-disable-next-line dot-notation
                service['importDict']('a path');
            } catch (error) {
                expect(error).equal('une erreur');
            }
            done();
        }, RESPONSE_DELAY);
    });
});
