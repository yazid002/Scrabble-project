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

    // it('should return message from example service on valid get request to about route', async () => {
    //     const aboutMessage = { ...baseMessage, title: 'About' };
    //     exampleService.about.returns(aboutMessage);
    //     return supertest(expressApp)
    //         .get('/api/example/about')
    //         .expect(HTTP_STATUS_OK)
    //         .then((response) => {
    //             expect(response.body).to.deep.equal(aboutMessage);
    //         });
    // });

    // it('should store message in the array on valid post request to /send', async () => {
    //     const message: Message = { title: 'Hello', body: 'World' };
    //     return supertest(expressApp).post('/api/example/send').send(message).set('Accept', 'application/json').expect(HTTP_STATUS_CREATED);
    // });

    // it('should return an array of messages on valid get request to /all', async () => {
    //     exampleService.getAllMessages.returns([baseMessage, baseMessage]);
    //     return supertest(expressApp)
    //         .get('/api/example/all')
    //         .expect(HTTP_STATUS_OK)
    //         .then((response) => {
    //             expect(response.body).to.deep.equal([baseMessage, baseMessage]);
    //         });
    // });
});
