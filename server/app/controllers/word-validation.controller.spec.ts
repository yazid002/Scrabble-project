import { Application } from '@app/app';
import { DictionaryValidationResponse } from '@app/classes/dictionary-validation-response';
import { WordValidationService } from '@app/services/word-validation.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;
const HTTP_STATUS_SERVICE_UNAVAILABLE = StatusCodes.SERVICE_UNAVAILABLE;

describe('WordValidationController', () => {
    const baseResponse: DictionaryValidationResponse = { wordExists: true, errorMessage: '' };
    let wordValidationService: SinonStubbedInstance<WordValidationService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        wordValidationService = createStubInstance(WordValidationService);
        wordValidationService.validateWord.returns(baseResponse);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['wordValidationController'], 'wordValidationService', { value: wordValidationService });
        expressApp = app.app;
    });

    it('should return response from wordValidationService service on valid post request to root', async () => {
        return supertest(expressApp)
            .post('/api/validate')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal(baseResponse);
            });
    });

    it('should return HTTP_STATUS_SERVICE_UNAVAILABLE on invalid post request to root', async () => {
        wordValidationService.validateWord.throws('une erreur');
        return supertest(expressApp)
            .post('/api/validate')
            .expect(HTTP_STATUS_SERVICE_UNAVAILABLE)
            .catch((error) => {
                expect(error).to.deep.equal('une erreur');
            });
    });
});
