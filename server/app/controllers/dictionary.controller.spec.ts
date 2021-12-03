import { Application } from '@app/app';
import { Dictionary } from '@app/classes/dictionary';
import { FileMessages } from '@app/classes/file-messages';
import { TitleDescriptionOfDictionary } from '@app/classes/title-description-of-dictionary';
import { DictionaryService } from '@app/services/dictionary.service';
import { expect } from 'chai';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe('DictionaryController', () => {
    const findAllResponse: TitleDescriptionOfDictionary[] = [{ title: 'a title', description: 'a description' }];
    const getDictionaryResponse: Dictionary = { title: 'a title', description: 'a description', words: ['aa', 'bb'] };
    const deleteResponse = 'file removed successfully';

    let dictionaryService: SinonStubbedInstance<DictionaryService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        dictionaryService = createStubInstance(DictionaryService);
        dictionaryService.addDict.resolves(undefined);
        dictionaryService.findAllDictionaries.returns(findAllResponse);
        dictionaryService.getDictionary.returns(getDictionaryResponse);
        dictionaryService.deleteDictionary.returns(deleteResponse);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['dictionaryController'], 'dictionaryService', { value: dictionaryService });
        expressApp = app.app;
    });
    describe('/addNewDictionary', () => {
        it('should call dictionaryService.addDict', async () => {
            const expectedMessage: FileMessages = {
                isSuccess: true,
                message: 'file uploaded',
            };
            return supertest(expressApp)
                .post('/api/admin/dictionary/addNewDictionary')
                .then((response) => {
                    expect(response.body).to.deep.equal(expectedMessage);
                });
        });
        it('should return an error if there was any errors while uploading the message', async () => {
            dictionaryService.addDict.throws('an error');
            const expectedMessage: FileMessages = {
                isSuccess: false,
                message: 'error is on the server side, contact administrator',
            };
            return supertest(expressApp)
                .post('/api/admin/dictionary/addNewDictionary')
                .then((response) => {
                    expect(response.body).to.deep.equal(expectedMessage);
                });
        });
    });
    describe('/findAll', () => {
        it('should return an array of dictionary descriptions', async () => {
            return supertest(expressApp)
                .get('/api/admin/dictionary/findAll')
                .then((response) => {
                    expect(response.body).to.deep.equal(findAllResponse);
                });
        });
    });
    describe('/getDictionary/:name', () => {
        it('should return the desired dictionary', async () => {
            return supertest(expressApp)
                .get('/api/admin/dictionary/getDictionary/name')
                .then((response) => {
                    expect(response.body).to.deep.equal(getDictionaryResponse);
                });
        });
    });
    describe('/delete/:title', () => {
        it('should return deletion status', async () => {
            return supertest(expressApp)
                .delete('/api/admin/dictionary/delete/title')
                .then((response) => {
                    expect(response.body).to.deep.equal(deleteResponse);
                });
        });
    });
});
